package org.hw.sml.manager;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.tools.Assert;

public class DelegatingFilterProxy implements Filter{
	
	private boolean targetFilterLifecycle;
	private String filterName;
	private BeanFilter beanFilter;
	public void init(FilterConfig filterConfig) throws ServletException {
		filterName=filterConfig.getFilterName();
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		beanFilter=(BeanFilter)BeanHelper.getBean(filterName);
		Assert.notNull(beanFilter,"beanFilter ["+filterName+"] bean not exsits");
		try {
			beanFilter.getObject().doFilter(request, response, chain);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void destroy() {
		if(targetFilterLifecycle){
			try {
				beanFilter.getObject().destroy();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
