package org.hw.sml.helper.plugin.tools;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.hw.sml.server.NanoHTTPD.IHTTPSession;

import com.alibaba.fastjson.JSON;

public class WebTools {

	public static String toGson(Object params) {
		return JSON.toJSONString(params);
	}

	public static <T> T fromGson(String requestBody,
			Class<T> class1) {
		return JSON.parseObject(requestBody,class1);
	}
	public static Map<String,Object> buildResult(boolean successMark,String msg,Object result){
		Map<String,Object> returnResult=new LinkedHashMap<String, Object>();
		returnResult.put("success",successMark);
		returnResult.put("msg",msg);
		returnResult.put("data",result);
		return returnResult;
	}
	public static Map<String, String> buildJqParams(IHTTPSession session) {
		Map<String, String> param = null;
		Map<String,String> params=session.getParms();
		param = fromGson(params.get("params"),Map.class);
		if(param == null){
			param = new HashMap<String,String>();
		}
		param.put("limit",params.get("limit")==null?"15":params.get("limit"));
		param.put("pageNo",params.get("page")==null?"1":params.get("page"));
		param.put("page",params.get("page")==null?"1":params.get("page"));
		param.put("sord", params.get("sord"));
		if(params.get("sidx")!=null&&params.get("sidx").isEmpty()){
			param.put("sidx", null);
		}else{
			param.put("sidx", params.get("sidx"));
		}
		if(params.get("HeaderTitle")!=null){
			param.put("HeaderTitle",params.get("HeaderTitle"));
		}
		if(params.get("FileTitle")!=null){
			param.put("FileTitle",params.get("FileTitle"));
		}
		return param;
	}
}
