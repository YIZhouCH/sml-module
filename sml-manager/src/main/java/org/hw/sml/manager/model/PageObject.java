package org.hw.sml.manager.model;


import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class PageObject implements Serializable {
	private static final long serialVersionUID = -3213277316190699360L;

	private List<?> elements;

	private long totals = 0L; //总条数

	private int pageNo = 0;//当前页码
	
	private int pageNum = 0;//总页数

	private int pageSize = 15;// 每页条数
	
	private Map<String,Object> extInfo;

	public PageObject() {

	}

	public PageObject(List<?> elements1, long totalElements, int pageNo,
			int pageSize) {
		this.elements = elements1;

		this.totals = totalElements;

		this.pageNo = pageNo;
		this.pageSize = pageSize;
		if (this.pageNo == Integer.MAX_VALUE
				|| this.pageNo > getPageNo()) {
			this.pageNo = getPageNo();
		}
		
		initPageNum();
	}
	
	private void initPageNum(){
		long totals = this.totals;
		int pageSize = this.pageSize;
		if (totals % pageSize == 0)
			this.pageNum = (int)(totals / pageSize);
		else
			this.pageNum = (int)(totals / pageSize + 1);
	}
	
	public int getPageNum() {
		return pageNum;
	}

	public int getPageNo() {
		return pageNo;
	}
	
	public void setPageNo(int pageNumber) {
		this.pageNo = pageNumber;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
		initPageNum();
	}

	public List<?> getElements() {
		return elements;
	}

	public void setElements(List<?> elements) {
		this.elements = elements;
	}

	public long getTotal() {
		return totals;
	}

	public void setTotal(long totalElements) {
		this.totals = totalElements;
		initPageNum();
	}

	public long getTotals() {
		return totals;
	}

	public void setTotals(long totals) {
		this.totals = totals;
	}

	public Map<String, Object> getExtInfo() {
		return extInfo;
	}

	public void setExtInfo(Map<String, Object> extInfo) {
		this.extInfo = extInfo;
	}

	public void setPageNum(int pageNum) {
		this.pageNum = pageNum;
	}
	
}

