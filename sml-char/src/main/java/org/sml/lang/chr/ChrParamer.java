package org.sml.lang.chr;

import java.util.LinkedHashMap;
import java.util.Map;

public class ChrParamer {
	private String beanName;
	private String chr;
	private int eventNotMatcher;//going break filter  000=1 001=1 100=2;
	private int eventError;//going break filter  000=1 001=1 100=2;
	private String pattern;
	private Map<String,String> extParamer=new LinkedHashMap<String, String>();
	
	public String get(String key){
		return extParamer.get(key);
	}
	
	public ChrParamer() {
		super();
	}
	
	public ChrParamer(String alias) {
		super();
		this.beanName =alias ;
	}
	public ChrParamer param(String k,String v){
		extParamer.put(k, v);
		return this;
	}
	public String getChr() {
		return chr;
	}
	public void setChr(String chr) {
		this.chr = chr;
	}
	public int getEventNotMatcher() {
		return eventNotMatcher;
	}
	public void setEventNotMatcher(int eventNotMatcher) {
		this.eventNotMatcher = eventNotMatcher;
	}
	public int getEventError() {
		return eventError;
	}
	public void setEventError(int eventError) {
		this.eventError = eventError;
	}
	public String getPattern() {
		return pattern;
	}
	public void setPattern(String pattern) {
		this.pattern = pattern;
	}
	public Map<String, String> getExtParamer() {
		return extParamer;
	}
	public void setExtParamer(Map<String, String> extParamer) {
		this.extParamer = extParamer;
	}

	public String getBeanName() {
		return beanName;
	}

	public void setBeanName(String beanName) {
		this.beanName = beanName;
	}
	
	
}
