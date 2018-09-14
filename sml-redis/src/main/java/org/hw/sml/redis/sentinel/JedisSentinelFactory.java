package org.hw.sml.redis.sentinel;

import java.io.ObjectInputStream.GetField;
import java.util.HashSet;
import java.util.Set;

import org.hw.sml.support.LoggerHelper;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Urls;

import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisSentinelPool;

public class JedisSentinelFactory {
	public static JedisSentinelPool create(String url){
		Urls urls=new Urls(url);
		JedisPoolConfig jpc=new JedisPoolConfig();
		try {
			ClassUtil.mapToBean(urls.getParams(),jpc);
		} catch (Exception e) {
			e.printStackTrace();
		}
		int timeout=MapUtils.getInt(urls.getParams(),"timeout",10*1000);
		String hostAndPortst=urls.getParams().get("hostAndPorts");
		Set<String> hps=new HashSet<String>();
		hps.add(urls.getHost()+":"+urls.getPort());
		if(hostAndPortst!=null){
			String[] hostAndPorts=hostAndPortst.split(",");
			for(String hp:hostAndPorts){
				hps.add(hp);
			}
		}
		LoggerHelper.debug(JedisSentinelFactory.class,"create JedisSentinelPool {"+hps+"}");
		return new JedisSentinelPool(MapUtils.getString(urls.getParams(),"master","mymaster"),hps,jpc,timeout,urls.getPassword(),Integer.parseInt(urls.getPrePath()));
	}
}
