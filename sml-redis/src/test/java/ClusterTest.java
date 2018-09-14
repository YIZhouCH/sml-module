import org.hw.sml.redis.cluster.JedisClusterFactory;
import org.hw.sml.support.time.StopWatch;

import redis.clients.jedis.JedisCluster;


public class ClusterTest {
	public static void main(String[] args) throws InterruptedException {
		StopWatch sw=new StopWatch("");
		sw.start("1");
		final JedisCluster cluster=JedisClusterFactory.create("redis://wenjimmy@192.168.193.128:7001/0?maxTotal=50&maxActive=50&hostAndPorts=192.168.193.128:7002,192.168.193.128:7003,192.168.193.128:7004,192.168.193.128:7005,192.168.193.128:7006"); 
		Thread t=null;
		for(int i=0;i<5;i++){
			t=new Thread(new Runnable() {
				public void run() {
					for(int i=0;i<100;i++)
					System.out.println(Thread.currentThread().getName()+":---->"+cluster.hget("student","name"));
				}
			});
			t.start();
		}
		t.join();
		sw.stop();
		
		System.out.println(sw.prettyPrint());
		
	}
}
