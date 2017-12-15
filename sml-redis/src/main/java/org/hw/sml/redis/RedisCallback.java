package org.hw.sml.redis;

import redis.clients.jedis.Jedis;

public interface RedisCallback<T> {
	public   T doJedisCallback(Jedis jedis);
}
