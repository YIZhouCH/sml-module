package com.eastcom_sw.srpt.tools;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.Charset;
import java.util.Date;
import java.util.List;

import org.hw.sml.support.LoggerHelper;

import au.com.bytecode.opencsv.CSVWriter;





/**
 */

public class CsvExporter{
    public static final int LIMIT = 50000;

    public static interface DataRetriver{
        List retrive(int start, int limit);
    }


    public static void export(OutputStream out, DataRetriver dataRetriver, String[] properiesName, String[] headsName, Class beanClass, String exportFileName, String username) throws IOException {
        CSVWriter cw;
        Writer outWriter = new BufferedWriter(new OutputStreamWriter(out, Charset.forName("GBK")));
        cw = new CSVWriter(outWriter, ',');
        cw.writeNext(new String[]{exportFileName});
        cw.writeNext(new String[]{"创建人:"+username,"创建时间:"+org.hw.sml.tools.DateTools.sdf_mis().format(new Date())});
        cw.writeNext(headsName);
        cw.flush(); //弹出框选
        int start = 1, limit = LIMIT;
        int totalCount = 0;
        List data;
        do {
            data = dataRetriver.retrive(start, limit);  //调用查询记录  查询完返回导出 下次查询
            LoggerHelper.info(CsvExporter.class,"导出["+exportFileName+"]"+start+"----->"+(start+limit));
            //数组
                for (int i = 0, len = data.size(); i < len; i++) {
                    Object[] records = (Object[]) data.get(i);
                    cw.writeNext(transStrArrs(records));
                    totalCount++;
                }
                cw.flush();
            start += limit;
        } while (!data.isEmpty() && data.size() == limit);
        cw.flush();
        cw.close();
     //   out.close();  //self add
      //  outWriter.close();  //self add
    }


	private static String[] transStrArrs(Object[] records) {
		String[] strs=new String[records.length];
		for(int i=0;i<records.length;i++){
			strs[i]=String.valueOf(records[i]==null?"":records[i]);
		}
		return strs;
	}
}

