package org.hw.sml.manager.tools;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.hw.sml.tools.MapUtils;

import com.alibaba.fastjson.JSON;

public class WebTools {
	
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
		return JSON.toJSONString(obj);
	}
	public static String toGson(Object obj){
		return toJson(obj);
	}
	public static <T> T fromGson(String json,Class<T> t){
		return fromJson(json, t);
	}
	public static <T> T fromJson(String json,Class<T> t){
		return JSON.parseObject(json,t);
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
	public static String formatJson(String jsonStr) {
        if (null == jsonStr || "".equals(jsonStr)) return "";
        StringBuilder sb = new StringBuilder();
        char last = '\0';
        char current = '\0';
        int indent = 0;
        for (int i = 0; i < jsonStr.length(); i++) {
            last = current;
            current = jsonStr.charAt(i);
            switch (current) {
                case '{':
                case '[':
                    sb.append(current);
                    sb.append('\n');
                    indent++;
                    addIndentBlank(sb, indent);
                    break;
                case '}':
                case ']':
                    sb.append('\n');
                    indent--;
                    addIndentBlank(sb, indent);
                    sb.append(current);
                    break;
                case ',':
                    sb.append(current);
                    if (last != '\\') {
                        sb.append('\n');
                        addIndentBlank(sb, indent);
                    }
                    break;
                default:
                    sb.append(current);
            }
        }
        return sb.toString();
	}
    private static void addIndentBlank(StringBuilder sb, int indent) {
            for (int i = 0; i < indent; i++) {
                sb.append('\t');
          }
     }
    public static boolean isFormMethod(HttpServletRequest request){
    	return request.getHeader("Content-Type").contains("multipart/form-data");
    }
    public static Map<String,String> upload(String uploadPath,HttpServletRequest request) throws Exception{
		Map<String,String> result=MapUtils.newHashMap();
		String filePath = null;
		boolean isFile = ServletFileUpload.isMultipartContent(request);
		if(!isFile){
			throw new Exception("Selected file is error!");
		}else{
			DiskFileItemFactory fa = new DiskFileItemFactory();
			ServletFileUpload upload = new ServletFileUpload(fa);
			upload.setHeaderEncoding("utf-8");
			File uploadDir = new File(uploadPath);
	        if (!uploadDir.exists()) {
	            uploadDir.mkdirs();
	        }
	        try {
	            List<FileItem> formItems = upload.parseRequest(request);
	            if (formItems != null && formItems.size() > 0) {
	                for (FileItem item : formItems) {
	                    if (!item.isFormField()) {
	                        String fileName = new File(item.getName()).getName();
	                        filePath = uploadPath + File.separator + fileName;
	                        File storeFile = new File(filePath);
	                        item.write(storeFile);
	                    }else{
	                    	result.put(item.getFieldName(), item.getString());
	                    }
	                }
	            }
	           
	        } catch (Exception ex) {
	        	throw new Exception("Upload file fail error like ["+ex+"]");
	        }
		}
		result.put("filePath", filePath);
		return result;
	}
    

    public static String[] buildList2Arr(List<String> ns) {
		String[] arr = new String[ns.size()];
		for (int i = 0; i < ns.size(); i++) {
			arr[i] = ns.get(i);
		}
		return arr;
	}
    
    public static List<Map<String, Object>> toObjs(Map<String, Object> param) {
		List<String> propertys=(List<String>) param.get("propertys");
		List<List<Object>> datas=(List<List<Object>>) param.get("datas");
		Map<String,Object> record = null;
		List<Map<String,Object>> result = new ArrayList<Map<String,Object>>();
		for (List<Object> data : datas) {
			record = new HashMap<String,Object>();//每条记录
			for (int i = 0; i < data.size(); i++) {
				record.put(propertys.get(i), data.get(i));//记录中个字段和属性值
			}
			result.add(record);
		}
		return result;
	}
    public static void exportPreDone(String filename,String userAgent,HttpServletResponse response){
    	String fileName=filename;
		try {
			fileName = WebTools.getContentDisposition(filename, userAgent);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		response.setHeader("Content-Disposition","attachment;" + fileName);
		response.setHeader("Connection", "close");
		response.setHeader("Content-Type", "application/octet-stream");
    }
}
