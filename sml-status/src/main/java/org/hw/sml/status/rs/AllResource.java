package org.hw.sml.status.rs;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.hw.sml.context.Context;
import org.hw.sml.context.Context.Source;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.status.helper.HtmlHelp;
import org.hw.sml.status.helper.SystemHelper;
import org.hw.sml.status.server.ServerResource;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.tools.MapUtils;

@Bean("manage-resource")
@SmlResource("resource")
public class AllResource {
	@SmlResource
	public Map<String,Object> source(){
		Map<String,Object> result=MapUtils.newLinkedHashMap();
		result.put("contextPath",SystemHelper.getServerContextPath());
		List<Map<String,Object>> subResult=MapUtils.newArrayList();
		for(Map.Entry<String,Source> entry:Context.urlMapper.entrySet()){
			Map<String,Object> s=MapUtils.newLinkedHashMap();
			s.put("uri",entry.getKey());
			s.put("method",entry.getValue().getRequestMethods());
			s.put("params",Arrays.asList(entry.getValue().getPaths()));
			Object bean=entry.getValue().getBean();
			if(bean instanceof AllResource||bean instanceof StatusResource||bean instanceof ServerResource){}
			else
			subResult.add(s);
		}
		result.put("sources",subResult);
		return result;
	}
	@SmlResource(value="html",produces=SmlResource.TEXT_HTML)
	public String html(){
		HtmlHelp hh=new HtmlHelp();
		hh.append("<h3>server.contextPath:"+SystemHelper.getServerContextPath()+"</h3>");
		hh.append("resource",new String[]{"uri","method","other"});
		for(Map<String,Object> m:(List<Map<String,Object>>)source().get("sources")){
			hh.append(new Object[]{m.get("uri"),m.get("method"),m.get("params")});
		}
		return hh.endInnerBody().toString();
	}
}
