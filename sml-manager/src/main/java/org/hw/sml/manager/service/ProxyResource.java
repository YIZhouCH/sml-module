package org.hw.sml.manager.service;

import java.io.IOException;
import java.util.Enumeration;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Val;
import org.hw.sml.tools.Https;
import org.hw.sml.tools.IOUtils;
import org.hw.sml.tools.MapUtils;

@Bean("sml-helper-plugin-resource")
@SmlResource("proxy")
public class ProxyResource {
	@Val(value="plugin.helper.proxy.nullurl",required=false)
	private String defaultUrl;
	@SmlResource("/(.*?)")
	public Object proxy(HttpServletRequest request,HttpServletResponse response) throws IOException{
		String url=request.getParameter("realUrl");
		if(url==null){
			url=defaultUrl;
		}
		url=url+("/"+(request.getPathInfo().replaceFirst("/proxy/","")).replace("//","/"))+"?"+request.getQueryString();
		LoggerHelper.getLogger().info(getClass(),"proxy url["+url+"]");
		String method=request.getMethod();
		Enumeration<String> enums= request.getHeaderNames();
		Map<String,String> heads=MapUtils.newHashMap();
		Https https=null;
		while(enums.hasMoreElements()){
			String ele=enums.nextElement();
			heads.put(ele,request.getHeader(ele));
		}
		if(method.equalsIgnoreCase("GET")){
			 https=Https.newGetHttps(url);
		}else{
			https=Https.newPostHttps(url);
			String body=IOUtils.toString(request.getInputStream(),"utf-8");
			https.body(body);
		}
		for(Map.Entry<String,String> entry:heads.entrySet()){
			if(!entry.getKey().equalsIgnoreCase("accept-encoding"))
			https.getHeader().put(entry.getKey(),entry.getValue());
		}
		Object result= https.execute();
		response.setContentType(https.getResponseHeader().getHeader().get("Content-Type"));
		return result;
	}
}
