package org.hw.sml.status.server;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hw.sml.rest.annotation.Body;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.server.NanoHTTPD;
import org.hw.sml.server.NanoHTTPD.IHTTPSession;
import org.hw.sml.server.NanoHTTPD.Response.Status;
import org.hw.sml.server.NanoHTTPD.ResponseException;
import org.hw.sml.status.helper.HtmlHelp;
import org.hw.sml.status.helper.SystemHelper;
import org.hw.sml.status.proxy.ProxyRouter;
import org.hw.sml.status.rs.StatusResource;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Inject;
import org.hw.sml.tools.DateTools;
import org.hw.sml.tools.Https;
import org.hw.sml.tools.MapUtils;

@Bean
@SmlResource("server")
public class ServerResource {
	public Map<String,Map<String,Object>> sources=MapUtils.newLinkedHashMap();
	
	@Inject("manage-status-resource")
	private StatusResource statusResource;
	
	@SmlResource(produces=SmlResource.TEXT_HTML)
	public Object server(){
		HtmlHelp hh=new HtmlHelp();
		hh.append("server",getHeadValues());
		hh.append(getValues("server",statusResource.status()));
		hh.endInnerBody();
		hh.append("client",getHeadValues());
		for(Map.Entry<String,Map<String,Object>> entry:sources.entrySet()){
			Object[] values=getValues(entry.getKey(),entry.getValue());
			values[values.length-1]="<a href='./server/clear?key="+entry.getKey()+"'> remove</a>";
			if(!ProxyRouter.hasTimeExpire(entry.getValue().get("lastTime").toString()))
			hh.append(values);
		}
		hh.endInnerBody();
		hh.append("exception-client",getHeadValues());
		for(Map.Entry<String,Map<String,Object>> entry:sources.entrySet()){
			Object[] values=getValues(entry.getKey(),entry.getValue());
			values[values.length-1]="<a href='./server/clear?key="+entry.getKey()+"'> remove</a>";
			if(ProxyRouter.hasTimeExpire(entry.getValue().get("lastTime").toString()))
			hh.append(values);
		}
		return hh.endInnerBody().toString();
	}
	@SmlResource(value="clear",produces=SmlResource.TEXT_HTML)
	public Object remove(@Param("key")String key){
		sources.remove(key);
		return server();
	}
	@SmlResource(value="regist",method=SmlResource.POST)
	public Object regist(@Body Map<String,Object> status,IHTTPSession session){
		status.put("lastTime",DateTools.sdf_mi.format(new Date()));
		sources.put("http://"+session.getRemoteIpAddress()+":"+status.get("serverPort")+"/"+(status.get("serverContextPath")==null?"":status.get("serverContextPath")), status);
		return "1";
	}
	@SmlResource("proxy/(.*?)")
	public Object proxy(IHTTPSession session) throws ResponseException{
		String uri=session.getUri().replace("/"+SystemHelper.getServerContextPath()+"/server/proxy/","");
		String serverContextPath=uri.split("/")[0];
		String httpUrl=ProxyRouter.getProxyUrl(sources, serverContextPath);
		if(httpUrl==null){
			throw new NanoHTTPD.ResponseException(Status.NOT_FOUND,"source not found or expired!");
		}
		String url=httpUrl+uri.substring(uri.indexOf("/"));
		String method=session.getMethod().name();
		if(!method.equalsIgnoreCase("get")&&!method.equalsIgnoreCase("post")){
			throw new NanoHTTPD.ResponseException(Status.METHOD_NOT_ALLOWED,"proxy not support method["+method+"]");
		}
		Https https=null;
		if(method.equalsIgnoreCase("get")){
			 https=Https.newGetHttps(url);
		}else{
			 https=Https.newPostHttps(url);
			 String postData=session.getFiles().get("postData");
			 if(postData!=null){
				 https.body(postData);
			 }
		}
		https.getParamer().param(session.getQueryParameterString());
		List<String> blacklist=Arrays.asList(new String[]{"accept-encoding"});
		for(Map.Entry<String,String> entry:session.getHeaders().entrySet()){
			if(blacklist.contains(entry.getKey().toLowerCase())) continue;
			https.getHeader().put(entry.getKey(),entry.getValue());
		}
		String result;
		try {
			result = https.execute();
			return NanoHTTPD.newResponse(Status.OK, session.getHeaders().get("accept"),result);
		} catch (Exception e) {
			throw new NanoHTTPD.ResponseException(Status.INTERNAL_ERROR,"url ["+url+"] error["+e.getMessage()+"]");
		}
	}
	
	private String[] getHeadValues(){
		Map<String,Object> key=statusResource.status();
		List<String> heads=MapUtils.newArrayList();
		heads.add("serverName");
		heads.addAll(Arrays.asList(key.keySet().toArray(new String[]{})));
		heads.add("lastTime");
		heads.add("operator");
		return heads.toArray(new String[]{});
	}
	
	private Object[] getValues(String serverName,Map<String,Object> status){
		String[] heads=getHeadValues();
		Object[] values=new Object[heads.length];
		values[0]=serverName;
		for(int i=1;i<heads.length;i++){
			values[i]=status.get(heads[i]);
		}
		return values;
	}
	public static void main(String[] args) throws IOException {
		String result=Https.newGetHttps("http://127.0.0.1:9001/esb/cache").execute();
		System.out.println(result);
	}
}