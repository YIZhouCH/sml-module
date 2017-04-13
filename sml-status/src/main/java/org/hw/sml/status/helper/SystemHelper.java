package org.hw.sml.status.helper;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.Date;

import org.hw.sml.support.ioc.BeanHelper;

public class SystemHelper {
	public static Runtime rt=Runtime.getRuntime();
	public static RuntimeMXBean rm=ManagementFactory.getRuntimeMXBean();
	
	public static long getPid(){
		return Long.parseLong(rm.getName().split("@")[0]);
	}
	public static String getHostName(){
		return rm.getName().split("@")[1];
	}
	public static String getServerContextPath(){
		return BeanHelper.getValue("server.contextPath");
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
	
	public static void main(String[] args) {
		System.out.println(getPid());
		System.out.println(getHostName());
		System.out.println(totalMemory());
		System.out.println(maxMemory());
		System.out.println(useMemoryUtility());
		System.out.println(availableProcessors());
	}
	
}
