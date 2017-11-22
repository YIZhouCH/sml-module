package org.hw.sml.shiro.web;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.shiro.ShiroFilterFactoryBean;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;

@Bean
@SmlResource("security")
public class SecurityResource {
	@SmlResource("login")
	public String login(@Param("username")String username,@Param("password")String password) throws Exception{
		Subject subject=SecurityUtils.getSubject();
		UsernamePasswordToken upt=new UsernamePasswordToken(username, password);
		try{
			subject.login(upt);
		    return "redirect:"+BeanHelper.getBean(ShiroFilterFactoryBean.class).getSuccessUrl();
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
}
