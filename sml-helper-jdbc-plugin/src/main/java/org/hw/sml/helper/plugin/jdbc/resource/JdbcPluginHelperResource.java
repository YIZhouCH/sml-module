package org.hw.sml.helper.plugin.jdbc.resource;

import org.hw.sml.helper.plugin.jdbc.JdbcPluginHelper;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Inject;

@SmlResource("jdbc/metadata")
@Bean
public class JdbcPluginHelperResource {
	
	@Inject("plugin-jdbc-manage")
	private JdbcPluginHelper jdbcPluginHelper;
	
	@SmlResource(value="table",method=SmlResource.GET)
	public Object findTables(@Param(value="dbid",defaultValue="defJt")String dbid,@Param("schema")String schema,@Param(value="table",defaultValue="%")String table){
		return jdbcPluginHelper.getTables(dbid, schema, table.equals("")?"%":("%"+table+"%"));
	}
}
