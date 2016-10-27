package org.hw.sml.helper;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.annotation.SmlResource;
import org.hw.sml.manager.service.RcptBaseService;
import org.hw.sml.support.cache.CacheManager;
import org.hw.sml.tools.MapUtils;
import org.springframework.stereotype.Service;

@Service
@SmlResource
public class SmlHelperService extends RcptBaseService{
	
	public void clear(String mark,HttpServletRequest request,HttpServletResponse response) throws IOException{
		response.setContentType("text/html;charset=utf-8");
		int i=0;
		if(mark.equals("all")){
			i=clear("");
		}else{
			i=clear(mark);
		}
		response.getWriter().print("delete ["+i+"] success! <a href='../cache/all'>back</a>");
	}
	
	public void cache(String mark,HttpServletRequest request,HttpServletResponse response) throws IOException{
		response.setContentType("text/html;charset=utf-8");
		PrintWriter print=response.getWriter();
		HtmlHelp ht=new HtmlHelp();
		ht.append("sml cache manager",new String[]{"接口名","缓存数","操作"});
		CacheManager cm=getSqlMarkupTemplate().getCacheManager();
		String cacheStart=getSqlMarkupTemplate().CACHE_PRE+":";
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
		ht.append("<br>本次缓存接口数:"+caches.size()+",<a href='../clear/all'>清空</a>");
		ht.endInnerBody();
		print.print(ht.toString());
	}
	
	//public void 
	
}
