package org.hw.sml.office.excel;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * excel 操作
 * @author wen
 *
 */
public class ExcelBase{

	/**
	 * 标题
	 */
	public  enum Type{
		xls,xlsx,csv
	}
	protected Type type=Type.xlsx;
	protected String title;
	
	protected String sheetName;
	
	protected String[] propertyNames;
	
	protected String[] headNames;
	/*
	 * list集合中默认为map
	 * 也可为array或任间bean
	 */
	protected Class beanClass=Map.class;

	protected List datas;
	
	protected int xStart=0;
	
	protected int yStart=0;
	
	protected String filename;
	/**
	 * 
	 * @return
	 */
	protected Map<String,Object> extInfos=new HashMap<String,Object>();
	
	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getSheetName() {
		return sheetName;
	}

	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}

	public String[] getPropertyNames() {
		return propertyNames;
	}

	public void setPropertyNames(String[] propertyNames) {
		this.propertyNames = propertyNames;
	}

	public String[] getHeadNames() {
		return headNames;
	}

	public void setHeadNames(String[] headNames) {
		this.headNames = headNames;
	}

	public Class getBeanClass() {
		return beanClass;
	}

	public void setBeanClass(Class beanClass) {
		this.beanClass = beanClass;
	}

	public List getDatas() {
		return datas;
	}

	public void setDatas(List datas) {
		this.datas = datas;
	}

	public int getxStart() {
		return xStart;
	}

	public void setxStart(int xStart) {
		this.xStart = xStart;
	}

	public int getyStart() {
		return yStart;
	}

	public void setyStart(int yStart) {
		this.yStart = yStart;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public Map<String, Object> getExtInfos() {
		return extInfos;
	}

	public void setExtInfos(Map<String, Object> extInfos) {
		this.extInfos = extInfos;
	}
	
	
	
	
}
