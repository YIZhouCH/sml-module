package com.eastcom_sw.srpt.service;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.core.Rslt;
import org.hw.sml.core.build.SmlTools;
import org.hw.sml.core.resolver.Rst;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.model.SqlTemplate;
import org.hw.sml.office.excel.ExcelBase.Type;
import org.hw.sml.office.excel.creater.ExcelCreater;
import org.hw.sml.office.excel.creater.rs.ExcelRsCsvCreater;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Inject;
import org.hw.sml.support.time.StopWatch;
import org.hw.sml.tools.MapUtils;

import com.eastcom_sw.srpt.base.SrptBaseService;
import com.eastcom_sw.srpt.model.ReportCheckInfo;
import com.eastcom_sw.srpt.model.SrptLog;
import com.eastcom_sw.srpt.tools.CsvExporter;
import com.eastcom_sw.srpt.tools.CsvExporter.DataRetriver;
import com.eastcom_sw.srpt.tools.ParamsUtil;
import com.eastcom_sw.srpt.tools.QuerySqlBuilder;
import com.eastcom_sw.srpt.tools.ReportTool;
import com.eastcom_sw.srpt.tools.RsltPageObject;


@Bean
public class SrptRcptQueryService extends SrptBaseService{
	@Inject(value="iSrptRcptLogService",required=false)
	private ISrptRcptLogService iSrptRcptLogService;
	private static String multHead = "<select id=\"multHead\">";
	
	public Map<String, Object> checkOrQueryReportPre(ReportCheckInfo reportCheckInfo,Map<String,String> drillParam) {
		Map<String, Object> buildResultPreSql = null;
		RsltPageObject pageObject = null;
		try{
			//解析组件  
			List<String> qryDBnames = ReportTool.analyseQryDb(queryQryBdByReportId(reportCheckInfo.getReport_id()));
			//重新组装reportcheckinfo 的sql
			buildPreSql(reportCheckInfo,qryDBnames,"head");
			//获取表头  <-- 二次过滤以及钻取的sql改变  
			pageObject = buildPageObjectGetHead(reportCheckInfo);
			ReportTool.buildReturnSql(reportCheckInfo,qryDBnames);
			buildResultPreSql = buildResultPreSql(true,"success",pageObject,reportCheckInfo);
			return buildResultPreSql;
		}catch(Exception e){
			buildResultPreSql = buildResultPreSql(false,"fail",e.getMessage(),reportCheckInfo);
			logger.info("报表:["+queryMenuName(reportCheckInfo.getReport_id()).get(0).get("name_")+",报表ID:"+reportCheckInfo.getReport_id()+"]查询表头有误!");
			e.printStackTrace();
			return buildResultPreSql;
		}
	}
	
	public Object checkOrQueryReport(ReportCheckInfo reportCheckInfo){
		RsltPageObject pageObject = null;
		try{
			//with临时表查询时，为提高速度，在with最后加上 and 1>2 等不成立的条件
			reportCheckInfo.getConditions().put("headQuery", "data");
			List<String> qryDBnames = ReportTool.analyseQryDb(queryQryBdByReportId(reportCheckInfo.getReport_id()));
			//将组建信息交给sql判断
			buildPreSql(reportCheckInfo,qryDBnames,"select");
			Map<String, String> resultMap = ReportTool.getResultMapping(reportCheckInfo.getLogic_sql_info());
			//
			String sidx=reportCheckInfo.getConditions().get("sidx");
			if(!resultMap.keySet().contains(sidx)&&!resultMap.isEmpty()){
				reportCheckInfo.getConditions().put("sidx",MapUtils.invert(resultMap).get(sidx));
			}

			String dbid = getDbidByReport(reportCheckInfo.getReport_id());
			
			reportCheckInfo.getConditions().put("queryType", "select");
			
			Rslt queryRslt = super.queryRslt(dbid, reportCheckInfo.getLogic_sql_info(), reportCheckInfo.getConditions());
			List<String> resultHeaders = ReportTool.replaceValue(queryRslt.getHeadMetas(),resultMap);
			long count=queryRslt.getDatas().size();
			
			//TODO 分页
			if(count<Integer.parseInt(reportCheckInfo.getConditions().get("limit"))&&(reportCheckInfo.getConditions().get("pageNo").equals("1"))){//总条数小于limit 直接查询了
				
				pageObject = new RsltPageObject(ReportTool.buildDatas(queryRslt,queryRslt.getDatas().size(),resultHeaders),
						queryRslt.getDatas().size(),
						Integer.parseInt(reportCheckInfo.getConditions().get("pageNo")==null?"1":reportCheckInfo.getConditions().get("pageNo")),
						Integer.parseInt(reportCheckInfo.getConditions().get("limit")==null?"1":reportCheckInfo.getConditions().get("limit")));
			}else{//总条数大于limit 用分页
				reportCheckInfo.getConditions().put("queryType", "count");
				reportCheckInfo.getConditions().put("sidx", null);
				Rslt rslt = super.queryRslt(dbid, reportCheckInfo.getLogic_sql_info(), reportCheckInfo.getConditions());
				
				pageObject = new RsltPageObject(ReportTool.buildDatas(queryRslt,queryRslt.getDatas().size(),resultHeaders),
						Long.parseLong(String.valueOf(rslt.getDatas().get(0).get(0))),
						Integer.parseInt(reportCheckInfo.getConditions().get("pageNo")==null?"1":reportCheckInfo.getConditions().get("pageNo")),
						Integer.parseInt(reportCheckInfo.getConditions().get("limit")==null?"1":reportCheckInfo.getConditions().get("limit")));
			}
			pageObject.setHeadMetas(resultHeaders);
			return buildResultPreSql(true, "success", pageObject,reportCheckInfo);
		}catch(Exception e){
			logger.info("报表:["+queryMenuName(reportCheckInfo.getReport_id()).get(0).get("name_")+",报表ID:"+reportCheckInfo.getReport_id()+"]查询数据有误!");
			e.printStackTrace();
			return buildResultPreSql(false, "false", e.getMessage(),reportCheckInfo);
		}
		
	}

	
	@SuppressWarnings("unchecked")
	public ReportCheckInfo buildReportCheckInfo(Map<String,String> params) {
		ReportCheckInfo reportCheckInfo = new ReportCheckInfo();
		reportCheckInfo.setReport_id(params.get("report_id"));
		params.remove("report_id");
		//解析组件
		List<String> qryDBnames = ReportTool.analyseQryDb(queryQryBdByReportId(reportCheckInfo.getReport_id()));
		//将组建信息交给sql判断
		buildPreSql(reportCheckInfo,qryDBnames,"select");
		params.remove("logic_sql_info");
		reportCheckInfo.setConditions(params);
		reportCheckInfo.setFilter_data(WebTools.fromGson(params.get("filter_data"), List.class));
		return reportCheckInfo;
	}
	
