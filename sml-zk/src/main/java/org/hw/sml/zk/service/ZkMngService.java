package org.hw.sml.zk.service;

import java.util.Collections;
import java.util.List;

import org.I0Itec.zkclient.IZkChildListener;
import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.ZkConnection;
import org.apache.zookeeper.CreateMode;
import org.hw.sml.plugin.Plugin;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.tools.Assert;


public class ZkMngService implements Plugin{
	
	private String serverName;
	
	private String id;
	
	private boolean isRunning=false;
	
	private String zkHosts;
	
	private int sessionTimeout=5000;
	
	private int connectionTimeout=5000;
	
	private String executeElp;
	
	private Bootstrap bootstrap;
	
	private ZkClient zkClient;
	
	public void init() {
		Assert.notNull(serverName,"zk serverName must not null!");
		if(id==null)
			id=String.valueOf(System.currentTimeMillis());
		zkClient=new ZkClient(new ZkConnection(zkHosts,sessionTimeout),connectionTimeout);
		String path="/"+serverName;
		boolean exists=zkClient.exists(path);
		if(!exists){
			zkClient.create(path,serverName,CreateMode.PERSISTENT);
		}
		if(bootstrap==null){
			bootstrap=new DefaultBootstrap(executeElp);
		}
		zkClient.subscribeChildChanges(path,new ZkChildListener());
		zkClient.create(path+"/"+id,id,CreateMode.EPHEMERAL);
	}
	private class ZkChildListener implements IZkChildListener{
		public void handleChildChange(String parentPath,
				List<String> currentChilds) throws Exception {
			Collections.sort(currentChilds);
			LoggerHelper.getLogger().info(getClass(),"childChange:"+currentChilds);
			if(!isRunning&&currentChilds.size()>=1&&id.equals(currentChilds.get(0))){
            	LoggerHelper.getLogger().info(getClass(),"serverName:["+serverName+"] instanceId:["+id+"] do!");
            	bootstrap.start();
            	setRunning(true);
            }
		}
	}
	public static interface Bootstrap{
		public void start() throws Exception;
	}
	private class DefaultBootstrap implements Bootstrap{
		private String elp;
		public DefaultBootstrap(String elp){
			this.elp=elp;
		}
		public void start() throws Exception {
			BeanHelper.evelV(elp);
		}
	}
	public String getZkHosts() {
		return zkHosts;
	}
	public void setZkHosts(String zkHosts) {
		this.zkHosts = zkHosts;
	}

	public boolean isRunning() {
		return isRunning;
	}

	public void setRunning(boolean isRunning) {
		this.isRunning = isRunning;
	}

	public int getSessionTimeout() {
		return sessionTimeout;
	}

	public void setSessionTimeout(int sessionTimeout) {
		this.sessionTimeout = sessionTimeout;
	}

	public int getConnectionTimeout() {
		return connectionTimeout;
	}

	public void setConnectionTimeout(int connectionTimeout) {
		this.connectionTimeout = connectionTimeout;
	}

	public String getExecuteElp() {
		return executeElp;
	}

	public void setExecuteElp(String executeElp) {
		this.executeElp = executeElp;
	}
	
	public String getServerName() {
		return serverName;
	}
	public void setServerName(String serverName) {
		this.serverName = serverName;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public ZkClient getZkClient() {
		return zkClient;
	}
	public void setZkClient(ZkClient zkClient) {
		this.zkClient = zkClient;
	}
	public void destroy() {
		zkClient.close();
	}
	public Bootstrap getBootstrap() {
		return bootstrap;
	}
	public void setBootstrap(Bootstrap bootstrap) {
		this.bootstrap = bootstrap;
	}

}
