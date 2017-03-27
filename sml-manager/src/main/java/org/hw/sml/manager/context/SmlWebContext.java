package org.hw.sml.manager.context;

import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.rest.annotation.Body;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.PathParam;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SmlWebContext {
	public static final Logger logger=LoggerFactory.getLogger(SmlWebContext.class);
	private static class Source{
		private String[] paths;
		private Method method;
		private String requestMethods;
		private Object bean;
		public Source(String[] paths,Method method,String requestMethods,Object bean){
			this.paths=paths;
			this.method=method;
			this.requestMethods=requestMethods;
			this.bean=bean;
		}
		public String[] getPaths() {
			return paths;
		}
		public Method getMethod() {
			return method;
		}
		public String getRequestMethods() {
			return requestMethods;
		}
		public Object getBean() {
			return bean;
		}
		
	}
	
	private static Map<String,Source> urlMapper=new HashMap<String,Source>();
	
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
	
	
	public static void start(){
		Map<String,Object> beans=BeanHelper.getBeanMap();
		for(Map.Entry<String,Object> entry:beans.entrySet()){
			Object bean=entry.getValue();
			SmlResource smlResource=bean.getClass().getAnnotation(SmlResource.class);
			if(smlResource==null) continue;
			String classValuePath=smlResource.value();
			Method[] methods=ClassUtil.getMethods(bean.getClass());
			for(Method method:methods){
				SmlResource smlMethodResource=method.getAnnotation(SmlResource.class);
				if(smlMethodResource==null) continue;
				String methodValuePath=smlMethodResource.value();
				String[] paths=getPaths(classValuePath, methodValuePath);
				urlMapper.put(paths[0],new Source(paths, method,smlMethodResource.method(),bean));
				logger.debug("urlMapper:{},methodName:{},parameter:{}",paths[0],method.getName(),method.getParameterTypes());
			}
			
		}
	}
	public static void doService(String requestMethod,String source) throws Throwable{
		source=source.replace(getCurrentRequest().getContextPath()+"/","");
		source=source.substring(source.indexOf("/"));
		Source urlSource=checkPath(source);
		if(urlSource==null){
			getCurrentResponse().setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		if(!urlSource.getRequestMethods().equals("")){
			if(!urlSource.getRequestMethods().equalsIgnoreCase(requestMethod)){
				getCurrentResponse().setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
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
				params[i]=getCurrentRequest();
			}else if(clazz.isAssignableFrom(HttpServletResponse.class)){
				params[i]=getCurrentResponse();
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
						String pv=getCurrentRequest().getParameter(((Param)at).value());
						params[i]=ClassUtil.convertValueToRequiredType((pv==null?((Param)at).defaultValue():pv),clazz);
					}else if(at.annotationType().isAssignableFrom(Body.class)){
						if(method.equals(SmlResource.GET)){
							getCurrentResponse().setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
							return;
						}
						params[i]=WebTools.fromJson(WebTools.getRequestBody(getCurrentRequest()),clazz);
					}
				}
				if(ats.length==0){
					if(clazz.isAssignableFrom(CharSequence.class)){
						params[i]=WebTools.getRequestBody(getCurrentRequest());
					}else{
						params[i]=WebTools.fromJson(WebTools.getRequestBody(getCurrentRequest()),clazz);
					}
				}
				
			}
		}
		try {
			Object result=method.invoke(urlSource.getBean(),params);
			if(result!=null)
			WebTools.print(getCurrentResponse(),result);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
			getCurrentResponse().setStatus(HttpServletResponse.SC_BAD_REQUEST);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			throw e.getTargetException(); 
		}
		//
	}
	private static Source checkPath(String path){
		Source source=urlMapper.get(path);
		if(source==null){
			for(String urlPath:urlMapper.keySet()){
				try{
				String[] pathparams=RegexUtils.matchSubString(urlPath, path);
				if(pathparams!=null&&pathparams.length>0){
					return urlMapper.get(urlPath);
				}
				}catch(Exception e){
				}
			}
		}
		return source;
	}
	
	private static String[] getPaths(String cP,String mP){
		List<String> result=MapUtils.newArrayList();
		if(cP==null||cP.trim().equals("")){
			cP="/";
		}
		if(mP==null||mP.trim().equals("")){
			mP="/";
		}
		String path=("/"+cP+"/"+mP).replaceAll("/{1,}","/");
		result.add(path.replaceAll("\\{\\w+\\}", "([\\\\w|\\\\-|:]+)"));
		result.addAll(RegexUtils.matchGroup("\\{\\w+\\}",path));
		return result.toArray(new String[0]);
	}
}
