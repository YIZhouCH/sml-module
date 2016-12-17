package org.hw.sml.manager.service;

import java.lang.reflect.Method;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.model.PageObject;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.model.Result;
import org.hw.sml.report.model.Update;
import org.hw.sml.support.ioc.BeanHelper;

/**
 * 用传统servlet发布资源
 * @author wen
 *
 */

public class SmlManageService extends RcptBaseService{

	/**
	 * 修改操作
	 * @throws Exception 
	 */
	public void update(String updateStatus,HttpServletRequest request,HttpServletResponse response){
		try{
			if(!request.getMethod().equals("POST")){
				throw new Exception("method not support ["+request.getMethod()+"]");
			}
			Object result=null;
			String requestBody= WebTools.getRequestBody(request);
			if(requestBody==null||requestBody.length()<3){
				throw new Exception("reqeuest body is empty!");
			}
			Update update=WebTools.fromJson(requestBody,Update.class);
			if(updateStatus.equals("insert")){
				result=super.add(update);
			}else if(updateStatus.equals("update")){
				result=super.update(update);
			}else if(updateStatus.equals("delete")){
				result=super.delete(update);
			}else if(updateStatus.equals("adu")){
				result=super.adu(update);
			}else{
				Map<String,String> params=WebTools.fromJson(requestBody,Map.class);
				result=super.update(updateStatus, params);
			}
			WebTools.print(response,WebTools.buildResult(true,"success", result));
		}catch(Exception e){
			e.printStackTrace();
			WebTools.print(response,WebTools.buildResult(false,e.getMessage(),null));
		}
	}
	/**
	 * 查询操作
	 * @param uri
	 * @param requestBody
	 * @param request
	 * @param response
	 */
	public void query(String queryStatus,HttpServletRequest request,HttpServletResponse response){
		Object result=null;
		try{
			if(request.getMethod().equals("GET")){
				Map<String,String> params=WebTools.toMap(request);
				params.put("ifId",queryStatus);
				result=super.query(queryStatus, params);
			}else{
				if(request.getParameter("params")!=null){//jqGrid分页
					Map<String,String> params=WebTools.buildJqParams(request);
					params.put("ifId",queryStatus);
					Result pages=super.page(params);
					result=new PageObject(pages.getDatas(),pages.getCount(),Integer.parseInt(params.get("page")),Integer.parseInt(params.get("limit")));
				}else{//body接参数或者
					Map<String,String> params=WebTools.toMap(request);
					String body=WebTools.getRequestBody(request);
					if(body!=null&&body.length()>2){//body参数处理
						Map<String,String> bodyParams=WebTools.fromGson(body,Map.class);
						params.putAll(bodyParams);
					}
					params.put("ifId",queryStatus);
					result=super.query(queryStatus, params);
				}
			}
			WebTools.print(response,WebTools.buildResult(true,"success", result));
		}catch(Exception e){
			e.printStackTrace();
			WebTools.print(response,WebTools.buildResult(false,e.getMessage(),result));
		}
	}
	/**
	 * 导出方法
	 * @param queryStatus
	 * @param request
	 * @param response
	 */
	public void export(String queryStatus,HttpServletRequest request,HttpServletResponse response){
		
	}
	/**
	 *uri      /sml/invoke/{beanName}/{method} 
	 *所有bean只要符合上面uri都可以调用并用有@SmlResource注解
	 * @param mark
	 * @param request
	 * @param response
	 */
	public void invoke(String mark,HttpServletRequest request,HttpServletResponse response){
		Object invokeBean=BeanHelper.getBean(mark);
		if(invokeBean==null){
			 WebTools.print(response,WebTools.buildResult(false,"bean["+mark+"] not exists!",null));
			 return;
		}
		String[] uris=WebTools.getUris(request.getRequestURI());
		if(uris.length<5){
			WebTools.print(response,WebTools.buildResult(false,"uri error["+request.getRequestURI()+"]",null));
			return;
		}
		String invokeMethod=uris[4];
		String invokeMark=uris[5];
		try {
			Method method=invokeBean.getClass().getMethod(invokeMethod,String.class,HttpServletRequest.class,HttpServletResponse.class);
			Object obj=method.invoke(invokeBean,invokeMark,request,response);
			if(obj!=null){
				WebTools.print(response,WebTools.buildResult(true,"success",obj));
			}
		}catch (NoSuchMethodException e) {
			WebTools.print(response,WebTools.buildResult(false,"["+mark+"."+invokeMethod+"] not exists!",null));
		} catch (Exception e) {
			WebTools.print(response,WebTools.buildResult(false,mark+"."+invokeMethod+" error["+e.getMessage()+"]",null));
			e.printStackTrace();
		} 
	}

	
}
