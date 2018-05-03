package org.hw.sml.rest.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER})
public @interface Param {
	String value();
	String defaultValue() default "";
	String descr() default "";
	String type() default "string";
	boolean must() default false;
	String[] enumStrs() default {};
	String pos() default "param";
}
