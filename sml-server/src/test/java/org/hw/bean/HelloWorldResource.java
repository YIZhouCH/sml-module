package org.hw.bean;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.LinkedHashMap;

import org.hw.sml.FrameworkConstant;
import org.hw.sml.context.Context;
import org.hw.sml.core.SqlMarkupAbstractTemplate;
import org.hw.sml.rest.annotation.Body;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.PathParam;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.server.NanoHTTPD;
import org.hw.sml.server.NanoHTTPD.IHTTPSession;
import org.hw.sml.server.NanoHTTPD.Response;
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
	@SmlResource(value="/export",produces=SmlResource.OCTET_STREAM)
	public Response export(@Param("User-Agent")String userAgent,IHTTPSession session) throws FileNotFoundException, UnsupportedEncodingException{
		InputStream is=new  FileInputStream("d:/temp/RdbmsTable.xlsx");
		return NanoHTTPD.newStreamResponse(is).export("表名称.xlsx", userAgent);
	}
	@SmlResource(value="import",produces=SmlResource.TEXT_PLAIN)
	public String importXls(IHTTPSession session) throws IOException{
		String filename=session.getFiles().get("file");
		return "success";
	}
	public static void main(String[] args) {
		BeanHelper.start();
	}
}
