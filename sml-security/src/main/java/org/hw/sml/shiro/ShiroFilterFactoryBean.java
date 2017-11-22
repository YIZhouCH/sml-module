package org.hw.sml.shiro;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.Filter;

import org.apache.shiro.config.Ini;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.util.CollectionUtils;
import org.apache.shiro.util.Nameable;
import org.apache.shiro.util.StringUtils;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.filter.authc.AuthenticationFilter;
import org.apache.shiro.web.filter.authz.AuthorizationFilter;
import org.apache.shiro.web.filter.mgt.DefaultFilterChainManager;
import org.apache.shiro.web.filter.mgt.FilterChainManager;
import org.apache.shiro.web.filter.mgt.FilterChainResolver;
import org.apache.shiro.web.filter.mgt.PathMatchingFilterChainResolver;
import org.apache.shiro.web.mgt.WebSecurityManager;
import org.apache.shiro.web.servlet.AbstractShiroFilter;
import org.hw.sml.manager.BeanFilter;

public class ShiroFilterFactoryBean implements BeanFilter{
	private SecurityManager securityManager;
	private Map<String, Filter> filters;
	private Map<String, String> filterChainDefinitionMap;
	private String loginUrl;
	private String successUrl;
	private String unauthorizedUrl;
	private AbstractShiroFilter instance;
	private String filterChainDefinitionFile="classpath:shiro.ini";

	public ShiroFilterFactoryBean() {
		this.filters = new LinkedHashMap<String,Filter>();
		this.filterChainDefinitionMap = new LinkedHashMap<String,String>();
	}

	public SecurityManager getSecurityManager() {
		return this.securityManager;
	}
	
	public void setFilterChainDefinitionFile(String filterChainDefinitionFile) {
		Ini ini=new Ini();
		ini.loadFromPath(filterChainDefinitionFile);
		Ini.Section section = ini.getSection("urls");
		if (CollectionUtils.isEmpty(section)) {
			section = ini.getSection("");
		}
		setFilterChainDefinitionMap(section);
	}

	public void setSecurityManager(SecurityManager securityManager) {
		this.securityManager = securityManager;
	}

	public String getLoginUrl() {
		return this.loginUrl;
	}

	public void setLoginUrl(String loginUrl) {
		this.loginUrl = loginUrl;
	}

	public String getSuccessUrl() {
		return this.successUrl;
	}

	public void setSuccessUrl(String successUrl) {
		this.successUrl = successUrl;
	}

	public String getUnauthorizedUrl() {
		return this.unauthorizedUrl;
	}

	public void setUnauthorizedUrl(String unauthorizedUrl) {
		this.unauthorizedUrl = unauthorizedUrl;
	}

	public Map<String, Filter> getFilters() {
		return this.filters;
	}

	public void setFilters(Map<String, Filter> filters) {
		this.filters = filters;
	}

	public Map<String, String> getFilterChainDefinitionMap() {
		return this.filterChainDefinitionMap;
	}

	public void setFilterChainDefinitionMap(
			Map<String, String> filterChainDefinitionMap) {
		this.filterChainDefinitionMap = filterChainDefinitionMap;
	}
	
	public void setFilterChainDefinitions(String definitions) {
		Ini ini = new Ini();
		ini.load(definitions);

		Ini.Section section = ini.getSection("urls");
		if (CollectionUtils.isEmpty(section)) {
			section = ini.getSection("");
		}
		setFilterChainDefinitionMap(section);
	}

	@SuppressWarnings("unchecked")
	public AbstractShiroFilter getObject() throws Exception {
		if (this.instance == null) {
			this.instance = createInstance();
		}
		return this.instance;
	}
	
	public AbstractShiroFilter getInstance() {
		return instance;
	}

	public void setInstance(AbstractShiroFilter instance) {
		this.instance = instance;
	}

	public String getFilterChainDefinitionFile() {
		return filterChainDefinitionFile;
	}
	protected FilterChainManager createFilterChainManager() {
		DefaultFilterChainManager manager = new DefaultFilterChainManager();
		Map<String,Filter> defaultFilters = manager.getFilters();
		for (Filter filter : defaultFilters.values()) {
			applyGlobalPropertiesIfNecessary(filter);
		}
		Map<String,Filter> filters = getFilters();
		if (!(CollectionUtils.isEmpty(filters))) {
			for (Map.Entry<String,Filter> entry : filters.entrySet()) {
				String name = (String) entry.getKey();
				Filter filter = (Filter) entry.getValue();
				applyGlobalPropertiesIfNecessary(filter);
				if (filter instanceof Nameable) {
					((Nameable) filter).setName(name);
				}
				manager.addFilter(name, filter, false);
			}

		}

		Map<String,String> chains = getFilterChainDefinitionMap();
		if (!(CollectionUtils.isEmpty(chains))) {
			for (Map.Entry<String,String> entry : chains.entrySet()) {
				String url = (String) entry.getKey();
				String chainDefinition = (String) entry.getValue();
				manager.createChain(url, chainDefinition);
			}
		}

		return manager;
	}

	@SuppressWarnings("unchecked")
	public AbstractShiroFilter createInstance() throws Exception {
		SecurityManager securityManager = getSecurityManager();
		FilterChainManager manager = createFilterChainManager();
		PathMatchingFilterChainResolver chainResolver = new PathMatchingFilterChainResolver();
		chainResolver.setFilterChainManager(manager);
		return new ShiroFilter((WebSecurityManager) securityManager,chainResolver);
	}

	private void applyLoginUrlIfNecessary(Filter filter) {
		String loginUrl = getLoginUrl();
		if ((StringUtils.hasText(loginUrl))&&(filter instanceof AccessControlFilter)) {
			AccessControlFilter acFilter = (AccessControlFilter) filter;
			String existingLoginUrl = acFilter.getLoginUrl();
			if ("/login.jsp".equals(existingLoginUrl))
				acFilter.setLoginUrl(loginUrl);
		}
	}

	private void applySuccessUrlIfNecessary(Filter filter) {
		if ((StringUtils.hasText(successUrl))&& (filter instanceof AuthenticationFilter)) {
			AuthenticationFilter authcFilter = (AuthenticationFilter) filter;
			String existingSuccessUrl = authcFilter.getSuccessUrl();
			if ("/".equals(existingSuccessUrl))
				authcFilter.setSuccessUrl(successUrl);
		}
	}

	private void applyUnauthorizedUrlIfNecessary(Filter filter) {
		String unauthorizedUrl = getUnauthorizedUrl();
		if ((StringUtils.hasText(unauthorizedUrl))&& (filter instanceof AuthorizationFilter)) {
			AuthorizationFilter authzFilter = (AuthorizationFilter) filter;
			String existingUnauthorizedUrl = authzFilter.getUnauthorizedUrl();
			if (existingUnauthorizedUrl == null)
				authzFilter.setUnauthorizedUrl(unauthorizedUrl);
		}
	}

	private void applyGlobalPropertiesIfNecessary(Filter filter) {
		applyLoginUrlIfNecessary(filter);
		applySuccessUrlIfNecessary(filter);
		applyUnauthorizedUrlIfNecessary(filter);
	}
	
	private static final class ShiroFilter extends AbstractShiroFilter {
		protected ShiroFilter(WebSecurityManager webSecurityManager,
				FilterChainResolver resolver) {
			if (webSecurityManager == null) {
				throw new IllegalArgumentException(
						"WebSecurityManager property cannot be null.");
			}
			setSecurityManager(webSecurityManager);
			if (resolver != null)
				setFilterChainResolver(resolver);
		}
	}
}