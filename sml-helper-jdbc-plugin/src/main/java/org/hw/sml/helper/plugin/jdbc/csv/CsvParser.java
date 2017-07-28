package org.hw.sml.helper.plugin.jdbc.csv;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;

import org.hw.sml.tools.MapUtils;

import com.csvreader.CsvReader;

public class CsvParser {
	public static List<Map<String,Object>> read(InputStream is,String tableName) throws IOException{
		CsvReader cr=new CsvReader(new InputStreamReader(is,"gbk"),',');
		cr.readHeaders();
		String[] heads=cr.getHeaders();
		List<Map<String,Object>> result=MapUtils.newArrayList();
		while(cr.readRecord()){
			String[] data=cr.getValues();
			Map<String,Object> sr=MapUtils.newLinkedHashMap();
			for(int i=0;i<heads.length;i++){
				try{
					sr.put(heads[i],data[i]);
				}catch(Exception e){
					sr.put(heads[i],null);
				}
			}
			result.add(sr);
		}
		cr.readRecord();
		return result;
	}
	public static void main(String[] args) throws FileNotFoundException, IOException {
		List result=CsvParser.read(new FileInputStream("d:/ipmsdm.DM_CO_BA_CFG_RCPT_IF.csv"), "DM_CO_BA_CFG_RCPT_IF");
		System.out.println(result.get(result.size()-1));
		//ObjectOutputStream os=new ObjectOutputStream(new FileOutputStream("d://temp.txt"));
		
	}
}
