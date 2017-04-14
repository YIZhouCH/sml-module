package org.hw.sml.status.proxy;

import java.util.Map;

import org.hw.sml.tools.DateTools;

public class ProxyRouter {
	public static final long TIME_EXPIRE=65000;
	public static String getProxyUrl(Map<String,Map<String,Object>> sources,String serverContextPath){
		String url=null;
		double d=100000d;
		for(Map.Entry<String,Map<String,Object>> entry:sources.entrySet()){
			if(hasTimeExpire(entry.getValue().get("lastTime").toString())) continue;
			String httpUrl=entry.getKey();
			String contexpath=httpUrl.substring(httpUrl.lastIndexOf("/")+1);
			if(serverContextPath.equals(contexpath)){
				if(d>Double.parseDouble(entry.getValue().get("useMemoryUtility").toString())){
					url=httpUrl;
				}
			}
		}
		return url;
	}
	public static boolean hasTimeExpire(String lastTime){
		return System.currentTimeMillis()-DateTools.parse(lastTime).getTime()>TIME_EXPIRE;
	}
	
	
}
