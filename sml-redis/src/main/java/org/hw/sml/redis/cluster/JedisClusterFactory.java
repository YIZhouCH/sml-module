package org.hw.sml.redis.cluster;

import java.util.HashSet;
import java.util.Set;

import org.hw.sml.redis.sentinel.JedisSentinelFactory;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Urls;

import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.JedisPoolConfig;

public class JedisClusterFactory {
	public static JedisCluster create(String url){
		Urls urls=new Urls(url);
		JedisPoolConfig jpc=new JedisPoolConfig();
		try {
			ClassUtil.mapToBean(urls.getParams(),jpc);
		} catch (Exception e) {
			e.printStackTrace();
		}
		int timeout=MapUtils.getInt(urls.getParams(),"timeout",10*1000);
		String hostAndPortst=urls.getParams().get("hostAndPorts");
		Set<HostAndPort> hps=new HashSet<HostAndPort>();
		hps.add(new HostAndPort(urls.getHost(),urls.getPort()));
		if(hostAndPortst!=null){
			String[] hostAndPorts=hostAndPortst.split(",");
			for(String hp:hostAndPorts){
				String[] haps=hp.split(":");
				hps.add(new HostAndPort(haps[0],Integer.parseInt(haps[1])));
			}
		}
		JedisCluster cluster=new JedisCluster(hps,MapUtils.getInt(urls.getParams(),"connectionTimeout",timeout),timeout,MapUtils.getInt(urls.getParams(),"maxAttempts",hps.size()),urls.getPassword(),jpc);
		LoggerHelper.debug(JedisSentinelFactory.class,"create JedisCluster {"+hps+"}");
		return cluster;
	}
}
