package org.hw;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

import org.hw.sml.tools.Https;
import org.hw.sml.tools.IOUtils;

public class test {
	public static void main1(String[] args) throws IOException {
		Https https=Https.newPostBodyHttps("http://localhost:10086/esb/helloworld/hw").body(" asadfasdfad");
		https.getHeader().put("Content-Length","0");
		String result=https.execute();
		System.out.println(result);
	}
	public static void main(String[] args) throws UnknownHostException, IOException {
		Socket socket=new Socket("localhost",10086);
		PrintWriter pw=new PrintWriter(socket.getOutputStream());
		  StringBuffer sb = new StringBuffer();  
          sb.append("POST /esb/helloworld/hw HTTP/1.1\r\n");  
          sb.append("Connection: Keep-Alive\r\n");  
          sb.append("Content-Length: 0\r\n");  
          sb.append("\r\n");  
          sb.append("aaa");
          pw.write(sb.toString());  
          pw.flush();  
          socket.shutdownOutput();
         // pw.close();
          //socket.shutdownOutput();
		String result=IOUtils.toString(socket.getInputStream(),"utf-8"); 
		System.out.println(result);
		socket.close();
	}
}