	Map<String,Object> buildResultPreSql(boolean successMark,String msg,Object result,ReportCheckInfo reportCheckInfo){
		Map<String, Object> buildResult = null;
		try{
			buildResult = ReportTool.buildResult(successMark,msg,result);
			reportCheckInfo.getConditions().remove("limit");
			reportCheckInfo.getConditions().remove("pageNo");
			reportCheckInfo.setLogic_sql_info("");
			
			buildResult.put("reportCheckInfo", reportCheckInfo);
			
			Map<String,String> field_Info = queryFieldInfo(reportCheckInfo.getReport_id());
			List<Map<String,Object>> info = ReportTool.buildInfo(field_Info,"FIELD_INFO");
			//TODO 将过滤数据返回！！！！  预览和正式查询都需要
			Map<String,String> filter_data = queryFilterData(reportCheckInfo.getReport_id());
			List<Map<String,Object>> filter_info = ReportTool.buildInfo(filter_data,"FILTER_DATA");
			 
			reportCheckInfo.setFilter_data(filter_info);
			//查询字段信息，如果是符合表头，则返回为null
			String queryForLogicSql = queryForLogicSqlByReportId(reportCheckInfo.getReport_id());
			if(queryForLogicSql!=null&&queryForLogicSql.contains(multHead)){
				buildResult.put("field_info",null);
			}else{
				buildResult.put("field_info",info);
			}
			
			buildResult.put("filter_data", filter_info);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("buildResultPreSql is wrong");
		}
		
		return buildResult;
	}

	/**
	 * 查询，获取中文表头，返回RsltPageObject
	 * @param reportCheckInfo
	 * @return
	 */
	private RsltPageObject buildPageObjectGetHead(ReportCheckInfo reportCheckInfo) {
		reportCheckInfo.getConditions().put("headQuery", "head");
		
		Map<String, String> resultMap = ReportTool.getResultMapping(reportCheckInfo.getLogic_sql_info());

		String dbid = getDbidByReport(reportCheckInfo.getReport_id());
		
		Rslt queryRslt = super.queryRslt(dbid, reportCheckInfo.getLogic_sql_info(), reportCheckInfo.getConditions());
		//重组表头信息返回给前台
		List<String> resultHeaders = ReportTool.replaceValue(queryRslt.getHeadMetas(),resultMap);
		RsltPageObject pageObject = new RsltPageObject(ReportTool.buildDatas(queryRslt,queryRslt.getDatas().size(),resultHeaders),
				queryRslt.getDatas().size(),
				Integer.parseInt(reportCheckInfo.getConditions().get("pageNo")==null?"1":reportCheckInfo.getConditions().get("pageNo")),
				Integer.parseInt(reportCheckInfo.getConditions().get("limit")==null?"1":reportCheckInfo.getConditions().get("limit")));
		pageObject.setHeadMetas(resultHeaders);
		
		return pageObject;
	}

