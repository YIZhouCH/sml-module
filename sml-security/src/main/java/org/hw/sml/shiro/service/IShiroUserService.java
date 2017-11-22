package org.hw.sml.shiro.service;

import org.hw.sml.shiro.model.ShiroUser;

public interface IShiroUserService {
	public ShiroUser queryShiroUser(String username);
}
