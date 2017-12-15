package org.sml.lang.chr.filter;

import org.sml.lang.chr.ChrFilter;
import org.sml.lang.chr.ChrParamer;
import org.sml.lang.chr.ChrResult;

public class NvlFilter implements ChrFilter{

	public ChrResult filter(ChrParamer chrParamer) {
		return new ChrResult(chrParamer.getChr()==null||chrParamer.getChr().length()==0?chrParamer.getExtParamer().get("arg0"):chrParamer.getChr());
	}
	
}
