package org.hw.sml.office.excel.creater;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.RegexUtils;

public class Excel03Creater extends ExcelBaseCreater {

	@Override
	public void execute() throws Exception {
		int start=0,limit=20000,totalCount=0;
		Workbook wb= new HSSFWorkbook();
		
		/**工作簿创建好*/
		Sheet sheet = wb.createSheet(sheetName);
		sheet.setDefaultColumnWidth(10);
		//
		/**设定列宽*/
		if(headNames.length==propertyNames.length&&headlengths!=null){
			for(int i=0;i<headlengths.length;i++){
				sheet.setColumnWidth(i,headlengths[i]*100*5);
			}
		}
		int first=0;
		/**设定title*/
		Row row =null;
		if(title!=null){
			row= sheet.createRow(first);
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
			if(type.equals(Type.xls))
				cHead.setCellStyle(getStyle(wb,"head"));
			else
				cHead.setCellStyle(getStyle(wb,"xlsx_head"));
		}
		/**具体每个字段值*/
		
		List data;
		 do {
	            data = retriver==null?datas:retriver.retrive(start, limit);
	            for(int i=0;i<data.size();i++,totalCount++){
	    			row = sheet.createRow(i+first+start+1);
	    			Object recordT=data.get(i);
	    			if(Map.class.isAssignableFrom(recordT.getClass())){
	    			Map<String,Object> record=(Map<String, Object>) recordT;
	    			for(int n=0;n<propertyNames.length;n++){
	    				Cell fc=row.createCell(n);
	    				String value=String.valueOf(record.get(propertyNames[n]));
	    				if(value.trim().length()>0&&RegexUtils.isNumber(value)){///hw  0329
	    					Double d=(Double) ClassUtil.convertValueToRequiredType(value,Double.class);
    	            		fc.setCellValue(d);
    	            	}else{
    	            		fc.setCellValue(value.equals("null")?"":value);
    	            	}
	    			}
	    		  }
	           }
	           start += limit;
	        } while (!data.isEmpty() && data.size() == limit&&retriver!=null);
		 wb.write(outputStream);
		 
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
