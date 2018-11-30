package org.hw.sml.redis;

import org.hw.sml.redis.cluster.JedisClusterFactory;
import org.hw.sml.redis.sentinel.JedisSentinelFactory;
import org.hw.sml.tools.Assert;
import org.hw.sml.tools.Urls;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisSentinelPool;

public class RedisTemplate {
	public static  enum RT{
		jedis,jedisPool,jedisSentinelPool,jedisCluster
	}
	private Jedis jedis;
	private RT rt=RT.jedis;
	private JedisPool jedisPool;
	private JedisSentinelPool jedisSentinelPool;
	private JedisCluster jedisCluster;
	private String url;
	public RedisTemplate(){
	}
	public RedisTemplate(String url){
		this.url=url;
		init();
	}
	public void init(){
		Urls urls=new Urls(url);
		if(urls.getParams().get("master")!=null){
			this.jedisSentinelPool=JedisSentinelFactory.create(url);
			rt=RT.jedisSentinelPool;
		}else if(urls.getParams().get("hostAndPorts")!=null){
			this.jedisCluster=JedisClusterFactory.create(url);
			rt=RT.jedisCluster;
		}else{
			this.jedisPool=JedisPoolFactory.create(url);
			rt=RT.jedisPool;
		}
	}
	public RedisTemplate(JedisPool jedisPool){
		this.jedisPool=jedisPool;
		rt=RT.jedisPool;
	}
	public RedisTemplate(Jedis jedis){
		this.jedis=jedis;
	}
	public RedisTemplate(JedisSentinelPool jedisSentinelPool){
		this.jedisSentinelPool=jedisSentinelPool;
		rt=RT.jedisSentinelPool;
	}
	public Jedis getResource(){
		Jedis jd=null;
		switch (rt) {
		case jedisPool:
			jd=this.jedisPool.getResource();
			break;
		case jedisSentinelPool:
			jd=this.jedisSentinelPool.getResource();
			break;
		default:
			jd=this.jedis;
			break;
		}
		Assert.notNull(jd,"jedis or poolJedis or jedisSentinelPool is not null!");
		return jd;
	}
	public JedisCluster getCluster(){
		return this.jedisCluster;
	}
	public <T> T execute(RedisCallback<T> call){
		Jedis jedise=null;
		try{
			jedise=getResource();
			return call.doJedisCallback(jedise);
		}catch(Exception e){
			throw new RuntimeException(e);
		}finally{
			if(jedise!=null)
				close(jedise);
		}
	}
	public void close(Jedis jedise) {
		jedise.close();
	}
	public void destroy(){
		if(jedisPool!=null){
			jedisPool.close();
		}
		if(jedisSentinelPool!=null){
			jedisPool.close();
		}
		if(jedisCluster!=null){
			try {
					jedisCluster.close();
			} catch (Exception e) {
				e.printStackTrace();
			};
			}
	}
	public RT getRt() {
		return rt;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	
}	
