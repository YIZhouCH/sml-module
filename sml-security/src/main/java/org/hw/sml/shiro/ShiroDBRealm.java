package org.hw.sml.shiro;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.hw.sml.shiro.model.ShiroUser;
import org.hw.sml.shiro.service.IShiroUserService;
import org.hw.sml.support.security.CyptoUtils;

public class ShiroDBRealm extends AuthorizingRealm{
	private IShiroUserService shiroUserService;

	protected AuthorizationInfo doGetAuthorizationInfo(
			PrincipalCollection principal) {
		ShiroUser user=(ShiroUser) principal.getPrimaryPrincipal();
		SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
		info.setRoles(user.getRoles());
		info.setStringPermissions(user.getResources());
		return info;
	}

	protected AuthenticationInfo doGetAuthenticationInfo(
			AuthenticationToken authenticationToken)
			throws AuthenticationException {
		UsernamePasswordToken up=(UsernamePasswordToken) authenticationToken;
		if(up.getUsername()==null){
			 throw new UnknownAccountException();
		}
		ShiroUser user =shiroUserService.queryShiroUser(up.getUsername());
		if(user.getPassword()==null){
			throw new UnknownAccountException();
		}
		if(user.isLocked()){
			throw new LockedAccountException();
		}
		up.setPassword(CyptoUtils.encode(user.getSalt(),new String(up.getPassword())).toCharArray());
		return new SimpleAuthenticationInfo(user,user.getPassword(),getName());
	}

	public IShiroUserService getShiroUserService() {
		return shiroUserService;
	}

	public void setShiroUserService(IShiroUserService shiroUserService) {
		this.shiroUserService = shiroUserService;
	}
	
}
