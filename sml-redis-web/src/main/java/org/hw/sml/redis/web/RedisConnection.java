package org.hw.sml.redis.web;

import java.io.Serializable;
import java.util.Set;

import org.hw.sml.redis.RedisCallback;
import org.hw.sml.redis.RedisTemplate;
import org.hw.sml.tools.SerializationUtils;

import redis.clients.jedis.Jedis;

public class RedisConnection{
	private RedisTemplate redisTemplate;
	public RedisConnection(String url){
		redisTemplate=new RedisTemplate(url);
	}
	public RedisConnection(RedisTemplate redisTemplate){
		this.redisTemplate=redisTemplate;
	}

	public Long hset(final String key,final String field,final Serializable object) {
		return redisTemplate.execute(new RedisCallback<Long>() {
			public Long doJedisCallback(Jedis jedis) {
				return jedis.hset(key.getBytes(),field.getBytes(),SerializationUtils.serialize(object));
			}
		});
	}

	public Object hget(final String key,final String field) {
		return redisTemplate.execute(new RedisCallback<Object>() {
			public Object doJedisCallback(Jedis jedis) {
				byte[] b=jedis.hget(key.getBytes(), field.getBytes());
				if(b!=null)
					return SerializationUtils.deserialize(b);
				return null;
			}
		});
	}

	public Long del(final String... keys) {
		return redisTemplate.execute(new RedisCallback<Long>() {
			public Long doJedisCallback(Jedis jedis) {
				return jedis.del(keys);
			}
		});
	}

	public Long hdel(final String key,final String... fields) {
		return redisTemplate.execute(new RedisCallback<Long>() {
			public Long doJedisCallback(Jedis jedis) {
				return jedis.hdel(key, fields);
			}
		});
	}

	public Long expire(final String key, final int seconds) {
		return redisTemplate.execute(new RedisCallback<Long>() {
			public Long doJedisCallback(Jedis jedis) {
				return jedis.expire(key, seconds);
			}
		});
	}

	public Set<String> hkeys(final String key) {
		return redisTemplate.execute(new RedisCallback<Set<String>>() {
			public Set<String> doJedisCallback(Jedis jedis) {
				return jedis.hkeys(key);
			}
		});
	}

	public Boolean exists(final String key) {
		return redisTemplate.execute(new RedisCallback<Boolean>() {
			public Boolean doJedisCallback(Jedis jedis) {
				return jedis.exists(key);
			}
		});
	}
	
}
