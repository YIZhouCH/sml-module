package org.hw.sml.manager.context;

public class ResponseContext {
	public static ThreadLocal<Object> responseBodys=new InheritableThreadLocal<Object>();
	
	public static void setResponseBody(Object obj){
		responseBodys.set(obj);
	}
	public static Object getResponseBody(){
		return responseBodys.get();
	}
	public static void release(){
		responseBodys.remove();
	}
}
