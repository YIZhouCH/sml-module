package org.hw.sml.helper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
/*
 * 表
 * 增 add
 * 删 delete 删除前备份
 * 改 update 更改前备份
 * 表 table 表单个字段进行检查 
 */
public interface ISmlTableService {
	
	public int add(String mark,HttpServletRequest request,HttpServletResponse response) throws Exception;
	
	public int update(String mark,HttpServletRequest request,HttpServletResponse response)throws Exception;
	
	public int delete(String mark,HttpServletRequest request,HttpServletResponse response)throws Exception;
	/**
	 * 
	 * @param mark   [conditionInfo,mainSql,reBuildInfo]
	 * @param request
	 * @param response
	 * @throws Exception
	 * @return obj 根据mark三个参数按参数本身意义返回
	 */
	public Object table(String mark,HttpServletRequest request,HttpServletResponse response)throws Exception;
	
}
