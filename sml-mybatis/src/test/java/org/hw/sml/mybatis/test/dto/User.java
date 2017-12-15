package org.hw.sml.mybatis.test.dto;

import java.util.Date;
public class User {
	private String name;
	private int id;
	private Date date_;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Date getDate_() {
		return date_;
	}
	public void setDate_(Date date_) {
		this.date_ = date_;
	}
	@Override
	public String toString() {
		return "User [name=" + name + ", id=" + id + ", date_=" + date_ + "]";
	}
	
	
}
