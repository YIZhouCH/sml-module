package org.hw.sml.status.rs;

import java.io.File;
import java.nio.charset.Charset;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.status.helper.HtmlHelp;
import org.hw.sml.status.helper.SystemHelper;
import org.hw.sml.status.tools.Files;
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
	@SmlResource("log")
	public Object log(@Param(value="charset",defaultValue="utf-8")String charset,
			@Param(value="filepath")String filepath,
			@Param(value="lastNum",defaultValue="200")int lastNum,
			@Param(value="from",defaultValue="0")int from,
			@Param("words")String word,
			@Param(value="isText",defaultValue="true")boolean isText){
		if(filepath==null||filepath.length()==0){
			File fileDir=new File(SystemHelper.getServerDirLog());
			if(fileDir.exists()){
				List<String> files=Arrays.asList(new File(SystemHelper.getServerDirLog()).list());
				if(files.size()>0&&files.get(0).contains("-")){
					filepath=SystemHelper.getServerDirLog()+"/debug-"+new SimpleDateFormat("yyyy-MM-dd").format(new Date())+".log";
				}else{
					filepath=SystemHelper.getServerDirLog()+"/debug.log";
				}
			}
		}
		if(!isText)
		 return Files.readLastNLine(new File(filepath),Charset.forName(charset),lastNum,from,word);
		else
		 return Files.readLastNLineString(new File(filepath),Charset.forName(charset),lastNum,from,word);
	}
}
