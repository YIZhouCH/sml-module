package org.hw.sml.manager.service;

import java.io.IOException;

import org.hw.sml.queryplugin.JsonMapper;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;


public class RcptFastJsonMapper implements JsonMapper{
	public static final ObjectMapper om=new ObjectMapper();
	public <T> T toObj(String json, Class<T> t) {
			try {
				return om.readValue(json, t);
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			return null;
	}
	public String toJson(Object value) {
			try {
				return om.writeValueAsString(value);
			} catch (JsonGenerationException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			return null;
	
	}
}
