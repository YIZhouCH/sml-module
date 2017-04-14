package org.hw.sml.status.rs;

import java.text.DecimalFormat;
import java.util.Enumeration;
import java.util.Map;

import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.status.helper.HtmlHelp;
import org.hw.sml.status.helper.SystemHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.tools.DateTools;
import org.hw.sml.tools.Maps;

@Bean("manage-status-resource")
@SmlResource("status")
public class StatusResource {
	public static DecimalFormat df=new DecimalFormat("#.##");
	@SmlResource
	public Map<String,Object> status(){
		return new Maps<String,Object>()
				.put("pid",SystemHelper.getPid())
				.put("host",SystemHelper.getHostName())
				.put("useMemory",df.format(SystemHelper.totalMemory()/1024.0/1024))
				.put("maxMemory",df.format(SystemHelper.maxMemory()/1024.0/1024))
				.put("useMemoryUtility",df.format(SystemHelper.useMemoryUtility()))
				//.put("availableProcessors",SystemHelper.availableProcessors())
				.put("upTime",DateTools.sdf_mi.format(SystemHelper.getStartTime()))
				.put("serverPort",SystemHelper.getServerPort())
				.put("serverContextPath",SystemHelper.getServerContextPath())
				.put("activeCount",SystemHelper.activeCount())
				.getMap();
	}
	@SmlResource(value="html",produces=SmlResource.TEXT_HTML)
	public String html(@Param(value="hasSystem",defaultValue="false")boolean hasSystem){
		HtmlHelp hh=new HtmlHelp();
		hh.append("status",new String[]{"properties","value"});
		for(Map.Entry<String,Object> entry:status().entrySet()){
			hh.append(new Object[]{entry.getKey(),entry.getValue()});
		}
		if(hasSystem){
			Enumeration<Object> keys=System.getProperties().keys();
			while(keys.hasMoreElements()){
				String key=keys.nextElement().toString();
				hh.append(new Object[]{key,System.getProperty(key)});
			}
		}
		return hh.endInnerBody().toString();
	}
}