	/**
	 * 组装 预处理sql
	 * @param reportCheckInfo
	 * @param qryDBnames
	 */
	private void buildPreSql(ReportCheckInfo reportCheckInfo,List<String> qryDBnames,String headOrSelect ) {
		if((reportCheckInfo.getLogic_sql_info()!=null&&reportCheckInfo.getLogic_sql_info().trim().length()>0)){
			reportCheckInfo.setLogic_sql_info((String)(new QuerySqlBuilder().jugeSql(headOrSelect,reportCheckInfo.getLogic_sql_info(),reportCheckInfo.getConditions(),qryDBnames).get("sql")));
		}else{
			String queryForSql = queryForLogicSqlByReportId(reportCheckInfo.getReport_id());
			reportCheckInfo.setLogic_sql_info((String)(new QuerySqlBuilder().jugeSql(headOrSelect,queryForSql,reportCheckInfo.getConditions(),qryDBnames).get("sql")));
		}
	}
	

	
	
	
	//  将filter_data 中的数据和filed_info 最后和 sql中的resultMapping 联系起来处理成where 子查询的格式
	@SuppressWarnings("unchecked")
	public String assembleField(ReportCheckInfo reportCheckInfo){
		
		String report_id = reportCheckInfo.getReport_id();
		
		if(reportCheckInfo.getLogic_sql_info()==null||(reportCheckInfo.getLogic_sql_info()!=null&&reportCheckInfo.getLogic_sql_info().isEmpty())){
			String queryForSql = queryForLogicSqlByReportId(reportCheckInfo.getReport_id());
			reportCheckInfo.setLogic_sql_info(queryForSql);
		}
		String filterDataStr = null;
		List<Map<String,Object>> filterData=null;
		
		filterData = reportCheckInfo.getFilter_data()!=null?filterData = reportCheckInfo.getFilter_data():null;
		if(filterData==null){
			Map<String,String> filterDataMap = queryFilterData(report_id);
			filterDataStr = filterDataMap.get("FILTER_DATA");//字段数不全，可能为空
			filterData = WebTools.fromGson(filterDataStr, List.class);
		}
		//TODO filterData 中文转英文
		
		List<Map<String, Object>> resultMapping = ParamsUtil.getResultMapping(reportCheckInfo.getLogic_sql_info());
		
		//有{{}}  并且有resultmapping 
		if(reportCheckInfo.getLogic_sql_info().contains("{{}}")&&reportCheckInfo.getLogic_sql_info().contains("<select id=\"resultMapping\">")&&filterData!=null&&filterData.size()>0){
			
			String varchar = "varchar";
			String number = "number";
			String and = " and ";
			String end = "  ";
			
			Map<String,String> fieldInfoMap = queryFieldInfo(report_id);
			String fieldInfoStr = fieldInfoMap.get("FIELD_INFO");//字段全，可能为空
			List<Map<String,Object>> fieldInfo = WebTools.fromGson(fieldInfoStr, List.class);
			
			if(fieldInfo!=null&&fieldInfo.size()>0){
				//将两者组合    要对空值的异常判断
				StringBuffer sbf = new StringBuffer();
				for (Map<String, Object> info : fieldInfo) {//sortflag,fieldname,linewidth,isshow,fieldType
					
					for (Map<String, Object> filter : filterData) {//fieldname,fieldType,minVal,minSymbol,maxSymbol,maxVal
						
						//转中文
						for (Map<String, Object> rsltMapping : resultMapping) {
						
							if(String.valueOf(info.get("fieldname")).equals(String.valueOf(filter.get("fieldname")))&&
									filter.get("fieldType").equals(varchar)&&
									String.valueOf(filter.get("fieldname")).equals(String.valueOf(rsltMapping.get("columnCN")))){
								//拼接
								if(String.valueOf(filter.get("maxSymbol")).equals("like")){
									sbf.append(and);
									sbf.append(String.valueOf(rsltMapping.get("column"))).append(" like ").append("'%").append(String.valueOf(filter.get("maxVal"))).append("%'").append(end);
										
								}else{
									sbf.append(and);
									sbf.append(String.valueOf(rsltMapping.get("column"))).append(" "+filter.get("maxSymbol")).append(" '").append(String.valueOf(filter.get("maxVal"))).append("'").append(end);
								}
								
							}else if(String.valueOf(info.get("fieldname")).equals(String.valueOf(filter.get("fieldname")))&&
									filter.get("fieldType").equals(number)&&
									String.valueOf(filter.get("fieldname")).equals(String.valueOf(rsltMapping.get("columnCN")))){
								//=    dayu   xiaoyu 
								if(filter.get("maxVal")!=null&&!String.valueOf(filter.get("maxVal")).isEmpty()&&filter.get("minVal")!=null&&!String.valueOf(filter.get("minVal")).isEmpty()){//dayu xiaoyu 
									sbf.append(and);
									sbf.append(String.valueOf(rsltMapping.get("column"))).append(" "+filter.get("minSymbol")).append(String.valueOf(filter.get("minVal"))).
									append(and).append(String.valueOf(rsltMapping.get("column"))).append(" "+filter.get("maxSymbol")).append(String.valueOf(filter.get("maxVal"))).append(end);
								}else if(filter.get("maxVal")!=null&&!String.valueOf(filter.get("maxVal")).isEmpty()&&(filter.get("minVal")==null||String.valueOf(filter.get("minVal")).isEmpty())){//=
									sbf.append(and);
									sbf.append(String.valueOf(rsltMapping.get("column"))).append(" "+filter.get("maxSymbol")).append(String.valueOf(filter.get("maxVal"))).append(end);
								}else if(filter.get("minVal")!=null&&!String.valueOf(filter.get("minVal")).isEmpty()&&(filter.get("maxVal")==null||String.valueOf(filter.get("maxVal")).isEmpty())){
									sbf.append(and);
									sbf.append(String.valueOf(rsltMapping.get("column"))).append(" "+filter.get("minSymbol")).append(String.valueOf(filter.get("minVal"))).append(end);
								}
							}
						}
					}
				}
				
				String con = sbf.toString();
					
				reportCheckInfo.setLogic_sql_info(reportCheckInfo.getLogic_sql_info().replace("{{}}", con));
			}else{
				reportCheckInfo.setLogic_sql_info(reportCheckInfo.getLogic_sql_info().replace("{{}}", ""));
			}
		}else{
			
			reportCheckInfo.setLogic_sql_info(reportCheckInfo.getLogic_sql_info().replace("{{}}", ""));
		}
		return reportCheckInfo.getLogic_sql_info();
	}
		
