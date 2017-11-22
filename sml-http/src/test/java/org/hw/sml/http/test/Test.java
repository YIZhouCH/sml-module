package org.hw.sml.http.test;

import java.io.IOException;

import org.hw.sml.component.RcptFastJsonMapper;
import org.hw.sml.http.HttpMapperFactory;
import org.hw.sml.tools.Maps;

public class Test {
	public static void main(String[] args) throws IOException {
		//System.out.println(Https.newGetHttps("http://localhost:1202/master/status").execute());
		HttpMapper ht=new HttpMapperFactory(new RcptFastJsonMapper()).getMapper(HttpMapper.class);
		System.out.println(ht.queryStatus("status","name"));
		
		System.out.println(ht.testBody("proxy1", new Maps<String,Object>().put("a", 1).getMap()));
		System.out.println(ht.query("area-pm",new Maps<String,String>().getMap()));
		
	}
	
}
