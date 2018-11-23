package org.hw.sml.net;

import org.hw.socks.server.impl.ProxyServerInitiator;
/**
 * bean-socks=--class=org.hw.sml.net --p-port=10012 --init-method=init
 * @author wen
 *
 */
public class Socks {
	private int port=1080;
	
	private String username;
	private String password;
	private ProxyServerInitiator proxyServerInitiator;
	public Socks(){}
	public Socks(int port){this.port=port;}

	public void init(){
		proxyServerInitiator=new ProxyServerInitiator(port);
		proxyServerInitiator.setUsername(username);
		proxyServerInitiator.setPassword(password);
		proxyServerInitiator.start();
	}
	
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	
	public void stop(){
		proxyServerInitiator.stop();
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
}
