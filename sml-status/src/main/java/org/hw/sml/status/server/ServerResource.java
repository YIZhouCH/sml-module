package org.hw.sml.status.server;

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
	public Map<String,Map<String,Object>> sources=MapUtils.newHashMap();
	
	@Inject("manage-status-resource")
	private StatusResource statusResource;
	
	@SmlResource("clearAll")
	public Object clear(){
		sources.clear();
		return "1";
	}
	@SmlResource("sources")
	public Object source(){
		return sources.values();
	}
	@SmlResource(value="clear",produces=SmlResource.TEXT_HTML)
	public Object remove(@Param("key")String key){
		sources.remove(key);
		return 1;
	}
	@SmlResource(value="regist",method=SmlResource.POST)
	public Object regist(@Body Map<String,Object> status,IHTTPSession session){
		status.put("lastTime",DateTools.sdf_mi().format(new Date()));
		status.put("remoteIp",session.getRemoteIpAddress());
		sources.put("http://"+session.getRemoteIpAddress()+":"+status.get("serverPort")+"/"+(status.get("serverContextPath")==null?"":status.get("serverContextPath")), status);
		return "1";
	}
	@SmlResource("proxy/(.*?)")
	public Object proxy(IHTTPSession session) throws ResponseException, Exception{
		String uri=session.getUri().replace("/"+SystemHelper.getServerContextPath()+"/server/proxy/","");
		String httpUrl=session.getParms().get("realUrl");
		List<String> urlHttp=MapUtils.newArrayList();
		String serverContextPath=uri.split("/")[0];
		if((httpUrl==null||httpUrl.length()==0)){
			urlHttp=Arrays.asList(ProxyRouter.getProxyUrls(MapUtils.getInt(session.getParms(),"expires",65)*1000,sources, serverContextPath));
		}
		if(httpUrl.isEmpty()){
			throw new NanoHTTPD.ResponseException(Status.NOT_FOUND,"source not found or expired!");
		}else{
			httpUrl=urlHttp.get(0);
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
		if(urlHttp.size()>1){
			List<Https.Failover> failovers=MapUtils.newArrayList();
			for(String uh:urlHttp){
				Https.Failover failover=new Https.Failover(uh+uri.substring(uri.indexOf("/")), MapUtils.getInt(session.getParms(),"retry",1), MapUtils.getInt(session.getParms(),"timewait",0));
				failovers.add(failover);
			}
			https.failover(failovers.toArray(new Https.Failover[0]));
		}
		https.getParamer().param(session.getQueryParameterString());
		List<String> blacklist=Arrays.asList(new String[]{"accept-encoding"});
		for(Map.Entry<String,String> entry:session.getHeaders().entrySet()){
			if(blacklist.contains(entry.getKey().toLowerCase())) continue;
			https.getHeader().put(entry.getKey(),entry.getValue());
		}
		https.getHeader().put("x-forwarded-for",session.getRemoteIpAddress());
		String result;
		try {
			result = https.execute();
			return NanoHTTPD.newResponse(Status.OK, session.getHeaders().get("accept"),result);
		} catch (Exception e) {
			throw new NanoHTTPD.ResponseException(Status.INTERNAL_ERROR,"url ["+url+"] error["+e.getMessage()+"]");
		}
	}
}
