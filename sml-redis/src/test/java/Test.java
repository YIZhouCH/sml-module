

import java.util.Set;

import org.hw.sml.redis.JedisPoolFactory;
import org.hw.sml.redis.RedisCallback;
import org.hw.sml.redis.RedisPoolCacheManager;
import org.hw.sml.redis.RedisTemplate;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

public class Test {
	public static void main(String[] args) {
		//JedisPool jedisPool=JedisPoolFactory.create("redis://wenjimmy@localhost:16379/1?maxTotal=1"); 
		//RedisTemplate rt=new RedisTemplate(jedisPool);
		RedisPoolCacheManager cacheManager=new RedisPoolCacheManager();
		//cacheManager.setJedisPool(jedisPool);
		cacheManager.setUrl("redis://wenjimmy@localhost:16379/1?maxTotal=1&maxActive=1");
		cacheManager.init();
		for(int i=0;i<1;i++){
			final String t=i+"";
			//cacheManager.set("test:"+t, t, -1);
			/*System.out.println(rt.execute(new RedisCallback<Set<String>>() {
				public Set<String> doJedisCallback(Jedis jedis) {
					return jedis.keys("*");
				}
			}));*/
			System.out.println(cacheManager.getKeyStart(""));
		}
	}
}
