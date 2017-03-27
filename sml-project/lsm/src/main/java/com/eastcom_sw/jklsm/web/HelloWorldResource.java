package com.eastcom_sw.jklsm.web;

import java.util.LinkedHashMap;
import java.util.Map;

import org.hw.sml.manager.service.RcptBaseService;
import org.hw.sml.rest.annotation.Body;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.PathParam;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ioc.annotation.Bean;

@SmlResource("helloworld")
@Bean
public class HelloWorldResource extends RcptBaseService{
	@SmlResource(value="aaaa/{path1}/{path2}",method=SmlResource.POST)
	public Object query(
			@PathParam("path1") String path1,
			@PathParam("path2") String path2,
			@Param(value="a",defaultValue="123")int a,
			@Body Map<String,Object> params){
		return path1+":"+path2+":"+a+":"+params;
	}
	@SmlResource("hw")
	public Object query2(LinkedHashMap<String,Object> map){
		return map;
	}
	@SmlResource("/query")
	public Object query3() throws InterruptedException{
		return getJdbc("defJt").queryForList("select * from dual");
	}

}
