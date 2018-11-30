package org.hw.sml.manager.servlet;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.hw.sml.tools.IOUtils;

public class BodyReaderHttpServletRequestWrapper extends HttpServletRequestWrapper{
	private  String body;
	private ServletInputStream servletInputStream;
	
	public BodyReaderHttpServletRequestWrapper(HttpServletRequest request) {
		super(request);
		try {
			InputStream is=request.getInputStream();
			if(is==null){
				return;
			}
			body=IOUtils.toString(is,"utf-8");
			final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(body.getBytes("utf-8"));
			servletInputStream=new ServletInputStream() {
				public int read() throws IOException {
					return byteArrayInputStream.read();
				}
			};
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	@Override
	public ServletInputStream getInputStream(){
		return servletInputStream;
	}
	public String getBody() {
		return body;
	}
	
}
