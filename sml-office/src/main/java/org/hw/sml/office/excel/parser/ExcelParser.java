package org.hw.sml.office.excel.parser;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

public class ExcelParser extends ExcelBaseParser{

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void execute() throws Exception{
		datas=new ArrayList();
		Workbook book=null;
		
		if(this.type.equals(Type.xls))
			//book = new HSSFWorkbook(inputStream);
			book = WorkbookFactory.create(inputStream);
		else
			//book = new XSSFWorkbook(inputStream);
			book = WorkbookFactory.create(inputStream);
		
		Sheet sheet=null;
		int size=0;
		if(sheetName!=null) sheet=book.getSheet(sheetName);
		else sheet=book.getSheetAt(0);
		size=sheet.getLastRowNum()-sheet.getFirstRowNum()+1;
		if(headNames==null){
			Row firstRow=sheet.getRow(xStart);
			headNames=builedFields(firstRow);
		}
		Row row=null;
		for (int i = xStart+1; i <size; i++) {
			row=sheet.getRow(i);
			if(Map.class.isAssignableFrom(beanClass)){
				Map<String,Object> data=new HashMap<String,Object>();
				if(row==null){
					continue;
				}
				Cell cell=null;
				Object value;
				for(int j=yStart;j<headNames.length+yStart;j++){
					cell=row.getCell(j);
					value=getValue(cell);
					data.put(headNames[j-yStart],value);
				}
				datas.add(data);
			}
		}
		end();
		
	}
	
	private  String[] builedFields(Row firstRow) {
		Iterator<Cell> iter=firstRow.cellIterator();
		List<String> ss=new ArrayList<String>();
		int i=0;
		while(iter.hasNext()){
			if(i>=yStart){
				String value=iter.next().getStringCellValue();
				if(value!=null&&value.trim().length()>0)
				ss.add(value);
			}
			i++;
		}
		return ss.toArray(new String[]{});
	}
	private  Object getValue(Cell cell) {
		try{
			return cell.getStringCellValue().trim();
		}catch(Exception e){
		}
		try{
			return cell.getNumericCellValue();
		}catch(Exception e){
		}
		try{
			return cell.getDateCellValue();
		}catch(Exception e){
		}
		try{
			return cell.toString().trim();
		}catch(Exception e){
		}
		return null;
	}
	
	public static void main(String[] args) throws Exception {
		ExcelBaseParser parser=new ExcelParser();//修改测试示例，没有提交
		parser.setFilename("F:/exe.xlsx");
		parser.setxStart(0);
		parser.setHeadNames(new String[]{"field1","field2","field3"});
		parser.init();
		parser.execute();
		System.out.println(parser.getDatas());
	}
}
