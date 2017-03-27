package org.hw.sml.server;

import java.io.IOException;

import org.hw.sml.context.Context;
import org.hw.sml.server.NanoHTTPD.Response.Status;
import org.hw.sml.support.LoggerHelper;



public class SmlServer{
	private boolean daemon=false;
	
	private int port;
	
	private int timeout=2*60*1000;
	
	public SmlServer(int port) {
		super();
		this.port = port;
	}
	public SmlServer() {
	
	}
	public void init() throws IOException{
		Context.start();
		NanoHTTPD httpd= new NanoHTTPD(port) {
			public Response serve(IHTTPSession session){
				try {
					return Context.doService(session);
				} catch (ResponseException e) {
					return NanoHTTPD.newResponse(e.getStatus(),NanoHTTPD.MIME_HTML,e.getMessage());
				}catch (Exception e) {
					return NanoHTTPD.newResponse(Status.INTERNAL_ERROR,NanoHTTPD.MIME_HTML,e.getMessage());
				} 
			}
		};
		httpd.start(timeout, daemon);
		LoggerHelper.info(getClass(),"nanohttp server bind-->["+port+"],daemon:["+daemon+"],timeout:["+timeout+"]");
	}
	public boolean isDaemon() {
		return daemon;
	}
	public void setDaemon(boolean daemon) {
		this.daemon = daemon;
	}
}
