package org.hw.sml.manager.tools;

import java.util.List;

import org.hw.sml.tools.MapUtils;

public class Uris {
	private String[] uris;
	private List<String> uriList=MapUtils.newArrayList();;
	private Uris(){}
	public static Uris newUris(String[] uris){
		Uris us=new Uris();
		us.uris=uris;
		us.init();
		return us;
	}
	public Uris init(){
		for(String alu:uris){
			if(alu.contains("**")){
				alu=alu.replace("**","(.*?)");
			}else{
				alu=alu.replace("*","([\\\\w|\\\\-|:]+)");
			}
			if(!uriList.contains(alu)){
				uriList.add(alu);
			}
		}
		return this;
	}
	public boolean containUri(String uri){
		boolean flag=uriList.contains(uri);
		if(flag){
			return true;
		}else{
			for(String anonLogUrl:uriList){
				try{
					if(uri.matches(anonLogUrl)){
						return true;
					}
				}catch(Exception e){}
			}
		}
		return false;
	}
	public static Uris newUris(String urisStr,String split){
		return newUris(urisStr.split(split));
	}
	public static Uris newUris(String urisStr){
		return newUris(urisStr,",");
	}
	
}
