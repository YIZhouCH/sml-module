package org.hw.bean;

import java.util.LinkedHashMap;

import org.hw.sml.core.SqlMarkupAbstractTemplate;
import org.hw.sml.rest.annotation.Body;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.PathParam;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Inject;


@SmlResource("helloworld")
@Bean
public class HelloWorldResource{
	@Inject
	private SqlMarkupAbstractTemplate sqlMarkupAbstractTemplate;
	@SmlResource(value="aaaa/{path1}/{path2}",method=SmlResource.POST)
	public Object query(
			@PathParam("path1") String path1,
			@PathParam("path2") String path2,
			@Param(value="a",defaultValue="123")int a,
			@Body String body){
		return path1+":"+path2+":"+a+":"+body;
	}
	@SmlResource("hw")
	public Object query2(LinkedHashMap<String,Object> map){
		return map;
	}
	@SmlResource("/query")
	public Object query3() throws Exception{
		return sqlMarkupAbstractTemplate.getSmlContextUtils().query("area-pm", "");
	}
	public static void main(String[] args) {
		BeanHelper.start();
	}
}
