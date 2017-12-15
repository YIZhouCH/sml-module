package org.sml.lang.chr.filter;

import java.text.DecimalFormat;

import org.hw.sml.tools.MapUtils;
import org.sml.lang.chr.ChrFilter;
import org.sml.lang.chr.ChrParamer;
import org.sml.lang.chr.ChrResult;

public class NumFmtFilter implements ChrFilter{

	public ChrResult filter(ChrParamer chrParamer) {
		String chr=chrParamer.getChr();
		ChrResult result=null;
		if(chr==null||chr.trim().length()==0){
			result= new ChrResult(chrParamer.getChr());
			result.setBreaked(true);
			return result;
		}
		DecimalFormat dcmFmt = new DecimalFormat(MapUtils.getString(chrParamer.getExtParamer(),"arg0"));
		return new ChrResult(dcmFmt.format(Double.parseDouble(chr)));
	}

}
