package org.hw.sml.office.excel.creater.ext;

import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.RegexUtils;

public class Excel07MultiSheetCreater extends ExcelCreater{
	/*
	 * (non-Javadoc)
	 *          eea.put("title",reportName);
				eea.put("sheetName",reportName);
				eea.put("datas",datas);
				eea.put("propertyNames", resultMapping.keySet().toArray(new String[]{}));
				eea.put("headNames", resultMapping.values().toArray(new String[]{}));
				eea.put("extInfos", jsonMapper.toObj(extInfoContent,Map.class));
	 * @see org.hw.sml.office.excel.creater.ExcelBaseCreater#execute()
	 */
	public void execute() throws Exception {
		Workbook wb = new SXSSFWorkbook();
		((SXSSFWorkbook)wb).setCompressTempFiles(true); 
		Map<String,Object> extInfos=getExtInfos();
		for(Map.Entry<String,Object> entry:extInfos.entrySet()){
			String sheetName=entry.getKey();
			Map<String,Object> info=(Map<String, Object>) entry.getValue();
			Sheet sheet = wb.createSheet(sheetName);
			sheet.setDefaultColumnWidth(10);
			String[] hns=(String[]) info.get("headNames");
			String[] pns=(String[]) info.get("propertyNames");
			List<Map<String,Object>> datas=(List<Map<String, Object>>) info.get("datas");
			int[] hls=doCellLength(hns,pns, datas);
			String _title=info.get("title").toString();
			Map<String,Object> fci=info.get("extInfos")==null?null:(Map<String,Object>)((Map<String,Object>)info.get("extInfos")).get("fieldColorInfo");
			for(int i=0;i<hls.length;i++){
				sheet.setColumnWidth(i,hls[i]*120*5);
			}
			Row row=null;
			int first=0;
			if(_title!=null){
				row= sheet.createRow(first);
				row.setHeightInPoints(30);
				Cell cell = row.createCell(0);
				cell.setCellValue(_title);
				sheet.addMergedRegion(new CellRangeAddress(0,0,0, hns.length-1));
				cell.setCellStyle(getStyle(wb,"title"));
				first++;
			}
			/**headnames*/
			int size=createHeader(hns, sheet, first, type.equals(Type.xls)?getStyle(wb,"head"):getStyle(wb,"xlsx_head"));
			first=first+size-1;
			/**具体每个字段值*/
			int start=0,limit=20000,totalCount=0;
			List data;
			 do {
		            data = retriver==null?datas:retriver.retrive(start, limit);
		            for(int i=0;i<data.size();i++,totalCount++){
		    			row = sheet.createRow(i+first+start+1);
		    			Object recordT=data.get(i);
		    			if(Map.class.isAssignableFrom(recordT.getClass())){
		    			Map<String,Object> record=(Map<String, Object>) recordT;
		    			for(int n=0;n<pns.length;n++){
		    				Cell fc=row.createCell(n);
		    				String value=String.valueOf(record.get(pns[n]));
		    				if(value.trim().length()>0&&RegexUtils.isNumber(value)){
		    					Double d=(Double) ClassUtil.convertValueToRequiredType(value,Double.class);
	    	            		fc.setCellValue(d);
	    	            	}else{
	    	            		fc.setCellValue(value.equals("null")?"":value);
	    	            	}
		    				fc.setCellStyle(getStyle(wb,"emailBorderBlack"));
		    				doColorStyle(fci,wb, pns[n],record,row,fc,sheet);
		    			}
		    		  }
		           }
		           start += limit;
		        } while (!data.isEmpty() && data.size() == limit&&retriver!=null);
		}
		 wb.write(outputStream);
			((SXSSFWorkbook)wb).dispose();
			 if(outputStream!=null)
				outputStream.close();
	}

}
