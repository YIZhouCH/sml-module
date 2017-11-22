package org.hw.sml.manager;

import javax.servlet.Filter;


public interface BeanFilter {
	public <T extends Filter>  T getObject() throws Exception;
}
