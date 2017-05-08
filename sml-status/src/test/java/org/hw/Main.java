package org.hw;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;

@SmlResource("msg")
@Bean
public class Main {
	@SmlResource
	public Object msg(String msg){
		LoggerHelper.info(getClass(),msg);
		return msg;
	}
	public static void main(String[] args) {
		BeanHelper.start();
	}
}
