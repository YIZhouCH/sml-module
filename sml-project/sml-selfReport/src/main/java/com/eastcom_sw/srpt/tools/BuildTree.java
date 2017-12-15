package com.eastcom_sw.srpt.tools;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Maps;


public class BuildTree {
	
	public static List<Map<String,Object>> createTree(List<Map<String,Object>> datas,String id,String pid,String children,String rootId){
		//先重组数据
		Map<String,Map<String,Object>> dts=MapUtils.newHashMap();
		Map<String,List<Map<String,Object>>> ddts=MapUtils.newHashMap();
		for(Map<String,Object> data:datas){
			dts.put(String.valueOf(data.get(id)), data);
			if(!ddts.containsKey(data.get(pid))){
				ddts.put(String.valueOf(data.get(pid)),new ArrayList<Map<String,Object>>());
			}
			ddts.get(data.get(pid)).add(data);
		}
		
		if(rootId==null){
			for(Map.Entry<String,List<Map<String,Object>>> entry:ddts.entrySet()){
				if(dts.get(entry.getKey())==null){
					rootId=entry.getKey();
					break;
				}
			}
		}
		List<Map<String,Object>> result=ddts.get(rootId);
		recursion(id,pid,children,result,dts,ddts);
		return result;
	}
	//递归
	public static void recursion(String id,String pid,String children,List<Map<String,Object>> datas,Map<String,Map<String,Object>> dts,Map<String,List<Map<String,Object>>> pdts){
		for(Map<String,Object> data:datas){
			String idt=String.valueOf(data.get(id));
			String pidt=String.valueOf(data.get(pid));
			if(pdts.containsKey(pidt)){
				List<Map<String,Object>> subPdts =pdts.get(idt);
				if(subPdts!=null&&subPdts.size()>0){
					data.put(children,subPdts);
					recursion(id,pid,children,subPdts,dts,pdts);
				}else{
					data.put(children,new LinkedList());
				}
			}
		}
	}
	public static void main(String[] args){
		List<Map<String,Object>> orders=new ArrayList<Map<String,Object>>();
		orders.add(new Maps<String,Object>().put("id","2").put("pId","1").getMap());
		orders.add(new Maps<String,Object>().put("id","2").put("pId","1").getMap());
		orders.add(new Maps<String,Object>().put("id","3").put("pId","1").getMap());
		orders.add(new Maps<String,Object>().put("id","4").put("pId","2").getMap());
		orders.add(new Maps<String,Object>().put("id","5").put("pId","2").getMap());
		orders.add(new Maps<String,Object>().put("id","6").put("pId","5").getMap());
		orders.add(new Maps<String,Object>().put("id","7").put("pId","5").getMap());
	}
}