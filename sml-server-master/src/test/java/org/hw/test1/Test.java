package org.hw.test1;

import java.util.Set;

import org.hw.sml.redis.JedisPoolFactory;
import org.hw.sml.redis.RedisCallback;
import org.hw.sml.redis.RedisTemplate;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

public class Test {
	public static void main(String[] args) {
		JedisPool jedisPool=JedisPoolFactory.create("redis://wenjimmy@localhost:16379/1?maxTotal=10"); 
		RedisTemplate rt=new RedisTemplate(jedisPool);
		for(int i=1;i<1000;i++)
		System.out.println(rt.execute(new RedisCallback<Set<String>>() {
			public Set<String> doJedisCallback(Jedis jedis) {
				return jedis.keys("*");
			}
		}));
	}
}
