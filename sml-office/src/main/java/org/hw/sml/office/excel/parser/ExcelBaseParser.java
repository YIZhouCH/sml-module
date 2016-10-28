package org.hw.sml.office.excel.parser;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.hw.sml.office.excel.ExcelBase;


/**
 * excel解析
 * @author wen
 *
 */
public abstract class ExcelBaseParser extends ExcelBase{
	
	protected  InputStream inputStream;
	
	public void init() throws Exception{
		verified();
		if(inputStream==null&&filename!=null){
			inputStream=new FileInputStream(filename);
			if(filename.toLowerCase().endsWith("xls")){
				type=Type.xls;
			}
		}
	}
	public  void verified()throws Exception{
		try {
			if(inputStream==null&&filename==null){
				//throw new Exception("verified[target filename and inputstream is null]");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public abstract void execute() throws Exception;
	public InputStream getInputStream() {
		return inputStream;
	}
	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}
	public void end(){
		if(inputStream!=null){
			try {
				inputStream.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	
}
