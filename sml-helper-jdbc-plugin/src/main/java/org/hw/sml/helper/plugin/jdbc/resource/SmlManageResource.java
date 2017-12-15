package org.hw.sml.helper.plugin.jdbc.resource;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import org.hw.sml.core.DelegatedSqlMarkupAbstractTemplate;
import org.hw.sml.core.build.SmlTools;
import org.hw.sml.helper.plugin.tools.WebTools;
import org.hw.sml.model.Result;
import org.hw.sml.report.model.Constants;
import org.hw.sml.report.model.Update;
import org.hw.sml.rest.annotation.PathParam;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.server.NanoHTTPD.IHTTPSession;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.tools.MapUtils;

@SmlResource("sml")
@Bean
public class SmlManageResource extends DelegatedSqlMarkupAbstractTemplate{
	private static final String COMMON="common";
	@SmlResource("/update/{updateStatus}")
	public Object update(IHTTPSession session,@PathParam("updateStatus")String updateStatus){
		Map<String,String> params=session.getParms();
		try{
			if(!session.getMethod().name().equalsIgnoreCase("POST")){
				throw new Exception("method not support ["+session.getMethod()+"]");
			}
			Object result=null;
			String requestBody=null;
			if(session.getHeaders().get("content-type").contains("x-www-form-urlencoded")){
				requestBody=WebTools.toGson(params);
			}else{
				requestBody= session.getBody();
			}
			if(requestBody==null||requestBody.length()<3){
				throw new Exception("reqeuest body is empty!");
			}
			if(requestBody.startsWith("[")&&requestBody.endsWith("]")&&updateStatus.equals(COMMON)){
				List<Update> updateDatas=MapUtils.newArrayList();
				@SuppressWarnings("unchecked")
				List<Map<String,Object>> updates=WebTools.fromGson(requestBody,List.class);
				for(Map<String,Object> update:updates){
					updateDatas.add(WebTools.fromGson(WebTools.toGson(update),Update.class));
				}
				result=super.update(updateDatas);
			}else{
				Update update=null;
				if(updateStatus.equals(Constants.TYPE_INSERT)){
					update=WebTools.fromGson(requestBody,Update.class);
					result=super.add(update);
				}else if(updateStatus.equals(Constants.TYPE_UPDATE)){
					update=WebTools.fromGson(requestBody,Update.class);
					result=super.update(update);
				}else if(updateStatus.equals(Constants.TYPE_DELETE)){
					update=WebTools.fromGson(requestBody,Update.class);
					result=super.delete(update);
				}else if(updateStatus.equals(Constants.TYPE_ADU)){
					update=WebTools.fromGson(requestBody,Update.class);
					result=super.adu(update);
				}else if(updateStatus.equals(COMMON)){
					update=WebTools.fromGson(requestBody,Update.class);
					if(update.getType().equals(Constants.TYPE_INSERT)){
						result=super.add(update);
					}else if(update.getType().equals(Constants.TYPE_UPDATE)){
						result=super.update(update);
					}else if(update.getType().equals(Constants.TYPE_ADU)){
						result=super.adu(update);
					}else if(update.getType().equals(Constants.TYPE_DELETE)){
						result=super.delete(update);
					}
				}else{ 
					Map<String,Object> paramt = WebTools.fromGson(requestBody,Map.class);
					Map<String,String> param=SmlTools.rebuildSimpleKv(paramt);
					param.put("ifId", updateStatus);
					result = super.update(param);
				}
			}
			return WebTools.buildResult(true,"success", result);
		}catch(Exception e){
			e.printStackTrace();
			return WebTools.buildResult(false,e.getMessage(), e.getMessage());
		}
	}
	@SmlResource("query/{queryStatus}")
	public Object query(@PathParam("queryStatus")String queryStatus,IHTTPSession session){
		Object result=null;
		try{
			if(session.getMethod().name().equals("GET")){
				Map<String,String> params=session.getParms();
				if(!queryStatus.equals(COMMON))
				params.put("ifId",queryStatus);
				result=super.query(params.get("ifId"),params);
			}else{
				if(session.getParms().get("params")!=null){//jqGrid分页
					Map<String,String> params=WebTools.buildJqParams(session);
					if(!queryStatus.equals(COMMON))
					params.put("ifId",queryStatus);
					Result pages=super.page(params);
					result=new PageObject(pages.getDatas(),pages.getCount(),Integer.parseInt(params.get("page")),Integer.parseInt(params.get("limit")));
				}else{//body接参数或者
					Map<String,String> params=session.getParms();
					String body=session.getFiles()!=null?session.getBody():null;
					if(body!=null&&body.length()>2&&body.contains("{")&&body.contains("}")){//body参数处理
						Map<String,String> bodyParams=WebTools.fromGson(body,Map.class);
						params.putAll(bodyParams);
					}
					if(!queryStatus.equals(COMMON))
					params.put("ifId",queryStatus);
					result=super.query(params.get("ifId"),params);
				}
			}
			return WebTools.buildResult(true,"success", result);
		}catch(Exception e){
			e.printStackTrace();
			return WebTools.buildResult(false,e.getMessage(),e.getMessage());
		}
	}
	@SmlResource("invoke/{bean}/{method}/{mark}")
	public Object invoke(@PathParam("bean")String bean,@PathParam("method")String invokeMethod,@PathParam("mark")String invokeMark,IHTTPSession session){
		Object invokeBean=BeanHelper.getBean(bean);
		if(invokeBean==null){
			 return WebTools.buildResult(false,"bean["+mark+"] not exists!",null);
		}
		try {
			Method method=invokeBean.getClass().getMethod(invokeMethod,String.class,IHTTPSession.class);
			Object obj=method.invoke(invokeBean,invokeMark,session);
			return obj;
		}catch (NoSuchMethodException e) {
			return WebTools.buildResult(false,"["+mark+"."+invokeMethod+"] not exists!",null);
		}catch(InvocationTargetException t){
			Throwable e = t.getTargetException();// 获取目标异常  
			t.printStackTrace();
			return WebTools.buildResult(false,mark+"."+invokeMethod+" error["+e.getMessage()+"]",null);
		} catch (Throwable e) {
			e.printStackTrace();
			return WebTools.buildResult(false,mark+"."+invokeMethod+" error["+e.getMessage()+"]",e.getMessage());
		} 
	}
	
}
