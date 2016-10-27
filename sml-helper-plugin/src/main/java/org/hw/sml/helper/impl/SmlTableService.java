package org.hw.sml.helper.impl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.helper.ISmlTableService;
import org.hw.sml.manager.annotation.SmlResource;
import org.hw.sml.manager.service.RcptBaseService;
import org.springframework.stereotype.Service;

@SmlResource
@Service
public class SmlTableService extends RcptBaseService implements ISmlTableService{
	
	@Override
	public int add(String mark, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return 0;
	}

	@Override
	public int update(String mark, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return 0;
	}

	@Override
	public int delete(String mark, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return 0;
	}

	@Override
	public Object table(String mark, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
	
}
