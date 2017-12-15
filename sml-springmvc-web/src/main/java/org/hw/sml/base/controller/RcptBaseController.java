package org.hw.sml.base.controller;

import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.tools.WebTools;

public class RcptBaseController{

	//获取参数
	public void print(HttpServletResponse response,Object obj){
		//返回样例好看
		response.setContentType("application/json;charset=utf-8");
		WebTools.print(response, obj);
	}
	
	public Map<String,Object> buildResult(boolean successMark,String msg,Object result){
		return (Map<String, Object>) WebTools.buildResult(successMark, msg, result);
	}
	public String toJson(Object obj){
		return WebTools.toJson(obj);
	}
	public String toGson(Object obj){
		return WebTools.toGson(obj);
	}
	public <T> T fromGson(String json,Class<T> t){
		return WebTools.fromGson(json, t);
	}
	public <T> T fromJson(String json,Class<T> t){
		return WebTools.fromJson(json, t);
	}
}
