package org.hw.sml.office.excel.creater.rs;

import org.hw.sml.jdbc.JdbcTemplate;
import org.hw.sml.office.excel.creater.ExcelBaseCreater;

public abstract class ExcelRsBaseCreator extends ExcelBaseCreater {
	
	/**
	 * 原始方法读取数据库数据
	 */
	protected JdbcTemplate jdbcTemplate;
	//查询的sql
	protected String sql;
	//查询参数
	protected Object[] params;

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public Object[] getParams() {
		return params;
	}

	public void setParams(Object[] params) {
		this.params = params;
	}

	public abstract void execute() throws Exception;

}
