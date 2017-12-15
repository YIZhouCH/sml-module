package com.eastcom_sw.srpt.resource;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.service.RcptBaseService;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.tools.MapUtils;

@SmlResource
@Bean
public class SrptAssistantService extends RcptBaseService {
	
	/**
	 * 首页查询，一步查询模糊字段名称
	 * url: ../sml/invoke/srptAssistantService/queryFieldKpiNames/srpt-cfg-reportInfo
	 * @param request
	 * @param response   
	 * params    {"report_id":"2016*****","fields":"FIELD_INFO","kpi_name":"话务量"}
	 */
	public List<Map<String,Object>> queryFieldKpiNames(String mark,HttpServletRequest request,HttpServletResponse response) {
		List<Map<String,Object>> result = null; 
		try{
			String paramStr = WebTools.getRequestBody(request);
			Map<String,String> params = WebTools.fromGson(paramStr,Map.class);
			Map<String,String> field_info = super.query(mark, params);
			String fieldInfoStr = field_info.get("FIELD_INFO");
			List<Map<String,Object>> fieldsAll = WebTools.fromJson(fieldInfoStr, List.class);
			result = blurMapValueOfList(fieldsAll,"fieldname",params.get("kpi_name"));
			
		}catch(Throwable t){
			t.printStackTrace();
		}
		return result;
	}
	
	
	public static List<Map<String,Object>> blurMapValueOfList(List<Map<String,Object>> source,String mapKey,String blurValue){
        List<Map<String,Object>> result = MapUtils.newArrayList();
        if((blurValue!=null&&blurValue.isEmpty())||blurValue==null){
        	return result;
        }else{
        	 for (Map<String,Object> map : source) {
                 if(String.valueOf(map.get(mapKey)).contains(blurValue)){
                     result.add(map);
                 }
             }
             return result;
        }
       
    }
	
	
	/**
	 * 判断该报表是否支持二次过滤
	 * url: ../sml/invoke/srptAssistantService/showFilter/srpt-cfg-reportInfo
	 * @param request
	 * @param response   
	 * params    {"report_id":"2016*****"}
	 */
	public Map<String,String> showFilter(String mark,HttpServletRequest request,HttpServletResponse response) {
		Map<String,String> result = MapUtils.newHashMap(); 
		try{
			String paramStr = WebTools.getRequestBody(request);
			Map<String,String> params = WebTools.fromGson(paramStr,Map.class);
			params.put("fields", "sql_logic_info");
			Map<String,String> sqlMap = super.query(mark, params);
			String queryForSql = sqlMap.get("SQL_LOGIC_INFO");
			
			String flag = queryForSql!=null&&queryForSql.contains("{{}}")?"show":"hide";
			result.put("flag", flag);
		}catch(Throwable t){
			t.printStackTrace();
		}
		return result;
	}
	

	

}
