package org.hw.sml.manager.context;

import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.rest.annotation.Body;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.PathParam;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.route.Router;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;


public class WebRouter extends Router{	
	private static ThreadLocal<HttpServletRequest> requests=new ThreadLocal<HttpServletRequest>();
	private static ThreadLocal<HttpServletResponse> responses=new ThreadLocal<HttpServletResponse>();
	public static void set(HttpServletRequest request,HttpServletResponse response){
		requests.set(request);
		responses.set(response);
	}
	public static HttpServletRequest getCurrentRequest(){
		return requests.get();
	}
	public static HttpServletResponse getCurrentResponse(){
		return responses.get();
	}

	public static void release(){
		requests.remove();
		responses.remove();
	}
	public static void doService(String requestMethod,String source) throws Throwable{
		HttpServletRequest request=getCurrentRequest();
		HttpServletResponse response=getCurrentResponse();
		Source urlSource=checkPath(source);
		if(urlSource==null){
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		if(!urlSource.getRequestMethods().equals("")){
			if(!urlSource.getRequestMethods().equalsIgnoreCase(requestMethod)){
				response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
				return;
			}
		}
		String[] paths=urlSource.getPaths();
		Method method=urlSource.getMethod();
		Annotation[][] annotations=method.getParameterAnnotations();
		Class<?>[] clazzs=method.getParameterTypes();
		//
		Object[] params=new Object[clazzs.length];
		for(int i=0;i<clazzs.length;i++){
			Class<?> clazz=clazzs[i];
			Annotation[] ats=annotations[i];
			if(clazz.isAssignableFrom(HttpServletRequest.class)){
				params[i]=request;
			}else if(clazz.isAssignableFrom(HttpServletResponse.class)){
				params[i]=response;
			}else{
				Map<String,String> pathUrlParams=MapUtils.newHashMap();
				String[] args=RegexUtils.matchSubString(paths[0], source);
				for(int z=0;z<args.length;z++){
					pathUrlParams.put(paths[z+1].substring(1,paths[z+1].length()-1),args[z]);
				}
				for(Annotation at:ats){
					if(at.annotationType().isAssignableFrom(PathParam.class)){
						String pathParamName=((PathParam)at).value();
						params[i]=pathUrlParams.get(pathParamName);
					}else if(at.annotationType().isAssignableFrom(Param.class)){
						String pv=getParamer(((Param)at).value());
						params[i]=ClassUtil.convertValueToRequiredType((pv==null?((Param)at).defaultValue():pv),clazz);
					}else if(at.annotationType().isAssignableFrom(Body.class)){
						if(method.equals(SmlResource.GET)){
							response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
							return;
						}
						if(CharSequence.class.isAssignableFrom(clazz)){
							params[i]=WebTools.getRequestBody(getCurrentRequest());
						}else{
							try{
								params[i]=WebTools.fromJson(WebTools.getRequestBody(request),clazz);
							}catch(Exception e){
								e.printStackTrace();
								response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
								WebTools.print(response,e.getMessage());
								return;
							}
						}
						//params[i]=WebTools.fromJson(WebTools.getRequestBody(getCurrentRequest()),clazz);
					}
				}
				if(ats.length==0){
					if(CharSequence.class.isAssignableFrom(clazz)){
						params[i]=WebTools.getRequestBody(request);
					}else{
						try{
							params[i]=WebTools.fromJson(WebTools.getRequestBody(request),clazz);
						}catch(Exception e){
							e.printStackTrace();
							response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
							WebTools.print(response,e.getMessage());
							return;
						}
					}
				}
				
			}
		}
		try {
			Object result=method.invoke(urlSource.getBean(),params);
			ResponseContext.setResponseBody(result);
			if(result!=null){
				if(result instanceof String&&result.toString().startsWith(WebTools.REDIRECT)){
					request.getRequestDispatcher(result.toString().replaceFirst(WebTools.REDIRECT,"")).forward(request,response);
					return;
				}
				WebTools.print(response,result);
			}
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			WebTools.print(response,e.getMessage());
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			throw e.getTargetException(); 
		}
		//
	}
	private static String getParamer(String name){
		String v=getCurrentRequest().getParameter(name);
		if(v==null){
			v=getCurrentRequest().getHeader(name);
		}
		return v;
	}
	
}
