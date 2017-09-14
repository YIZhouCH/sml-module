package org.hw;
import java.net.UnknownHostException;
import java.util.Date;

import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.status.rs.StatusResource;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.time.annotation.Scheduler;
import org.hw.sml.tools.DateTools;

@SmlResource("msg")
@Bean
public class Main {
	@SmlResource
	public Object msg(String msg){
		LoggerHelper.info(getClass(),msg);
		return msg;
	}
	@Scheduler("hour|29,33,35,46,39,51|00")
	public void task(){
		System.out.println(DateTools.sdf_mis.format(new Date()));
	}
	@Scheduler("min1")
	public void task2() throws UnknownHostException{
		Object obj=BeanHelper.getBean(StatusResource.class).status();
		LoggerHelper.debug(getClass(),obj.toString());
	}
	public static void main(String[] args) {
		BeanHelper.start();
	}
}
