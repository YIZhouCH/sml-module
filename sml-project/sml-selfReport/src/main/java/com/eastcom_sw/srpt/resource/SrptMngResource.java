package com.eastcom_sw.srpt.resource;


import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.hw.sml.manager.model.PageObject;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Inject;
import org.hw.sml.tools.MapUtils;

import com.eastcom_sw.srpt.model.ReportCheckInfo;
import com.eastcom_sw.srpt.service.EmailSrptService;
import com.eastcom_sw.srpt.service.SrptRcptQueryService;
import com.eastcom_sw.srpt.service.SrptRcptService;
import com.eastcom_sw.srpt.tools.BuildTree;
import com.eastcom_sw.srpt.tools.ParamsUtil;
import com.eastcom_sw.srpt.tools.ReportTool;

@SmlResource
@Bean
public class SrptMngResource{
	
	public static final Logger logger=Logger.getLogger(SrptMngResource.class);
	@Inject
	private SrptRcptQueryService srptRcptQueryService;
	@Inject
	private EmailSrptService emailSrptService;
	@Inject
	private SrptRcptService srptRcptService;
	/**
	 * 
	 * @param mark  srpt-cfg-reportInfo
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public void checkOrQueryReport(String name,HttpServletRequest request,HttpServletResponse response) throws Exception{
		Object result = null;
		 ReportCheckInfo reportCheckInfo=WebTools.fromJson(WebTools.getRequestBody(request),ReportCheckInfo.class);
		try{
			reportCheckInfo.setLogic_sql_info(srptRcptQueryService.assembleField(reportCheckInfo));
			//将传的条件与子报表组件条件一一对应起来
			reportCheckInfo.setLogic_sql_info(srptRcptQueryService.getDrillParam(reportCheckInfo));
			result = srptRcptQueryService.checkOrQueryReportPre(reportCheckInfo,null);
			WebTools.print(response, result);
		}catch(Exception e){
			logger.info("报表:["+srptRcptQueryService.queryMenuName(reportCheckInfo.getReport_id())+"]查询表头有误!");
			WebTools.print(response, result);
		}
	}
	
	
	/**
	 * 
	 * @param mark  srpt-cfg-reportInfo
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public void getCompDownColumn(String name,HttpServletRequest request,HttpServletResponse response) throws Exception{
		Map<String,Object> result = null;
		ReportCheckInfo reportCheckInfo=WebTools.fromJson(WebTools.getRequestBody(request),ReportCheckInfo.class);
		try{
			result = srptRcptQueryService.getCompDownColumn(reportCheckInfo);
			WebTools.print(response, result);
		}catch(Exception e){
			logger.info("报表:["+srptRcptQueryService.queryMenuName(reportCheckInfo.getReport_id())+"]查询表头有误!");
			WebTools.print(response, result);
		}
	}
	
	//验证或者查询报表   插件调用
	public void checkOrQueryReportAuto(String name,HttpServletRequest request,HttpServletResponse response) throws Exception{
		Map<String, String> params = srptRcptQueryService.buildRequest(request);
		ReportCheckInfo reportCheckInfo = srptRcptQueryService.buildReportCheckInfo(params);
		Object result=null;
		try {
			Double startTime = Double.parseDouble(String.valueOf(System.currentTimeMillis()));
			
			//--log
			reportCheckInfo.setLogic_sql_info(srptRcptQueryService.assembleField(reportCheckInfo));
			reportCheckInfo.setLogic_sql_info(srptRcptQueryService.getDrillParam(reportCheckInfo));
			
			result=srptRcptQueryService.checkOrQueryReport(reportCheckInfo);
			Double endTime = Double.parseDouble(String.valueOf(System.currentTimeMillis()));
			
			reportCheckInfo.setLogic_sql_info(srptRcptQueryService.assembleField(reportCheckInfo));
			reportCheckInfo.setLogic_sql_info(srptRcptQueryService.getDrillParam(reportCheckInfo));
			
			String total = srptRcptQueryService.getTotal(reportCheckInfo);
			srptRcptQueryService.takeLog(request,reportCheckInfo,startTime,endTime,"0",total);
			reportCheckInfo.setLogic_sql_info("");
			WebTools.print(response,result);
		}  catch (IOException e) {
			logger.info("报表:["+srptRcptQueryService.queryMenuName(reportCheckInfo.getReport_id())+"]查询有误!");
			WebTools.print(response,result);
			e.printStackTrace();
		}
	}
	
	public int buildFieldInfo(String name,HttpServletRequest request,HttpServletResponse response) throws IOException{
		ReportCheckInfo  reportCheckInfo=WebTools.fromJson(WebTools.getRequestBody(request),ReportCheckInfo.class);
		try {
			Map<String,Object> result = (Map<String, Object>) srptRcptQueryService.checkOrQueryReportPre(reportCheckInfo,null);
			Map<String,Object> page = (Map<String, Object>) result.get("data");
			List<String> headers = (List<String>) page.get("headMetas");
			List<Map<String,Object>> fieldInfo = ReportTool.buildFieldInfo(headers);
			return  srptRcptQueryService.insertFieldInfo(reportCheckInfo.getReport_id(),fieldInfo);
		} catch (Exception e) {
			logger.info("报表:["+srptRcptQueryService.queryMenuName(reportCheckInfo.getReport_id())+"]获取FieldInfo有误!");
			return -1;
		}
	}
	
	//首页直接查询可显示报表
	public List<Map<String, String>>  findByParentContinue(String name,
			HttpServletRequest request,HttpServletResponse response) throws IOException{
		Map<String,String> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return srptRcptQueryService.search(params.get("name"));
	}
	
	//首页直接查询可显示报表
	public Object distinctDataSource(String name,HttpServletRequest request,HttpServletResponse response){
		return  srptRcptQueryService.distinctDataSource();
	}
	
	//查询颜色
	public List<Map<String,String>>  queryReportFieldColor(String name,HttpServletRequest request,HttpServletResponse response) throws IOException{
		Map<String,String> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return  srptRcptQueryService.findReportFieldAndTpl(params);
	}
	
	//修改日志表模块名称
	public int updateLogModuleCode(String name,HttpServletRequest request,HttpServletResponse response) throws IOException{
		Map<String,String> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return srptRcptQueryService.updateLogModuleCode(params);
	}
	
//  5W条记录以内导出  查询，直接将limit设置为50000
	public void exportAll(String name,HttpServletRequest request,HttpServletResponse response) throws Exception {
		srptRcptQueryService.exportAll(request.getHeader("User-Agent"),request,response);
	}
	public void exportBatch(String name,final HttpServletRequest request, HttpServletResponse response) throws Exception {
		String userAgent=request.getHeader("User-Agent");
		srptRcptQueryService.exportBatch(userAgent,request,response);
	}
	/**
	 * 
	 * @param mark  srpt-cfg-reportInfo
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public String getSql(String name,HttpServletRequest request,HttpServletResponse response) throws Exception{
		ReportCheckInfo reportCheckInfo=WebTools.fromJson(WebTools.getRequestBody(request),ReportCheckInfo.class);
		reportCheckInfo.setLogic_sql_info(srptRcptQueryService.assembleField(reportCheckInfo));
		reportCheckInfo.setLogic_sql_info(srptRcptQueryService.getDrillParam(reportCheckInfo));
		String sql = srptRcptQueryService.getSql(reportCheckInfo);
		return sql;
	}
	
	public void testExportAll(String name,HttpServletRequest request,HttpServletResponse response) throws Exception {
		String userAgent=request.getHeader("User-Agent");
		srptRcptQueryService.testExportAll(userAgent,request,response);
	}
	
	public Map<String, Object> getMaxTime(String name,HttpServletRequest request,HttpServletResponse response) throws Exception{
		ReportCheckInfo reportCheckInfo=WebTools.fromJson(WebTools.getRequestBody(request),ReportCheckInfo.class);
		return  srptRcptQueryService.getMaxTime(reportCheckInfo);
	}
	
	public void excludeSql(String name,HttpServletRequest request,HttpServletResponse response) throws Exception{
		ReportCheckInfo reportCheckInfo=WebTools.fromJson(WebTools.getRequestBody(request),ReportCheckInfo.class);
		List<Map<String,Object>> result = srptRcptQueryService.excludeSql(reportCheckInfo);
		WebTools.print(response, ReportTool.buildResult(true, "success", result));
	}
	
	public Map<String, String> getColumnCNEN(String name,HttpServletRequest request,HttpServletResponse response) throws Exception{
		ReportCheckInfo reportCheckInfo=WebTools.fromJson(WebTools.getRequestBody(request),ReportCheckInfo.class);
		return srptRcptQueryService.getColumnCNEN(reportCheckInfo);
	}

	
	public List<Map<String, Object>> syncQueryReportMenu(String name,HttpServletRequest request,HttpServletResponse response) {
		return buildResult();
	}
	public int sendMailNow(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		return copyTask(WebTools.fromJson(WebTools.getRequestBody(request),Map.class));
		
	}
	public List<Map<String,String>> getFullMenu(String name,HttpServletRequest request,HttpServletResponse response) throws IOException{
		return srptRcptService.queryFullMenu(WebTools.fromJson(WebTools.getRequestBody(request),Map.class));
	}
	
	public int updateDeviceModel(String name,
			HttpServletRequest request,HttpServletResponse response) throws IOException{
		Map<String,String> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return srptRcptService.updateDeviceModel(params);
	}
	
	public int[] updateDvcMdlRel(String name,HttpServletRequest request,HttpServletResponse response) throws IOException{
		List<Map<String,String>> params=WebTools.fromJson(WebTools.getRequestBody(request),List.class);
		return srptRcptService.updateDvcMdlRel(params);
	}
	
	public List<Map<String,Object>> getChoosedTree(String name,HttpServletRequest request,HttpServletResponse response) throws IOException{
		List<Map<String,Object>> interIdsAndNames=WebTools.fromJson(WebTools.getRequestBody(request),List.class);
		return  srptRcptService.getChoosedTree(interIdsAndNames);
	}
	
	public List<Map<String, Object>> getArrangedTree(String name,HttpServletRequest request,HttpServletResponse response) throws IOException{
		Map<String,String> tplId=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return srptRcptService.getArrangedTree(tplId);
	}
	public PageObject showNotice(String name,HttpServletRequest request,HttpServletResponse response){
		Map<String,String> params = WebTools.buildJqParams(request);
		return srptRcptService.queryNoticeByPage(params);
	}
	
	public PageObject showLastReport(String name ,HttpServletRequest request,HttpServletResponse response){
		Map<String,String> params = WebTools.buildJqParams(request);
		return srptRcptService.queryLastRptByPage(params);
	}
	//菜单同步查询  条件 用户名和enabled
	public List<Map<String, Object>>  syncQueryReport(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,Object> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return  buildResult1(params);
	}
		
	public List<Map<String, Object>> syncQueryReportUrl(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,Object> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return buildResultUrl(params);
	}

	public int deletePackageUrl(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,String> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);	
		return srptRcptService.deleteAllMenuUrl(params);
	}
	public List<Map<String, Object>> syncQueryRoleUser(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,String> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return buildResultRole(params);
	}
	public List<String>  findAllRoleOrMenu(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,String> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return buildAllRoleOrMenu(params);
	}
	//1: 1用户 - n报表   2： n用户 - 1报表  3： n 用户-n 报表[批量给用户报表权限]   4：n用户-n报表 [批量授权报表给指定用户]
	public int publishTypeOne(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,Object> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return buildTypeOneResult(params);
	}
	public int publishTypeTwo(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		//传入 "username":[]  "report_id":[]
		Map<String,Object> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return buildTypeTwoResult(params);
	}
	public int publishTypeThree(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,Object> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return	 buildTypeThreeResult(params);
	}
	
	public int publishTypeFour(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,Object> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return buildTypeFourResult(params);
	}
	
	public int publishTypeFive(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,Object> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return buildTypeFourResult(params);
	}
	public List<Map<String, Object>> findAllReportAndMenuByUsername(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,String> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return findAllReportAndMenu(params);
	}
	
	public List<Map<String, Object>> asyncFindByCreator(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,Object> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return findRportsByCreator(params);
	}
	
	//获取列名以及列名算法等
	public List<Map<String, Object>> getColumnDesc(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		Map<String,String> params=WebTools.fromJson(WebTools.getRequestBody(request),Map.class);
		return getColumnAndDescr(params);
	}
	
	public Map<String, Object> saveColumnDescr(String name,HttpServletRequest request,HttpServletResponse response) throws IOException {
		List<Map<String,Object>> params=WebTools.fromJson(WebTools.getRequestBody(request),List.class);
		Map<String,Object> columnDescr = null;
		return  saveColumnDescr(params);
	}
	
	
	
	
	private List<Map<String, Object>> buildResultUrl(Map<String, Object> params) {
			List<Map<String,Object>> reportInfoAll = new ArrayList<Map<String,Object>>(); 
			List<Map<String,Object>> result = MapUtils.newArrayList();
			//直接查所有的
			
			List<Map<String,Object>> reportInfoAllList = (List<Map<String,Object>>)srptRcptService.queryReportLoopAllById(String.valueOf(params.get("url")),"url");
			
			//list去重
			for (Map<String, Object> map : reportInfoAllList) {
				if(!reportInfoAll.contains(map)){
					reportInfoAll.add(map);
				}
			}
			if(reportInfoAll!=null&&reportInfoAll.size()>0){
				result = BuildTree.createTree(reportInfoAll, "id_", "parent_id", "children", "0");
			}
			return result;
		}
		
		

		
		
	
		
		
		
		
		
		private int buildTypeFiveResult(Map<String, Object> params) {
			List<String> usernames = (List<String>) params.get("username");
			List<String> reportIds = (List<String>) params.get("report_id");
			int buildTypeThreeResult = 0;
			if(usernames!=null&&usernames.size()>0&&reportIds!=null&&reportIds.size()>0){
				buildTypeThreeResult = srptRcptService.buildTypeFiveResult(usernames,reportIds);
			}
			return buildTypeThreeResult;
		}
		/*
		 * TODO 菜单目录和角色关联 未使用
		 */
		
		
		private Map<String,Object> saveColumnDescr(List<Map<String, Object>> params) {
			Map<String,Object> result = new HashMap<String,Object>();
			if(params!=null&&!params.isEmpty()){
				//delete first
				String id = (String) params.get(0).get("id");
				int delete = srptRcptService.deleteStrategy(id);
				int[] save = srptRcptService.saveStrategy(params);
				result.put("delete", delete);
				result.put("save", save);
			}
			return result;
		}

