package org.hw.sml.manager.service;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.model.PageObject;
import org.hw.sml.manager.tools.HtmlHelp;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.model.Result;
import org.hw.sml.report.model.Update;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ClassHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;
/**
 * 用传统servlet发布资源
 * @author wen
 *
 */
//@SmlResource
public class SmlManageService extends RcptBaseService{
	private static final String COMMON="common";
	/**
	 * 接口概览
	 * @param uri
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	public void index(String uri,HttpServletRequest request,HttpServletResponse response) throws IOException{
		if(uri.equals("default")||uri.equals(COMMON))
			uri="com.eastcom_sw";
		List<Class<?>>  smlLstClass=ClassHelper.getClassListByAnnotation(uri, SmlResource.class);
		response.setContentType("text/html;charset=utf-8");
		HtmlHelp ht=new HtmlHelp();
		ht.append("sml resource manager",new String[]{"类名","方法名","访问"});
		for(Class<?> smlClass:smlLstClass){
			Method[] methods=ClassUtil.getMethods(smlClass);
			String className=smlClass.getName();
			for(Method method:methods){
				java.lang.reflect.Type[] types=method.getGenericParameterTypes();
				if(types==null||types.length!=3||!types[1].equals(HttpServletRequest.class)||!types[2].equals(HttpServletResponse.class)){
					continue;
				}
				//
				String methodName=method.getName();
				ht.append(new Object[]{className,methodName,"<a href='../invoke/"+(smlClass.getSimpleName().substring(0,1).toLowerCase()+smlClass.getSimpleName().substring(1))+"/"+methodName+"/all'>点击</a>"});
			}
		}
		ht.endInnerBody();
		response.getWriter().append(ht.toString());
	}
	/**
	 * 修改操作
	 * @throws IOException 
	 * @throws Exception 
	 */
	public void update(String updateStatus,HttpServletRequest request,HttpServletResponse response){
		try{
			if(!request.getMethod().equals("POST")){
				throw new Exception("method not support ["+request.getMethod()+"]");
			}
			Object result=null;
			String requestBody=null;
			if(WebTools.isFormMethod(request)){
				requestBody=WebTools.toGson(WebTools.toMap(request));
			}else{
				requestBody= WebTools.getRequestBody(request);
			}
			if(requestBody==null||requestBody.length()<3){
				throw new Exception("reqeuest body is empty!");
			}
			Update update=null;
			if(updateStatus.equals("insert")){
				update=WebTools.fromGson(requestBody,Update.class);
				result=super.add(update);
			}else if(updateStatus.equals("update")){
				update=WebTools.fromGson(requestBody,Update.class);
				result=super.update(update);
			}else if(updateStatus.equals("delete")){
				update=WebTools.fromGson(requestBody,Update.class);
				result=super.delete(update);
			}else if(updateStatus.equals("adu")){
				update=WebTools.fromGson(requestBody,Update.class);
				result=super.adu(update);
			}else{ 
				Map<String,String> param = WebTools.fromGson(requestBody,Map.class);
				param.put("ifId", updateStatus);
				result = super.update(param);
			}
			WebTools.print(response,WebTools.buildResult(true,"success", result));
		}catch(Exception e){
			e.printStackTrace();
			WebTools.print(response,WebTools.buildResult(false,"success", e.getMessage()));
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
				if(!queryStatus.equals(COMMON))
				params.put("ifId",queryStatus);
				result=super.query(params.get("ifId"),params);
			}else{
				if(request.getParameter("params")!=null){//jqGrid分页
					Map<String,String> params=WebTools.buildJqParams(request);
					if(!queryStatus.equals(COMMON))
					params.put("ifId",queryStatus);
					Result pages=super.page(params);
					result=new PageObject(pages.getDatas(),pages.getCount(),Integer.parseInt(params.get("page")),Integer.parseInt(params.get("limit")));
				}else{//body接参数或者
					Map<String,String> params=WebTools.toMap(request);
					String body=WebTools.getRequestBody(request);
					if(body!=null&&body.length()>2&&body.contains("{")&&body.contains("}")){//body参数处理
						Map<String,String> bodyParams=WebTools.fromGson(body,Map.class);
						params.putAll(bodyParams);
					}
					if(!queryStatus.equals(COMMON))
					params.put("ifId",queryStatus);
					result=super.query(params.get("ifId"),params);
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
	 * @param queryStatus  :export|exportOriginal
	 * @param request
	 * @param response
	 * @throws Exception 
	 */
	public void export(String queryStatus,HttpServletRequest request,HttpServletResponse response) throws Exception{
	
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
		SmlResource smlResource=invokeBean.getClass().getAnnotation(SmlResource.class);
		if(smlResource==null){
			WebTools.print(response,WebTools.buildResult(false,"bean["+mark+"] not support[@SmlResource]!",null));
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
		}catch(InvocationTargetException t){
			Throwable e = t.getTargetException();// 获取目标异常  
			WebTools.print(response,WebTools.buildResult(false,mark+"."+invokeMethod+" error["+e.getMessage()+"]",null));
            e.printStackTrace(); 
		} catch (Throwable e) {
			WebTools.print(response,WebTools.buildResult(false,mark+"."+invokeMethod+" error["+e.getMessage()+"]",null));
			e.printStackTrace();
		} 
	}
	
	public static class HeaderTitle{
		String[] pns;
		String[] hns;
		public HeaderTitle(String htStr){
			String[] hts=htStr.split(",#,;#;");
			List<String> pnLst=MapUtils.newArrayList();
			List<String> hnLst=MapUtils.newArrayList();
			for(String ht:hts){
				String[] hs=ht.split(",#,");
				if(hs.length==2){
					pnLst.add(hs[1]);
					hnLst.add(hs[0]);
				}
			}
			pns=pnLst.toArray(new String[pnLst.size()]);
			hns=hnLst.toArray(new String[hnLst.size()]);
		}
	}
	
}
