package org.hw.sml.http.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Http {
	String value() default "/";
	String method() default METHOD_GET;
	String url() default "";
	String[] headers() default {};
	public static final String METHOD_GET="GET";
	public static final String METHOD_POST="POST";
	public static final String METHOD_POSTFORM="POSTFORM";
}
