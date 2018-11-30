package org.hw.sml.office.excel.creater.ext;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.hw.sml.office.excel.creater.ExcelBaseCreater;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;
/**
 * 
 * @author wen
 * sourceType=email  默认会传到sql那边的参数
 * --------------------------------------------------
 * 碰到单元格内容需要回车那种，通过字段是否包含RICH
 */
public abstract class ExcelCreater extends ExcelBaseCreater {
	public static final String OPTIONS_FIELD_MARK="RICH";
	public static final Integer MAX_COLUMN_WIDTH=30;//设置列值得最大长度
	protected Map<String,Object> fieldColorInfo;
	
	public void doColorInit(){
		Object obj=getExtInfos().get("fieldColorInfo");
		if(obj!=null){
			fieldColorInfo=(Map<String, Object>) obj;
		}
	}
	
	protected CellStyle getDataCellStyleWithColor(Workbook wb,String color){
		   return getDataCellStyleWithColor(wb,true,false,color);
	}
	Map<String,CellStyle> css=MapUtils.newHashMap(); 
	protected  CellStyle getDataCellStyleWithColor(Workbook wb,boolean fill,boolean isCenter,String color){
		String key=""+fill+isCenter+color;
		if(css.containsKey(key)){
			return css.get(key);
		}
		CellStyle style = wb.createCellStyle();
			if(isCenter)
			style.setAlignment(CellStyle.ALIGN_CENTER);
			style.setBorderBottom(CellStyle.BORDER_THIN); 
			style.setBorderLeft(CellStyle.BORDER_THIN);
			style.setBorderTop(CellStyle.BORDER_THIN);
			style.setBorderRight(CellStyle.BORDER_THIN);
			Font font = wb.createFont();
			font.setFontName("Times New Roman");
			short i=getColor(color);
			if(i!=-1){
				if(fill){
				  style.setFillForegroundColor(i);
				  style.setFillPattern(CellStyle.SOLID_FOREGROUND);
				}
				else{
					font.setColor(i);
				}
			}
			style.setFont(font);
			css.put(key, style);
			return style;
		}
		public short getColor(String color){
			if(color==null){
				return -1;
			}
			color=color.toUpperCase();
			try{
				return IndexedColors.valueOf(color).index;
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
			style.setLeftBorderColor(HSSFColor.BLACK.index);
			style.setBorderRight(CellStyle.BORDER_THIN);
			style.setRightBorderColor(HSSFColor.BLACK.index);
			style.setBorderTop(CellStyle.BORDER_THIN);
			style.setTopBorderColor(HSSFColor.BLACK.index);
			style.setFillForegroundColor(IndexedColors.SKY_BLUE.getIndex());
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
			style.setAlignment(CellStyle.ALIGN_CENTER); 
			return style;
		}
		/**
		 * 表头控制逻辑
		 * @param hns
		 * @param sheet
		 * @param rowIndex
		 * @param style
		 * @return
		 */
		public  int createHeader(String[] hns,Sheet sheet,int rowIndex,CellStyle style){
			Map<String,List<String>> list=MapUtils.newLinkedHashMap();
			boolean isMulti=false;
			for(int i=0;i<hns.length;i++){
				String hn=hns[i];
				String[] ls=hn.split("\\|");
				if(isMulti||ls.length==2){
					isMulti=true;
				}
				if(!list.containsKey(ls[0])){
					list.put(ls[0],new ArrayList<String>());
				}//
				list.get(ls[0]).add(ls.length==2?ls[1]:ls[0]);
			}
			if(isMulti){
				createMultiHeader(list, sheet, rowIndex, style);
			}else{
				createSingleHeader(hns, sheet, rowIndex, style);
			}
			return isMulti?2:1;
		}
		public  void createSingleHeader(String[] hns,Sheet sheet,int rowIndex,CellStyle style){
			Row row=sheet.createRow(rowIndex);
			for(int i=0;i<hns.length;i++){
				Cell cell=row.createCell(i);
				cell.setCellValue(hns[i]);
				cell.setCellStyle(style);
			}
		}
		public  void createMultiHeader(Map<String,List<String>> list,Sheet sheet,int rowIndex,CellStyle style){
			int firstRow=rowIndex;
			int firstCol=0;
			int rowstart=0;
			Row r0=sheet.createRow(rowIndex);
			Row r1=sheet.createRow(rowIndex+1);
			for(Map.Entry<String,List<String>> entry:list.entrySet()){
				List<String> vs=entry.getValue();
				int lastRow=vs.size()>1?firstRow:firstRow+1;
				int lastCol=firstCol+vs.size()-1;
				Cell c0=null;
				Cell c1=null;
				for(String v:vs){
					c0=r0.createCell(rowstart);
					c0.setCellValue(entry.getKey());
					c1=r1.createCell(rowstart);
					c1.setCellValue(v);
					if(style!=null){
						c0.setCellStyle(style);
						c1.setCellStyle(style);
					}
					rowstart++;
				}
				sheet.addMergedRegion(new CellRangeAddress(firstRow, lastRow, firstCol, lastCol));
				firstCol+=vs.size();
			}
		}
		public void doColorStyle(Map<String,Object> fieldColorInfo,Workbook wb,String currentField,Map<String,Object> record,Row row,Cell fc,Sheet sheet){
			boolean rich=currentField.contains(OPTIONS_FIELD_MARK);
			if(fieldColorInfo==null&&!rich){
				return;
			}
			if(rich&&record.get(currentField)!=null){
				String value=record.get(currentField).toString();
				CellStyle cellStyle=getDataCellStyleWithColor(wb,"field_rich");
				cellStyle.setWrapText(true);
        		fc.setCellValue(new HSSFRichTextString(value.replace(";",";\n")));
        		row.setHeightInPoints(((value.split(";").length+1)*sheet.getDefaultRowHeightInPoints()));
        		fc.setCellStyle(cellStyle);
			}else if(fieldColorInfo.containsKey(currentField)){
				Map<String,Object> fieldColor=(Map<String, Object>)fieldColorInfo.get(currentField);
				String enumType=MapUtils.getString(fieldColor,"enumType","enum");
				boolean fillColor=MapUtils.getBoolean(fieldColor,"fill",true);
				boolean isCenter=MapUtils.getBoolean(fieldColor,"center",false);
				if(enumType.equals("enum")){
					String field=fieldColor.get("field").toString();
					Map<String,String> enumColor=(Map<String, String>) fieldColor.get("enum");
					if(record.get(field)!=null){
						fc.setCellStyle(getDataCellStyleWithColor(wb,fillColor,isCenter,enumColor.get(String.valueOf(record.get(field)))));
					}
				}else{
					Object v=record.get(currentField);
					if(v!=null&&RegexUtils.isNumber(v)){
						String d=String.valueOf(v);
						String field=fieldColor.get("field").toString();
						Map<String,String> enumColor=(Map<String, String>) fieldColor.get("enum");
						if(record.get(field)!=null){
							for(Map.Entry<String,String> entry:enumColor.entrySet()){
								String key=entry.getKey();
								String value=entry.getValue();
								if(key.split(",").length==2){
									if(colorIn(key.split(","),d)){
										fc.setCellStyle(getDataCellStyleWithColor(wb,fillColor,isCenter,value));
										return;
									}
								}
							}
						}
					}
				}
			}
		}
		public void doColorStyle(Workbook wb,String currentField,Map<String,Object> record,Row row,Cell fc,Sheet sheet){
			 doColorStyle(this.fieldColorInfo, wb, currentField, record,row, fc,sheet);
		}
		

		
		 private boolean colorIn(String[] splits, String value) {
		    	boolean flag=false;
		    	try{
				flag=Double.parseDouble(value)>=Double.parseDouble(splits[0])&& Double.parseDouble(value)<=Double.parseDouble(splits[1]);
		    	}catch(Exception e){}
				return flag;
		    }
		 /**
		  * 传递一个list集合，通过集合中的数据将列宽设置成容放80%以上的列值。
		  * @param list
		  * @return
		  */
		 public Integer getColumnLenthByValue(List<Integer> list,int length) {
			 if(list==null||list.isEmpty() || list.size()==0) {
				 return 0;
			 }
			Collections.sort(list);
		    int tempLen = list.get(list.size()-1);
		    return tempLen;
				 
		 }
		 
		 /**
		  * 
		  * @param hns 列名
		  * @param datas 列数据
		  * @return
		  */
	public int[] doCellLength(String [] hns,String[] pns,List<Map<String,Object>> datas) {
		int[] length=new int[hns.length];
		//
		Map<String,List<Integer>> lns=new LinkedHashMap<String, List<Integer>>();
		//
		for(Map<String,Object> data:datas) {//遍历数据
			for(int i=0;i<hns.length;i++) {//遍历列名
				String hn=hns[i];
				String pn=pns[i];
				if(!lns.containsKey(hn)) {
					lns.put(hn,new ArrayList<Integer>());
				}
				
				int l=getStringLength(String.valueOf(data.get(pn)).length(),pn,data);
				lns.get(hn).add(l>hn.length()?l:hn.length());
			}
		}
		//
		for (int i = 0; i < hns.length; i++) {
			List<Integer> hn = lns.get(hns[i]);
			length[i] = getColumnLenthByValue(hn,hns[i].length())>MAX_COLUMN_WIDTH?MAX_COLUMN_WIDTH:getColumnLenthByValue(hn,hns[i].length());
			length[i] = hns[i].length()>length[i]?hns[i].length():length[i];
		}
		return length;
	}
	private int getStringLength(int hnLength,String pn,Map<String,Object> data){
		boolean rich=pn.contains(OPTIONS_FIELD_MARK);
		Object val=data.get(pn);
		if(val==null){
			return hnLength;
		}
		String vs=String.valueOf(val);
		if(rich){
			int vl=0;
			for(String v:vs.split(";")){
				int vtl=getStringLength0(v);
				vl=vtl>vl?vtl:vl;
			}
			return vl;
		}else{
			return getStringLength0(vs);
		}
	}
	private int getStringLength0(String val){
		int i=0;
		for(char c:val.toCharArray()){
			if(String.valueOf(c).matches("[\\u4e00-\\u9fa5]")){
				i+=2;
			}else{
				i++;
			}
		}
		return i/2+1;
	}
}
