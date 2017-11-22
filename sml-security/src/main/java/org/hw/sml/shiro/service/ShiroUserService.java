package org.hw.sml.shiro.service;

import java.util.HashSet;

import org.hw.sml.shiro.model.ShiroUser;

public class ShiroUserService implements IShiroUserService{

	public ShiroUser queryShiroUser(String username) {
		ShiroUser su=new ShiroUser();
		su.setUsername(username);
		su.setPassword("123456");
		su.setRoles(new HashSet<String>(){{
			add("admin");
		}});
		su.setResources(new HashSet<String>(){{
			add("/sml/query/area-pm");
			add("/sml/query/area-enum-area");
		}});
		return su;
	}
	
}
