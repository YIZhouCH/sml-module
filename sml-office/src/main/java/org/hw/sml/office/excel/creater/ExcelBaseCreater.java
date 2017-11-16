package org.hw.sml.office.excel.creater;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Map;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Workbook;
import org.hw.sml.office.excel.ExcelBase;
import org.hw.sml.office.excel.Retriver;
import org.hw.sml.office.excel.parser.StypeParser;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Maps;

public abstract class ExcelBaseCreater extends ExcelBase{
	
	protected Retriver retriver;
	
	protected String modelpath;
	
	protected int[] headlengths;
	protected Map<String,Map<String,Object>> styles=MapUtils.newHashMap();
	
	protected OutputStream outputStream;
	
	protected String creator;
	
	public OutputStream getOutputStream() {
		return outputStream;
	}
	
	@SuppressWarnings("unchecked")
	public void init() throws Exception{
		verified();
		if(outputStream==null){
			outputStream=new FileOutputStream(filename);
			if(filename.toLowerCase().endsWith("xls")){
				type=Type.xls;
			}else if(filename.toLowerCase().endsWith("csv")){
				type=Type.csv;
			}
		}
		if(!type.equals(Type.csv)){
		//
			StypeParser stypeParser=new StypeParser();
			if(modelpath==null){
				if(type.equals(Type.xls)){
					stypeParser.setType(Type.xls);
					stypeParser.setInputStream(StypeParser.class.getResourceAsStream("model.xls"));
				}
				else{
					stypeParser.setType(Type.xlsx);
					stypeParser.setInputStream(StypeParser.class.getResourceAsStream("model.xlsx"));
				}
			}
			else{
				stypeParser.setInputStream(new FileInputStream(modelpath));
			}
			stypeParser.setxStart(-1);
			stypeParser.init();
			stypeParser.setHeadNames(new String[]{"key","cellStype"});
			stypeParser.execute();
			styles=MapUtils.groupMpSingle(stypeParser.getDatas(),"key");
		}else{
			
		}
		//
	}
	

	public abstract void execute() throws Exception;
	public  void verified()throws Exception{
		try {
			if(outputStream==null&&filename==null){
				throw new Exception("verified[target filename and outputStream is null]");
			}
			if(headNames!=null&&propertyNames!=null){
				if(headNames.length!=propertyNames.length){
					headNames=propertyNames;
				}
				if(headlengths==null||headlengths.length!=headNames.length){
					headlengths=new int[headNames.length];
					for(int i=0;i<headNames.length;i++){
						headlengths[i]=headNames[i].length()>10?headNames[i].length():10;
					}
				}
			}
		
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public void setOutputStream(OutputStream outputStream) {
		this.outputStream = outputStream;
	}
	public CellStyle getStyle(Workbook wb,String key){
		Map<String,Object> data=styles.get(key);
		String name=key+"_new";
		if(key.equals("xlsx_head")){
			styles.put(key+"_new",new Maps<String,Object>().put("cellStype",getHeaderStyle(wb)).getMap());
		}
		if(key.equals("xlsx_data")){
			styles.put(key+"_new",new Maps<String,Object>().put("cellStype",getDataCellStyleWithColor(wb,"")).getMap());
		}
		if(key.equals("xlsx_data_color")){
			styles.put(key+"_new",new Maps<String,Object>().put("cellStype",getDataCellStyleWithColor(wb,"LIGHT_TURQUOISE")).getMap());
		}
		if(!styles.containsKey(name)){
			if(data!=null){
				CellStyle cs=wb.createCellStyle();
				copyCellStyle((Workbook)data.get("book"),(CellStyle)data.get("cellStype"),cs);
				styles.put(name,new Maps<String,Object>().put("cellStype",cs).getMap());
			}else{
				styles.put(name, new Maps<String,Object>().put("cellStype",getDataCellStyleWithColor(wb,key)).getMap());
			}
		}
		return (CellStyle)styles.get(name).get("cellStype");
	}

	

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}
	
	public  void copyCellStyle(Workbook workbook, CellStyle fromStyle,  
            CellStyle toStyle) {  
		toStyle.cloneStyleFrom(fromStyle);
    }
	protected  CellStyle getDataCellStyleWithColor(Workbook wb,String color){
		CellStyle style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setBorderBottom(CellStyle.BORDER_THIN);  
		//style.setBottomBorderColor(HSSFColor.BLACK.index);
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(HSSFColor.BLACK.index);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(HSSFColor.BLACK.index);
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(HSSFColor.BLACK.index);
		short i=getColor(color);
		if(i!=-1){
			style.setFillForegroundColor(i);
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		}
	//	style.setFillPattern(CellStyle.SOLID_FOREGROUND);    //zxw fix 20160711 
		//style.setAlignment(CellStyle.ALIGN_RIGHT); 
		return style;
	}
	public short getColor(String color){
		color=color.toUpperCase();
		try{
			return (short) IndexedColors.valueOf(color).getIndex();
		}catch(Throwable t){}
		return -1;
    }
	public  CellStyle getHeaderStyle(Workbook wb){
		CellStyle style = wb.createCellStyle();
		Font font = wb.createFont();
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		font.setFontHeightInPoints((short) 12 ); 
		style.setFont(font);
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setBorderBottom(CellStyle.BORDER_THIN);  
		//style.setBottomBorderColor(HSSFColor.BLACK.index);
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(HSSFColor.BLUE.index);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(HSSFColor.BLUE.index);
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(CellStyle.BORDER_THIN);
		style.setFillForegroundColor(IndexedColors.SKY_BLUE.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setAlignment(CellStyle.ALIGN_CENTER); 
		return style;
	}
	
	public Retriver getRetriver() {
		return retriver;
	}

	public void setRetriver(Retriver retriver) {
		this.retriver = retriver;
	}

	public String getModelpath() {
		return modelpath;
	}

	public void setModelpath(String modelpath) {
		this.modelpath = modelpath;
	}

	public int[] getHeadlengths() {
		return headlengths;
	}

	public void setHeadlengths(int[] headlengths) {
		this.headlengths = headlengths;
	}

	public Map<String, Map<String, Object>> getStyles() {
		return styles;
	}

	public void setStyles(Map<String, Map<String, Object>> styles) {
		this.styles = styles;
	}
}
