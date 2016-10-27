package org.hw.sml.manager.tools;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.tools.MapUtils;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

public class WebTools {
public static final ObjectMapper om=new ObjectMapper();
	
	public static final Gson gson=new Gson();
	
	/**
	 * 输出到界面
	 * @param response
	 * @param obj
	 */
	public static void print(HttpServletResponse response,Object obj){
		Object result=obj;
		if(!(obj instanceof String)){
			result=toJson(obj);
		}
		try {
			response.getWriter().print(result);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 绑定返回集
	 * @param successMark
	 * @param msg
	 * @param result
	 * @return
	 */
	public static Map<String,Object> buildResult(boolean successMark,String msg,Object result){
		Map<String,Object> returnResult=new LinkedHashMap<String, Object>();
		returnResult.put("success",successMark);
		returnResult.put("msg",msg);
		returnResult.put("data",result);
		return returnResult;
	}
	public static String toJson(Object obj){
		try {
			return om.writeValueAsString(obj);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	public static String toGson(Object obj){
		return gson.toJson(obj);
	}
	public static <T> T fromGson(String json,Class<T> t){
		return gson.fromJson(json, t);
	}
	public static <T> T fromJson(String json,Class<T> t){
		try {
			return om.readValue(json, t);
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * jqgrid插件查询
	 * @param request
	 * @return
	 */
	public static Map<String, String> buildJqParams(HttpServletRequest request) {
		Map<String, String> param = null;
		param = fromGson(request.getParameter("params"),Map.class);
		if(param == null){
			param = new HashMap<String,String>();
		}
		param.put("limit",request.getParameter("limit")==null?"15":request.getParameter("limit"));
		param.put("pageNo",request.getParameter("page")==null?"1":request.getParameter("page"));
		param.put("page",request.getParameter("page")==null?"1":request.getParameter("page"));
		param.put("sord", request.getParameter("sord"));
		if(request.getParameter("sidx")!=null&&request.getParameter("sidx").isEmpty()){
			param.put("sidx", null);
		}else{
			param.put("sidx", request.getParameter("sidx"));
		}
		if(request.getParameter("HeaderTitle")!=null){
			param.put("HeaderTitle",request.getParameter("HeaderTitle"));
		}
		if(request.getParameter("FileTitle")!=null){
			param.put("FileTitle",request.getParameter("FileTitle"));
		}
		return param;
	}
	/**
	 * request获取所有查询参数，不支持多个同名值传输
	 * @param request
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static Map<String,String> toMap(HttpServletRequest request){
		Map<String,String> result=MapUtils.newHashMap();
		Map<String,Object> strs=request.getParameterMap();
		for (String key : strs.keySet()) {
			result.put(key,request.getParameter(key));
		}
		return result;
	}
	/**
	 * @throws IOException 
	 * 
	 */
	public static String getRequestBody(HttpServletRequest request) throws IOException{
		String result="";
		InputStream is=request.getInputStream();
		if(is!=null){
			BufferedReader in = new BufferedReader(new InputStreamReader(is));
			String line;
			while ((line = in.readLine()) != null) {
				result += line;
			}
		}
		return result;
	}
	public static String[] getUris(String uri){
		if(uri.startsWith("/")){
			uri=uri.substring(1,uri.length());
		}
		return uri.split("/");
	}
	public static String getContentDisposition(String fileName, String userAgent) throws UnsupportedEncodingException {
		String rtn=fileName;
		String newFileName = URLEncoder.encode(fileName, "UTF-8");
		 if (userAgent != null) {
	            userAgent = userAgent.toLowerCase();
	            if (userAgent.contains("msie")) {
	                rtn = "filename=\"" + newFileName + "\"";
	            }
	            else if (userAgent.contains("opera")) {
	                rtn = "filename*=UTF-8''" + newFileName;
	            }
	            else if (userAgent.contains("safari")) {
	                rtn = "filename=\"" + new String(fileName.getBytes("UTF-8"), "ISO8859-1") + "\"";
	            }
	            else if (userAgent.contains("applewebkit")) {
	                rtn = "filename=\"" + newFileName + "\"";
	            }
	            else if (userAgent.contains("mozilla")) {
	                rtn = "filename*=UTF-8''" + newFileName;
	            }
	        }
		return rtn;
	}
	public static void main(String[] args) {
		System.out.println(Arrays.asList(getUris("/3/4/5/6/7/8")));
	}
}
