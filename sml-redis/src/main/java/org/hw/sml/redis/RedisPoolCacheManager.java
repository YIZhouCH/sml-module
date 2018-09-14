package org.hw.sml.redis;

import java.io.Serializable;
import java.nio.charset.Charset;
import java.util.Map;
import java.util.Set;

import org.hw.sml.support.cache.CacheManager;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.SerializationUtils;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

public class RedisPoolCacheManager implements CacheManager{
	protected boolean useKeys=true;
	
	protected String cacheKeysKey="sml:keys";
	
	protected String url;
	
	protected JedisPool jedisPool;
	
	protected RedisTemplate redisTemplate;
	
	public void init() {
		if(url!=null&&jedisPool==null){
			jedisPool=JedisPoolFactory.create(url);
		}
		redisTemplate=new RedisTemplate(jedisPool);
	}
	@Override
	public void destroy() {
		jedisPool.destroy();
	}
	@Override
	public Object get(final String key) {
		return redisTemplate.execute(new RedisCallback<Object>() {
			public Object doJedisCallback(Jedis jedis) {
				byte[] bytes=jedis.get(toByte(key));
				if(bytes==null)
					return null;
				return SerializationUtils.deserialize(bytes);
			}
		});
	}

	@Override
	public void set(final String key,final Object value,final int minutes) {
		if(value!=null)
		redisTemplate.execute(new RedisCallback<Object>() {
			public Object doJedisCallback(Jedis jedis) {
				jedis.set(toByte(key),SerializationUtils.serialize((Serializable)value));
				if(minutes>0)
				jedis.expire(toByte(key), minutes*60);
				if(!useKeys){
					jedis.hset(cacheKeysKey,key,String.valueOf(System.currentTimeMillis()));
				}
				return null;
			}
		});
	}

	@Override
	public boolean contain(final String key) {
		return redisTemplate.execute(new RedisCallback<Boolean>() {
			public Boolean doJedisCallback(Jedis jedis) {
				return jedis.exists(toByte(key));
			}
		});
	}

	@Override
	public void remove(final String key) {
	   redisTemplate.execute(new RedisCallback<Object>() {
			public Object doJedisCallback(Jedis jedis) {
				return jedis.del(toByte(key));
			}
		});
	}

	@Override
	public int clearKeyStart(final String keyStart) {
		if(keyStart==null||keyStart.trim().length()==0)
			return 0;
		return redisTemplate.execute(new RedisCallback<Integer>() {
			public Integer doJedisCallback(Jedis jedis) {
				if(useKeys){
					Set<String> keys=jedis.keys(keyStart+"*");
					long size=jedis.del(keys.toArray(new String[]{}));
					return (int)size;
				}else{
					Set<String> keys=getKeyStart(keyStart).keySet();
					for(String key:keys){
						jedis.del(key);
					}
					return keys.size();
				}
			}
		});
	}

	@Override
	public Map<String,Object> getKeyStart(final String keyStart) {
		return redisTemplate.execute(new RedisCallback<Map<String, Object>>() {
			public Map<String, Object> doJedisCallback(Jedis jedis) {
				Map<String,Object> result=MapUtils.newLinkedHashMap();
				if(useKeys){
					Set<String> keys=jedis.keys(keyStart+"*");
					for(String key:keys){
						result.put(key,null);
					}
				}else{
					Set<String> keys=jedis.hkeys(cacheKeysKey);
					for(String key:keys){
						if(jedis.exists(key)){
							result.put(key,null);
						}else{
							jedis.del(key);
						}
					}
				}
				return result;
			}
		});
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
	public boolean isUseKeys() {
		return useKeys;
	}
	public void setUseKeys(boolean useKeys) {
		this.useKeys = useKeys;
	}
	public String getCacheKeysKey() {
		return cacheKeysKey;
	}
	public void setCacheKeysKey(String cacheKeysKey) {
		this.cacheKeysKey = cacheKeysKey;
	}
	
}
