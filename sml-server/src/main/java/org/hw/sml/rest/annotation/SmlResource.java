package org.hw.sml.rest.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE,ElementType.METHOD})
public @interface SmlResource {
	String value() default "";
    String method() default "";
    String produces() default APPLICATION_JSON;
    String charset() default "utf-8";
	
	public static final String GET="GET";
	public static final String POST="POST";
	public static final String PUT="PUT";
	public static final String DELETE="DELETE";
	public static final String OPTIONS="OPTIONS";
	public static final String TRACE="TRACE";
	
	public static final String APPLICATION_JSON="application/json";
	public static final String APPLICATION_XML="application/xml";
	public static final String TEXT_HTML="text/html";
	public static final String TEXT_PLAIN="text/plain";
	public static final String OCTET_STREAM="application/octet-stream";
}
