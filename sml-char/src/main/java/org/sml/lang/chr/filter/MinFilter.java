package org.sml.lang.chr.filter;

import org.hw.sml.tools.MapUtils;
import org.sml.lang.chr.ChrFilter;
import org.sml.lang.chr.ChrParamer;
import org.sml.lang.chr.ChrResult;

public class MinFilter implements ChrFilter{
	public ChrResult filter(ChrParamer chrParamer) {
		String chr=chrParamer.getChr();
		ChrResult result=null;
		if(chr==null||chr.trim().length()==0){
			result= new ChrResult(chrParamer.getChr());
			result.setBreaked(true);
			return result;
		}
		double ori=Double.parseDouble(chrParamer.getChr());
		double cpv=MapUtils.getDouble(chrParamer.getExtParamer(),"arg0");
		String rc=String.valueOf(ori>cpv?cpv:ori);
		return new ChrResult(rc.endsWith(".0")?rc.substring(0,rc.length()-2):rc);
	}
	
}
