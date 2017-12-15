package org.hw.sml.helper.plugin.jdbc.resource;

import java.io.IOException;

import org.hw.sml.core.DelegatedSqlMarkupAbstractTemplate;
import org.hw.sml.server.NanoHTTPD.IHTTPSession;
import org.hw.sml.support.ioc.annotation.Bean;

@Bean
public class SmlHelperService extends DelegatedSqlMarkupAbstractTemplate{
	
	public Object clear(String mark,IHTTPSession session) throws IOException{
		int result=0;
		if(mark.equals("all")){
			result=clear("");
		}else{
			result=clear(mark);
		}
		return "delete "+result+" success! <a href='../cache/all'>back</a>";
	}
}
