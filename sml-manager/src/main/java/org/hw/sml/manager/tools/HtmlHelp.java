package org.hw.sml.manager.tools;

import java.io.Serializable;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.text.SimpleDateFormat;
import java.util.Date;

public class HtmlHelp implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -6202960408176696066L;

	public static RuntimeMXBean rm=ManagementFactory.getRuntimeMXBean();
	public HtmlHelp(){
		preBody.append("<!DOCTYPE html>");
		preBody.append("<html>");
		preBody.append("<head>");
		preBody.append("<style type=\"text/css\"><!--"+
				"body { font-family: arial, helvetica, sans-serif; font-size: 12px; font-weight: normal; color: black; background: white;}"+
				"th,td { font-size: 10px;}"+
				"h1 { font-size: x-large; margin-bottom: 0.5em;}"+
				"h2 { font-family: helvetica, arial; font-size: x-large; font-weight: bold; font-style: italic; color: #6020a0; margin-top: 0em; margin-bottom: 0em;}"+
				"h3 { font-family: helvetica, arial; font-size: 16px; font-weight: bold; color: #b00040; background: #e8e8d0; margin-top: 0em; margin-bottom: 0em;}"+
				"li { margin-top: 0.25em; margin-right: 2em;}"+
				".hr {margin-top: 0.25em; border-color: black; border-bottom-style: solid;}"+
				".titre	{background: #20D0D0;color: #000000; font-weight: bold; text-align: center;}"+
				".total	{background: #20D0D0;color: #ffff80;}"+
				".frontend	{background: #e8e8d0;}"+
				".backend	{background: #e8e8d0;}"+
				".rls      {letter-spacing: 0.2em; margin-right: 1px;}"+
				""+
				"a.px:link {color: #ffff40; text-decoration: none;}a.px:visited {color: #ffff40; text-decoration: none;}a.px:hover {color: #ffffff; text-decoration: none;}a.lfsb:link {color: #000000; text-decoration: none;}a.lfsb:visited {color: #000000; text-decoration: none;}a.lfsb:hover {color: #505050; text-decoration: none;}"+
				"table.tbl { border-collapse: collapse; border-style: none;}"+
				"table.tbl td { text-align: left; border-width: 1px 1px 1px 1px; border-style: solid solid solid solid; padding: 2px 3px; border-color: gray; white-space: nowrap;}"+
				"table.tbl td.ac { text-align: center;}"+
				"table.tbl th { border-width: 1px; border-style: solid solid solid solid; border-color: gray;}"+
				"table.tbl th.pxname { background: #b00040; color: #ffff40; font-weight: bold; border-style: solid solid none solid; padding: 2px 3px; white-space: nowrap;}"+
				"table.tbl th.empty { border-style: none; empty-cells: hide; background: white;}"+
				"table.tbl th.desc { background: white; border-style: solid solid none solid; text-align: left; padding: 2px 3px;}"+
				""+
				"table.lgd { border-collapse: collapse; border-width: 1px; border-style: none none none solid; border-color: black;}"+
				"table.lgd td { border-width: 1px; border-style: solid solid solid solid; border-color: gray; padding: 2px;}"+
				"table.lgd td.noborder { border-style: none; padding: 2px; white-space: nowrap;}"+
				"u {text-decoration:none; border-bottom: 1px dotted black;}"+
				"-->"+
				"</style>");
		preBody.append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
		preBody.append("<body>");
		
		endBody.append("</body>");
		endBody.append("</head>");
		endBody.append("</html>");
	}
	private StringBuffer preBody=new StringBuffer();
	
	private StringBuffer innerBody=new StringBuffer();
	
	private StringBuffer endBody=new StringBuffer();
	
	public HtmlHelp append(String title,String[] heads){
		innerBody.append("<h1>"+title+"</h1>");
		
		innerBody.append("<h5>运行pid@host："+rm.getName()+"</h5>");
		innerBody.append("<h5>服务开始时间："+new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(rm.getStartTime()))+"</h5>");
		innerBody.append("<table class=\"tbl\">");
		innerBody.append("<thead>");
		innerBody.append("<tr class=\"titre\">");
		for(String head:heads){
			innerBody.append("<th>"+head+"</th>");
		}
		innerBody.append("</tr>");
		innerBody.append("</thead>");
		innerBody.append("<tbody>");
		return this;
	}
	public HtmlHelp append(Object[] values){
		innerBody.append("<tr class=\"backend\">");
		for(Object value:values){
			innerBody.append("<td>"+value+"</td>");
		}
		innerBody.append("</tr>");
		return this;
	}
	public HtmlHelp endInnerBody(){
		innerBody.append("</tbody>");
		innerBody.append("</table>");
		return this;
	}
	public HtmlHelp append(String value){
		innerBody.append(value);
		return this;
	}
	
	public String toString(){
		return preBody.toString()+innerBody.toString()+endBody.toString();
	}
}
