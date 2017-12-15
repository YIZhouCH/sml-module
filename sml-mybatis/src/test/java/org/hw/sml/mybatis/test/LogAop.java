package org.hw.sml.mybatis.test;

import org.hw.sml.support.aop.AbstractAspect;
import org.hw.sml.support.aop.Invocation;
import org.hw.sml.support.ioc.annotation.Bean;

@Bean
public class LogAop extends AbstractAspect{
	{
		setPackageMatchs("org.hw.sml.core.*.*");
	}

	public void doBefore(Invocation invocation)  throws Throwable{
		invocation.getExtInfo().put("start",System.currentTimeMillis());
	}
	public void doAfter(Invocation invocation)  throws Throwable{
		Long start=(Long) invocation.getExtInfo().get("start");
		System.out.println(invocation.getTarget().getClass().getName()+"."+invocation.getMethod().getName()+"耗时："+(System.currentTimeMillis()-start));
	}
	
}
