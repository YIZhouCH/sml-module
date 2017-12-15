package org.sml.lang.chr;

import java.util.Map;

import org.hw.sml.tools.MapUtils;

public class ChrOperator {
	
	private  Map<String,ChrFilter> beans=MapUtils.newConcurrentHashMap();
	
	public void bindBean(String alias,ChrFilter bean){
		beans.put(alias, bean);
	}
	
	public ChrResult doChain(String chr,ChrParamer ... chrParamers){
		ChrResult result=null;
		chrParamers[0].setChr(chr);
		for(int i=0;i<chrParamers.length;i++){
			ChrParamer chrParamer=chrParamers[i];
			ChrFilter filter=beans.get(chrParamer.getBeanName());
			result=filter.filter(chrParamer);
			if(result.isBreaked()||!result.isGoing()||result.isFilter()){
				return result;
			}
			//System.out.println(chrParamer.getBeanName()+":"+chrParamer.getChr()+":"+result.getChr()+":"+chrParamer.getExtParamer().get("arg0"));
			if(i<chrParamers.length-1)
				chrParamers[i+1].setChr(result.getChr());
			
		}
		return result;
	}

	public Map<String, ChrFilter> getBeans() {
		return beans;
	}

	public void setBeans(Map<String, ChrFilter> beans) {
		this.beans = beans;
	}
	
}