		private List<Map<String, Object>> getColumnAndDescr(Map<String,String> params) {
			//1.id-sql->column
			String logicSql = srptRcptService.queryForLogicSqlByReportId(params.get("id"));
			List<Map<String, Object>> columnList = ParamsUtil.getResultMapping(logicSql);  //{"column":"kpi001","columnCN":"日期"}
			//2.id-table->column
			List<Map<String, Object>> columnInfo = srptRcptService.queryForColumnByReportId(params,columnList);
			return columnInfo;
		}

		private List<Map<String, Object>> findRportsByCreator(Map<String, Object> params) {
			// TODO 0428 Auto-generated method stub
			String creator = (String) params.get("creator_");
			String report_id = params.get("report_id").toString(); //父类id
			List<Integer> enabledList = (List<Integer>) params.get("enabled");
			String enabledStr = getEnabledStr(enabledList);
			String classValue = (String) params.get("class");
			List<Map<String, Object>> docAndReport = new LinkedList<Map<String,Object>>();   //结果集
			
			//先判断是不是超级管理员，根据用户查询角色
//			List<String> rolesList = srptRcptService.findRoleByCreator(creator);
			//find superadmin
			List<Map<String,String>> superAdmin = new ArrayList<Map<String,String>>(); 
			List<Map<String, Object>> queryReportByParentAsync = null;
			//judge superAdmin.contains role
//			if(rolesList.size()<0){
				//juge admin
//			}else{
				/*//非管理员 和之前逻辑一样，加上 and creator_=? 只查询自己的返回 
				//根据report_id查自己，自
				 
	*/			if(classValue!=null&&classValue.equals("0")){
					queryReportByParentAsync = srptRcptService.queryReportByParentAsync(report_id,enabledStr);//异步，根据父类查子类
					/*if(queryReportByParentAsync!=null&&queryReportByParentAsync.size()>0){
						for (Map<String, Object> reportAndDoc : queryReportByParentAsync) {
							if(reportAndDoc.get("type_").toString().equals("0")){
								docAndReport.add(reportAndDoc);
							}else{ //报表判断创建者是谁
								if(reportAndDoc.get("creator")!=null&&reportAndDoc.get("creator").equals(creator)){
									docAndReport.add(reportAndDoc);
								}
							}
						}
					}*/
				}
//			}
			return queryReportByParentAsync;
		}

