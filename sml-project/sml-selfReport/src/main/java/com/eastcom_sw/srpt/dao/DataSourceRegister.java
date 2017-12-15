package com.eastcom_sw.srpt.dao;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.hw.sml.support.SmlAppContextUtils;

public class DataSourceRegister {
	public static boolean regist(String dbid,DataSource dataSource){
		Connection con=null;
		try {
			con=dataSource.getConnection();
		} catch (SQLException e) {
			return false;
		}finally{
			if(con!=null)
				try {
					con.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
		}
		SmlAppContextUtils.getSmlContextUtils().registDataSource(dbid, dataSource);
		return true;
	}
}
