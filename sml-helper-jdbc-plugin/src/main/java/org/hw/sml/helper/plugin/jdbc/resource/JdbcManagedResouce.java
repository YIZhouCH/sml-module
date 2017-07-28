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
import java.util.List;
import java.util.Map;

import org.hw.sml.core.SqlMarkupAbstractTemplate;
import org.hw.sml.helper.plugin.jdbc.csv.CsvCreater;
import org.hw.sml.helper.plugin.jdbc.csv.CsvParser;
import org.hw.sml.jdbc.JdbcTemplate;
import org.hw.sml.report.model.Update;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.server.NanoHTTPD;
import org.hw.sml.server.NanoHTTPD.IHTTPSession;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Val;
import org.hw.sml.tools.MapUtils;

@SmlResource("jdbc")
@Bean
public class JdbcManagedResouce {
	@Val(value="plugin.helper.jdbc.nullchar",required=false)
	private String nullChar="<null>";
	@SmlResource("update")
	public Object update(Map<String,String> params){
		LoggerHelper.debug(getClass(),String.format("update[%s]",params));
		return getAbstractTemplate(params.get("dbid")).update(params.get("sql"));
	}
	@SmlResource("query")
	public Object query(Map<String,String> params){
		LoggerHelper.debug(getClass(),String.format("query[%s]",params));
		String sql=params.get("sql");
		if(!sql.toLowerCase().contains("rownum")){
			sql="select * from ("+sql+") where rownum<="+params.get("maxSize");
		}
		List<Map<String,Object>> result= getAbstractTemplate(params.get("dbid")).queryForList(sql);
		for(Map<String,Object> data:result){
			for(Map.Entry<String,Object> entry:data.entrySet()){
				if(entry.getValue()==null){
					data.put(entry.getKey(),nullChar);
				}
			}
		}
		return result;
	}
	@SmlResource(value="export",produces=SmlResource.OCTET_STREAM)
	public Object  export(@Param("User-Agent")String userAgent,@Param(value="dbid",defaultValue="defJt")String dbid,@Param(value="tableName",defaultValue="user_tables") final String tableName) throws SQLException, IOException{
			final JdbcTemplate jt=getAbstractTemplate(dbid);
			Connection conn=jt.getDataSource().getConnection();
			ResultSet rs=conn.createStatement().executeQuery("select * from "+tableName);
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
			conn.close();
			//---------------------------------
			File file=File.createTempFile("table_","_temp");
			CsvCreater.create(new FileOutputStream(file), headLst.toArray(new String[]{}),new CsvCreater.Retriver() {
				public List<Map<String, Object>> retrive(int start, int limit) {
					String sql="select * from (select t.*,rownum as row_ from "+tableName+" t) where row_ >"+start+" and row_<="+start+limit;
					List<Map<String,Object>> datas=jt.queryForList(sql);
					LoggerHelper.debug(getClass(),"table:["+tableName+"] between "+start+" and "+(start+limit));
					return datas;
				}
			});
			return NanoHTTPD.newStreamResponse(new FileInputStream(file)).export(tableName+".csv", userAgent);
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
