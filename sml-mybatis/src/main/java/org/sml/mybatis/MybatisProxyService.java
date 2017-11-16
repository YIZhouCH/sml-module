package org.sml.mybatis;

import java.util.Map;

import javax.sql.DataSource;

import org.apache.ibatis.mapping.Environment;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.ibatis.transaction.TransactionFactory;
import org.apache.ibatis.transaction.jdbc.JdbcTransactionFactory;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Init;
import org.hw.sml.support.ioc.annotation.Stop;
import org.hw.sml.support.ioc.annotation.Val;
import org.hw.sml.tools.Assert;
import org.hw.sml.tools.MapUtils;
import org.sml.mybatis.plugins.PaginationInterceptor;
import org.sml.mybatis.plugins.RstInterceptor;

@Bean
public class MybatisProxyService{
	
	@Val(value="jdbc.mybatis.dss",isEvel=true,required=false)
	private Map<String,DataSource> dss;
	private Map<String,SqlSession> sessions;
	@Val(value="jdbc.mybatis.mapper.package",isEvel=true,required=false)
	private Map<String,String> mapperResource;
	@Val(value="jdbc.mybatis.alias.package",required=false)
	private String aliasPn;
	
	@Init(igErr=true)
	public void init() {
		if(dss==null){
			LoggerHelper.error(getClass(),"jdbcMybatisDss bean is not configed!");
			return;
		}
		if(mapperResource==null){
			LoggerHelper.error(getClass(),"mapperResource bean is not configed!");
			return;
		}
		LoggerHelper.info(getClass(),"mybatis mapppers -->"+mapperResource);
		sessions=MapUtils.newHashMap();
		for(Map.Entry<String,DataSource> entry:dss.entrySet()){
			TransactionFactory transactionFactory = new JdbcTransactionFactory();
			Environment environment =new Environment(entry.getKey(), transactionFactory, entry.getValue());
			Configuration configuration = new Configuration(environment);
			configuration.addInterceptor(new PaginationInterceptor());
			configuration.addInterceptor(new RstInterceptor());
			configuration.getVariables().put("dialect","oracle");
			if(aliasPn!=null){
				for(String pn:aliasPn.split(",| "))
					configuration.getTypeAliasRegistry().registerAliases(pn);
			}
			Assert.notNull(mapperResource.get(entry.getKey()),"mybatis mapperResource id :["+entry.getKey()+"] not exists!");
			for(String pn:mapperResource.get(entry.getKey()).split(",| ")){
				configuration.getTypeAliasRegistry().registerAliases(pn);
				configuration.addMappers(pn);
			}
			SqlSessionFactory sqlSessionFactory =new SqlSessionFactoryBuilder().build(configuration);
			SqlSession session=sqlSessionFactory.openSession();
			sessions.put(entry.getKey(),session);
		}
	}
	
	@Stop
	public void destroy() {
		if(sessions!=null)
		for(Map.Entry<String,SqlSession> entry:sessions.entrySet()){
			entry.getValue().close();
		}
	}
	public SqlSession getSqlSession(String dbid){
		return sessions.get(dbid);
	}
	private Map<Class<?>,String> dbids=MapUtils.newHashMap();
	public <T> T getMapper(Class<T> t){
		String dbid="defJt";
		if(dbids.containsKey(t)){
			dbid=dbids.get(t);
		}else{
			String pac=t.getPackage().getName();
			for(Map.Entry<String,String> entry:mapperResource.entrySet()){
				for(String pn:entry.getValue().split(",| ")){
					if(pn.equals(pac)){
						dbid=entry.getKey();
						dbids.put(t,dbid);
						break;
					}
				}
			}
		}
		return getSqlSession(dbid).getMapper(t);
	}
}
