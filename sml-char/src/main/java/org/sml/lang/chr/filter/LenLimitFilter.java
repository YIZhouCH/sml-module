package org.sml.lang.chr.filter;

import org.hw.sml.tools.MapUtils;
import org.sml.lang.chr.ChrFilter;
import org.sml.lang.chr.ChrParamer;
import org.sml.lang.chr.ChrResult;

public class LenLimitFilter implements ChrFilter{

	public ChrResult filter(ChrParamer chrParamer) {
		String chr=chrParamer.getChr();
		ChrResult result=null;
		if(chr==null||chr.trim().length()==0){
			result= new ChrResult(chrParamer.getChr());
			result.setBreaked(true);
			return result;
		}
		int len=MapUtils.getInt(chrParamer.getExtParamer(),"arg0");
		if(chr.length()>len){
			chr=chr.substring(0,len);
		}
		return new ChrResult(chr);
	}
	
}
