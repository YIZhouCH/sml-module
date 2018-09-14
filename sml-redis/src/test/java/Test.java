

import java.util.Set;

import org.hw.sml.redis.JedisPoolFactory;
import org.hw.sml.redis.RedisCallback;
import org.hw.sml.redis.RedisPoolCacheManager;
import org.hw.sml.redis.RedisTemplate;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisSentinelPool;

public class Test {
	public static void main(String[] args) {
		JedisPool jedisPool=JedisPoolFactory.create("redis://eastcom!@#$@10.222.42.10:6380/0?maxTotal=1&maxActive=1&hostAndPorts=192.168.193.128:7002,192.168.193.128:7003,192.168.193.128:7004,192.168.193.128:7005,192.168.193.128:7006"); 
		RedisTemplate rt=new RedisTemplate(jedisPool);
		/*rt.execute(new RedisCallback<Object>() {
			public Object doJedisCallback(Jedis jedis) {
				jedis.hset("student","weiht","60.0");
				return null;
			}
		});*/
		System.out.println(rt.execute(new RedisCallback<Object>() {
			public Object doJedisCallback(Jedis jedis) {
				return jedis.hkeys("student");
			}
		}));
		System.out.println(rt.execute(new RedisCallback<Object>() {
			public Object doJedisCallback(Jedis jedis) {
				return jedis.keys("*");
			}
		}));
	}
}
