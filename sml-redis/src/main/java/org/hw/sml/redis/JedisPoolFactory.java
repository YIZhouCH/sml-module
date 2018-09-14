package org.hw.sml.redis;

import org.hw.sml.redis.sentinel.JedisSentinelFactory;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Urls;

import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public  class JedisPoolFactory{
	public static JedisPool create(String url){
		Urls urls=new Urls(url);
		JedisPoolConfig jpc=new JedisPoolConfig();
		try {
			ClassUtil.mapToBean(urls.getParams(),jpc);
		} catch (Exception e) {
			e.printStackTrace();
		}
		int timeout=MapUtils.getInt(urls.getParams(),"timeout",10*1000);
		LoggerHelper.debug(JedisSentinelFactory.class,"create JedisPool {"+urls.getHost()+":"+urls.getPort()+"}");
		return new JedisPool(jpc,urls.getHost(),urls.getPort(),timeout,urls.getPassword(),Integer.parseInt(urls.getPath()));
	}
	
}