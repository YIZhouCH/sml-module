package org.hw.sml.manager.service;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface ServiceBean {
	public void service(HttpServletRequest request,HttpServletResponse response)throws IOException;
}
