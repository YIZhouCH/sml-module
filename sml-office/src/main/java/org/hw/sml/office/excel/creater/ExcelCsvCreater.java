package org.hw.sml.office.excel.creater;

import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;

import au.com.bytecode.opencsv.CSVWriter;

public class ExcelCsvCreater extends ExcelBaseCreater {

	@Override
	public void execute() throws Exception {
		int start=0,limit=20000,totalCount=0;
		
		CSVWriter cw;
        Writer outWriter = new BufferedWriter(new OutputStreamWriter(outputStream, Charset.forName("GBK")));
        cw = new CSVWriter(outWriter, ',');
        cw.writeNext(getHeadNames());
        cw.flush(); //弹出框选
        List data;
        do {
        	data = retriver==null?datas:retriver.retrive(start, limit);
            //数组
                for (int i = 0, len = data.size(); i < len; i++) {
                    Map records=(Map) data.get(i);
                    cw.writeNext(transStrArrs(getPropertyNames(),records));
                    totalCount++;
                }
                cw.flush();
            start += limit;
        } while (!data.isEmpty() && data.size() == limit&&retriver!=null);
        cw.flush();
        cw.close();
        if(outputStream!=null)
        	outputStream.close();
		
	}
	private static String[] transStrArrs(String[] pns,Map records) {
		String[] strs=new String[pns.length];
		for(int i=0;i<pns.length;i++){
			strs[i]=String.valueOf(records.get(pns[i])==null?"":records.get(pns[i]));
		}
		return strs;
	}

}
