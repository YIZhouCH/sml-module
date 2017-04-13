package org.hw.sml.status.server;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hw.sml.rest.annotation.Body;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.server.NanoHTTPD.IHTTPSession;
import org.hw.sml.status.helper.HtmlHelp;
import org.hw.sml.status.rs.StatusResource;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Inject;
import org.hw.sml.tools.DateTools;
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
		hh.append("server-client-manager",getHeadValues());
		hh.append(getValues("server",statusResource.status()));
		for(Map.Entry<String,Map<String,Object>> entry:sources.entrySet()){
			Object[] values=getValues(entry.getKey(),entry.getValue());
			values[values.length-1]="<a href='./server/clear?key="+entry.getKey()+"'> remove</a>";
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
		sources.put(session.getRemoteHostName()+"("+session.getRemoteIpAddress()+"):"+status.get("serverPort"), status);
		return "1";
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
}
