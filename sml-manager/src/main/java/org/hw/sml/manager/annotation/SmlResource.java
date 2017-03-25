package org.hw.sml.manager.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE,ElementType.METHOD})
public @interface SmlResource {
	String value() default "";
    String method() default "";
	
	public static final String GET="GET";
	public static final String POST="POST";
	public static final String PUT="PUT";
	public static final String DELETE="DELETE";
	public static final String OPTIONS="OPTIONS";
	public static final String TRACE="TRACE";
}
