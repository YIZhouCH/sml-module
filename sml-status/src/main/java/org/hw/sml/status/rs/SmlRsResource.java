package org.hw.sml.status.rs;

import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.el.ElException;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
@Bean
@SmlResource("sml")
public class SmlRsResource {
	@SmlResource("cmd")
	public Object evel(String elp){
		try {
			return BeanHelper.evelV(elp);
		} catch (IllegalArgumentException e) {
			return e.toString();
		} catch (ElException e) {
			return e.toString();
		}
	}
}
