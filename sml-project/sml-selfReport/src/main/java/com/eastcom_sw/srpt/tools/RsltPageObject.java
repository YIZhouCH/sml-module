package com.eastcom_sw.srpt.tools;

import java.util.List;
import java.util.Map;


public class RsltPageObject extends org.hw.sml.manager.model.PageObject{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -3516380971944784402L;
	private List<String> headMetas;

	public RsltPageObject(List<Map<String,Object>> datas, long count, int parseInt,
			int parseInt2) {
		super(datas, count, parseInt, parseInt2);
	}

	public List<String> getHeadMetas() {
		return headMetas;
	}

	public void setHeadMetas(List<String> headMetas) {
		this.headMetas = headMetas;
	}

	@Override
	public String toString() {
		String ss=headMetas.get(0);
		int j=headMetas.size();
		for(int i = 1;i<j;i++){
				ss=headMetas.get(i)+";"+ss;
		}
		return ss;
	}
	
	
	
}
