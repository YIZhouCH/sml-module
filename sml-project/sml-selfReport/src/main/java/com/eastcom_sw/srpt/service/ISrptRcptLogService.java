package com.eastcom_sw.srpt.service;

import javax.servlet.http.HttpServletRequest;

import com.eastcom_sw.srpt.model.SrptLog;


public interface ISrptRcptLogService {

	/**
	 * request 中获取用户信息以及其他有用信息
	 * @param request
	 * @param srptLog
	 * 
	 * add用于添加日志记录对象
	 */
	void add(HttpServletRequest request, SrptLog srptLog);

}
