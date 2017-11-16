package org.hw.sml.helper.plugin.jdbc;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.hw.sml.core.SqlMarkupAbstractTemplate;
import org.hw.sml.jdbc.ConnectionCallback;
import org.hw.sml.jdbc.JdbcTemplate;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.tools.MapUtils;

@Bean("plugin-jdbc-manage")
public class JdbcPluginHelper {
	public List<Map<String, Object>> getTables(String dbid,
			final String schema, final String name) {
		return getJdbc(dbid).execute(
				new ConnectionCallback<List<Map<String, Object>>>() {
					public List<Map<String, Object>> doInConnection(
							Connection conn) {
						List<Map<String, Object>> result = MapUtils
								.newArrayList();
						DatabaseMetaData dmd;
						try {
							dmd = conn.getMetaData();
							ResultSet rs = dmd.getTables(null, schema == null
									|| schema.equals("") ? dmd.getUserName()
									: schema, name,
									new String[] { "TABLE", "VIEW" });
							ResultSetMetaData rmd = rs.getMetaData();
							List<String> columnNames = MapUtils.newArrayList();
							for (int i = 1; i < rmd.getColumnCount(); i++) {
								columnNames.add(rmd.getColumnName(i));
							}
							while (rs.next()) {
								Map<String, Object> subResult = MapUtils
										.newLinkedHashMap();
								for (String cn : columnNames) {
									subResult.put(cn, rs.getObject(cn));
								}
								result.add(subResult);
							}
						} catch (SQLException e) {
							e.printStackTrace();
						}
						return result;
					}
				});

	}

	public JdbcTemplate getJdbc(String dbid) {
		return BeanHelper.getBean(SqlMarkupAbstractTemplate.class)
				.getJdbc(dbid);
	}
}
