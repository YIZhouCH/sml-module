package org.hw.sml.helper.plugin.jdbc.csv;

import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;

import org.hw.sml.tools.DateTools;
import org.hw.sml.tools.Https;

import com.csvreader.CsvWriter;

public class CsvCreater {
	public static interface Retriver{
		public  List<Map<String,Object>> retrive(int start,int limit);
	}
	public static void create(OutputStream outputStream,String[] heads,Retriver retriver) throws IOException{
        Writer outWriter = new BufferedWriter(new OutputStreamWriter(outputStream, Charset.forName("GBK")));
        CsvWriter cw = new CsvWriter(outWriter, ',');
        cw.writeRecord(heads);
        cw.flush(); 
        List<Map<String,Object>> datas=null;
        int start=0,limit=10000;
        do {
        	datas = (retriver==null?datas:retriver.retrive(start, limit));
            //数组
                for (int i = 0, len = datas.size(); i < len; i++) {
                    Map<String,Object> records=datas.get(i);
                    cw.writeRecord(transStrArrs(heads,records));
                }
                cw.flush();
            start += limit;
        } while (!datas.isEmpty() && datas.size() == limit&&retriver!=null);
        cw.flush();
        cw.close();
	}
	private static String[] transStrArrs(String[] heads, Map<String,Object> records) {
		String[] result=new String[heads.length];
		int i=0;
		for(String head:heads){
			String[] hs=head.split("@");
			String hv=null;
			Object hvt=records.get(hs[0]);
			if(hvt!=null&&String.valueOf(hvt).length()>0){
				if(hs.length==2){
					hv=DateTools.sdf_mi.format(hvt);
				}else{
					hv=String.valueOf(hvt);
				}
			}
			result[i++]=hv;
		}
		return result;
	}
	public static void main(String[] args) throws FileNotFoundException, IOException {
		String result=Https.newGetHttps("http://192.168.1.121:8080/WlanOrderAutomatic/rest/workOrder/export?title=asdfa&exportType=csv").bos(new FileOutputStream("d:/temp3.csv")).execute();
		System.out.println(result);
	}
}
