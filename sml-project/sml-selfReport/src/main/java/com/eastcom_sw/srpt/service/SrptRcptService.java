package com.eastcom_sw.srpt.service;


import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.hw.sml.manager.model.PageObject;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.model.Result;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Maps;

import com.eastcom_sw.srpt.base.SrptBaseService;
import com.eastcom_sw.srpt.model.ReportCheckInfo;
import com.eastcom_sw.srpt.tools.ParamsUtil;


@Bean
public class SrptRcptService extends SrptBaseService{
	
	
	public String queryForLogicSqlByReportId(String report_id){
		@SuppressWarnings("unchecked")
		String logicSql=((Map<String,String>)query("--ifId=srpt-cfg-reportInfo --report_id="+report_id+" --fields=sql_logic_info")).get("SQL_LOGIC_INFO");
		return logicSql;
	}
	
	public Map<String,String> queryQryBdByReportId(String report_id){
		@SuppressWarnings("unchecked")
		Map<String,String> qryBd=(Map<String,String>)query("--ifId=srpt-cfg-reportInfo --report_id="+report_id+" --fields=qry_bd_info");
		return qryBd;
	}
	
	@SuppressWarnings({ "unchecked"})
	public List<Map<String,String>> search(String nameLike) {
		//利用原 模糊查询接口，如果没有name模糊，则直接查询
		List<String>  enabled = null;
		List<Map<String,String>> report = new LinkedList<Map<String,String>>();
		if(nameLike==null||nameLike.isEmpty()){//直接查询
			List<Map<String,String>> menuInfo = (List<Map<String,String>>)query("srpt-cfg-reportLikeQuery",new HashMap<String,String>());
			return getReports(menuInfo,enabled,report);
		}else{ //代参数查询
			List<Map<String,String>> menuInfo = (List<Map<String,String>>)query("srpt-cfg-reportLikeQuery",new Maps<String,String>().put("name",nameLike).getMap());
			return getReports(menuInfo,enabled,report);
		}
		
	}

