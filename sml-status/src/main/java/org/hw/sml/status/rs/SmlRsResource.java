package org.hw.sml.status.rs;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.PathParam;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.el.ElException;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.tools.IOUtils;
@Bean
@SmlResource("sml")
public class SmlRsResource {
	@SmlResource("cmd")
	public Object evel(String elp){
		try {
			return BeanHelper.evelV(elp);
		} catch (IllegalArgumentException e) {
			return e.toString();
		} catch (ElException e) {
			return e.toString();
		}
	}
	
	@SmlResource("shell/{issyn}")
	public Object eval(@PathParam("issyn")String issyn,@Param(value="charset",defaultValue="utf8")final String charset,final String shellScript) throws IOException{
		Process process=null;
		if(issyn.equalsIgnoreCase("syn")){
			InputStream is=null;
			try{
				process=Runtime.getRuntime().exec(shellScript);
				is=process.getInputStream();
			}catch(Exception e){
				is=process.getErrorStream();
			}
			return IOUtils.toString(is,charset);
		}else if(issyn.equalsIgnoreCase("asyn")){
			new Thread(new Runnable(){
				public void run() {
					try {
						Process p=Runtime.getRuntime().exec(shellScript);
						BufferedInputStream in = new BufferedInputStream(p.getInputStream());
	                    BufferedReader inBr = new BufferedReader(new InputStreamReader(in,charset));
	                    String lineStr;
	                    while ((lineStr = inBr.readLine()) != null) {
	                        LoggerHelper.getLogger().info(getClass(),lineStr);// 打印输出信息
	                    }
	                    if (p.waitFor() != 0) {
	                        if (p.exitValue() == 1) {// 0表示正常结束，1：非正常结束
	                        	LoggerHelper.getLogger().error(getClass(),shellScript + "命令执行失败!");
	                        }
	                    }
	                    inBr.close();
	                    in.close();
					} catch (IOException e) {
						e.printStackTrace();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
			}).start();
			return "asyn process!";
		}else{
			return "error path["+issyn+"], only asyn|syn!";
		}
	}
	public static void main(String[] args) throws IOException {
		System.out.println(new SmlRsResource().eval("asyn", "gbk", "ping 192.168.1.206"));
	}
}
