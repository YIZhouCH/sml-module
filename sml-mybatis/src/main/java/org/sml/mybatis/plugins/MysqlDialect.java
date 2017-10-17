package org.sml.mybatis.plugins;

public class MysqlDialect extends Dialect{

	public String getLimitString(String sql, int skipResults, int maxResults) {
		return sql +" limit "+skipResults+","+maxResults;
	}

}
