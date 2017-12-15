package org.hw.sml.office.excel.creater.rs;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.Charset;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.hw.sml.jdbc.Callback;

import au.com.bytecode.opencsv.CSVWriter;

public class ExcelRsCsvCreater extends ExcelRsBaseCreator {
	@Override
	public void execute() throws Exception {
		SimpleDateFormat sf = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分");      //24小时制
		String nowTime = sf.format(Calendar.getInstance().getTime());
		
		final CSVWriter cw;
        Writer outWriter = new BufferedWriter(new OutputStreamWriter(outputStream, Charset.forName("GBK")));
        cw = new CSVWriter(outWriter, ',');
        cw.writeNext(new String[]{title});
        cw.writeNext(new String[]{"创建人:"+creator,"创建时间:"+nowTime});
        cw.writeNext(getHeadNames());
        cw.flush(); //弹出框选
        
        jdbcTemplate.queryForCallback(sql, params ,new Callback(){
        	int i=0;
			public void call(ResultSet rs, int rowNum) throws SQLException {
				//write 里面是数组
                cw.writeNext(transStrArrs(getPropertyNames(),rs));
                try {
                	if(i++%10000==0){
					cw.flush();
                		System.out.println("导出第"+i+"条");
                	}
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		});
        cw.flush();
        cw.close();
        if(outputStream!=null)
        	outputStream.close();
		
	}
	private static String[] transStrArrs(String[] pns,ResultSet rs) throws SQLException {
		String[] strs=new String[pns.length];
		for(int i=0;i<pns.length;i++){
			rs.getString(i+1);
			strs[i]=String.valueOf(rs.getString(i+1)==null?"":rs.getString(i+1));
		}
		return strs;
	}

}
