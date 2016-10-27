package org.hw.sml.helper.builder;

public class UpdateSqlBuilder {
	private String tableName;
	private String type;
	private String[] updateFields;
	private String[] conditionFields;
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String[] getUpdateFields() {
		return updateFields;
	}
	public void setUpdateFields(String[] updateFields) {
		this.updateFields = updateFields;
	}
	public String[] getConditionFields() {
		return conditionFields;
	}
	public void setConditionFields(String[] conditionFields) {
		this.conditionFields = conditionFields;
	}
	public String toString(){
		StringBuffer sb=new StringBuffer();
		sb.append("update "+tableName+"\n");
		sb.append("set 1=1");
		for(int i=0;i<updateFields.length;i++){
			sb.append(",<isNotEmpty property=\""+updateFields[i]+"\">"+updateFields[i]+"="+"#"+updateFields[i]+"#</isNotEmpty>");
		}
		sb.append(" where 1=1 ");
		for(String conditionField:conditionFields){
			sb.append("and "+conditionField+"=#"+conditionField+"#");
		}
		return sb.toString();
	}
}
