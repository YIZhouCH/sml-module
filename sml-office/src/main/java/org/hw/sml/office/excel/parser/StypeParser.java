package org.hw.sml.office.excel.parser;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class StypeParser extends ExcelBaseParser{
	
	
	@SuppressWarnings({ "unchecked" })
	public void execute() throws Exception {
		datas=new ArrayList<Map<String,Object>>();
		Workbook book=null;
		if(this.type.equals(Type.xls))
			book = new HSSFWorkbook(inputStream);
		else
			book = new XSSFWorkbook(inputStream);
		Sheet sheet=null;
		int size=0;
		if(sheetName!=null) sheet=book.getSheet(sheetName);
		else sheet=book.getSheetAt(0);
		size=sheet.getLastRowNum()-sheet.getFirstRowNum()+1;
		Row row=null;
		for (int i = xStart+1; i <size; i++) {
			row=sheet.getRow(i);
			if(Map.class.isAssignableFrom(beanClass)){
				Map<String,Object> data=new HashMap<String,Object>();
				data.put("book",book);
				if(row==null){
					continue;
				}
				Cell cell=null;
				Object value;
				cell=row.getCell(0);
				if(cell==null){
					continue;
				}
				data.put(headNames[0],cell.toString());
				cell=row.getCell(1);
				if(cell==null){
					continue;
				}
				value=cell.getCellStyle();
				data.put(headNames[1],value);
				datas.add(data);
			}
		}
		end();
	}
	public static void main(String[] args) throws Exception {
		StypeParser stypeParser=new StypeParser();
		URL url=StypeParser.class.getResource("/");
		stypeParser.setInputStream(StypeParser.class.getResourceAsStream("model.xls"));
		stypeParser.setType(Type.xls);
		stypeParser.setxStart(-1);
		stypeParser.init();
		stypeParser.setHeadNames(new String[]{"key","cellStype"});
		stypeParser.execute();
		System.out.println(stypeParser.getDatas());
	}
}
