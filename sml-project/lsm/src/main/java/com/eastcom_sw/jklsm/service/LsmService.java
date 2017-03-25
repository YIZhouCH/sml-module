package com.eastcom_sw.jklsm.service;

import org.hw.sml.core.SqlMarkupAbstractTemplate;
import org.hw.sml.manager.service.RcptBaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//@Service
public class LsmService extends RcptBaseService{

	@Autowired
	public void setSqlMarkupTemplate(SqlMarkupAbstractTemplate sqlMarkupTemplate) {
		super.setSqlMarkupTemplate(sqlMarkupTemplate);
	}
	
}