	private List<Map<String, String>> getReports(List<Map<String, String>> menuInfo, List<String> enabled,
			List<Map<String, String>> report) {
		for (Map<String, String> map : menuInfo) {
			enabled = new LinkedList<String>();
			List<Map<String,BigDecimal>> parentEna = (List<Map<String,BigDecimal>>)query("srpt-cfg-searchParent",new Maps<String,String>().put("id",map.get("id_")).getMap());
			//查询 如果包含 0 则不添加进结果集
			if(parentEna!=null&&parentEna.size()==0){
				report.add(map);
			}
		}
		return report;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, String>> queryReportIdByUsername(String username) {
		//ifId srpt-cfg-queryReportByUsername
		List<Map<String,String>> reportIdList = null;
		try{
			reportIdList = (List<Map<String,String>>)query("srpt-cfg-queryReportByUsername", " --username="+username);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("queryReportIdByUsername failed");
		}
		return reportIdList;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> queryReportLoopAllById(String reportId,String type) {
		List<Map<String,Object>> menuList = null;
		try{
			if(type.equals("ori")){
				menuList = (List<Map<String,Object>>)query("srpt-cfg-menuQueryParent", " --id="+reportId+" --mark="+type);
			}else if(type.equals("url")){
				menuList = (List<Map<String,Object>>)query("srpt-cfg-menuQueryParent", " --url="+reportId+" --mark="+type);
			}else if(type.equals("parent")){
				menuList = (List<Map<String,Object>>)query("srpt-cfg-menuQueryParent", " --parent_id="+reportId+" --mark="+type);
			}
			
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("queryReportLoopAllById by reportId failed");
		}
		return menuList;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> queryAllRoles(String roleId) {
		// srpt-cfg-reportQueryRoles   查询所有角色
		List<Map<String,Object>> rolesResult = null;
		try{
			if(roleId!=null&&(!roleId.isEmpty())){
				rolesResult = (List<Map<String,Object>>)query("srpt-cfg-reportQueryRoles"," --role_id="+roleId);
			}else{
				rolesResult = (List<Map<String,Object>>)query(" --ifId=srpt-cfg-reportQueryRoles");
			}
			
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("queryAllRoles failed");
		}
		return rolesResult;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> queryAllUsers(String roleId) {
		List<Map<String,Object>> usersResult = null;
		try{
			usersResult = (List<Map<String,Object>>)query("srpt-cfg-reportQueryUsers"," --role_id="+roleId);
			return usersResult;
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("queryAllUsers by roleId failed");
			return new ArrayList();
		}
		
	}

	public int buildTypeOneResult(List<String> usernames, List<String> reportIds) {
		String username = usernames.get(0);
		String deleteSql = "delete from DM_CO_BA_SRPT_user_report_rel where username=?";
		String insertSql = "insert into DM_CO_BA_SRPT_user_report_rel(username,report_Id,update_time) values(?,?,?)";
		String updateSql = "update dm_co_ba_srpt_menu set enabled=2 where id_=?";
		int update=0;
		int insert=0;
		int setEnabled =0;
		try{
			update = getJdbc().update(deleteSql,new Object[]{username});
			for (String reportId : reportIds) {
				insert = getJdbc().update(insertSql,new Object[]{username,reportId,new Date()});
				//update
				setEnabled =getJdbc().update(updateSql,new Object[]{reportId});
			}
			logger.info("update "+username+" success"+";set enabled=2 state:"+setEnabled);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("buildTypeOneResult delete info failed");
		}
		return insert;
		
	}

	public int buildTypeTwoResult(List<String> usernames, List<String> reportIds) {
		String report_id = reportIds.get(0);
		String deleteSql = "delete from DM_CO_BA_SRPT_user_report_rel where report_id=?";
		String insertSql = "insert into DM_CO_BA_SRPT_user_report_rel(username,report_Id,update_time) values(?,?,?)";
		String updateSql = "update dm_co_ba_srpt_menu set enabled=2 where id_=?";
		int update=0;
		int insert=0;
		int setEnabled=0;
		try{
			update = getJdbc().update(deleteSql,new Object[]{report_id});
			setEnabled =getJdbc().update(updateSql,new Object[]{report_id});
			for (String username : usernames) {
				insert =getJdbc().update(insertSql,new Object[]{username,report_id,new Date()});
			}
			logger.info("update "+report_id+" success;set enabled=2 state:"+setEnabled);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("buildTypeOneResult delete info failed");
		}
		return insert;
	}

	public int buildTypeThreeResult(List<String> usernames, List<String> reportIds) {
		String userstring = list2String(usernames);
		String deleteSql = "delete from DM_CO_BA_SRPT_user_report_rel where username =?";
		String insertSql = "insert into DM_CO_BA_SRPT_user_report_rel(username,report_Id,update_time) values(?,?,?)";
		String updateSql = "update dm_co_ba_srpt_menu set enabled=2 where id_=?";
		int update=0;
		int insert=0;
		int setEnabled=0;
		try{
			//删除用户
			for (String username : usernames) {
				update =getJdbc().update(deleteSql,new Object[]{username});
				for (String reportId : reportIds) {
					insert=getJdbc().update(insertSql,new Object[]{username,reportId,new Date()});
					setEnabled=getJdbc().update(updateSql,new Object[]{reportId});
				}
			}
			logger.info("update "+userstring+" success;set enabled=2 state:"+setEnabled);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("buildTypeOneResult delete info failed");
		}
		return insert;
	}

	private String list2String(List<String> listParams) {
		StringBuffer sb = new StringBuffer();
		for (String listParam : listParams) {
			sb.append(listParam+",");
		}
		//去掉最后的逗号
		String listStr = sb.toString();
		listStr = listStr.substring(0, listStr.length()-1);
		return listStr;
	}

	public int buildTypeFourResult(List<String> usernames, List<String> reportIds) {
		String reportstring = list2String(reportIds);
		String deleteSql = "delete from DM_CO_BA_SRPT_user_report_rel where report_id =?";
		String insertSql = "insert into DM_CO_BA_SRPT_user_report_rel(username,report_Id,update_time) values(?,?,?)";
		String updateSql = "update dm_co_ba_srpt_menu set enabled=2 where id_=?";
		int update=0;
		int insert=0;
		int setEnabled=0;
		try{
			//删除用户
			for (String reportId : reportIds) {
				update =getJdbc().update(deleteSql,new Object[]{reportId});
				setEnabled =getJdbc().update(updateSql,new Object[]{reportId});
				for (String username : usernames) {
					insert =getJdbc().update(insertSql,new Object[]{username,reportId,new Date()});
				}
			}
			
			logger.info("update "+reportstring+" success;set enabled=2 state:"+setEnabled);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("buildTypeOneResult delete info failed");
		}
		return insert;
	}
	
	//查找符合条件的报表id
	@SuppressWarnings("unchecked")
	public List<Map<String, String>> queryReportSelfById(String reportId,String enabledStr,String nameLike, String reportName,String kpi_name) {
		List<Map<String,String>> reportResult = null;
		try{
			if(nameLike == null&&(reportName==null||(reportName!=null&&reportName.equals("")))){
				//根据reportName 模糊查询
				reportResult = (List<Map<String,String>>)query("srpt-cfg-reportQuerySelfEnable"," --id="+reportId+" --enabled="+enabledStr+" --kpi_name="+kpi_name);
			}else if(nameLike == null&&reportName!=null&&(!reportName.isEmpty())){
				reportResult = (List<Map<String,String>>)query("srpt-cfg-reportQuerySelfEnable"," --id="+reportId+" --enabled="+enabledStr+" --reportName="+reportName);
			}else if(nameLike != null){
				reportResult = (List<Map<String,String>>)query("srpt-cfg-reportQuerySelfEnable"," --id="+reportId+" --enabled="+enabledStr+" --name="+nameLike);
			}
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("queryReportSelfById by roleId failed");
			return new ArrayList();
		}
		return reportResult;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> queryReportBySelfId(String id) {
		List<Map<String,Object>> reportResult = null;
		try{
			reportResult = (List<Map<String,Object>>)query("srpt-cfg-reportLikeQuery"," --id="+id);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("queryReportBySelfId by roleId failed");
			return new ArrayList();
		}
		return reportResult;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> queryReportByParentAsync(String report_id, String enabledStr) {
		//srpt-cfg-menuQueryAsync
		List<Map<String,Object>> reportResult = null;
		try{
			reportResult = (List<Map<String,Object>>)query("srpt-cfg-menuQueryAsync"," --parent_id="+report_id+" --enabled="+enabledStr);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("queryReportByParentAsync by roleId failed");
			return new ArrayList();
		}
		return reportResult;
	}

	@SuppressWarnings("unchecked")
	public List<String> findAllRole() {
		List<String> listStringResult = null;
		try{
			List<Map<String,String>> resultListMap = (List<Map<String,String>>)query(" --ifId=srpt-cfg-rolesQuery");
			listStringResult = buildListString(resultListMap,"role_id");
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("findAllRole failed");
		}
		return listStringResult;
	}
	
	@SuppressWarnings("unchecked")
	public List<String> findAllMenu() {
		List<String> listStringResult = null;
		try{
			List<Map<String,String>> resultListMap = (List<Map<String,String>>)query(" --ifId=srpt-cfg-menusQuery");
			listStringResult = buildListString(resultListMap,"menu_id");
			listStringResult.add("0");//add root id
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("findAllMenu failed");
		}
		return listStringResult;
	}

	private List<String> buildListString(List<Map<String, String>> resultListMap,String key) {
		List<String> resultListString = new ArrayList<String>();
		String value = null;
		for (Map<String, String> map : resultListMap) {
			value = map.get(key);
			resultListString.add(value);
		}
		return resultListString;
	}

	@SuppressWarnings("unchecked")
	public List<String> findRoleByCreator(String creator) {
		// TODO 根据用户查询角色 id或者其它，关联查询
		List<String> resultListMap = null;
		try{
			resultListMap = (List<String>)query("srpt-cfg-queryRoleIdByCreator"," --creator="+creator);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("findRoleByCreator failed");
		}
		return resultListMap;
	}

	@SuppressWarnings("unchecked")
	public List<String> findReportIdByCreator(String creator) {
		List<String> reportIdList = null;
		try{
			reportIdList = (List<String>)query("srpt-cfg-queryRportIdByCreator"," --creator="+creator);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("findRoleByCreator failed");
		}
		return reportIdList;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> queryUsersLike(String type, String searchValue) {
		List<Map<String,Object>> userInfoQueryLike = null;
		try{
			userInfoQueryLike = (List<Map<String,Object>>)query("srpt-cfg-queryUsernameLike"," --"+type+"="+searchValue);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("queryUsersLike failed");
		}
		return userInfoQueryLike;
		
	}
//homepage
	public PageObject queryNoticeByPage(Map<String, String> params) {
		
		String limit = params.get("limit");
		String pageNo = params.get("pageNo");
		Result noticePage = null;     // 20160420  fix
		PageObject pageObject = null;
		try{
			noticePage = (Result)query("srpt-cfg-homePageNoticePage", params);
			if(noticePage!=null){
				pageObject = new PageObject(noticePage.getDatas(),noticePage.getCount(),Integer.parseInt(pageNo),Integer.parseInt(limit));
			}
	
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("queryNoticeByPage-查询失败");
		}
		return pageObject;
	}

/*	public void insertLog(SrptLog take) {
		String insertSql = "insert into DM_CO_BA_SRPT_LOG (record_time,log_type,user_name,report_id,qry_used_time,client_ip,response_msg,request_params,response_code) values(?,?,?,?,?,?,?,?,?)";
		int insert = jfContextUtils.getJdbc(defaultDbid).update(insertSql,new Object[]{new Date(),take.getLogType(),take.getUsername(),take.getReportId(),take.getUsedTime(),take.getClientIp(),take.getResponseMsg(),take.getRequestParams(),take.getResponseCode()});
	}*/

	public PageObject queryLastRptByPage(Map<String, String> params) {

		String limit = params.get("limit");
		String pageNo = params.get("pageNo");
		Result lastPage = null;     // 20160420  fix
		PageObject pageObject = null;
		try{
			lastPage = (Result)query("srpt-cfg-homePageLastQueryRpt", params);
			if(lastPage!=null){
				pageObject = new PageObject(lastPage.getDatas(),lastPage.getCount(),Integer.parseInt(pageNo),Integer.parseInt(limit));
			}
	
		}catch(Throwable t){
			t.printStackTrace();
		}
		return pageObject;
	}

	public List<Map<String, Object>> findReportLikeByCreator(String username, String enabledStr, String reportName) {
		List<Map<String,Object>> reportResult = null;
		try{
			reportResult = (List<Map<String,Object>>)query("srpt-cfg-reportQueryNameLike"," --username="+username+" --enabled="+enabledStr+" --report_name="+reportName);
		}catch(Throwable t){
			t.printStackTrace();
			return new ArrayList();
		}
		return reportResult;
	}

	public List<Map<String, String>> queryReportIdAll() {
		//ifId srpt-cfg-queryReportByUsername
		List<Map<String,String>> reportIdList = null;
		try{
			reportIdList = (List<Map<String,String>>)query(" --ifId=srpt-cfg-queryReportAll");
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("queryReportIdAll failed");
		}
		return reportIdList;
	}

	public Object distinctDataSource() {
		Map<String,Object> map = new HashMap<String,Object>();
		List<Map<String,String>> reportIdList = null;
		try{
			reportIdList = (List<Map<String,String>>)query(" --ifId=srpt-cfg-dataSourceQueryAll");
			return map.put("success", reportIdList);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("distinctDataSource failed");
			return map.put("false", t);
		}
	}

	@SuppressWarnings("unchecked")
	public List<Map<String,String>> findReportFieldAndTpl(Map<String, String> params) {//srpt-cfg-colorQueryField
		List<Map<String,String>> result = new ArrayList<Map<String,String>>();
		try{
			String fieldColor= ((Map<String,String>)query("srpt-cfg-colorQueryField",params)).get("field_color");
			if(fieldColor!=null&&!fieldColor.isEmpty()){
				Map<String,String> mapFieldTpl = WebTools.fromGson(fieldColor, Map.class);
				Set<String> keySet = mapFieldTpl.keySet();
				Iterator<String> it = keySet.iterator();
				Map<String,String> tplMap = null;
				while(it.hasNext()){
					String key = it.next();
					String value = (String) mapFieldTpl.get(key);
					tplMap = (Map<String,String>)query(" --ifId=srpt-cfg-colorQueryTplById --id="+value);
					tplMap.put("field", key);
					result.add(tplMap);
				}
			}
			
		//	JSONObject fieldJson = JSONObject.fromObject(fieldColor);
			/*JSONArray fromObject = JSONArray.fromObject(fieldColor);
			List<Map<String,String>> list = JSONArray.toList(fromObject);
			if(list!=null&&list.size()>0){
				for (Map<String, String> map2 : list) {
					Set<String> keySet = map2.keySet();
					Iterator<String> iterator = keySet.iterator();
					while(iterator.hasNext()){
						String key = iterator.next();
					}
					iterator.
				}
			}*/
			/*Iterator it = fieldJson.keys();  
			while (it.hasNext()){  
				String key = String.valueOf(it.next());  
				String value = (String) fieldJson.get(key);  
				fieldTplMap.put(key, value);  
			} */
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("findReportFieldAndTpl failed");
		}
		return result;
	}

	public List<Map<String,Object>> findReportNameById(String report_id) {
		List<Map<String,Object>> reportList = null;
		try{
			reportList = (List<Map<String,Object>>)query(" --ifId=srpt-cfg-menuQueryself --id="+report_id);
		}catch(Throwable t){
			t.printStackTrace();
		}
		return reportList;
	}

	public int updateLogModuleCode(Map<String, String> params) {
		String oldCode = params.get("oldCode");
		String newCode = params.get("newCode");
		String sql = "update ipmsp.sys_logs_ori set module_code =?  where  module_code=?";
		int update = -1;
		try{
			update =getJdbc().update(sql, new Object[]{newCode,oldCode});
		}catch(Throwable t){
			t.printStackTrace();
		}
		return update;
	}
	
	public List<Map<String, String>> queryFullMenu(Map<String, String> params) {
		List<Map<String,String>> rmDeviceSQL = null;
		/*if(((params.get("device_name")!=null&&!params.get("device_name").isEmpty())
				||(params.get("device_ip")!=null&&!params.get("device_ip").isEmpty())
				||(params.get("device_service_name")!=null&&!params.get("device_service_name").isEmpty()))
				&&((params.get("inter_alias")==null||(params.get("inter_alias")!=null&&params.get("inter_alias").isEmpty()))
						&&(params.get("in_ip")==null||params.get("in_ip")!=null&&params.get("in_ip").isEmpty())
						&&(params.get("device_id")==null||params.get("device_id")!=null&&params.get("device_id").isEmpty()))
				){
			params.put("level", "device");
		}else if((params.get("device_name")==null||params.get("device_name")!=null&&params.get("device_name").isEmpty())
				&&(params.get("device_ip")==null||params.get("device_ip")!=null&&params.get("device_ip").isEmpty())
				&&(params.get("device_service_name")==null||params.get("device_service_name")!=null&&params.get("device_service_name").isEmpty())
				&&(params.get("device_id")==null||params.get("device_id")!=null&&params.get("device_id").isEmpty())
				&&((params.get("inter_alias")!=null&&!params.get("inter_alias").isEmpty())
						||(params.get("in_ip")!=null&&!params.get("in_ip").isEmpty()))){
			params.put("level","devinterface");
		}else */if(params.get("device_id")!=null&&!params.get("device_id").isEmpty()){
			params.put("level","interface");
		}else{
			params.put("level","devinterface");//ori：complex
		}
		try{
			rmDeviceSQL = (List<Map<String,String>>)query("srpt-cfg-deviceModelCfg",params);
		}catch(Throwable t){
			t.printStackTrace();
		}
		return rmDeviceSQL;
	}
	
	public int updateDeviceModel(Map<String, String> params) {
		String insertSql = "insert into dm_co_ba_srpt_tpl(tpl_id,tpl_name,type,descr,tpl_sys_user,bandwidth,owner) values(?,?,?,?,?,?,?) ";
		int update = 0;
		try{
			update = getJdbc("srpt").update(insertSql, new Object[]{params.get("tpl_id"),
					params.get("tpl_name"),
					params.get("type"),
					params.get("descr"),
					params.get("tpl_sys_user"),
					params.get("bandwidth"),
					params.get("owner")});
		}catch(Throwable t){
			t.printStackTrace();
		}
		return update;
	}
	public int[] updateDvcMdlRel(List<Map<String, String>> params) {
		List<Object[]> list = new ArrayList<Object[]>();
		Object[] obj = null;
		if(params!=null&&params.size()>0){
			for (Map<String, String> map : params) {
				obj = new Object[]{map.get("tpl_id"),map.get("p_id"),map.get("p_name"),map.get("name"),map.get("id")};
				list.add(obj);
			}
		}
		String insertSql = "insert into dm_co_ba_srpt_rel_tpl(tpl_id,p_id,p_name,name,id) values(?,?,?,?,?)";
		int[] batchUpdate = null;
		try{
			batchUpdate = getJdbc("srpt").batchUpdate(insertSql, list);
		}catch(Throwable t){
			t.printStackTrace();
		}
		return batchUpdate;
	}
	
	public List<Map<String, Object>> getChoosedTree(List<Map<String,Object>> interIds) {
		List<Map<String,Object>> deviceList = null;
		List<Map<String,Object>> devOldList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> devQuChList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> interMapList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> interDevListAll = new ArrayList<Map<String,Object>>();
		try{
			if(interIds!=null&&interIds.size()>0){
				for (Map<String, Object> map : interIds) {
					if(!interMapList.contains(map)){
						interMapList.add(map);
					}
				}
			}
			deviceList = new ArrayList<Map<String,Object>>();
			if(interMapList!=null&&!interMapList.isEmpty()){
				for (Map<String, Object> interMap : interMapList) {//srpt-cfg-deviceQueryByInter
					interMap.put("children", new ArrayList());
					String id = (String) interMap.get("id");
					Map<String,Object> singleDevice = (Map<String,Object>)query(" --ifId=srpt-cfg-deviceQueryByInter --id="+id);
					devOldList.add(singleDevice);
				}
				List<Map<String,Object>> interList = null;
				if(devOldList!=null&&devOldList.size()>0){
					for (Map<String, Object> map : devOldList) {
						if(!devQuChList.contains(map)){
							devQuChList.add(map);
						}
					}
					for (Map<String, Object> devMap : devQuChList) {
						String devId = (String) devMap.get("device_id");
						interList = new ArrayList<Map<String,Object>>();
						for(Map<String, Object> interInfoMap : interMapList){
							if(devId.equals(interInfoMap.get("device_id"))){
								interList.add(interInfoMap);
							}
						}
						devMap.put("children", interList);
						interDevListAll.add(devMap);
					}
				}
			}
		}catch(Throwable t){
			t.printStackTrace();
		}
		return interDevListAll;
	}
	
	public List<Map<String, Object>> getArrangedTree(Map<String, String> tplId) {
		List<Map<String,Object>> modelTree = null;
		try{
			List<Map<String,Object>> devInterList = (List<Map<String,Object>>)query("srpt-cfg-deviceQueryByTplId", tplId);
		//	if(devInterList!=null&&(!devInterList.isEmpty())&&devInterList.get(0).get("device_id").equals("0")){
				modelTree = getChoosedDevTree(devInterList);
			//}else{
			//	modelTree = getChoosedTree(devInterList);
		//	}
			
			
		}catch(Throwable t){
			t.printStackTrace();
		}
		return modelTree;
	}
	
	private List<Map<String, Object>> getChoosedDevTree(List<Map<String, Object>> devInterList) {
		List<Map<String, Object>> devList = MapUtils.newArrayList();
		for (Map<String, Object> interMap : devInterList) {//srpt-cfg-deviceQueryByInter
			interMap.put("children", new ArrayList());
			devList.add(interMap);
		}
		return devList;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, String>> queryEamilReportSelfById(String reportId) {
		List<Map<String,String>> reportResult = null;
		try{
			reportResult = (List<Map<String,String>>)query("srpt-cfg-reportQuerySelfEnable"," --id="+reportId+" --enabled=2,3");
		}catch(Throwable t){
			t.printStackTrace();
			return new ArrayList();
		}
		return reportResult;
	}
	@SuppressWarnings("unchecked")
	public String queryForFiletitle(String reportId) {
		String fileTitle = null;
		try{
			fileTitle=((Map<String,String>)query("--ifId=srpt-cfg-reportInfo --report_id="+reportId+" --fields=name_")).get("NAME_");
		}catch(Throwable t){
			t.printStackTrace();
		}
		return fileTitle;
	}
	
	public int findOriginalTask(Map<String, String> params) {
		Map<String,String> oneTask = null;
		String insertSql = "insert into dm_co_ba_srpt_email(id,report_id,conditions,emails,enabled,priority,subject,field_color,text_style,type,timetype,usernames) values (?,?,?,?,?,?,?,?,?,?,?,?)";  //INSERT INTO Table(columnA, columnB) VALUES (valueA, valueB)
		int insert = 0;
		try{//id "id",report_id "report_id",conditions "conditions",emails "emails",
			//enabled "enabled",priority "priority",subject "subject",field_color "field_color",
			//text_style "text_style" 
			SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmm");
			String nowTime = sf.format(Calendar.getInstance().getTime());
			oneTask =query("srpt-cfg-emailQueryTaskCopy",params);
			insert =getJdbc().update(insertSql,new Object[]{params.get("id")+"+"+UUID.randomUUID().toString().replace("-", ""),oneTask.get("report_id"),oneTask.get("conditions"),oneTask.get("emails"),oneTask.get("enabled"),oneTask.get("priority"),oneTask.get("subject"),oneTask.get("field_color"),oneTask.get("text_style"),"tempTask","min1",nowTime});
		}catch(Throwable t){
			t.printStackTrace();
		}
		return insert ;
	}

	public List<Map<String, Object>> queryForColumnByReportId(Map<String, String> params,List<Map<String, Object>> columnList) {
		List<Map<String,Object>> cfgColumn = null;
		List<Map<String,Object>> arResult = new ArrayList<Map<String,Object>>();
		try{
			cfgColumn = (List<Map<String,Object>>)query("srpt-cfg-columnQueryById",params);
			if(columnList!=null&&!columnList.isEmpty()&&cfgColumn!=null&&!cfgColumn.isEmpty()){
				for (int i = 0; i < columnList.size(); i++) {
					Object column = columnList.get(i).get("column");//{"column":"kpi001","columnCN":"日期"}
					for (int j = 0; j < cfgColumn.size(); j++) {
						if(cfgColumn.get(j).get("name")!=null&&!cfgColumn.get(j).get("name").toString().isEmpty()&&cfgColumn.get(j).get("name").equals(column)){ //列名
							columnList.get(i).putAll(cfgColumn.get(j));
						}
					}
					if(!columnList.get(i).containsKey("name")){
						columnList.get(i).put("id", params.get("id"));
						columnList.get(i).put("name", null);
						columnList.get(i).put("type", "3");
						columnList.get(i).put("strategy", new ArrayList());
						columnList.get(i).put("descr", null);
					}
				}
			//	return columnList;
			}else if(columnList!=null&&!columnList.isEmpty()&&(cfgColumn==null||(cfgColumn!=null&&cfgColumn.isEmpty()))){
				for (int i = 0; i < columnList.size(); i++) {
					columnList.get(i).put("id", params.get("id"));
					columnList.get(i).put("name", null);
					columnList.get(i).put("type", "3");
					columnList.get(i).put("strategy", new ArrayList());
					columnList.get(i).put("descr", null);
					arResult.add(columnList.get(i));
				}
				
			} 
			return columnList;
		}catch(Throwable t){
			t.printStackTrace();
			return new ArrayList();
		}
	}

	public int deleteStrategy(String id) {
		String deleteSql = "delete from dm_co_ba_srpt_head_tpl where id=?";
		int i = -5;
		try{
			i =getJdbc().update(deleteSql, new Object[]{id});
		}catch(Throwable t){
			t.printStackTrace();
		}
		return i;
	}

	public int[] saveStrategy(List<Map<String, Object>> params) {
		String saveSql = "insert into dm_co_ba_srpt_head_tpl(id,name,type,strategy,descr_,name_z) values (?,?,?,?,?,?)";
		int[] i = null;
		if(params.size()>=1&&params.get(0).containsKey("name")){
			List<Object[]> values = new ArrayList<Object[]>();
			for (int j = 0; j < params.size(); j++) {
				Object[] obj = new Object[]{params.get(j).get("id"),params.get(j).get("name"),params.get(j).get("type"),WebTools.toJson(params.get(j).get("strategy")).toString(),params.get(j).get("descr_"),params.get(j).get("name_z")};
				values.add(obj);
			}
			i =getJdbc().batchUpdate(saveSql, values);
			
		}
		return i;
	}
	
	
	public int deleteAllMenuUrl(Map<String, String> params) {
		String deleteSql = "delete from dm_co_ba_srpt_menu_tpl where id_=?";
		List<Map<String,Object>> reportInfoAllList = (List<Map<String,Object>>)queryReportLoopAllById(params.get("parent_id"),params.get("mark"));
		List<Object[]> pa = new ArrayList<Object[]>();
		if(reportInfoAllList!=null&&reportInfoAllList.size()>0){//下面有自己的文件或者文件夹
			List<Object> grepVsByK = MapUtils.grepVsByK(reportInfoAllList, "id_", true);
			
			for (Object object : grepVsByK) {
				pa.add(new Object[]{object});
			}
			pa.add(new Object[]{params.get("parent_id")});
		}
		int[] batchUpdate =getJdbc().batchUpdate(deleteSql, pa);
		int result = 0;
		if(batchUpdate!=null&&batchUpdate.length>0){
			result=batchUpdate.length;
		}
		return result;
	}

	public int buildTypeFiveResult(List<String> usernames, List<String> reportIds) {
		String reportstring = list2String(reportIds);
		String insertSql = "insert into DM_CO_BA_SRPT_user_report_rel(username,report_Id,update_time) values(?,?,?)";
		String updateSql = "update dm_co_ba_srpt_menu set enabled=2 where id_=?";
		int insert=0;
		int setEnabled=0;
		try{
			for (String reportId : reportIds) {
				setEnabled = getJdbc().update(updateSql,new Object[]{reportId});
				for (String username : usernames) {
					insert = getJdbc().update(insertSql,new Object[]{username,reportId,new Date()});
				}
			}
			
			logger.info("update "+reportstring+" success;set enabled=2 state:"+setEnabled);
		}catch(Throwable t){
			t.printStackTrace();
			logger.info("buildTypeOneResult delete info failed");
		}
		return insert;
	}

	public int insertFieldInfo(String report_id, List<Map<String, Object>> fieldInfo) {
		String insertSql = "UPDATE dm_co_ba_srpt_report SET field_info= ? WHERE report_id = ?";
		int update = getJdbc().update(insertSql, new Object[]{fieldInfo,report_id});
		return update;
		
	}

	public Map<String,String> getFieldInfo(String report_id) {
		//--ifId=srpt-cfg-reportInfo --report_id="+report_id+" --fields=qry_bd_info"
		Map<String,String> query =query("--ifId=srpt-cfg-reportInfo --report_id="+report_id+" --fields=field_info");
		return query;
	}

	public Map<String, String> getFilterData(String report_id) {
		Map<String,String> map = MapUtils.newHashMap();
		map.put("ifId", "srpt-cfg-reportInfo");
		map.put("report_id",report_id);
		map.put("fields", "FILTER_DATA");
		Map<String,String> query =query(map.get("ifId"),map);
		return query;
	}
	
	//TODO  将filter_data 中的数据和filed_info 最后和 sql中的resultMapping 联系起来处理成where 子查询的格式
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
			Map<String,String> filterDataMap = getFilterData(report_id);
			filterDataStr = filterDataMap.get("FILTER_DATA");//字段数不全，可能为空
			filterData =WebTools.fromJson(filterDataStr, List.class);
		}
		
		//有{{}}  并且有resultmapping 
		if(reportCheckInfo.getLogic_sql_info().contains("{{}}")&&reportCheckInfo.getLogic_sql_info().contains("<select id=\"resultMapping\">")&&filterData!=null&&filterData.size()>0){
			String varchar = "varchar";
			String number = "number";
			String and = " and ";
			String end = "  ";
			Map<String,String> fieldInfoMap = getFieldInfo(report_id);
			String fieldInfoStr = fieldInfoMap.get("FIELD_INFO");//字段全，可能为空
			List<Map<String,Object>> fieldInfo = WebTools.fromJson(fieldInfoStr, List.class);
			if(fieldInfo!=null&&fieldInfo.size()>0){
				//将两者组合   TODO 要对空值的异常判断
				StringBuffer sbf = new StringBuffer();
				for (Map<String, Object> info : fieldInfo) {//sortflag,fieldname,linewidth,isshow,fieldType
					
					for (Map<String, Object> filter : filterData) {//fieldname,fieldType,minVal,minSymbol,maxSymbol,maxVal
						if(String.valueOf(info.get("fieldname")).equals(String.valueOf(filter.get("fieldname")))&&filter.get("fieldType").equals(varchar)){
							//拼接
							if(String.valueOf(filter.get("maxSymbol")).equals("like")){
								sbf.append(and);
								sbf.append(String.valueOf(filter.get("fieldname"))).append(" like ").append("'%").append(String.valueOf(filter.get("maxVal"))).append("%'").append(end);
									
							}else{
								sbf.append(and);
								sbf.append(String.valueOf(filter.get("fieldname"))).append(" "+filter.get("maxSymbol")).append(" '").append(String.valueOf(filter.get("maxVal"))).append("'").append(end);
							}
							
						}else if(String.valueOf(info.get("fieldname")).equals(String.valueOf(filter.get("fieldname")))&&filter.get("fieldType").equals(number)){
							//=    dayu   xiaoyu 
							if(filter.get("maxVal")!=null&&!String.valueOf(filter.get("maxVal")).isEmpty()&&filter.get("minVal")!=null&&!String.valueOf(filter.get("minVal")).isEmpty()){//dayu xiaoyu 
								sbf.append(and);
								sbf.append(String.valueOf(filter.get("fieldname"))).append(" "+filter.get("minSymbol")).append(String.valueOf(filter.get("minVal"))).
								append(and).append(String.valueOf(filter.get("fieldname"))).append(" "+filter.get("maxSymbol")).append(String.valueOf(filter.get("maxVal"))).append(end);
							}else if(filter.get("maxVal")!=null&&!String.valueOf(filter.get("maxVal")).isEmpty()&&(filter.get("minVal")==null||String.valueOf(filter.get("minVal")).isEmpty())){//=
								sbf.append(and);
								sbf.append(String.valueOf(filter.get("fieldname"))).append(" "+filter.get("maxSymbol")).append(String.valueOf(filter.get("maxVal"))).append(end);
							}else if(filter.get("minVal")!=null&&!String.valueOf(filter.get("minVal")).isEmpty()&&(filter.get("maxVal")==null||String.valueOf(filter.get("maxVal")).isEmpty())){
								sbf.append(and);
								sbf.append(String.valueOf(filter.get("fieldname"))).append(" "+filter.get("minSymbol")).append(String.valueOf(filter.get("minVal"))).append(end);
							}
						}
					}
				}
				
				String con = sbf.toString();
				//替换中文
				//根据id查询sql
				List<Map<String, Object>> resultMapping = ParamsUtil.getResultMapping(reportCheckInfo.getLogic_sql_info());
				//英文Key集合
				for (Map<String, Object> field : resultMapping) {
					if(con.contains(String.valueOf(field.get("columnCN")))){
						con = con.replace(String.valueOf(field.get("columnCN")), String.valueOf(field.get("column")));
					}
				}
					
				reportCheckInfo.setLogic_sql_info(reportCheckInfo.getLogic_sql_info().replace("{{}}", con));
			}else{
				reportCheckInfo.setLogic_sql_info(reportCheckInfo.getLogic_sql_info().replace("{{}}", ""));
			}
		}else{
			
			reportCheckInfo.setLogic_sql_info(reportCheckInfo.getLogic_sql_info().replace("{{}}", ""));
		}
		return reportCheckInfo.getLogic_sql_info();
	}
	
	

	public String getDrillParam(ReportCheckInfo reportCheckInfo) throws Exception {
		String and = " and ";
		String eq = " = ";
		//String report_id = reportCheckInfo.getReport_id();
		String report_id_p = reportCheckInfo.getConditions().get("report_id_p");
		//String queryForLogicSqlByReportId = queryForLogicSqlByReportId(report_id_p);
		if(report_id_p!=null&&!report_id_p.isEmpty()&&reportCheckInfo.getLogic_sql_info().contains("[[]]")&&reportCheckInfo.getLogic_sql_info().contains("<select id=\"resultMapping\">")){//是否钻取
			Map<String,String> result = MapUtils.newHashMap();
			//获取父的 field_info   drillParamColumn  钻取条件中文列名
			Map<String, String> fieldInfo = getFieldInfo(report_id_p);
			//根据conditions  --> column_cn找到需要钻取列中文名
			//找到对应的条件列名 fieldInfo  -->drillParamColumn
			Map<String, String> conditions = reportCheckInfo.getConditions();
			String drillColum = conditions.get("column_cn");
			String fieldInfoStr = fieldInfo.get("FIELD_INFO");//字段全，可能为空
			List<Map<String,Object>> fieldInfoList = WebTools.fromJson(fieldInfoStr, List.class);
			if(fieldInfoList!=null&&fieldInfoList.size()>0&&drillColum!=null&&!drillColum.isEmpty()){
				String[] drillParamColumns = null;
				for (Map<String, Object> fieldInfoMap : fieldInfoList) {
					if(drillColum.equals(fieldInfoMap.get("fieldname"))){
						String drillParamColumn = String.valueOf(fieldInfoMap.get("drillParamColumn"));
						drillParamColumns = drillParamColumn.split(",");
					}
					
				}
				
				//现将匹配得上的drillParamColumns换成中文
				for (String drillColumn : drillParamColumns) {
					
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
/*				
				//英文Key集合
				for (Map<String, Object> field : resultMapping) {
					if(con.contains(String.valueOf(field.get("columnCN")))){
						con = con.replace(String.valueOf(field.get("columnCN")), String.valueOf(field.get("column")));
					}
				}*/
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
	
}
