package org.sml.lang.chr;

public class ChrResult {
	private boolean going=true;
	private boolean breaked=false;
	private boolean filter=false;
	private String chr;
	
	public ChrResult() {
		super();
	}
	public ChrResult(String chr) {
		super();
		this.chr = chr;
	}

	public boolean isGoing() {
		return going;
	}
	public void setGoing(boolean going) {
		this.going = going;
	}
	public boolean isBreaked() {
		return breaked;
	}
	public void setBreaked(boolean breaked) {
		this.breaked = breaked;
	}
	public String getChr() {
		return chr;
	}
	public void setChr(String chr) {
		this.chr = chr;
	}
	public boolean isFilter() {
		return filter;
	}
	public void setFilter(boolean filter) {
		this.filter = filter;
	}	
}
