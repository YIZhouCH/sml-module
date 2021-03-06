package org.hw.sml.helper.plugin.jdbc.resource;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hw.sml.FrameworkConstant;
import org.hw.sml.core.SqlMarkupAbstractTemplate;
import org.hw.sml.helper.plugin.jdbc.csv.CsvCreater;
import org.hw.sml.helper.plugin.jdbc.csv.CsvParser;
import org.hw.sml.jdbc.ConnectionCallback;
import org.hw.sml.jdbc.JdbcTemplate;
import org.hw.sml.jdbc.exception.SqlException;
import org.hw.sml.report.model.Update;
import org.hw.sml.rest.annotation.Body;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.PathParam;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.server.NanoHTTPD;
import org.hw.sml.server.NanoHTTPD.IHTTPSession;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.SmlAppContextUtils;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Val;
import org.hw.sml.tools.DateTools;
import org.hw.sml.tools.MapUtils;

@SmlResource("jdbc")
@Bean
public class JdbcManagedResouce {
	@Val(value="plugin.helper.jdbc.nullchar",required=false)
	private String nullChar="<null>";
	
	@SmlResource("update")
	public Object update(Map<String,String> params){
		LoggerHelper.getLogger().debug(getClass(),String.format("update[%s]",params));
		return getAbstractTemplate(params.get("dbid")).update(params.get("sql"));
	}
	@SmlResource("/if/{ifId}/sql")
	public String getSql(@PathParam("ifId")String ifId){
		return SmlAppContextUtils.getSmlContextUtils().queryRst(ifId,null).getSqlString();
	}
	@SmlResource("/query/{ifId}")
	public Object queryIfId(@PathParam("ifId")String ifId,@Body Map<String,String> params){
		return SmlAppContextUtils.getSmlContextUtils().query(ifId, params);
	}
	@SmlResource("/update/{ifId}")
	public Object updateIfId(@PathParam("ifId")String ifId,@Body Map<String,String> params){
		return SmlAppContextUtils.getSmlContextUtils().update(ifId, params);
	}
	@SmlResource("if/{ifId}")
	public List<Map<String,Object>> ifIdInfo(@PathParam("ifId")String ifId,@Param(value="fields",defaultValue="id")String fields){
		String sql="select "+fields+" from ("+FrameworkConstant.getSupportKey("CFG_JDBC_SQL")+" or 1=1) where id like '%'||?||'%'";
		return getAbstractTemplate("defJt").queryForList(sql,ifId,ifId);
	}
	@SmlResource("query")
	public Object query(Map<String,String> params){
		LoggerHelper.getLogger().debug(getClass(),String.format("query[%s]",params));
		String sql=params.get("sql");
		if(!sql.toLowerCase().contains("rownum")){
			sql="select * from ("+sql+") where rownum<="+params.get("maxSize");
		}
		List<Map<String,Object>> result= getAbstractTemplate(params.get("dbid")).queryForList(sql);
		for(Map<String,Object> data:result){
			for(Map.Entry<String,Object> entry:data.entrySet()){
				if(entry.getValue()==null){
					data.put(entry.getKey(),nullChar);
				}else if(entry.getValue() instanceof Date){
					data.put(entry.getKey(),DateTools.sdf_mis().format((Date)entry.getValue()));
				}
			}
		}
		return result;
	}
	@SmlResource(value="export",produces=SmlResource.OCTET_STREAM)
	public Object  export(final @Param("User-Agent")String userAgent,@Param(value="dbid",defaultValue="defJt")String dbid,@Param(value="tableName",defaultValue="user_tables") final String tableName) throws SQLException, IOException{
			final JdbcTemplate jt=getAbstractTemplate(dbid);
			return jt.execute(new ConnectionCallback<Object>() {
				public Object doInConnection(Connection conn) {
					ResultSet rs;
					try {
						rs = conn.createStatement().executeQuery("select * from "+tableName);
						ResultSetMetaData rsmd=rs.getMetaData();
						int length=rsmd.getColumnCount();
						List<String> headLst=MapUtils.newArrayList();
						for(int i=1;i<=length;i++){
							String name=rsmd.getColumnName(i);
							int type=rsmd.getColumnType(i);
							if(type==Types.DATE||type==Types.TIME||type==Types.TIMESTAMP){
								headLst.add(name+"@date");
							}else{
								headLst.add(name);
							}
						}
						//---------------------------------
						File file=File.createTempFile("table_","_temp");
						CsvCreater.create(new FileOutputStream(file), headLst.toArray(new String[]{}),new CsvCreater.Retriver() {
							public List<Map<String, Object>> retrive(int start, int limit) {
								String sql="select * from (select t.*,rownum as row_ from "+tableName+" t) where row_ >"+start+" and row_<="+start+limit;
								List<Map<String,Object>> datas=jt.queryForList(sql);
								LoggerHelper.getLogger().debug(getClass(),"table:["+tableName+"] between "+start+" and "+(start+limit));
								return datas;
							}
						});
						return NanoHTTPD.newStreamResponse(new FileInputStream(file)).export(tableName+".csv", userAgent);
					} catch (Exception e) {
						throw new SqlException(e);
					}
				}
			});
	}
	@SuppressWarnings("deprecation")
	@SmlResource(value="import",produces=SmlResource.TEXT_PLAIN)
	public Object imports(IHTTPSession session) throws FileNotFoundException, IOException{
		String filepath=session.getFiles().get("file0");
		String tableName=session.getParms().get("tableName");
		String dbId=MapUtils.getString(session.getParms(),"tableName","defJt");
		List<Map<String,Object>> datas=CsvParser.read(new FileInputStream(filepath), tableName);
		Update update=new Update();
		update.setDatas(datas);
		update.setDbId(dbId);
		update.init();
		return getAbstractTemplate(dbId).batchUpdate(update.getUpateSql(),update.getObjects()).length;
	}
	public JdbcTemplate getAbstractTemplate(String dbid){
		return BeanHelper.getBean(SqlMarkupAbstractTemplate.class).getJdbc(dbid);
	}
}
