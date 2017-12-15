package com.eastcom_sw.srpt.tools;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.hw.sml.core.Rslt;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;

import com.eastcom_sw.srpt.model.ReportCheckInfo;

/**
 * 解析报表的一些工具方法
 * @author zxw
 *
 */
public class ReportTool {
	
	
	public static List<String>  analyseQryDb(Map<String, String> queryQryBdByReportId){
		//解析组件
//		Map<String, String> queryQryBdByReportId = srptRcptService.queryQryBdByReportId(reportCheckInfo.getReport_id());
		String bdInfoJson = queryQryBdByReportId.get("QRY_BD_INFO");
		List<String> qryDBnames = new ArrayList<String>();
		if(bdInfoJson!=null&&(!bdInfoJson.isEmpty())){
			Map<String,Object> bdInfo = WebTools.fromJson(bdInfoJson, Map.class);
			List<Map<String,String>> otherCon = (List<Map<String, String>>) bdInfo.get("otherCondition");
			
			for (int i = 0; i < otherCon.size(); i++) {
				if(otherCon.get(i).get("type").equals("leftRight")){
					qryDBnames.add(otherCon.get(i).get("id"));
				}
			}
		}
		return qryDBnames;
	}
	
	//调整程序结构 check是否存在这个标签   --字段=映射名称 --key=value
	public static Map<String,String> getResultMapping(String queryForSql){
		String mark = RegexUtils.subString(queryForSql,"<select id=\"resultMapping\">","</select>");
		if(mark!=null){
			return ParamsUtil.trans2MapFromString(mark.trim());
		}else{
			return MapUtils.newHashMap();
		}
	}
	
	//获取最新时间点的sql
	public static String getMaxTimeSql(String queryForSql){
		return RegexUtils.subString(queryForSql,"<select id=\"maxTime\">","</select>");
	}
	
	public static List<String> replaceValue(List<String> headMetas,Map<String,String> map) {
		List<String> ars=new LinkedList<String>();
		for(String headMeta:headMetas){
			ars.add(map.get(headMeta)==null?headMeta:map.get(headMeta));
		}
		return ars;
	}
	
	
	public static List<Map<String, Object>> buildDatas(Rslt rslt, long count,List<String> resultHeaders) {
		List<Map<String,Object>> pageDatas = new LinkedList<Map<String,Object>>();
		long headSize=resultHeaders.size();
		for(int i=0;i<count;i++){
			Map<String,Object> map = new LinkedHashMap<String,Object>();
			for(int j=0;j<headSize;j++){
			//	if(!(resultHeaders.get(j).equals("ROW_"))){
					map.put(resultHeaders.get(j), rslt.getDatas().get(i).get(j));
			//	}
			}
			pageDatas.add(map);
		}
		return pageDatas;
	}
	
	
	public static void buildReturnSql(ReportCheckInfo reportCheckInfo,List<String> qryDBnames) {
		String logic_sql_info = reportCheckInfo.getLogic_sql_info();
		
		//int legth = (Integer) new QuerySqlBuilder().jugeSql("head",logic_sql_info,reportCheckInfo.getConditions(),qryDBnames).get("jdbcTypeLen");
		Map<String, Object> jugeSql = new QuerySqlBuilder().jugeSql("head",logic_sql_info,reportCheckInfo.getConditions(),qryDBnames);
		int legth = (Integer)jugeSql.get("jdbcTypeLen");
		String isAddJdbcType = (String)jugeSql.get("isAddJdbcType");
		String newSql = null;
		if(isAddJdbcType.equals("no")){
			newSql = logic_sql_info.substring(15+legth, logic_sql_info.length()-16);
		}else{
			newSql = logic_sql_info.substring(15+49+legth, logic_sql_info.length()-16);
		}
		reportCheckInfo.setLogic_sql_info(newSql);
	}
	
	public static Map<String,Object> buildResult(boolean successMark,String msg,Object result){
		Map<String,Object> returnResult=new LinkedHashMap<String, Object>();
		returnResult.put("success",successMark);
		returnResult.put("msg",msg);
		returnResult.put("data",result);
		return returnResult;
	}
	
	public static List<Map<String,Object>> buildInfo(Map<String,String> field_Info,String fildName) {
		String info= field_Info.get(fildName);
		List<Map<String,Object>> fromJson = WebTools.fromJson(info, List.class);
		return fromJson;
	}
	
	/*
	 * [{
	"sortflag":1,                       //排序
	"fieldname":"开始时间",         //字段名称
	"ishidden":"false"             //是否隐藏
		}]
	 * @param headers
	 * @return
	 */
	public static List<Map<String, Object>> buildFieldInfo(List<String> headers) {
		List<Map<String,Object>> fieldInfo = new LinkedList<Map<String,Object>>();
		Map<String,Object> map = null;
		for (int i=0;i<headers.size();i++) {
			map = new HashMap<String,Object>();
			map.put("sortflag", i);
			map.put("fieldname", headers.get(i));
			map.put("ishidden", "false");
			fieldInfo.add(map);
		}
		return fieldInfo;
	}

	public static Map<String, String> convertKV(Map<String, String> resultMapping) {
		// 将map的key和value倒置
		Map<String,String> result = MapUtils.newHashMap();
		for (String key : resultMapping.keySet()) {
			result.put(resultMapping.get(key), key);
		}
		return result;
	}
	
}