		// params type:role/type:menu
		private List<String> buildAllRoleOrMenu(Map<String, String> params) {
			String type = params.get("type");
			List<String> result = null;
			if(type!=null&&type.equals("role")){
				result = srptRcptService.findAllRole();
			}else if(type!=null&&type.equals("menu")){
				result = srptRcptService.findAllMenu();
			}
			return result;
		}
		
		private List<Map<String, Object>> findAllReportAndMenu(Map<String, String> params) {
			String username = params.get("username");
			String parentId = params.get("parent_id");
			return null;
		}


		private String getEnabledStr(List<Integer> enabledList) {
			StringBuffer enableStrB = new StringBuffer();
			String enabledStr = null;
			if(enabledList!=null&&enabledList.size()>0){
				for (Integer integer : enabledList) {
					enableStrB.append(integer.toString()+",");
				}
				enabledStr = enableStrB.toString();
				enabledStr = enabledStr.substring(0, enabledStr.length()-1);
			}
			return enabledStr;
		}

		private int buildTypeFourResult(Map<String, Object> params) {
			List<String> usernames = (List<String>) params.get("username");
			List<String> reportIds = (List<String>) params.get("report_id");
			int buildTypeThreeResult = 0;
			if(usernames!=null&&usernames.size()>0&&reportIds!=null&&reportIds.size()>0){
				buildTypeThreeResult = srptRcptService.buildTypeFourResult(usernames,reportIds);
			}
			return buildTypeThreeResult;
		}

