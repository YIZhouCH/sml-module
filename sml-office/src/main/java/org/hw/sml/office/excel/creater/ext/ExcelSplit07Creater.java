package org.hw.sml.office.excel.creater.ext;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;
/**
 * 实现根据某个字段分sheet逻辑.
 * @author wen
 * 1.要在sql中返回要按照某字段值分页的 字段，别名为SHEETMARK
 * 2.需要在resultMapping中添加 SHEETMARK 的别名
 * 3.需要在sql文本中 添加<select id="createClass">com.eastcom_sw.srpt.excel.ExcelSplit07Creater</select>用来反射这个类
 */
public class ExcelSplit07Creater extends ExcelCreater{

	public void execute() throws Exception {
		//<select id="sheetColumn">time_id</select>
		Map<String,List<Map<String,Object>>> sheetDatas=MapUtils.groupMpLst(getDatas(),"SHEETMARK");
		int start=0;
		int	totalCount=0;
		doColorInit();
		Workbook wb = new SXSSFWorkbook();
		((SXSSFWorkbook)wb).setCompressTempFiles(true); 
		for (String sheetName : sheetDatas.keySet()) {
			/**工作簿创建好*/
			Sheet sheet = wb.createSheet(sheetName);
			sheet.setDefaultColumnWidth(10);
			//
			headlengths=doCellLength(headNames,propertyNames,sheetDatas.get(sheetName));
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
				cell.setCellValue(title+"--"+sheetName);
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
			int size=createHeader(headNames, sheet, first, type.equals(Type.xls)?getStyle(wb,"head"):getStyle(wb,"xlsx_head"));
			first=first+size-1;
			/**具体每个字段值*/
			List data;
			 do {
				 	data = sheetDatas.get(sheetName);
		            for(int i=0;i<data.size();i++,totalCount++){
		    			row = sheet.createRow(i+first+start+1);
		    			Object recordT=data.get(i);
		    			if(Map.class.isAssignableFrom(recordT.getClass())){
		    			Map<String,Object> record=(Map<String, Object>) recordT;
		    			for(int n=0;n<propertyNames.length;n++){
		    				Cell fc=row.createCell(n);
		    				String value=String.valueOf(record.get(propertyNames[n]));
		    				if(value.trim().length()>0&&RegexUtils.isNumber(value)){
		    					Double d=(Double) ClassUtil.convertValueToRequiredType(value,Double.class);
	    	            		fc.setCellValue(d);
	    	            	}else{
	    	            		fc.setCellValue(value.equals("null")?"":value);
	    	            	}
		    				fc.setCellStyle(getStyle(wb,"emailBorderBlack"));
		    				doColorStyle(wb, propertyNames[n], record, row,fc,sheet);
		    			}
		    		  }
		           }
		        } while (!data.isEmpty() &&retriver!=null);
		}
		 wb.write(outputStream);
		 ((SXSSFWorkbook)wb).dispose();
		if(outputStream!=null)
			outputStream.close();
	}
}
