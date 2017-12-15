package org.hw.sml.redis;

import java.lang.reflect.Method;

import org.hw.sml.tools.Assert;
import org.hw.sml.tools.ClassUtil;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

public class RedisTemplate {
	private JedisPool jedisPool;
	private Jedis jedis;
	public RedisTemplate(){
	}
	public RedisTemplate(JedisPool jedisPool){
		this.jedisPool=jedisPool;
	}
	public RedisTemplate(Jedis jedis){
		this.jedis=jedis;
	}
	public <T> T execute(RedisCallback<T> call){
		Jedis jedise=this.jedis;
		try{
			if(jedisPool!=null)
			jedise=jedisPool.getResource();
			Assert.notNull(jedise,"jedis or poolJedis is not null!");
			return call.doJedisCallback(jedise);
		}catch(Exception e){
			throw new RuntimeException(e);
		}finally{
			if(jedise!=null)
				close(jedise);
		}
	}
	
	
	
	private Boolean hasBorkenMethod;
	private Method method;
	public void close(Jedis jedise) {
		if (this.jedisPool != null) {
			if(hasBorkenMethod==null){
				method=ClassUtil.getMethod(jedise.getClient().getClass(),"isBroken");
				hasBorkenMethod=method!=null;
			}else{
				if(hasBorkenMethod){
					try {
						boolean flag=(Boolean) method.invoke(jedise,new Object[]{});
						if(flag){
							this.jedisPool.returnBrokenResource(jedise);
						}
					}catch (Exception e) {
					} 
				}
			}
			jedise.getClient();
			this.jedisPool.returnResource(jedise);
		} else
			jedise.disconnect();
	}
}	