		private int buildTypeThreeResult(Map<String, Object> params) {
			List<String> usernames = (List<String>) params.get("username");
			List<String> reportIds = (List<String>) params.get("report_id");
			int buildTypeThreeResult = 0;
			if(usernames!=null&&usernames.size()>0&&reportIds!=null&&reportIds.size()>0){
				buildTypeThreeResult = srptRcptService.buildTypeThreeResult(usernames,reportIds);
			}
			return buildTypeThreeResult;
		}

		private int buildTypeTwoResult(Map<String, Object> params) {
			List<String> usernames = (List<String>) params.get("username");
			List<String> reportIds = (List<String>) params.get("report_id");
			int buildTypeTwoResult = 0;
			if(usernames!=null&&usernames.size()>0&&reportIds!=null&&reportIds.size()==1){
				buildTypeTwoResult = srptRcptService.buildTypeTwoResult(usernames,reportIds);
			}
			return buildTypeTwoResult;
		}

		private int buildTypeOneResult(Map<String, Object> params) {
			// 根据用户删除原有报表 在根据报表id插入用户报表关系中
			List<String> usernames = (List<String>) params.get("username");
			List<String> reportIds = (List<String>) params.get("report_id");
			int buildTypeOneResult=0;
			if(usernames!=null&&usernames.size()==1&&reportIds!=null&&reportIds.size()>0){
				buildTypeOneResult = srptRcptService.buildTypeOneResult(usernames,reportIds);
			}
			return buildTypeOneResult;
			
		}

