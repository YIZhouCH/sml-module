package org.hw.sml.manager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hw.sml.core.SqlMarkupAbstractTemplate;
import org.hw.sml.jdbc.JdbcTemplate;
import org.hw.sml.model.Result;
import org.hw.sml.report.model.Constants;
import org.hw.sml.report.model.Update;
import org.hw.sml.support.ioc.annotation.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RcptBaseService {
	public  Logger logger=LoggerFactory.getLogger(getClass());
	
	@Inject
	protected SqlMarkupAbstractTemplate sqlMarkupAbstractTemplate;
	
	protected String mark="";
	
	protected String tableName;
	
	protected Map<String,String> mapper=new HashMap<String,String>();
	
	
	/**
	 * 增加数据
	 * @param update
	 * @return
	 * @throws Exception
	 */
	public int add(Update update) throws Exception{
		if(tableName!=null)
		update.setTableName(tableName);
		update.setType(Constants.TYPE_INSERT);
		update.init();
		logger.info("executeSql add:["+update.getUpateSql()+"]");
		int flag = sqlMarkupAbstractTemplate.getJdbc(update.getDbId()).batchUpdate(update.getUpateSql(), update.getObjects()).length;
		return flag;
	}
	/**
	 * 更新数据
	 * @param update
	 * @return
	 * @throws Exception
	 */
	public int update(Update update) throws Exception{
		if(tableName!=null)
		update.setTableName(tableName);
		update.setType(Constants.TYPE_UPDATE);
		update.init();
		logger.info("executeSql update:["+update.getUpateSql()+"]");
		int flag = sqlMarkupAbstractTemplate.getJdbc(update.getDbId()).batchUpdate(update.getUpateSql(), update.getObjects()).length;
		return flag;
	}
	/**
	 * 删除数据
	 * @param update
	 * @return
	 * @throws Exception
	 */
	public int delete(Update update) throws Exception{
		if(tableName!=null)
		update.setTableName(tableName);
		update.setType(Constants.TYPE_DELETE);
		update.init();
		logger.info("executeSql delete:["+update.getUpateSql()+"]");
		int flag = sqlMarkupAbstractTemplate.getJdbc(update.getDbId()).batchUpdate(update.getUpateSql(), update.getObjects()).length;
		return flag;
	}
	/**
	 * 存在更新，不存在新加数据
	 * @param update
	 * @return
	 * @throws Exception
	 */
	public int adu(Update update) throws Exception{
		if(tableName!=null)
		update.setTableName(tableName);
		update.setType(Constants.TYPE_ADU);
		update.init();
		boolean exists=sqlMarkupAbstractTemplate.getJdbc(update.getDbId()).queryForInt(update.isExistSql(), update.getExistParams())>0;
		logger.info("executeSql adu:["+update.getUpdateSqlForAdu(exists)+"]");
		int flag = sqlMarkupAbstractTemplate.getJdbc(update.getDbId()).update(update.getUpdateSqlForAdu(exists),update.getObjectForAdu(exists));
		return flag;
	}
	/**
	 * 根据id查单条记录
	 * @param params
	 * @return
	 */
	public Map<String,Object> queryById(Map<String,String> params){
		String ifId=params.get("ifId");
		if(ifId==null){
		   ifId=mapper.get("queryById")==null?(getClassName()+"-"+"queryById"):mapper.get("queryById");
		}
		return sqlMarkupAbstractTemplate.getSmlContextUtils().query(ifId,params);
	}
	/**
	 * 根据查询条件查多条记录
	 * @param params
	 * @return
	 */
	public List<Map<String,Object>> query(Map<String,String> params){
		String ifId=params.get("ifId");
		if(ifId==null){
		   ifId=mapper.get("query")==null?(getClassName()+"-"+"query"):mapper.get("query");
		}
		return sqlMarkupAbstractTemplate.getSmlContextUtils().query(ifId,params);
	}
	/**
	 * 查询返回任意配置返回值
	 * @param params
	 * @return
	 */
	public <T> T query(String ifId,Map<String,String> params){
		return sqlMarkupAbstractTemplate.getSmlContextUtils().query(ifId,params);
	}
	/**
	 * 分页查询
	 * @param params
	 * @return
	 */
	public Result page(Map<String,String> params){
		String ifId=params.get("ifId");
		if(ifId==null){
			ifId=mapper.get("page")==null?(getClassName()+"-"+"page"):mapper.get("page");
		}
		return sqlMarkupAbstractTemplate.getSmlContextUtils().query(ifId,params);
	}
	/**
	 * 配置更新
	 * @param ifId
	 * @param params
	 * @return
	 */
	public int update(String ifId,Map<String,String> params){
		return sqlMarkupAbstractTemplate.getSmlContextUtils().update(ifId, params);
	}
	public int update(Map<String,String> params){
		return sqlMarkupAbstractTemplate.getSmlContextUtils().update(params);
	}
	
	


	public String getMark() {
		return mark;
	}
	public void setMark(String mark) {
		this.mark = mark;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public Map<String, String> getMapper() {
		return mapper;
	}
	public void setMapper(Map<String, String> mapper) {
		this.mapper = mapper;
	}
	public String getClassName(){
		return mark.length()>0?(mark+"-"+this.getClass().getSimpleName()):this.getClass().getSimpleName();
	}
	//子类中，如果没有定义id则用类名+方法作为ifId
		String s = "标识-当前类名已知-方法名已知";
	public JdbcTemplate getJdbc(String dbid){
		return sqlMarkupAbstractTemplate.getJdbc(dbid);
	}

	public int clear(String parameter) {
		return sqlMarkupAbstractTemplate.getSmlContextUtils().clear(parameter);
	}
	public SqlMarkupAbstractTemplate getSqlMarkupAbstractTemplate() {
		return sqlMarkupAbstractTemplate;
	}
	public void setSqlMarkupAbstractTemplate(
			SqlMarkupAbstractTemplate sqlMarkupAbstractTemplate) {
		this.sqlMarkupAbstractTemplate = sqlMarkupAbstractTemplate;
	}
	
}