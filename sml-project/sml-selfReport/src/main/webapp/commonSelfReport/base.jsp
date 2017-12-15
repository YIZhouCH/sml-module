<%@ page language="java"  pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!-- base -->
<!--  
<c:set var="allLu" value='<%=request.getContextPath() %>' />
<c:set var="ctx" value='<%=request.getRequestURL().substring(0,request.getRequestURL().indexOf("/", 7))+"/selfReport" %>' />
<c:set var="jslib" value='<%=request.getRequestURL().substring(0,request.getRequestURL().indexOf("/", 7))+"/selfReport/static/jslib" %>' />
-->
<c:set var="ctx" value='<%=request.getRequestURL().substring(0,request.getRequestURL().indexOf("/", 7)) + request.getContextPath() %>' />
<c:set var="jslib" value='<%=request.getRequestURL().substring(0,request.getRequestURL().indexOf("/", 7))+request.getContextPath() +"/static/jslibSelfReport" %>' />

<script type="text/javascript">
	var serverName="<%=request.getRequestURL().substring(0,request.getRequestURL().indexOf("/", 7)) %>";
	var restUrl="http://10.221.247.7:8080/";
	var CTX = "${ctx}";
	var JSLIB = "${jslib}";
	serverName=serverName.replace("http://","").split(":")[0];
	

</script>
<script src="${ctx}/pages/reportManageSys/easyui/commonModule.js" type="text/javascript"></script>
<!-- end base -->