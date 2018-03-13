package org.hw.sml.helper.plugin.jdbc.resource;


import java.io.Serializable;
import java.util.List;

public class PageObject implements Serializable {
	private static final long serialVersionUID = -3213277316190699360L;

	private List<?> elements;

	private long totals = 0L; //总条数

	private int pageNo = 0;//当前页码
	
	private int pageNum = 0;//总页数

	private int pageSize = 15;// 每页条数

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
}