		private List<Map<String,Object>> buildResultRole(Map<String,String> params) {
			List<Map<String,Object>> allUsers = null ;
			List<Map<String,Object>> reportInfoListAll = new LinkedList<Map<String,Object>>();    //父子集
			String type = params.get("type");
			String searchValue = params.get("searchValue");
			
			if(searchValue==null||(searchValue!=null&&searchValue.isEmpty())){  //find all
				List<Map<String,Object>> allRoles = srptRcptService.queryAllRoles(null);
				if(allRoles!=null&&allRoles.size()>0){
					for (Map<String, Object> map : allRoles) {
						String roleId = (String) map.get("role_id");
						allUsers = srptRcptService.queryAllUsers(roleId); //   fix 14:55
						if(allUsers!=null&&allUsers.size()>0){
							for (Map<String, Object> allUsersMap : allUsers) {
								allUsersMap.put("children", new ArrayList());
							}
						}
						map.put("children", allUsers);
						reportInfoListAll.add(map);
					}
				}
			}else if(searchValue!=null&&(!searchValue.isEmpty())&&type!=null&&(!type.isEmpty())){ //srpt-cfg-queryUsernameLike
				List<Map<String,Object>> allRoles = null;
				List<Map<String,Object>> allResult = new ArrayList<Map<String,Object>>();
				List<Map<String,Object>> allResultDistinct = new LinkedList<Map<String,Object>>();
				List<Map<String,Object>> userInfoQueryLike = srptRcptService.queryUsersLike(type,searchValue);
				if(userInfoQueryLike!=null&&userInfoQueryLike.size()>0){
					for (Map<String, Object> map : userInfoQueryLike) {
						map.put("children", new ArrayList());
						//find role id by roleidself role_id
						String roleIdByUserInfo = (String) map.get("role_id");
						allRoles = srptRcptService.queryAllRoles(roleIdByUserInfo);
						allResult.addAll(allRoles);
					}
				}
				//去重
				List<Map<String,Object>> userList = null;
				if(allResult!=null&&allResult.size()>0){
					for (Map<String, Object> map : allResult) {
						if(!allResultDistinct.contains(map)){
							allResultDistinct.add(map);
						}
					}
					for (Map<String, Object> roleMap : allResultDistinct) {
						String roleId = (String) roleMap.get("role_id");
						userList = new ArrayList<Map<String,Object>>();
						for(Map<String, Object> userInfoMap : userInfoQueryLike){
							if(roleId.equals(userInfoMap.get("role_id"))){
								userList.add(userInfoMap);
							}
						}
						roleMap.put("children", userList);
						reportInfoListAll.add(roleMap);
					}
				}
				
			}
		
			return reportInfoListAll;
		}

