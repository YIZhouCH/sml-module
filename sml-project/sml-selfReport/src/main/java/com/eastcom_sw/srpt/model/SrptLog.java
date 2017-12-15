package com.eastcom_sw.srpt.model;

public class SrptLog{
	private String id;  //uuid
	private String appHost;//服务器ip
	private String host;//clientip
	private String logLevel; 
	private String message;
	private String moduleCode; //模块名称
	private String operateType; //操作类型
	private Double qryusedTime;
	private String recordTime; //记录时间
	private String username;
	private String auditId;
	private String authFlag;
	private String optReason;
	private String orderId; // 记录总数
	private String outerUser;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getAppHost() {
		return appHost;
	}
	public void setAppHost(String appHost) {
		this.appHost = appHost;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public String getLogLevel() {
		return logLevel;
	}
	public void setLogLevel(String logLevel) {
		this.logLevel = logLevel;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getModuleCode() {
		return moduleCode;
	}
	public void setModuleCode(String moduleCode) {
		this.moduleCode = moduleCode;
	}
	public String getOperateType() {
		return operateType;
	}
	public void setOperateType(String operateType) {
		this.operateType = operateType;
	}
	public Double getQryusedTime() {
		return qryusedTime;
	}
	public void setQryusedTime(Double qryusedTime) {
		this.qryusedTime = qryusedTime;
	}
	public String getRecordTime() {
		return recordTime;
	}
	public void setRecordTime(String recordTime) {
		this.recordTime = recordTime;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getAuditId() {
		return auditId;
	}
	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}
	public String getAuthFlag() {
		return authFlag;
	}
	public void setAuthFlag(String authFlag) {
		this.authFlag = authFlag;
	}
	public String getOptReason() {
		return optReason;
	}
	public void setOptReason(String optReason) {
		this.optReason = optReason;
	}
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public String getOuterUser() {
		return outerUser;
	}
	public void setOuterUser(String outerUser) {
		this.outerUser = outerUser;
	}
	
}
