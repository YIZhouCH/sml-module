package org.hw.sml.shiro.filter;

import java.io.IOException;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter;

public class URLPermissionsFilter extends PermissionsAuthorizationFilter{

	public boolean isAccessAllowed(ServletRequest request,
			ServletResponse response, Object mappedValue) throws IOException {
		 return super.isAccessAllowed(request, response, buildPermissions(request));
	}
	protected String[] buildPermissions(ServletRequest request) {
		String[] perms = new String[1];
		HttpServletRequest req = (HttpServletRequest) request;
		String servletpath = req.getContextPath();
		String path=req.getRequestURI().replaceFirst(servletpath,"");
		if(!path.startsWith("/")){
			path="/"+path;
		}
		perms[0] = path;
		return perms;
	}
}