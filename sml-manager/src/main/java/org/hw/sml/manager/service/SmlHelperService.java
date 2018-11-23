package org.hw.sml.manager.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.core.SqlMarkupAbstractTemplate;
import org.hw.sml.manager.tools.HtmlHelp;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.SmlAppContextUtils;
import org.hw.sml.support.cache.CacheManager;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.tools.MapUtils;

@Bean
@SmlResource
public class SmlHelperService extends RcptBaseService{
	
	public void clear(String mark,HttpServletRequest request,HttpServletResponse response) throws IOException{
		response.setContentType("text/html;charset=utf-8");
		int result=0;
		if(mark.equals("all")){
			result=0;
		}else{
			CacheManager cm=SmlAppContextUtils.getSqlMarkupAbstractTemplate().getCacheManager();
			String cacheStart=SqlMarkupAbstractTemplate.CACHE_PRE+":"+(mark.equals("all")?"":mark);
			Map<String,Object> obj=cm.getKeyStart(cacheStart);
			Map<String,Integer> caches=MapUtils.newLinkedHashMap();
			for(String keyt:obj.keySet()){
				String key=keyt.split(":")[1];
				if(!caches.keySet().contains(key)){
					caches.put(key,1);
				}else{
					caches.put(key, caches.get(key)+1);
				}
			}
			for(String key:caches.keySet())
			result+=clear(key);
		}
		response.getWriter().print("delete "+result+" success! <a href='../cache/all'>back</a>");
	}
	
	public void cache(String mark,HttpServletRequest request,HttpServletResponse response) throws IOException{
		response.setContentType("text/html;charset=utf-8");
		PrintWriter print=response.getWriter();
		HtmlHelp ht=new HtmlHelp();
		ht.append("sml cache manager",new String[]{"接口名","缓存数","操作"});
		CacheManager cm=SmlAppContextUtils.getSqlMarkupAbstractTemplate().getCacheManager();
		String cacheStart=SqlMarkupAbstractTemplate.CACHE_PRE+":"+(mark.equals("all")?"":mark);
		Map<String,Object> obj=cm.getKeyStart(cacheStart);
		Map<String,Integer> caches=MapUtils.newLinkedHashMap();
		for(String keyt:obj.keySet()){
			String key=keyt.split(":")[1];
			if(!caches.keySet().contains(key)){
				caches.put(key,1);
			}else{
				caches.put(key, caches.get(key)+1);
			}
		}
		for(Map.Entry<String,Integer> entry:caches.entrySet()){
			if(mark.equals("all")||entry.getKey().contains(mark))
			ht.append(new String[]{entry.getKey(),String.valueOf(entry.getValue()),"<a href='../clear/"+entry.getKey()+"'>清空</a>"});
		}
		ht.append("<br>本次缓存接口数:"+caches.size()+(mark.equals("all")?"":",<a href='../clear/"+mark+"'>清空</a>"));
		ht.endInnerBody();
		print.print(ht.toString());
	}
	
}
