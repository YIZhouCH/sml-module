package org.hw.sml.route;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hw.sml.component.RcptFastJsonMapper;
import org.hw.sml.rest.annotation.Body;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.PathParam;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.server.NanoHTTPD;
import org.hw.sml.server.NanoHTTPD.IHTTPSession;
import org.hw.sml.server.NanoHTTPD.Response;
import org.hw.sml.server.NanoHTTPD.Response.Status;
import org.hw.sml.server.NanoHTTPD.ResponseException;
import org.hw.sml.server.SmlServer;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.PropertiesHelper;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;


public class Router {
	protected static Class<Router> LOG=Router.class;
	protected static  Map<String,String> urlrewrite=MapUtils.newHashMap();
	public static final String KEY_URLREWRITE="urlrewrite.";
	public static class Source{
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
	public static Map<String,String> getUrlrewrite(){
		return urlrewrite;
	}
	public static Map<String,Source> urlMapper=new HashMap<String,Source>();
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
				LoggerHelper.debug(LOG,String.format("urlMapper:%s,methodName:%s,parameter:%s",paths[0],method.getName(),Arrays.asList(method.getParameterTypes())));
			}
		}
		for(Map.Entry<String,String> entry:BeanHelper.getBean(PropertiesHelper.class).getValuesByKeyStart(KEY_URLREWRITE).entrySet()){
			LoggerHelper.debug(LOG,"urlrewrite "+entry.getKey().replaceFirst(KEY_URLREWRITE,"")+"---->"+entry.getValue());
			urlrewrite.put(entry.getValue(),entry.getKey());
		}
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
		if(path.endsWith("/")){
			path=path.substring(0,path.length()-1);
		}
		result.add(path.replaceAll("\\{\\w+\\}", "([\\\\w|\\\\-|:]+)"));
		result.addAll(RegexUtils.matchGroup("\\{\\w+\\}",path));
		return result.toArray(new String[0]);
	}
	protected static Source checkPath(String path){
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
	public static Response route(IHTTPSession session) throws Exception,ResponseException{
		LoggerHelper.debug(LOG,session.getRemoteIpAddress()+"|"+session.getMethod().name()+",URI:["+session.getUri()+"] --");
		Map<String, String> files = new HashMap<String, String>();
        org.hw.sml.server.NanoHTTPD.Method md = session.getMethod();
        if (md.name().equalsIgnoreCase("POST")) {
            try {//postData
                session.parseBody(files);
            } catch (IOException ioe) {
                throw new ResponseException(Status.INTERNAL_ERROR,ioe.getMessage());
            } catch (ResponseException re) {
                throw re;
            }
        }
		String source=session.getUri();
		if(urlrewrite.containsKey(source)){
			source=urlrewrite.get(source);
		}
		source=source.substring(source.indexOf("/"));
		String contextPath=BeanHelper.getValue("server.contextPath");
		if(contextPath!=null){
			if(!(source.startsWith(contextPath)||source.startsWith("/"+contextPath))){
				throw new ResponseException(Status.NOT_FOUND,Status.NOT_FOUND.name());
			}
			contextPath=contextPath.startsWith("/")?contextPath:("/"+contextPath);
			source=source.replaceFirst(contextPath, "");
		}
		String statisSource=source.substring(source.lastIndexOf("/")+1);
		if(statisSource.contains(".")){
			String suffix=statisSource.substring(statisSource.lastIndexOf(".")+1);
				try {
					String filepath=BeanHelper.getBean(SmlServer.class).getWebapp()+source;
					return NanoHTTPD.newChunkedResponse(Status.OK,NanoHTTPD.mimeTypes().get(suffix)==null?NanoHTTPD.MIME_PLAINTEXT:NanoHTTPD.mimeTypes().get(suffix),new FileInputStream(new File(filepath)));
				} catch (FileNotFoundException e) {
					return NanoHTTPD.newFixedLengthResponse(Status.NOT_FOUND, NanoHTTPD.MIME_PLAINTEXT,source+" not found!");
				}
		}
		Source urlSource=checkPath(source);
		if(urlSource==null){
			throw new ResponseException(Status.NOT_FOUND, "NOT_FOUND");
		}
		if(!urlSource.getRequestMethods().equals("")){
			if(!urlSource.getRequestMethods().equalsIgnoreCase(session.getMethod().name())){
				throw new ResponseException(Status.METHOD_NOT_ALLOWED,Status.METHOD_NOT_ALLOWED.name());
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
			if(clazz.isAssignableFrom(IHTTPSession.class)){
				params[i]=session;
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
						String pv=getParamter(session, ((Param)at).value());
						params[i]=ClassUtil.convertValueToRequiredType((pv==null?((Param)at).defaultValue():pv),clazz);
					}else if(at.annotationType().isAssignableFrom(Body.class)){
						if(method.equals(SmlResource.GET)){
							throw new ResponseException(Status.METHOD_NOT_ALLOWED, "METHOD_NOT_ALLOWED");
						}
						params[i]=new RcptFastJsonMapper().toObj(files.get("postData"), clazz);
					}
				}
				if(ats.length==0){
						if(CharSequence.class.isAssignableFrom(clazz)){
								params[i]=files.get("postData");
						}else{
							params[i]=new RcptFastJsonMapper().toObj(files.get("postData"), clazz);
						}
				}
			}
		}
		try {
			Object result=method.invoke(urlSource.getBean(),params);
			if(result!=null&&result instanceof Response){
				return (Response)result;
			}else{
				String produces=getProduces(urlSource.getMethod());
				if(result!=null&&(!(result instanceof CharSequence))){
					result=new RcptFastJsonMapper().toJson(result);
				}
				return NanoHTTPD.newResponse(Status.OK,produces,result==null?null:(String)result);
			}
		} catch (IllegalArgumentException e) {
			throw new ResponseException(Status.BAD_REQUEST,e.getMessage());
		} catch (IllegalAccessException e) {
			throw new ResponseException(Status.INTERNAL_ERROR,e.getMessage());
		} catch (InvocationTargetException e) {
			 throw new ResponseException(Status.INTERNAL_ERROR,e.getTargetException().getMessage());
		}catch(Exception e){
			e.printStackTrace();
			throw new ResponseException(Status.INTERNAL_ERROR,e.getMessage());
		}
	}
	/**
	 * 优先取query-param|然后 header-param
	 * @param session
	 * @param name
	 * @return
	 */
	private static String getParamter(IHTTPSession session,String name){
		String result=session.getParms().get(name);
		if(result==null){
			result=session.getHeaders().get(name.toLowerCase());
		}
		return result;
	}
	private static String getProduces(Method method){
		SmlResource sml=method.getAnnotation(SmlResource.class);
		return sml.produces()+" ;charset="+sml.charset();
	}
	
}
