package org.sml.lang.chr.test;

import org.hw.sml.support.time.StopWatch;
import org.sml.lang.chr.ChrOperator;
import org.sml.lang.chr.ChrParamer;
import org.sml.lang.chr.ChrResult;
import org.sml.lang.chr.filter.LenLimitFilter;
import org.sml.lang.chr.filter.MaxFilter;
import org.sml.lang.chr.filter.MinFilter;
import org.sml.lang.chr.filter.NumFmtFilter;
import org.sml.lang.chr.filter.NvlFilter;

public class Test {
	public static void main(String[] args) {
		ChrOperator op=new ChrOperator();
		op.bindBean("max",new MaxFilter());
		op.bindBean("min",new MinFilter());
		op.bindBean("numFmt", new NumFmtFilter());
		op.bindBean("lenLimit", new LenLimitFilter());
		op.bindBean("nvl", new NvlFilter());
		StopWatch sw=new StopWatch("test");
		sw.start("a");
		ChrResult cr=null;
		for(int i=0;i<1;i++){
			cr=op.doChain(null,
					new ChrParamer("nvl").param("arg0","23.123456789"),
					new ChrParamer("max").param("arg0","200"),
					new ChrParamer("min").param("arg0","100"),
					new ChrParamer("numFmt").param("arg0","00.0000000"),
					new ChrParamer("lenLimit").param("arg0","6")
				);
		}
		sw.stop();
		System.out.println(cr.getChr());
		System.out.println(sw.prettyPrint());
		//
	}
}
