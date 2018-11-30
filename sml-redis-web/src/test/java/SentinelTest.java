import org.hw.sml.redis.sentinel.JedisSentinelFactory;

import redis.clients.jedis.JedisSentinelPool;


public class SentinelTest {
	public static void main(String[] args) {
		JedisSentinelPool jsp=JedisSentinelFactory.create("redis://eastcom!@#$@10.222.42.9:26379/8?master=mymaster&maxTotal=200&maxActive=100&hostAndPorts=10.222.42.10:26379");
		System.out.println(jsp.getResource().keys("*"));
	}
}
