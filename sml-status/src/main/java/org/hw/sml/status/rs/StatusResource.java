package org.hw.sml.status.rs;

import java.io.File;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.charset.Charset;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
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
	public Map<String,Object> status() throws UnknownHostException{
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
				.put("remoteIp",InetAddress.getLocalHost().getHostAddress())
				.getMap();
	}
	
	@SmlResource(value="log")
	public Object log(@Param(value="charset",defaultValue="utf-8")String charset,
			@Param(value="filepath")String filepath,
			@Param(value="lastNum",defaultValue="200")int lastNum,
			@Param(value="from",defaultValue="0")int from,
			@Param("words")String word,
			@Param(value="isText",defaultValue="true")boolean isText){
		if((filepath==null||filepath.length()==0)){
			File fileDir=new File(SystemHelper.getServerDirLog());
			if(fileDir.exists()){
				List<String> files=Arrays.asList(new File(SystemHelper.getServerDirLog()).list());
				if(!isLog4j(files)){
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
	
	private boolean isLog4j(List<String> files){
		for(String file:files){
			if(file.contains("-")){
				return false;
			}
		}
		return true;
	}
}
