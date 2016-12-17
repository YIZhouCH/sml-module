package org.hw.sml.support;

import java.beans.PropertyVetoException;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public class ComboPooledDataSourceT {
	public static void main(String[] args) throws PropertyVetoException {
		ComboPooledDataSource cpd=new ComboPooledDataSource();
		cpd.setDriverClass("");
	}
}
