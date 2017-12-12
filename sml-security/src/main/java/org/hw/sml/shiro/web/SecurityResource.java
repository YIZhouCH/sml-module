package org.hw.sml.shiro.web;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.hw.sml.manager.context.WebRouter;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.shiro.ShiroFilterFactoryBean;
import org.hw.sml.shiro.tools.VerifyCodeUtils;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;

@Bean
@SmlResource("security")
public class SecurityResource {
	@SmlResource(value="login",method=SmlResource.POST)
	public void login(@Param("username")String username,@Param("password")String password,@Param("verCode")String verCode) throws Exception{
		String reqCode=(String) WebRouter.getCurrentRequest().getSession().getAttribute("verCode");
		if(!reqCode.equalsIgnoreCase(verCode)){
			throw new Exception("验证码错误!");
		}
		Subject subject=SecurityUtils.getSubject();
		UsernamePasswordToken upt=new UsernamePasswordToken(username, password);
		try{
			subject.login(upt);
		  WebRouter.getCurrentResponse().sendRedirect(WebRouter.getCurrentRequest().getContextPath()+BeanHelper.getBean(ShiroFilterFactoryBean.class).getSuccessUrl());
		}catch(Exception e){
			LoggerHelper.error(getClass(),"登录失败：["+e.getMessage()+"]");
			throw e;
		}
	}
	@SmlResource("logout")
	public String logout(){
		Subject subject=SecurityUtils.getSubject();
		subject.logout();
		return "redirect:"+BeanHelper.getBean(ShiroFilterFactoryBean.class).getLoginUrl();
	}
	@SmlResource("captcha")
	public void image(HttpServletResponse response,HttpServletRequest request) throws IOException{
		response.setHeader("Pragma", "No-cache"); 
        response.setHeader("Cache-Control", "no-cache"); 
        response.setDateHeader("Expires", 0); 
        response.setContentType("image/jpeg"); 
        //生成随机字串 
        String verifyCode = VerifyCodeUtils.generateVerifyCode(4); 
        //存入会话session 
        HttpSession session = request.getSession(true); 
        //删除以前的
        session.removeAttribute("verCode");
        session.setAttribute("verCode", verifyCode.toLowerCase()); 
        //生成图片 
        VerifyCodeUtils.outputImage(260, 90, response.getOutputStream(), verifyCode); 
	}
}
