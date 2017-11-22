package org.hw.sml.shiro.model;

import java.io.Serializable;
import java.util.Set;

public class ShiroUser implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -8821335385336296344L;
	private String username;
	private String password;
	private Set<String> roles;
	private Set<String> resources;
	private boolean isLocked;
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Set<String> getRoles() {
		return roles;
	}
	public void setRoles(Set<String> roles) {
		this.roles = roles;
	}
	public Set<String> getResources() {
		return resources;
	}
	public void setResources(Set<String> resources) {
		this.resources = resources;
	}
	
	public boolean isLocked() {
		return isLocked;
	}
	public void setLocked(boolean isLocked) {
		this.isLocked = isLocked;
	}
	@Override
	public String toString() {
		return "ShiroUser [username=" + username + ", password=" + password
				+ ", roles=" + roles + ", resources=" + resources + "]";
	}
	
}
