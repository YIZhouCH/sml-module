package org.hw.sml.manager.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface ISmlManageService {
	public void export(String str,HttpServletRequest req,HttpServletResponse resp) throws Exception;
	public void index(String str,HttpServletRequest req,HttpServletResponse resp) throws Exception;
	public void invoke(String str,HttpServletRequest req,HttpServletResponse resp);
	public void query(String str,HttpServletRequest req,HttpServletResponse resp);
	public void update(String str,HttpServletRequest req,HttpServletResponse resp);
	public void cmd(String str,HttpServletRequest req,HttpServletResponse resp);
}
