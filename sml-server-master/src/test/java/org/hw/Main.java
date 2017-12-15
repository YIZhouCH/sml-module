package org.hw;
import java.net.UnknownHostException;

import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.status.rs.StatusResource;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.cache.CacheManager;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.time.SchedulerPanner;
import org.hw.sml.support.time.annotation.Scheduler;

@SmlResource("msg")
@Bean
public class Main {
	@SmlResource
	public Object msg(String msg){
		LoggerHelper.info(getClass(),msg);
		return msg;
	}
	@Scheduler("min1")
	public void task3(){
		LoggerHelper.getLogger().debug(getClass(),"1");
	}
	//@Scheduler("min1")
	public void task2() throws UnknownHostException, InterruptedException{
		Object obj=null;
		StatusResource sr=BeanHelper.getBean(StatusResource.class);
		for(int i=0;i<10000;i++){
		 obj=sr.status();
		}
		LoggerHelper.debug(getClass(),BeanHelper.getBean(SchedulerPanner.class).getTaskMapContain()+"----"+BeanHelper.getBean(SchedulerPanner.class).getTaskMapStatus()+"----"+obj.toString());
		Thread.sleep(100000);
	}
	public static void main(String[] args) {
		BeanHelper.start();
		System.out.println(BeanHelper.getBean(CacheManager.class).getKeyStart("jdbc"));
	}
}
