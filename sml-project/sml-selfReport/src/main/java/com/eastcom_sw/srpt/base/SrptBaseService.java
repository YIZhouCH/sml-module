package com.eastcom_sw.srpt.base;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.hw.sml.core.DelegatedSqlMarkupAbstractTemplate;
import org.hw.sml.jdbc.JdbcTemplate;
import org.hw.sml.jdbc.impl.DefaultDataSource;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.tools.Assert;
import org.hw.sml.tools.MapUtils;

import com.eastcom_sw.srpt.dao.DataSourceRegister;

public class SrptBaseService extends DelegatedSqlMarkupAbstractTemplate{
	protected static final String dbid= "srpt";
	protected Logger logger=Logger.getLogger(getClass());
	/**
	 * 根据该报表id的获得报表中文名称
	 * @param report_id
	 * @return
	 */

	public List<Map<String,Object>> findReportNameById(String report_id) {
		String ifId = "srpt-cfg-menuQueryself";
		Map<String,String> params = MapUtils.newHashMap();
		params.put("id", report_id);
		List<Map<String,Object>> dataMap=super.query(ifId, params);
		return dataMap;
	}

	
	/**
	 * 根据report_id 获取sql
	 * @param report_id
	 * @return
	 */
	public String queryForLogicSqlByReportId(String report_id) {
		String ifId = "srpt-cfg-reportInfo";
		Map<String,String> params = MapUtils.newHashMap();
		params.put("report_id", report_id);
		params.put("fields","sql_logic_info");
		Map<String,String> sqlMap = super.query(ifId,params);
		String logicSql = sqlMap.get("SQL_LOGIC_INFO");
		return logicSql;
	}
	
	public Map<String, String> queryFilterData(String report_id) {
		String ifId = "srpt-cfg-reportInfo";
		Map<String,String> params = MapUtils.newHashMap();
		params.put("report_id",report_id);
		params.put("fields", "FILTER_DATA");
		Map<String,String> filterData = super.query(ifId, params);
		return filterData;
	}

	/**
	 * 根据报表id获取组件信息
	 * @param report_id
	 * @return
	 */
	public Map<String,String> queryQryBdByReportId(String report_id) {
		String ifId = "srpt-cfg-reportInfo";
		Map<String,String> params = MapUtils.newHashMap();
		params.put("report_id", report_id);
		params.put("fields","qry_bd_info");
		Map<String,String> qryBd=super.query(ifId, params);
		return qryBd;
	}
	
	/**
	 * 根据该数据源的信息
	 * @param report_id
	 * @return
	 */
	public Map<String,String> queryDatasourseByDbId(String dbid) {
		String ifId = "srpt-cfg-dataSourceQuery";
		Map<String,String> params = MapUtils.newHashMap();
		params.put("id", dbid);
		Map<String,String> qryBd=super.query(ifId, params);
		return qryBd;
	}
	
	/**
	 * 根据该报表的dbid
	 * @param report_id
	 * @return
	 */
	public String queryDatasourseId(String report_id) {
		String ifId = "srpt-cfg-reportInfo";
		Map<String,String> params = MapUtils.newHashMap();
		params.put("report_id", report_id);
		params.put("fields","data_source_id");
		Map<String,String> dataMap=super.query(ifId, params);
		return dataMap.get("DATA_SOURCE_ID");
	}
	
	/**
	 * 根据该报表id的FieldInfo ("--ifId=srpt-cfg-reportInfo --report_id="+report_id+" --fields=field_info");
	 * @param report_id
	 * @return
	 */
	public Map<String,String> queryFieldInfo(String report_id) {
		String ifId = "srpt-cfg-reportInfo";
		Map<String,String> params = MapUtils.newHashMap();
		params.put("report_id", report_id);
		params.put("fields","field_info");
		Map<String,String> dataMap=super.query(ifId, params);
		return dataMap;
	}
	//
	/**
	 * 根据该报表id 查询报表名称（菜单）
	 * @param report_id
	 * @return
	 */
	public List<Map<String,String>> queryMenuName(String report_id) {
		String ifId = "srpt-cfg-menuQueryself";
		Map<String,String> params = MapUtils.newHashMap();
		params.put("id", report_id);
		List<Map<String,String>> dataList=super.query(ifId, params);
		return dataList;
	}

	/**
	 * 根据该报表id 查询报表名称（菜单）
	 * @param report_id
	 * @return
	 */
	public List<Map<String,Object>> excludeSql(String dbId,String sql) {
		Map<String,String> params = MapUtils.newHashMap();
		List<Map<String, Object>> queryForList = super.queryForList(dbId, sql, params);
		return queryForList;
	}
	public <T> T query(String paramsStr){
		Map<String,String> params=MapUtils.transMapFromStr(paramsStr);
		return query(params.get("ifId"),params);
	}
	public <T> T query(String ifId,String paramsStr){
		return query(ifId,MapUtils.transMapFromStr(paramsStr));
	}
	public JdbcTemplate getJdbc(){
		return getJdbc(dbid);
	}
	
	public String getDbidByReport(String report_id) {
		String dbId=queryDatasourseId(report_id);
		if(dbId==null){
			throw new IllegalArgumentException("no config of DataSource for the Report");
		}else{
			//从初始化jts里面查询
			if(getSqlMarkupAbstractTemplate().getDss().containsKey(dbId)){
				return dbId;
			}else{
				//query数据源表
				Map<String,String> dataSourceMap = queryDatasourseByDbId(dbId);
				Assert.notNull(dataSourceMap, "Wrong config for DataSource");
				DefaultDataSource dataSource= new DefaultDataSource();
				dataSource.setDriverClassName(dataSourceMap.get("DEVICECLASS_"));
				dataSource.setUrl(dataSourceMap.get("URL_"));
				dataSource.setUsername(dataSourceMap.get("USERNAME_"));
				dataSource.setPassword(dataSourceMap.get("PASSWORD_"));
				boolean flag=DataSourceRegister.regist(dbId, dataSource);	
				LoggerHelper.info(getClass(),dbId+" dataSource registed "+flag);
			}
			return dbId;
		}
	}
}
