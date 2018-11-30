import org.hw.sml.redis.RedisCallback;
import org.hw.sml.redis.RedisTemplate;
import org.hw.sml.support.time.StopWatch;

import redis.clients.jedis.Jedis;


public class CommonTest {
	
	public static void main(String[] args) {
		StopWatch sw=new StopWatch("redis");
		String senUrl="redis://wenjimmy@192.168.193.128:26380/0?master=mymaster&maxTotal=1&maxActive=1&hostAndPorts=192.168.193.128:26381,192.168.193.128:26379";
		sw.start("Sentinels");
		RedisTemplate rt1=new RedisTemplate(senUrl);
		for(int i=0;i<10000;i++){
			Object keys=rt1.execute(new RedisCallback<Object>() {
				public Object doJedisCallback(Jedis jedis) {
					return jedis.keys("*");
				}
			});
			System.out.println(i+"----->"+keys);
		}
		sw.stop();
		System.out.println(sw.prettyPrint());
	}
}
