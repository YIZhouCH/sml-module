package org.hw.sml.shiro;

import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.shiro.ShiroException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;
import org.hw.sml.tools.MapUtils;

public class RetryLimitCredentialsMatcher extends SimpleCredentialsMatcher{
	private int limit=5;
	private int lockMinute=1;
	private Map<String,Cache> caches=MapUtils.newHashMap();
	public static class Cache{
		private AtomicInteger atomicInteger=new AtomicInteger(0);
		private long locktime=0;
		public void reset(){
			atomicInteger=new AtomicInteger(0);
			this.locktime=0;
		}
		public AtomicInteger getAtomicInteger() {
			return atomicInteger;
		}
		public void setAtomicInteger(AtomicInteger atomicInteger) {
			this.atomicInteger = atomicInteger;
		}
		public long getLocktime() {
			return locktime;
		}
		public void setLocktime(long locktime) {
			this.locktime = locktime;
		}
		
	}

	public RetryLimitCredentialsMatcher() {
		
	}
	
	
	public boolean doCredentialsMatch(AuthenticationToken authcToken, AuthenticationInfo info) {
		String username = (String) authcToken.getPrincipal();
		Cache retryCount =caches.get(username);
		if(retryCount == null) {
			retryCount = new Cache();
			caches.put(username,retryCount);
		}else{
			if(retryCount.getLocktime()!=0&&retryCount.getLocktime()<System.currentTimeMillis()){
				retryCount.reset();
			}
		}
		if(retryCount.getAtomicInteger().incrementAndGet() > limit) {
			retryCount.setLocktime(System.currentTimeMillis()+lockMinute*1000*60);
			throw new ExcessiveAttemptsException("用户名: " + username + " 密码连续输入错误超过"+limit+"次，锁定"+lockMinute+"分钟！"); 
		}
		boolean matches = super.doCredentialsMatch(authcToken, info);
		if(matches) {
			caches.remove(username);
		}
		return matches;
	}

	public void init() throws ShiroException {
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public int getLockMinute() {
		return lockMinute;
	}


	public void setLockMinute(int lockMinute) {
		this.lockMinute = lockMinute;
	}


	public Map<String, Cache> getCaches() {
		return caches;
	}


	public void setCaches(Map<String, Cache> caches) {
		this.caches = caches;
	}

	
}
