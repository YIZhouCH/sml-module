package org.hw.sml.status.helper;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.Date;

import org.hw.sml.support.ioc.BeanHelper;

public class SystemHelper {
	static{
		String conf=BeanHelper.getValue("sml.server.dir.conf");
		System.setProperty("sml.server.dir.conf",conf==null?"../conf":conf);
		String logs=BeanHelper.getValue("sml.server.dir.logs");
		System.setProperty("sml.server.dir.logs",logs==null?"../logs":logs);
	}
	public static Runtime rt=Runtime.getRuntime();
	public static RuntimeMXBean rm=ManagementFactory.getRuntimeMXBean();
	
	public static long getPid(){
		return Long.parseLong(rm.getName().split("@")[0]);
	}
	public static String getHostName(){
		return rm.getName().split("@")[1];
	}
	public static String getServerContextPath(){
		String contextPath= BeanHelper.getValue("server.contextPath");
		if(contextPath==null){
			return "";
		}
		return contextPath.startsWith("/")?contextPath.substring(1):contextPath;
	}
	public static int getServerPort(){
		return Integer.parseInt(BeanHelper.getValue("server.port"));
	}
	public static int activeCount(){
		return Thread.activeCount();
	}
	public static long totalMemory(){
		return rt.totalMemory();
	}
	public static Date getStartTime(){
		return new Date(rm.getStartTime());
	}
	public static long maxMemory(){
		return rt.maxMemory();
	}
	public static double useMemoryUtility(){
		return totalMemory()*100.00/maxMemory();
	}
	public static int availableProcessors(){
		return rt.availableProcessors();
	}
	public static String getServerDirLog(){
		return System.getProperty("sml.server.dir.logs");
	}
	public static String getServerDirConf(){
		return System.getProperty("sml.server.dir.conf");
	}
	
	public static void main(String[] args) {
		System.out.println(getPid());
		System.out.println(getHostName());
		System.out.println(totalMemory());
		System.out.println(maxMemory());
		System.out.println(useMemoryUtility());
		System.out.println(availableProcessors());
		System.out.println(getServerDirConf());
		System.out.println(getServerDirLog());
	}
	
}
