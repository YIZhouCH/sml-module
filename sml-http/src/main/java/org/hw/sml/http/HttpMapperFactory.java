package org.hw.sml.http;

import java.io.OutputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import org.hw.sml.http.annotation.BodyParam;
import org.hw.sml.http.annotation.HeaderParam;
import org.hw.sml.http.annotation.Http;
import org.hw.sml.http.annotation.PathParam;
import org.hw.sml.http.annotation.QueryParam;
import org.hw.sml.queryplugin.JsonMapper;
import org.hw.sml.support.aop.MethodProxyFactory;
import org.hw.sml.support.el.ElException;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.tools.Assert;
import org.hw.sml.tools.Https;
import org.hw.sml.tools.MapUtils;

public class HttpMapperFactory {
	private String baseUrl;
	private JsonMapper jsonMapper;
	public HttpMapperFactory(){
		
	}
	
	public HttpMapperFactory(JsonMapper jsonMapper) {
		super();
		this.jsonMapper = jsonMapper;
	}

	public HttpMapperFactory(String baseUrl){
		this.baseUrl=baseUrl;
	}
	public HttpMapperFactory(String baseUrl,JsonMapper jsonMapper){
		this.baseUrl=baseUrl;
		this.jsonMapper=jsonMapper;
	}
	public  <T> T getMapper(Class<T> t){
		return MethodProxyFactory.newInstance(t,new HttpInvocationHandler(t));
	}
	 class HttpInvocationHandler implements InvocationHandler{
		private Class<?> clazz;
		public HttpInvocationHandler(Class<?> clazz){
			this.clazz=clazz;
		}
		public Object invoke(Object proxy, Method method, Object[] args)
				throws Throwable {
			Http bhttp=clazz.getAnnotation(Http.class);
			Assert.notNull(bhttp,clazz.toString()+" is not has @Http");
			String preurl=bhttp.url();
			String prevalue=bhttp.value();
			//
			Http mhttp=method.getAnnotation(Http.class);
			Assert.notNull(bhttp,method.toString()+" is not has @Http");
			String murl=mhttp.url();
			String mvalue=mhttp.value();
			String methodtype=mhttp.method();
			String urls=(baseUrl!=null?baseUrl:(murl!=null&&murl.length()>0?getUrl(murl):getUrl(preurl)))+"/"+prevalue+"/"+mvalue;
			String[] pathfields=getPaths(urls);
			String url=pathfields[0];
			Annotation[][] annotations=method.getParameterAnnotations();
			Map<String,Object> pathvalues=MapUtils.newLinkedHashMap();
			Map<String,Object> queryvalues=MapUtils.newLinkedHashMap();
			Map<String,Object> headervalues=MapUtils.newLinkedHashMap();
			Object body=null;
			OutputStream os=null;
			for(String mheader:mhttp.headers()){
				headervalues.put(mheader.substring(0,mheader.indexOf("=")), mheader.substring(mheader.indexOf("=")+1,mheader.length()));
			}
			for(int i=0;i<annotations.length;i++){
				Annotation[] annos=annotations[i];
				Object value=args[i];
				if(annos.length==0){
					if(value instanceof OutputStream){
						os=(OutputStream) value;
					}
				}
				for(Annotation anno:annos){
					if(anno.annotationType().equals(HeaderParam.class)){
						HeaderParam hp=((HeaderParam)anno);
						headervalues.put(hp.value(), value);
					}else if(anno.annotationType().equals(QueryParam.class)){
						QueryParam hp=((QueryParam)anno);
						queryvalues.put(hp.value(), value);
					}else if(anno.annotationType().equals(PathParam.class)){
						pathvalues.put(((PathParam)anno).value(),value);
					}else if(anno.annotationType().equals(BodyParam.class)){
						body=value;
					}
				}
			}
			for(Map.Entry<String,Object> entry:pathvalues.entrySet()){
				url=url.replace("{"+entry.getKey()+"}",entry.getValue().toString());
			}
			//
			Https https=null;
			if(methodtype.equals(Http.METHOD_GET)){
				https=Https.newGetHttps(url);
			}else if(methodtype.equals(Http.METHOD_POST)){
				https=Https.newPostBodyHttps(url);
			}else if(methodtype.equals(Http.METHOD_POSTFORM)){
				https=Https.newPostFormHttps(url);
			}
			for(Map.Entry<String,Object> entry:headervalues.entrySet()){
				https.getHeader().put(entry.getKey(),String.valueOf(entry.getValue()));
			}
			for(Map.Entry<String,Object> entry:queryvalues.entrySet()){
				https.getParamer().add(entry.getKey(),String.valueOf(entry.getValue()));
			}
			if(body!=null){
				if(body instanceof byte[])
					https.body((byte[])body);
				else if(body instanceof Https.UpFile[])
					https.body((Https.UpFile[])body);
				else if(body instanceof String)
					https.body(body.toString());
				else{
					Assert.notNull(jsonMapper,"body param not support "+body.getClass());
					https.body(jsonMapper.toJson(body));
				}
			}
			if(os!=null){
				https.bos(os);
			}
			Class<?> c=method.getReturnType();
			if(c==null)
				return null;
			if(c.isArray())
				return https.query();
			else if(c.equals(String.class)) 
				return https.execute();
			else{
				Assert.notNull(jsonMapper,"return not support "+c.getClass());
				return jsonMapper.toObj(https.execute(),c);
			}
			
		}
		private String getUrl(String murl) {
			if(murl.startsWith("${")&&murl.endsWith("}")){
				try {
					return (String) BeanHelper.evelV(murl);
				} catch (ElException e) {
					return murl;
				}
			}
			return murl;
		}
	}
	private static String[] getPaths(String mP) {
		List<String> result = MapUtils.newArrayList();
		String path =mP.replaceAll("/{1,}", "/");
		path=path.replaceFirst(":/","://");
		if (path.endsWith("/")) {
			path = path.substring(0, path.length() - 1);
		}
		result.add(path);
		return ((String[]) result.toArray(new String[0]));
	}
	public String getBaseUrl() {
		return baseUrl;
	}
	public void setBaseUrl(String baseUrl) {
		this.baseUrl = baseUrl;
	}
	public JsonMapper getJsonMapper() {
		return jsonMapper;
	}
	public void setJsonMapper(JsonMapper jsonMapper) {
		this.jsonMapper = jsonMapper;
	}
	
}