		private List<Map<String, Object>> buildResult1(Map<String,Object> params) {
			String username = (String) params.get("username");
			List<Integer> enabled = (List<Integer>) params.get("enabled");
			String type = (String) params.get("type");
			String nameLike = (String) params.get("name");
			String reportName = (String) params.get("report_name");
			String kpi_name = (String) params.get("kpi_name");
			if(kpi_name==null){
				kpi_name = "";
			}
			String enabledStr = getEnabledStr(enabled);
			
			//if nameLike != null ====>likeQuery else menuQuery
			List<Map<String,String>> reportIdList = null;
			List<Map<String,String>> reportInfoList = new LinkedList<Map<String,String>>();    //父子集
			List<Map<String,Object>> reportInfoListAll = new LinkedList<Map<String,Object>>();    //父子集
			List<Map<String,Object>> reportInfoListAllNew = new LinkedList<Map<String,Object>>();
			//将所有的调用buildtree菜单
		//	List<Map<String, Object>> treeNew = null;
			if(type!=null&&type.equals("0")&&username!=null&&username.length()>0){ //无层级关系返回，模糊查询用到
				reportIdList = srptRcptService.queryReportIdByUsername(username);
				if(reportIdList!=null&&reportIdList.size()>0){
					for (Map<String, String> reportIdKey : reportIdList) {
						String reportId = reportIdKey.get("REPORT_ID");
						List<Map<String,String>> reportIdEnabled = (List<Map<String,String>>)srptRcptService.queryReportSelfById(reportId,enabledStr,nameLike,reportName,kpi_name);
						reportInfoList.addAll(reportIdEnabled);
					}
				}
				//find report Info by self id
				if(reportInfoList!=null&&reportInfoList.size()>0){
					for (Map<String, String> reportIdMap : reportInfoList) {
						String id = reportIdMap.get("report_id");
						//srpt-cfg-reportLikeQuery
						List<Map<String, Object>> queryReportBySelfId = srptRcptService.queryReportBySelfId(id);
						reportInfoListAll.addAll(queryReportBySelfId);
					}
				}
				for (Map<String, Object> map : reportInfoListAll) {
					if(!reportInfoListAllNew.contains(map)){
						reportInfoListAllNew.add(map);
					}
				}
			//	reportInfoListAllNew.addAll(reportInfoListAll);  //fix on 1205 16:42
			//	return reportInfoListAll;
			}else if(type!=null&&type.equals("1")&&username!=null&&username.length()>0){//层级返回
				reportIdList = srptRcptService.queryReportIdByUsername(username);
				//reportName like query
				if(reportIdList!=null&&reportIdList.size()>0){
					for (Map<String, String> reportIdKey : reportIdList) {
						String reportId = reportIdKey.get("REPORT_ID");
						List<Map<String,String>> reportIdEnabled = (List<Map<String,String>>)srptRcptService.queryReportSelfById(reportId,enabledStr,nameLike,reportName,kpi_name);
						reportInfoList.addAll(reportIdEnabled);
					}
				}
				//judge reportInfolist is null
				if(reportInfoList!=null&&reportInfoList.size()>0){
					for(Map<String,String> report_id : reportInfoList){
						String reportIdSingle = report_id.get("report_id");
						List<Map<String,Object>> reportInfoAllList = (List<Map<String,Object>>)srptRcptService.queryReportLoopAllById(reportIdSingle,"ori");
						reportInfoListAll.addAll(reportInfoAllList);
					}
					
				}
				//list去重
				for (Map<String, Object> map : reportInfoListAll) {
					if(!reportInfoListAllNew.contains(map)){
						reportInfoListAllNew.add(map);
					}
				}
				if(reportInfoListAllNew!=null&&reportInfoListAllNew.size()>0){
					reportInfoListAllNew = BuildTree.createTree(reportInfoListAllNew, "id_", "parent_id", "children", "0");
				}
				
			}else if(type!=null&&type.equals("1")&&username!=null&&username.isEmpty()){//层级返回,查询所有
				reportIdList = srptRcptService.queryReportIdAll();
				//reportName like query
				if(reportIdList!=null&&reportIdList.size()>0){
					for (Map<String, String> reportIdKey : reportIdList) {
						String reportId = reportIdKey.get("report_id");
						List<Map<String,String>> reportIdEnabled = (List<Map<String,String>>)srptRcptService.queryReportSelfById(reportId,enabledStr,nameLike,reportName,kpi_name);
						reportInfoList.addAll(reportIdEnabled);
					}
				}
				//judge reportInfolist is null
				if(reportInfoList!=null&&reportInfoList.size()>0){
					for(Map<String,String> report_id : reportInfoList){
						String reportIdSingle = report_id.get("report_id");
						List<Map<String,Object>> reportInfoAllList = (List<Map<String,Object>>)srptRcptService.queryReportLoopAllById(reportIdSingle,"ori");
						reportInfoListAll.addAll(reportInfoAllList);
					}
					
				}
				//list去重
				for (Map<String, Object> map : reportInfoListAll) {
					if(!reportInfoListAllNew.contains(map)){
						reportInfoListAllNew.add(map);
					}
				}
				if(reportInfoListAllNew!=null&&reportInfoListAllNew.size()>0){
					reportInfoListAllNew = BuildTree.createTree(reportInfoListAllNew, "id_", "parent_id", "children", "0");
				}
				
			}else if(type!=null&&type.equals("2")){//根据创建者模糊查询 无层次返回
			//	srpt-cfg-reportQueryNameLike
				reportInfoListAllNew = (List<Map<String,Object>>)srptRcptService.findReportLikeByCreator(username,enabledStr,reportName);
			}
			
			MapUtils.sort(reportInfoListAllNew, "id_", "asc");
			
			return reportInfoListAllNew;
		}	
	
