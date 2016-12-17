package org.hw.sml.support;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.axis.MessageContext;
import org.apache.axis.transport.http.HTTPConstants;

public class Hw {
	
	public List<String[]> getFilePath(List<String[]> params){
		System.out.println(getIp());
		return params;
	}
	private Object getIp() {
	    MessageContext mc = MessageContext.getCurrentContext();  
        if(mc==null){  
            return null;  
        }else{  
            HttpServletRequest request = (HttpServletRequest) mc.getProperty(HTTPConstants.MC_HTTP_SERVLETREQUEST);  
            return request.getRemoteAddr();  
        }  
	}
}