	@SuppressWarnings("unchecked")
	public String getDrillParam(ReportCheckInfo reportCheckInfo) throws Exception {
		
		String and = " and ";
		String eq = " = ";
		//String report_id = reportCheckInfo.getReport_id();
		String report_id_p = reportCheckInfo.getConditions().get("report_id_p");
		//String queryForLogicSqlByReportId = queryForLogicSqlByReportId(report_id_p);
		
		if(report_id_p!=null&&!report_id_p.isEmpty()&&reportCheckInfo.getLogic_sql_info().contains("[[]]")&&reportCheckInfo.getLogic_sql_info().contains("<select id=\"resultMapping\">")){//是否钻取
			
			//获取父的 field_info   drillParamColumn  钻取条件中文列名
			Map<String, String> fieldInfo = queryFieldInfo(report_id_p);
			//根据conditions  --> column_cn找到需要钻取列中文名
			//找到对应的条件列名 fieldInfo  -->drillParamColumn
			Map<String, String> conditions = reportCheckInfo.getConditions();
			String drillColum = conditions.get("column_cn");
			
			String fieldInfoStr = fieldInfo.get("FIELD_INFO");//字段全，可能为空
			List<Map<String,Object>> fieldInfoList = WebTools.fromGson(fieldInfoStr, List.class);
			if(fieldInfoList!=null&&fieldInfoList.size()>0&&drillColum!=null&&!drillColum.isEmpty()){
				String[] drillParamColumns = null;
				for (Map<String, Object> fieldInfoMap : fieldInfoList) {
					if(drillColum.equals(fieldInfoMap.get("fieldname"))){
						String drillParamColumn = String.valueOf(fieldInfoMap.get("drillParamColumn"));
						drillParamColumns = drillParamColumn.split(",");
					}
					
				}
				//根据id查询sql
				List<Map<String, Object>> resultMapping = ParamsUtil.getResultMapping(reportCheckInfo.getLogic_sql_info());
				
				StringBuffer sbf = new StringBuffer();
				//根据conditions和drillParamColumns 拼接where子句
				for (String key : conditions.keySet()) {
					for (String drillParamColumn : drillParamColumns) {
						for (Map<String, Object> field : resultMapping) {
							//根据中文获取英文  子的sql resultMapping
							if(key.equals(drillParamColumn)&&key.equals(String.valueOf(field.get("columnCN")))){
								sbf.append(and);
								sbf.append(String.valueOf(field.get("column")));
								sbf.append(eq);
								sbf.append("'"+conditions.get(key)+"'");
							}
						}

						
					}
					
				}
				
				String con = sbf.toString();

				reportCheckInfo.setLogic_sql_info(reportCheckInfo.getLogic_sql_info().replace("[[]]", con));
			}else{
				reportCheckInfo.setLogic_sql_info(reportCheckInfo.getLogic_sql_info().replace("[[]]", ""));
				throw new Exception("FIELD_INFO和column_cn不符合条件。fieldInfoStr："+fieldInfoStr+";column_cn:"+drillColum);
			}
		}else{
			reportCheckInfo.setLogic_sql_info(reportCheckInfo.getLogic_sql_info().replace("[[]]", ""));
		}
		
		return reportCheckInfo.getLogic_sql_info();
	}
	
	@SuppressWarnings("unchecked")
	public Map<String,String> buildRequest(HttpServletRequest request) throws IOException {
		//测试第二个接口
		Map<String,Object> param=WebTools.fromGson(request.getParameter("params"),Map.class);
		Map<String,String> params = (Map<String, String>) param.get("conditions");
		params.put("filter_data", WebTools.toJson(param.get("filter_data")));
		params.put("report_id",(String)param.get("report_id"));
		String queryForSql = null;
		if((String)param.get("logic_sql_info")==null||(String)param.get("logic_sql_info")==""){
			queryForSql = queryForLogicSqlByReportId((String)param.get("report_id"));
			params.put("logic_sql_info", queryForSql);
		}else{
			params.put("logic_sql_info", (String)param.get("logic_sql_info"));
		}
		params.put("limit",request.getParameter("limit"));
		params.put("pageNo",request.getParameter("page"));
		params.put("sord", request.getParameter("sord"));
		if(request.getParameter("sidx")==""){
			params.put("sidx", null);
		}else{
			params.put("sidx", request.getParameter("sidx"));
		}
		return params;
	}
	
	
	public String getTotal(ReportCheckInfo reportCheckInfo) {
		List<String> qryDBnames = ReportTool.analyseQryDb(queryQryBdByReportId(reportCheckInfo.getReport_id()));
		//将组建信息交给sql判断
		buildPreSql(reportCheckInfo,qryDBnames,"select");
	
		String dbid = getDbidByReport(reportCheckInfo.getReport_id());
		reportCheckInfo.getConditions().put("queryType", "count");
		Rslt queryRslt = super.queryRslt(dbid, reportCheckInfo.getLogic_sql_info(), reportCheckInfo.getConditions());
		
		Object object = queryRslt.getDatas().get(0).get(0);
		String count= object.toString();
		return count;
	}
	
