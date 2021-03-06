package org.hw.sml.status.client;

import org.hw.sml.status.rs.StatusResource;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Init;
import org.hw.sml.support.ioc.annotation.Inject;
import org.hw.sml.support.time.annotation.Scheduler;
import org.hw.sml.tools.Https;

import com.alibaba.fastjson.JSON;
@Bean("manageClientResource")
public class ClientResource {
	
	private String severUrl;
	
	@Inject("manage-status-resource")
	private StatusResource statusResource;
	
	@Init
	public void init(){
		severUrl=BeanHelper.getValue("server.master.url");
		if(severUrl!=null)LoggerHelper.getLogger().debug(getClass(),String.format("server.master.url[%s]",severUrl));
	}
	@Scheduler(Scheduler.min1)
	public void task(){
		try {
			if(severUrl==null){
				return;
			}
			String result=Https.newPostHttps(severUrl+"/regist").connectTimeout(2000).withReadTimeout(2000).body(JSON.toJSONString(statusResource.status())).execute();
			LoggerHelper.getLogger().debug(getClass(),"status sended! recieved->"+result);
		} catch (Exception e) {
			LoggerHelper.getLogger().error(getClass(),"status send error["+e.toString()+"]");
		}
	}

	public String getSeverUrl() {
		return severUrl;
	}

	public void setSeverUrl(String severUrl) {
		this.severUrl = severUrl;
	}
	
}
