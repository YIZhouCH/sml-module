package com.eastcom_sw.srpt.model;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.hw.sml.tools.MapUtils;

public class ReportCheckInfo implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -4974765001099665968L;

	private String report_id;
	
	private Map<String,String> conditions=new LinkedHashMap<String,String>();
	
	private String logic_sql_info;
	
	private List<Map<String,Object>> filter_data = MapUtils.newArrayList();
	
	public List<Map<String,Object>> getFilter_data() {
		return filter_data;
	}
	public void setFilter_data(List<Map<String,Object>> filter_data) {
		this.filter_data = filter_data;
	}
	 
	public String getReport_id() {
		return report_id;
	}
	public void setReport_id(String report_id) {
		this.report_id = report_id;
	}
	public Map<String, String> getConditions() {
		return conditions;
	}
	public void setConditions(Map<String, String> conditions) {
		this.conditions = conditions;
	}
	public String getLogic_sql_info() {
		return logic_sql_info;
	}
	public void setLogic_sql_info(String logic_sql_info) {
		this.logic_sql_info = logic_sql_info;
	}
	
	@Override
	public String toString() {
		return "ReportCheckInfo [report_id=" + report_id + ", conditions=" + conditions + ", logic_sql_info="
				+ logic_sql_info + ", filter_data=" + filter_data + "]";
	}
}
