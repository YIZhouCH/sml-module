package com.eastcom_sw.srpt.tools;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QuerySqlBuilder {
	
	String jdbcType = "<jdbcType name=\"discteteTime\" type=\"array-char\"/>";
	
	public Map<String,Object> jugeSql(String stab,String logicSql,Map<String,String> params,List<String> qryBD){
		Map<String,Object> sqlInfo = new HashMap<String,Object>();
		sqlInfo.put("isAddJdbcType", "no");
		StringBuffer sbf = new StringBuffer();
		
		if(qryBD.size()>0){
			//将每个组件的名字放入type中
			//sbf = new StringBuffer();
			for (String bdId : qryBD) {
				sbf.append("<jdbcType name=\"");
				sbf.append(bdId);
				sbf.append("\" type=\"array-char\"/>");
			}
		}
		String sbfString = sbf.toString();
		int jdbcTypev2Length = sbfString.length();
		StringBuilder sb = new StringBuilder();
		
		if(stab.equals("head")){
			if(!(logicSql.contains("jdbcType"))){
				sb.insert(0,jdbcType);
				sqlInfo.put("isAddJdbcType", "yes");
			}
			sb.insert(0, sbfString);
			sb.append(logicSql);
			sb.insert(0, "select * from ( ");
			sb.append(" ) where rownum<1");
		}else{
			sb.append(logicSql);
			if(!logicSql.contains("<select id=\"select\">")&&!logicSql.contains("<select31 id=\"select\">")){
				sb.insert(0, "<select31 id=\"select\">");
				sb.append("</select31>");
			}
			if(!(logicSql.contains("jdbcType"))){
				sb.insert(0,jdbcType);
				sqlInfo.put("isAddJdbcType", "yes");
			}
			sb.insert(0, sbfString);
			if(!logicSql.contains("<if test=\" '@queryType'=='count' \">")){
				sb.append("<if test=\" '@queryType'=='count' \"> select count(1) as \"total\" from (<included id=\"select\"/>) </if>");
				sb.append("<if test=\" '@queryType'=='select' \">select * from (select t1.*,rownum row_ from (select * from (<included id=\"select\"/>) <isNotEmpty property=\"sidx\"> order by \"$sidx$\" $sord$ nulls last</isNotEmpty>  ) t1 ) where row_>=(#pageNo#-1)*#limit#+1 and row_<#pageNo#*#limit#+1 </if>");
			}
		}
		
		sqlInfo.put("jdbcTypeLen", jdbcTypev2Length);
		sqlInfo.put("sql", sb.toString());
		
		return sqlInfo;
	}

}