	public void takeLog(HttpServletRequest request, ReportCheckInfo reportCheckInfo, Double startTime, Double endTime,String operateType,String total) {
		try{
			String username = reportCheckInfo.getConditions().get("username")==null?"liyq":reportCheckInfo.getConditions().get("username");
			//
			reportCheckInfo.setLogic_sql_info(assembleField(reportCheckInfo));
			reportCheckInfo.setLogic_sql_info(getDrillParam(reportCheckInfo));
			String report_id = reportCheckInfo.getReport_id();
			List<Map<String, Object>> reportNameById = findReportNameById(report_id);
			String name = null;
			if(reportNameById!=null&&reportNameById.get(0).containsKey("name_")){
				name = (String) reportNameById.get(0).get("name_");
			}
			if(request.getParameter("page").equals("1")){
				SrptLog srptLog=new SrptLog();
				srptLog.setLogLevel("1");
				srptLog.setUsername(username);
				srptLog.setQryusedTime(endTime-startTime);
				srptLog.setOperateType(operateType);
				srptLog.setModuleCode(name);
				srptLog.setOptReason("local_sh");
				String param = reportCheckInfo.getConditions().toString();
				String subParam = null;
				if(param!=null&&param.length()>1000){
					subParam = param.substring(0, 100)+param.substring(param.length()-300, param.length());
				}else{
					subParam = param;
				}
				srptLog.setMessage(" --"+report_id+" --"+subParam);
				srptLog.setOrderId(total);
				if(iSrptRcptLogService!=null){
					iSrptRcptLogService.add(request,srptLog);
				}
			}
		}catch(Throwable t){
			t.printStackTrace();
		}
		
	}
	

	
	public int insertFieldInfo(String report_id, List<Map<String, Object>> fieldInfo) {
		String insertSql = "UPDATE dm_co_ba_srpt_report SET field_info= ? WHERE report_id = ?";
		int update = getJdbc().update(insertSql, new Object[]{fieldInfo,report_id});
		return update;
		
	}
	
	@SuppressWarnings({ "unchecked"})
	public List<Map<String,String>> search(String nameLike) {
		Map<String,String> params = MapUtils.newHashMap();
		String ifId = "srpt-cfg-reportLikeQuery";
		//利用原 模糊查询接口，如果没有name模糊，则直接查询
		List<String>  enabled = null;
		List<Map<String,String>> report = new LinkedList<Map<String,String>>();
		if(nameLike==null||nameLike.isEmpty()){//直接查询
			List<Map<String,String>> menuInfo = (List<Map<String,String>>)super.query(ifId, params);
			return getReports(menuInfo,enabled,report);
		}else{ //代参数查询
			params.put("name", nameLike);
			List<Map<String,String>> menuInfo = (List<Map<String,String>>)super.query(ifId,params);
			return getReports(menuInfo,enabled,report);
		}
		
	}
	
	private List<Map<String, String>> getReports(List<Map<String, String>> menuInfo, List<String> enabled,
			List<Map<String, String>> report) {
		Map<String,String> params = MapUtils.newHashMap();
		String ifId = "srpt-cfg-searchParent";
		
		for (Map<String, String> map : menuInfo) {
			enabled = new LinkedList<String>();
			params.put("id", map.get("id_"));
			List<Map<String,BigDecimal>> parentEna = super.query(ifId,params);
			//查询 如果包含 0 则不添加进结果集
			if(parentEna!=null&&parentEna.size()==0){
				report.add(map);
			}
		}
		return report;
	}
	
