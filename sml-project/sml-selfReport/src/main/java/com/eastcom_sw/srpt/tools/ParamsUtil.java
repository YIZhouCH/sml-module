package com.eastcom_sw.srpt.tools;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.hw.sml.tools.Assert;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;

public class ParamsUtil {
	public static Map<String,String> trans2MapFromString(String paramsStr){
		return MapUtils.transMapFromStr(paramsStr);
	}
	
	public static List<Map<String,Object>> trans2Map2FromString(String paramsStr){
		if(!paramsStr.startsWith(" ")){
			paramsStr=" "+paramsStr;
			paramsStr=paramsStr.replaceAll("\t|\r|\n"," ");
		}
		Map<String,Object> resultMap = null;
		List<Map<String,Object>> result = new LinkedList<Map<String, Object>>();
		String[] split = paramsStr.split(" --");
	
		for(int i = 0;i<split.length;i++){
			resultMap = new HashMap<String, Object>();
			String p = split[i];
			String replaceBlank = ParamsUtil.replaceBlank(p);
			String[] split2 = replaceBlank.split("=");
			if(split2.length == 2){
				resultMap.put("column", split2[0]);
				resultMap.put("columnCN", split2[1]);
				result.add(resultMap);
				//result.put(split2[0], split2[1]);
			}else if(split2.length > 2){
				String sb = replaceBlank.substring(split2[0].length()+1, replaceBlank.length());
				resultMap.put("column", split2[0]);
				resultMap.put("columnCN", sb);
				result.add(resultMap);
				//result.put(split2[0], sb);
			}
		}
		return result;
	}
	
	public static String replaceBlank(String str) {
        String dest = "";
        if (str!=null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(str);
            dest = m.replaceAll("");
        }
        return dest;
    }
	
	public static String getTn(String sql){
		
		String temp = sql;
		if(sql!=null&&!sql.isEmpty()&&sql.contains("tableChoose")){
			List<String> matchGroup = RegexUtils.matchGroup("<select\\d* id=\"\\w+\">", temp);
			Iterator<String> it = matchGroup.iterator();
		   // while (true) { 
		    	String tmt = null;
		    	String tmtIf = null;
		    	int start=0;
		    	int startIf=0;
		    	while (true) {
		    		if (!(it.hasNext())) 
		    			break ; 
		    		String mather = (String)it.next();//<select id ="resultMapping">
		        	tmt = mather;
		        	start = temp.indexOf(tmt);//0
		        	if (temp.contains(tmt)){
		        		String mark = RegexUtils.subString(tmt, "<", " id=");//select
				    	int end = temp.indexOf("</" + mark + ">", start); //305
				    	String tm = temp.substring(start, end + ("</" + mark + ">").length());//<select id="...</select>

				    	String id = RegexUtils.subString(tm, "id=\"", "\">");//null
				    	String content = null;
				    	String tempIf = null;
				    	if(id!=null&&id.contains("tableChoose")){
				    		content = RegexUtils.subString(tm, ">", "</" + mark + ">");
				    		tempIf = content;
				    		if(tempIf.contains("<if test=")){
				    			//获取表头
					    		List<String> mathers = RegexUtils.matchGroup("<if\\d* test=\"\\s+\\S*\\s+\">", tempIf);
					    	    Iterator<String> iterator = mathers.iterator();
					    	    String matherIf = null;
					    	    while (true) {
					    	    	while (true) { 
					    	    		if (!(iterator.hasNext())) 
					    	    			break; 
					    	    		matherIf = (String)iterator.next();
					    	    	}
					    	        tmtIf = matherIf;
					    	        if (tempIf.contains(tmtIf))
					    	          break;
					    	     }
					    	      startIf = tempIf.indexOf(tmtIf);
					    	      String markIf = RegexUtils.subString(tmtIf, "<", " test=");
					    	      int endIf = tempIf.indexOf("</" + markIf + ">", startIf);
					    	      Assert.isTrue(false, markIf + " must has end!");
					    	      String tmIf = tempIf.substring(startIf, endIf + ("</" + markIf + ">").length());
					    	      content = RegexUtils.subString(tmIf, ">", "</" + mark + ">");
				    		}
				    		
				    	}
		        	}
		    }
		}
		
		return null;
	}
	
	public static List<Map<String, Object>> getResultMapping(String queryForSql){
		String mark = RegexUtils.subString(queryForSql,"<select id=\"resultMapping\">","</select>");
		if(mark!=null){
			return ParamsUtil.trans2Map2FromString(mark.trim());
		}else{
			return MapUtils.newArrayList();
		}
	}
	
	public static void main(String[] args) {
		String s = " --nihao=shdf \r\n --nih=dhfjdf --sdjf=kdfgjhd ";
		String sql = "<select id=\"resultMapping\">--KPI_201=报表日期 --KPI_202=网元名称 --KPI_001=接收的Cx接口请求消息数 --KPI_002=接收的Cx接口响应消息数 --KPI_003=始发Cx接口失败响应次数 --KPI_004=发送的Cx接口请求消息数 --KPI_005=发送的Cx接口响应消息数 --KPI_006=转发的失败的业务响应消息数 --KPI_007=转发成功Cx接口响应消息数 --KPI_008=Cx接口路由重选的业务请求消息数 --KPI_009=Cx接口业务消息转发成功率(%) --KPI_010=接收对端Cx接口请求消息业务成功率(%) </select> <select id=\"tableChooseSE\"> <if test=\" '@timeType'=='min' \">ipmsdm.DM_VOLTE_RE_NE_DRA_CX_15M</if> <if test=\" '@timeType'=='hour' \">ipmsdm.DM_VOLTE_RE_NE_DRA_CX_H</if> <if test=\" '@timeType'=='day' \">ipmsdm.DM_VOLTE_RE_NE_DRA_CX_D</if> <if test=\" '@timeType'=='week' \">ipmsdm.DM_VOLTE_RE_NE_DRA_CX_W</if> <if test=\" '@timeType'=='month' \">ipmsdm.DM_VOLTE_RE_NE_DRA_CX_M</if> </select>";
		Map<String, String> trans2MapFromString = trans2MapFromString(s);
	//	System.out.println(trans2MapFromString.toString());
		List<Object[]> values = new ArrayList<Object[]>();
		System.out.println(values.size());
	}
}
