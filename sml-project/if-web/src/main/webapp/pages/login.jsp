<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>xxx管理平台</title>
    <meta name="viewport" content="width=device-width">
    <%@ include file="./commons/basejs.jsp" %>
    <link rel="stylesheet" type="text/css" href="${ctxPath}/static/style/css/login.css" />
    <script type="text/javascript" src="${ctxPath}/static/login.js" charset="utf-8"></script>
<script type="text/javascript">
function changeImg(){
	$("#captcha").attr('src','${ctxPath}/sml/security/captcha?t='+(new Date()).getTime());
}
</script>
</head>
<body>
<div class="top_div"></div>
<div style="background: rgb(255, 255, 255); margin: -100px auto auto; border: 1px solid rgb(231, 231, 231);border-image:none;width:400px;text-align: center;">
    <form method="post" id="loginform" action="${ctxPath}/sml/security/login">
        <div style="width: 165px; height: 96px; position: absolute;">
            <div class="tou"></div>
            <div class="initial_left_hand" id="left_hand"></div>
            <div class="initial_right_hand" id="right_hand"></div>
        </div>
        <P style="padding: 20px 0px 10px; position: relative;">
            用户：
            <input  type="text" name="username" style="width:270px;height: 30px" placeholder="请输入登录名"/>
        </P>
        <P style="padding: 20px 0px 10px;position: relative;">
           密码：
            <input  id="password" style="width:270px;height: 30px" type="password" name="password" placeholder="请输入密码"/>
        </P>
        <P style="padding: 10px 0px 10px; position: relative;">
            <input class="captcha" type="text" name="verCode" placeholder="请输入验证码"/>
            <img id="captcha" alt="验证码" src="${ctxPath}/sml/security/captcha" onclick="changeImg();" style="vertical-align:middle;border-radius:4px;width:94.5px;height:35px;cursor:pointer;">
        </P>
         <P style="position: relative;text-align: left;">
            <input class="btn btn-success" name="" type="submit" value="登录" checked style="vertical-align:middle;margin-left:40px;height:30px;"/> 
        </P> 
        <div style="height: 50px; line-height: 50px; margin-top: 10px;border-top-color: rgb(231, 231, 231); border-top-width: 1px; border-top-style: solid;">
            <P style="margin: 0px 35px 20px 45px;">
                <span style="float: left;">
                    <a style="color: rgb(204, 204, 204);" href="javascript:;">忘记密码?</a>
                </span>
            </P>
        </div>
    </form>
</div>
<div style="text-align:center;">
   
</div>
</body>
</html>