	public Object distinctDataSource() {
		String ifId="srpt-cfg-dataSourceQueryAll";
		Map<String,Object> map = new HashMap<String,Object>();
		List<Map<String,String>> reportIdList = null;
		try{
			reportIdList = super.query(ifId,"");
			return map.put("success", reportIdList);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("distinctDataSource failed");
			return map.put("false", t);
		}
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String,String>> findReportFieldAndTpl(Map<String, String> params) {//srpt-cfg-colorQueryField
		String ifId="srpt-cfg-colorQueryTplById";
		Map<String,String> map = new HashMap<String,String>();
		List<Map<String,String>> result = new ArrayList<Map<String,String>>();
		try{
			String fieldColor= ((Map<String,String>)super.query("srpt-cfg-colorQueryField",params)).get("field_color");
			if(fieldColor!=null&&!fieldColor.isEmpty()){
				Map<String,String> mapFieldTpl = WebTools.fromGson(fieldColor,Map.class);
				Set<String> keySet = mapFieldTpl.keySet();
				Iterator<String> it = keySet.iterator();
				Map<String,String> tplMap = null;
				while(it.hasNext()){
					String key = it.next();
					String value = (String) mapFieldTpl.get(key);
					map.put("id", value);
					tplMap = (Map<String,String>)super.query(ifId,map);
					tplMap.put("field", key);
					result.add(tplMap);
				}
			}
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("findReportFieldAndTpl failed");
		}
		return result;
	}
	
	public int updateLogModuleCode(Map<String, String> params) {
		String oldCode = params.get("oldCode");
		String newCode = params.get("newCode");
		String sql = "update ipmsp.sys_logs_ori set module_code =?  where  module_code=?";
		int update = -1;
		try{
			update = getJdbc(dbid).update(sql, new Object[]{newCode,oldCode});
		}catch(Throwable t){
			t.printStackTrace();
		}
		return update;
	}

	public void exportAll(String userAgent, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Double startTime = Double.parseDouble(String.valueOf(System.currentTimeMillis()));
		Map<String, String> params = buildRequest(request);
		params.put("headQuery", "data");
		ReportCheckInfo reportCheckInfo = buildReportCheckInfo(params);
		reportCheckInfo.setLogic_sql_info(assembleField(reportCheckInfo));
		reportCheckInfo.setLogic_sql_info(getDrillParam(reportCheckInfo));
		List<String> qryDBnames = ReportTool.analyseQryDb(queryQryBdByReportId(reportCheckInfo.getReport_id()));
		buildPreSql(reportCheckInfo,qryDBnames,"select");
		reportCheckInfo.getConditions().put("pageNo", "1");
		reportCheckInfo.getConditions().put("limit", "50000");
		String dbid = getDbidByReport(reportCheckInfo.getReport_id());
		reportCheckInfo.getConditions().put("queryType", "select");
		Rslt queryRslt = super.queryRslt(dbid, reportCheckInfo.getLogic_sql_info(), reportCheckInfo.getConditions());
		Map<String, String> resultMap = ReportTool.getResultMapping(reportCheckInfo.getLogic_sql_info());
		List<String> resultHeaders = ReportTool.replaceValue(queryRslt.getHeadMetas(),resultMap);
		List<Map<String, Object>> datas = ReportTool.buildDatas(queryRslt, queryRslt.getDatas().size(),resultHeaders);

		if(resultHeaders.contains("ROW_")){
			resultHeaders.remove("ROW_");
		}
		String[] arrHeaders = resultHeaders.toArray(new String[resultHeaders.size()]);
		
		String title = request.getParameter("FileTitle");
		String username = reportCheckInfo.getConditions().get("username")==null?"liyq":reportCheckInfo.getConditions().get("username");
		//新版导出
		ExcelCreater xlsCreator = new ExcelCreater();
		xlsCreator.setCreator(username);
		xlsCreator.setFilename(title);
		xlsCreator.setSheetName(title);
		xlsCreator.setTitle(title);
		xlsCreator.setHeadNames(arrHeaders);
		xlsCreator.setPropertyNames(arrHeaders);
		xlsCreator.setDatas(datas);
		xlsCreator.setType(Type.xls);
		try {
			WebTools.exportPreDone(title+".xls", userAgent, response);
			OutputStream os = response.getOutputStream();
			xlsCreator.setOutputStream(os);
			xlsCreator.init();
			xlsCreator.execute();
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		Double endTime = Double.parseDouble(String.valueOf(System.currentTimeMillis()));
	    try {
	    	reportCheckInfo.setLogic_sql_info(assembleField(reportCheckInfo));
			reportCheckInfo.setLogic_sql_info(getDrillParam(reportCheckInfo));
	    	takeLog(request, reportCheckInfo,startTime, endTime,"2",String.valueOf(datas.size()));  //2:导出
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	public void exportBatch(String userAgent, final HttpServletRequest request, HttpServletResponse response) throws Exception {
		//TODO 分批导出调整
		final String totalcount = request.getParameter("totalCount");   //记录总数
		String[] arrHeaders = getArrHeaders(request);
		
		String fileTitle = request.getParameter("FileTitle");
		String username = buildRequest(request).get("username")==null?"liyq":buildRequest(request).get("username");
		
		Double startTime = Double.parseDouble(String.valueOf(System.currentTimeMillis()));
		Map<String,String> params = buildRequest(request);
		params.put("pageNo", ""+1);  //记录数，要换
		params.put("limit", String.valueOf(2000000));
		params.put("headQuery", "data");
		ReportCheckInfo reportCheckInfo = buildReportCheckInfo(params);
		
		reportCheckInfo.getConditions().put("pageNo", "1");
		reportCheckInfo.getConditions().put("limit", "2000000");
		reportCheckInfo.getConditions().put("queryType", "select");
		reportCheckInfo.getConditions().put("headQuery", "data");
		
		reportCheckInfo.setLogic_sql_info(assembleField(reportCheckInfo));
		reportCheckInfo.setLogic_sql_info(getDrillParam(reportCheckInfo));
		
		//新版导出
		ExcelRsCsvCreater xlsCreator = new ExcelRsCsvCreater();
		xlsCreator.setCreator(username);
		xlsCreator.setFilename(fileTitle);
		xlsCreator.setSheetName(fileTitle);
		xlsCreator.setTitle(fileTitle);
		xlsCreator.setHeadNames(arrHeaders);
		xlsCreator.setPropertyNames(arrHeaders);
		xlsCreator.setType(Type.csv);
		xlsCreator.setJdbcTemplate(super.getJdbc());
		String sql = getSql(reportCheckInfo);
		xlsCreator.setSql(sql);
		LoggerHelper.debug(getClass(),"执行sql："+sql);
		//xlsCreator.setFilename("d:/temp.csv");
		String rtn=WebTools.getContentDisposition(fileTitle+".csv",userAgent);
		response.setHeader("Content-Disposition","attachment;" + rtn);
		response.setHeader("Connection", "close");
		response.setHeader("Content-Type", "application/octet-stream");
		OutputStream os = response.getOutputStream();
		xlsCreator.setOutputStream(os);
		xlsCreator.init();
		StopWatch stop = new StopWatch("");	
		stop.start("执行");
		xlsCreator.execute();
		stop.stop();
		LoggerHelper.debug(getClass(),stop.prettyPrint());
		Double endTime = Double.parseDouble(String.valueOf(System.currentTimeMillis()));
		takeLog(request, reportCheckInfo, startTime, endTime, "2",totalcount);
	}
	
	
	private String[] getArrHeaders(HttpServletRequest request) throws Exception {
		Map<String, String> params = buildRequest(request);
		ReportCheckInfo reportCheckInfo = buildReportCheckInfo(params);
		reportCheckInfo.setLogic_sql_info(assembleField(reportCheckInfo));
		reportCheckInfo.setLogic_sql_info(getDrillParam(reportCheckInfo));
		List<String> qryDBnames = ReportTool.analyseQryDb(queryQryBdByReportId(reportCheckInfo.getReport_id()));
		buildPreSql(reportCheckInfo,qryDBnames,"select");
		reportCheckInfo.getConditions().put("pageNo", "1");
		reportCheckInfo.getConditions().put("limit", "1");
		String dbid = getDbidByReport(reportCheckInfo.getReport_id());
		reportCheckInfo.getConditions().put("queryType", "select");
		Rslt queryRslt = super.queryRslt(dbid, reportCheckInfo.getLogic_sql_info(), reportCheckInfo.getConditions());
		Map<String, String> resultMap = ReportTool.getResultMapping(reportCheckInfo.getLogic_sql_info());
		List<String> resultHeaders = ReportTool.replaceValue(queryRslt.getHeadMetas(),resultMap);
		if(resultHeaders.contains("ROW_")){
			resultHeaders.remove("ROW_");
		}
		String[] arrHeaders = resultHeaders.toArray(new String[resultHeaders.size()]);
		return arrHeaders;
	}

	private List<String[]> getExpResultBatch(ReportCheckInfo reportCheckInfo){
		try{
			//解析组件
			List<String> qryDBnames = ReportTool.analyseQryDb(queryQryBdByReportId(reportCheckInfo.getReport_id()));
			buildPreSql(reportCheckInfo,qryDBnames,"select");
			//修改参数
			Map<String, String> resultMap = ReportTool.getResultMapping(reportCheckInfo.getLogic_sql_info());
			
			reportCheckInfo.getConditions().put("queryType", "count");
			Rslt queryRslt = super.queryRslt(getDbidByReport(reportCheckInfo.getReport_id()), reportCheckInfo.getLogic_sql_info(), reportCheckInfo.getConditions());
			Object object = queryRslt.getDatas().get(0).get(0);
			long count= Long.parseLong(object.toString());
			
			reportCheckInfo.getConditions().put("queryType", "select");
			Rslt rslt2 = super.queryRslt(getDbidByReport(reportCheckInfo.getReport_id()), reportCheckInfo.getLogic_sql_info(), reportCheckInfo.getConditions());
			List<String> resultHeaders = ReportTool.replaceValue(rslt2.getHeadMetas(),resultMap);
			
			RsltPageObject pageObject=new RsltPageObject(ReportTool.buildDatas(rslt2,rslt2.getDatas().size(),resultHeaders),count,Integer.parseInt(reportCheckInfo.getConditions().get("pageNo")),Integer.parseInt(reportCheckInfo.getConditions().get("limit")));
			List elements = pageObject.getElements();
			
			String[] arr = new String[resultHeaders.size()]; 
			List<String[]> datas = MapUtils.trans2Array(elements, resultHeaders.toArray(arr));
			return datas;
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("did not get datas by batch"+t.toString());
			return null;
		}
	}

	protected void export(DataRetriver dataRetriver,
			final String[] properiesName, final String[] headsName,
			final String title, final Class beanCls, final String exportType,
			final String userAgent, HttpServletResponse response,String username)
			throws IOException {
		String rtn=WebTools.getContentDisposition(title+"."+exportType,userAgent);
		response.setHeader("Content-Disposition","attachment;" + rtn);
		response.setHeader("Connection", "close");
		response.setHeader("Content-Type", "application/octet-stream");
		OutputStream os = response.getOutputStream();
		CsvExporter.export(os, dataRetriver, properiesName, headsName, beanCls,title,username);
		
	}

	public String getSql(ReportCheckInfo reportCheckInfo) {
		SqlTemplate st = SmlTools.toSqlTemplate(dbid, reportCheckInfo.getLogic_sql_info(), reportCheckInfo.getConditions());
		Rst rst=getSqlMarkupAbstractTemplate().getSqlResolvers().resolverLinks(st.getMainSql(), st.getSmlParams());
		String sql = rst.getPrettySqlString();
		return sql;
	}
	/**
	 * 获取下拉组件的字段中英文名称
	 * @param reportCheckInfo
	 * @return
	 */
	public Map<String,Object> getCompDownColumn(ReportCheckInfo reportCheckInfo) {
		System.out.println("report:"+reportCheckInfo);
		List<Map<String,String>> result = null;
		Map<String,String> column = null;
		try{
			//解析组件  
			List<String> qryDBnames = ReportTool.analyseQryDb(queryQryBdByReportId(reportCheckInfo.getReport_id()));
			//重新组装reportcheckinfo 的sql
			buildPreSql(reportCheckInfo,qryDBnames,"head");
			//columnCN  column
			Map<String, String> resultMap = ReportTool.getResultMapping(reportCheckInfo.getLogic_sql_info());
			//获取field_info 和 resultMap组合
			Map<String, String> queryFieldInfo = queryFieldInfo(reportCheckInfo.getReport_id());
			//fieldType
			List<Map<String,Object>> field_info = WebTools.fromGson(queryFieldInfo.get("FIELD_INFO"), List.class);
			if(field_info!=null&&!field_info.isEmpty()&&queryFieldInfo.get("FIELD_INFO").contains("number")){
				result = MapUtils.newArrayList();
				for (Map<String, Object> map : field_info) {
					for (String engKey : resultMap.keySet()) {
						
						if(String.valueOf(map.get("fieldname")).equals(resultMap.get(engKey))
								&&String.valueOf(map.get("fieldType")).equals("number")
								){
							column = MapUtils.newHashMap();
							column.put("column", engKey);
							column.put("columnCN", resultMap.get(engKey));
							if(!result.contains(column)){
								result.add(column);
							}
						}
					}
				}
			}else{
				result = MapUtils.newArrayList();
			}
			return ReportTool.buildResult(true,"success",result);
		}catch(Exception e){
			logger.info("报表:["+queryMenuName(reportCheckInfo.getReport_id()).get(0).get("name_")+",报表ID:"+reportCheckInfo.getReport_id()+"]查询表头有误!");
			e.printStackTrace();
			return ReportTool.buildResult(false,"fail",result);
		}
	}
	
	
	
	
	
	
	public void testExportAll(String userAgent, HttpServletRequest request, HttpServletResponse response) throws Exception {
		/*Map<String, String> params = buildRequest(request);
		params.put("headQuery", "data");
		ReportCheckInfo reportCheckInfo = buildReportCheckInfo(params);
		reportCheckInfo.setLogic_sql_info(assembleField(reportCheckInfo));
		reportCheckInfo.setLogic_sql_info(getDrillParam(reportCheckInfo));
		
		List<String> qryDBnames = ReportTool.analyseQryDb(queryQryBdByReportId(reportCheckInfo.getReport_id()));
		buildPreSql(reportCheckInfo,qryDBnames,"select");
		
		reportCheckInfo.getConditions().put("pageNo", "1");
		reportCheckInfo.getConditions().put("limit", "50000");
	
		String dbid = getDbidByReport(reportCheckInfo.getReport_id());
		reportCheckInfo.getConditions().put("queryType", "select");
		Rslt queryRslt = super.queryRslt(dbid, reportCheckInfo.getLogic_sql_info(), reportCheckInfo.getConditions());
		
		Map<String, String> resultMap = ReportTool.getResultMapping(reportCheckInfo.getLogic_sql_info());

		List<String> headMetas = queryRslt.getHeadMetas();
		List<String> resultHeaders = ReportTool.replaceValue(headMetas,resultMap);

		System.out.println(headMetas);
		
		if(resultHeaders.contains("ROW_")){
			resultHeaders.remove("ROW_");
		}
		
		if(headMetas.contains("ROW_")){
			headMetas.remove("ROW_");
		}
		
		String[] arrHeaders = resultHeaders.toArray(new String[resultHeaders.size()]);
		
		System.out.println(arrHeaders);
		
		String[] proHeaders = headMetas.toArray(new String[headMetas.size()]);
		
		
		String title = request.getParameter("FileTitle");
		String username = reportCheckInfo.getConditions().get("username")==null?"liyq":reportCheckInfo.getConditions().get("username");
		//新版导出
		ExcelRsCreater xlsCreator = new ExcelRsCreater();
		xlsCreator.setCreator(username);
		xlsCreator.setFilename(title);
		xlsCreator.setSheetName(title);
		xlsCreator.setTitle(title);
		xlsCreator.setHeadNames(arrHeaders);
		xlsCreator.setPropertyNames(proHeaders);
		xlsCreator.setType(Type.xlsx);
		
		JdbcTemplate jdbc = super.getJdbc(dbid);
		xlsCreator.setJdbcTemplate(jdbc);
		xlsCreator.setSql(getSql(reportCheckInfo));
		
		String rtn=WebTools.getContentDisposition(title+".xlsx",userAgent);
		response.setHeader("Content-Disposition","attachment;" + rtn);
		response.setHeader("Connection", "close");
		response.setHeader("Content-Type", "application/octet-stream");
		OutputStream os = response.getOutputStream();
		
		xlsCreator.setOutputStream(os);
		xlsCreator.init();
		xlsCreator.execute();*/
	}

	public Map<String, Object> getMaxTime(ReportCheckInfo reportCheckInfo) {
		Map<String, Object> result = MapUtils.newHashMap();
		String sql = queryForLogicSqlByReportId(reportCheckInfo.getReport_id());
		if(sql!=null&&sql.contains("<select id=\"maxTime\">")){
			result.put("hasMixFlag", true);
			String maxTimeSql = ReportTool.getMaxTimeSql(sql);
			//执行获取最新时间
			List<Map<String, Object>> maxTimeInfo = super.queryForList(dbid, maxTimeSql, null);
			result.put("maxTime", maxTimeInfo);
		}else{
			result.put("hasMixFlag", false);
			result.put("maxTime", null);
		}
		return result;
	}

	public Map<String, String> getColumnCNEN(ReportCheckInfo reportCheckInfo) {
		
		if(reportCheckInfo.getLogic_sql_info()==null||(reportCheckInfo.getLogic_sql_info()!=null&&reportCheckInfo.getLogic_sql_info().isEmpty())){
			String queryForSql = queryForLogicSqlByReportId(reportCheckInfo.getReport_id());
			reportCheckInfo.setLogic_sql_info(queryForSql);
		}
		
		// 根据id获取sql -> 获取中英文字段
		Map<String, String> resultMapping = ReportTool.getResultMapping(reportCheckInfo.getLogic_sql_info());
		//将key和value 倒置
		Map<String, String> result = ReportTool.convertKV(resultMapping);
		return result;
	}

	public List<Map<String, Object>> excludeSql(ReportCheckInfo reportCheckInfo) {
		//执行sql
		List<Map<String, Object>> result = super.excludeSql(getDbidByReport(reportCheckInfo.getReport_id()), reportCheckInfo.getLogic_sql_info());
		return result;
	}
}
