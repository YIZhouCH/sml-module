package org.hw.sml.manager.service;

import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.queryplugin.JsonMapper;


public class RcptFastJsonMapper implements JsonMapper{
	public <T> T toObj(String json, Class<T> t) {
			return WebTools.fromJson(json, t);
	}
	public String toJson(Object obj) {
			return WebTools.toJson(obj);
	
	}
}