	//-------------------//--------------------
	
	
	
	private int copyTask(Map<String,String> params) {  //{"id":"任务id"}
		int findOriginalTask = emailSrptService.findOriginalTask(params);
		return findOriginalTask;
	}
	
	private List<Map<String, Object>> buildResult() {
		List<Map<String,String>> reportIdList = null;
		List<Map<String,String>> reportInfoList = new LinkedList<Map<String,String>>();    //父子集
		List<Map<String,Object>> reportInfoListAll = new LinkedList<Map<String,Object>>();    //父子集
		List<Map<String,Object>> reportInfoListAllNew = new LinkedList<Map<String,Object>>();
		//层级返回,查询所有
		reportIdList = emailSrptService.queryReportIdAll();
		//reportName like query
			if(reportIdList!=null&&reportIdList.size()>0){
			for (Map<String, String> reportIdKey : reportIdList) {
				String reportId = reportIdKey.get("report_id");
				List<Map<String,String>> reportIdEnabled =emailSrptService.queryEamilReportSelfById(reportId);
				reportInfoList.addAll(reportIdEnabled);
			}
		}
		//judge reportInfolist is null
		if(reportInfoList!=null&&reportInfoList.size()>0){
			for(Map<String,String> report_id : reportInfoList){
				String reportIdSingle = report_id.get("report_id");
				List<Map<String,Object>> reportInfoAllList =emailSrptService.queryReportLoopAllById(reportIdSingle);
				reportInfoListAll.addAll(reportInfoAllList);
			}
			
		}
		//list去重
		for (Map<String, Object> map : reportInfoListAll) {
			if(!reportInfoListAllNew.contains(map)){
				reportInfoListAllNew.add(map);
			}
		}
		if(reportInfoListAllNew!=null&&reportInfoListAllNew.size()>0){
			reportInfoListAllNew = BuildTree.createTree(reportInfoListAllNew, "id_", "parent_id", "children", "0");
		}
		return reportInfoListAllNew;
	}
}
