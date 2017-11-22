package org.hw.sml.http.test;

import java.util.Map;

import org.hw.sml.http.annotation.BodyParam;
import org.hw.sml.http.annotation.Http;
import org.hw.sml.http.annotation.PathParam;
import org.hw.sml.http.annotation.QueryParam;

@Http(url="${url}")
public interface HttpMapper {
	@Http(value="{status}",method=Http.METHOD_GET,headers={"accept=application/json; charset=utf-8"})
	public Map<String,Object> queryStatus(@PathParam("status")String status,@QueryParam("id")String query);
	
	@Http(value="test/{proxy}",method=Http.METHOD_POST)
	public String testBody(@PathParam("proxy")String proxy,@BodyParam Map<String,Object> requestBody);
	
	@Http(value="jdbc/query/{ifId}",method=Http.METHOD_POST)
	public String query(@PathParam("ifId")String idId,@BodyParam Map<String,String> params);
}
