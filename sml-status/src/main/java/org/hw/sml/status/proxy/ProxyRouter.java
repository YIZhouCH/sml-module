package org.hw.sml.status.proxy;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.hw.sml.tools.DateTools;
import org.hw.sml.tools.MapUtils;

public class ProxyRouter {
	public static String getProxyUrl(int expires, Map<String,Map<String,Object>> sources,String serverContextPath){
		String url=null;
		String[] urls=getProxyUrls(expires, sources, serverContextPath);
		if(urls.length>0){
			url=urls[0];
		}
		return url;
	}
	public static String[] getProxyUrls(int expires, Map<String,Map<String,Object>> sources,String serverContextPath){
		LinkedList<String> url=new LinkedList<String>();
		double d=100000d;
		for(Map.Entry<String,Map<String,Object>> entry:sources.entrySet()){
			if(hasTimeExpire(expires,entry.getValue().get("lastTime").toString())) continue;
			String httpUrl=entry.getKey();
			String contexpath=httpUrl.substring(httpUrl.lastIndexOf("/")+1);
			if(serverContextPath.equals(contexpath)){
				if(d>Double.parseDouble(entry.getValue().get("useMemoryUtility").toString())){
					url.addFirst(httpUrl);
				}else{
					url.addLast(httpUrl);
				}
			}
		}
		return url.toArray(new String[]{});
	}
	public static boolean hasTimeExpire(int expires,String lastTime){
		return System.currentTimeMillis()-DateTools.parse(lastTime).getTime()>expires;
	}
	
	
}
