package org.hw.sml.office.excel.creater.rs;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hw.sml.jdbc.Callback;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;

public class ExcelRsCreater extends ExcelRsBaseCreator {
	@Override
	public void execute() throws Exception {
		final Workbook wb=new XSSFWorkbook();
		//if(xlsCreator.getType().equals(Type.xls)){
		//	wb = new HSSFWorkbook();
		//}else{
		//	wb = new XSSFWorkbook();   //new SXSSFWorkbook();   wb.setCompressTempFiles(true); 
		//}
		
		/**工作簿创建好*/
		final Sheet sheet = wb.createSheet(title);
		sheet.setDefaultColumnWidth(10);
		//
		/**设定列宽*/
	/*	if(headNames.length==propertyNames.length&&headlengths!=null){
			for(int i=0;i<headlengths.length;i++){
				sheet.setColumnWidth(i,headlengths[i]*100*5);
			}
		}*/
		final Map<String,Integer> map = MapUtils.newHashMap();
		int first=0;
		/**设定title*/
		//Row row =null;
		if(title!=null){
			Row row= sheet.createRow(first);
			row.setHeightInPoints(30);
			Cell cell = row.createCell(0);
			cell.setCellValue(title);
			sheet.addMergedRegion(new CellRangeAddress(0,0,0, headNames.length-1));
			cell.setCellStyle(getStyle(wb,"title"));
			first++;
		}
		/**设定creator*/
		if(creator!=null){
			Row creatorRow = sheet.createRow(first);
			Cell ct1=creatorRow.createCell(0);
			ct1.setCellValue("创建者:");
			ct1.setCellStyle(getStyle(wb,"title_sub1"));
			Cell ct2=creatorRow.createCell(1);
			ct2.setCellValue(creator);
			ct2.setCellStyle(getStyle(wb,"title_sub2"));
			Cell ct3=creatorRow.createCell(2);
			ct3.setCellValue("创建时间:");
			ct3.setCellStyle(getStyle(wb,"title_sub1"));
			Cell ct4=creatorRow.createCell(3);
			ct4.setCellValue(new SimpleDateFormat("yyyy年MM月dd日 HH时mm分").format(new Date()));
			ct4.setCellStyle(getStyle(wb,"title_sub2"));
			first++;
		}
		/**headnames*/
		Row head = sheet.createRow(first);
		for(int m=0;m<headNames.length;m++){
			Cell cHead=head.createCell(m);
			cHead.setCellValue(headNames[m]);
			if(this.type.equals(Type.xls))
				cHead.setCellStyle(getStyle(wb,"head"));
			else
				cHead.setCellStyle(getStyle(wb,"xlsx_head"));
		}
		
		map.put("first", first);
		jdbcTemplate.queryForCallback(sql, params ,new Callback(){
			public void call(ResultSet rs, int rowNum) throws SQLException {
				Row row = sheet.createRow(rowNum+map.get("first")+1);
    			for(int n=0;n<headNames.length;n++){
    				Cell fc=row.createCell(n);
    				String value=String.valueOf(rs.getString(n+1));
    				//String value="ceshi";
    				if(value.trim().length()>0&&RegexUtils.isNumber(value)){
    					Double d=(Double) ClassUtil.convertValueToRequiredType(value,Double.class);
	            		fc.setCellValue(d);
	            	}else{
	            		fc.setCellValue(value.equals("null")?"":value);
	            	}
    			}
			}
		});
		wb.write(outputStream);
		if(outputStream!=null)
			outputStream.close();
	}

}
