package org.hw.sml.server;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.nio.SelectChannelConnector;
import org.eclipse.jetty.util.thread.QueuedThreadPool;
import org.eclipse.jetty.webapp.WebAppContext;
import org.hw.sml.plugin.Plugin;
import org.hw.sml.support.ManagedThread;


public class JettyProxyService extends ManagedThread  implements Plugin{
	
	private String queuedThreadPoolName="queuedTreadPool";
	
	private int port=1202;
	
	private String serverContextPath="/";
	
	private String webapp="src/main/webapp";
	private int minThreads=2;
	private int maxThreads=200;
	
	private int acceptors=4;
	
	private int maxBuffers=2048;
	
	private int maxIdleTime=20*60*1000;
	
	private Server server;
	
	public  void createServerIn() {
	    server = new Server();
		QueuedThreadPool queuedThreadPool = new QueuedThreadPool();
		queuedThreadPool.setName(queuedThreadPoolName);
		queuedThreadPool.setMinThreads(minThreads);
		queuedThreadPool.setMaxThreads(maxThreads);
		server.setThreadPool(queuedThreadPool);
		SelectChannelConnector connector = new SelectChannelConnector();
		connector.setPort(port);
		connector.setAcceptors(acceptors);// 
		connector.setMaxBuffers(maxBuffers);
		connector.setMaxIdleTime(maxIdleTime);
		server.addConnector(connector);
		WebAppContext webContext = new WebAppContext(webapp, serverContextPath);
		webContext.setDescriptor(webapp+"/WEB-INF/web.xml");
		webContext.setResourceBase(webapp);
		webContext.setClassLoader(Thread.currentThread().getContextClassLoader());
		server.setHandler(webContext);
	}
	public void init(){
		super.setName("jettyServer");
		super.start();
	}
	public void destroy() {
		try {
			server.stop();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public String getQueuedThreadPoolName() {
		return queuedThreadPoolName;
	}
	public void setQueuedThreadPoolName(String queuedThreadPoolName) {
		this.queuedThreadPoolName = queuedThreadPoolName;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public String getServerContextPath() {
		return serverContextPath;
	}
	public void setServerContextPath(String serverContextPath) {
		this.serverContextPath = serverContextPath;
	}
	public String getWebapp() {
		return webapp;
	}
	public void setWebapp(String webapp) {
		this.webapp = webapp;
	}
	public int getAcceptors() {
		return acceptors;
	}
	public void setAcceptors(int acceptors) {
		this.acceptors = acceptors;
	}
	public int getMaxBuffers() {
		return maxBuffers;
	}
	public void setMaxBuffers(int maxBuffers) {
		this.maxBuffers = maxBuffers;
	}
	public int getMaxIdleTime() {
		return maxIdleTime;
	}
	public void setMaxIdleTime(int maxIdleTime) {
		this.maxIdleTime = maxIdleTime;
	}
	public Server getServer() {
		return server;
	}
	public void setServer(Server server) {
		this.server = server;
	}
	
	protected void cleanup() {
		
	}
	protected void doWorkProcess() {
		createServerIn();
		try {
			server.start();
			server.join();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	protected boolean extraExitCondition() {
		return stopFlag;
	}
	protected boolean prepare() {
		return true;
	}
	
	public static void main(String[] args) {
		Plugin p=new JettyProxyService();
		p.init();
	}
}
