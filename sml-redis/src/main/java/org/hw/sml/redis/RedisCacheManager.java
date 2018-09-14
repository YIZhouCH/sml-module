package org.hw.sml.redis;

import java.io.Serializable;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hw.sml.redis.RedisTemplate.RT;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.SerializationUtils;

import redis.clients.jedis.JedisPool;

public class RedisCacheManager extends RedisPoolCacheManager{
	
	private RedisTemplate delegateRedisTemplate;
	
	private RT rt;
	
	public void init() {
		if(delegateRedisTemplate==null)
			delegateRedisTemplate=new RedisTemplate(url);
		super.redisTemplate=delegateRedisTemplate;
		this.rt=delegateRedisTemplate.getRt();
	}
	@Override
	public void destroy() {
		redisTemplate.destroy();
	}
	@Override
	public Object get(final String key) {
		if(rt.equals(RT.jedisCluster)){
			byte[] bytes=delegateRedisTemplate.getCluster().get(toByte(key));
			if(bytes==null){
				return null;
			}
			return SerializationUtils.deserialize(bytes);
		}else{
			return super.get(key);
		}
	}

	@Override
	public void set(final String key,final Object value,final int minutes) {
		if(value!=null){
			if(rt.equals(RT.jedisCluster)){
				delegateRedisTemplate.getCluster().set(toByte(key),SerializationUtils.serialize((Serializable)value));
				if(minutes>0)
				delegateRedisTemplate.getCluster().expire(toByte(key),minutes);
				delegateRedisTemplate.getCluster().hset(cacheKeysKey,key,String.valueOf(System.currentTimeMillis()));
			}else{
				super.set(key, value, minutes);
			}
		}
		
	}

	@Override
	public boolean contain(String key) {
		if(rt.equals(RT.jedisCluster)){
			return delegateRedisTemplate.getCluster().exists(toByte(key));
		}else{
			return super.contain(key);
		}
	}

	@Override
	public void remove(final String key) {
		if(rt.equals(RT.jedisCluster)){
			delegateRedisTemplate.getCluster().del(toByte(key));
		}else{
			super.remove(key);
		}
	}

	@Override
	public int clearKeyStart(final String keyStart) {
		if(keyStart==null||keyStart.trim().length()==0)
			return 0;
		if(rt.equals(RT.jedisCluster)){
			Map<String,Object> ks=getKeyStart(keyStart);
			for(String key:ks.keySet()){
				remove(key);
			}
			return ks.size();
		}else{
			return super.clearKeyStart(keyStart);
		}
	}

	@Override
	public Map<String,Object> getKeyStart(final String keyStart) {
		if(rt.equals(RT.jedisCluster)){
			Set<String> keys=delegateRedisTemplate.getCluster().hkeys(cacheKeysKey);
			Map<String,Object> ks=MapUtils.newHashMap();
			List<String> kes=MapUtils.newArrayList();
			for(String key:keys){
				if(key.startsWith(keyStart)){
					if(contain(key))
						ks.put(key,null);
					else{
						kes.add(key);
						remove(key);
					}
				}
			}
			
			return ks;
		}else{
			return super.getKeyStart(keyStart);
		}
	}
	@Override
	public int clear() {
		return 0;
	}
	public byte[] toByte(String name){
		return name.getBytes(Charset.forName("utf8"));
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public void setJedisPool(JedisPool jedisPool) {
		this.jedisPool = jedisPool;
	}
	public String getCacheKeysKey() {
		return cacheKeysKey;
	}
	public void setCacheKeysKey(String cacheKeysKey) {
		this.cacheKeysKey = cacheKeysKey;
	}
	
}
