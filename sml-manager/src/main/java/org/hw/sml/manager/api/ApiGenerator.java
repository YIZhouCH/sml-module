package org.hw.sml.manager.api;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import org.hw.sml.rest.annotation.Body;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.PathParam;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;

@Bean
public class ApiGenerator {
	Map<String,List<Map<String,Object>>> result;
	public  Map<String,List<Map<String,Object>>> getApi() {
		if(result!=null){
			return result;
		}
		Map<String,Object> beans=BeanHelper.getBeanMap();
		for(Object bean:beans.values()){
			Class<?> clazz=bean.getClass();
			SmlResource classSmlResource=clazz.getAnnotation(SmlResource.class);
			String baseUrl=classSmlResource.value();
			String classDescr=classSmlResource.descr().equals("")?(baseUrl.equals("")?clazz.getSimpleName():baseUrl):classSmlResource.descr();
			List<Map<String,Object>> data=MapUtils.newArrayList();
			result.put(classDescr,data);
			for(Method method:ClassUtil.getMethods(clazz)){
				SmlResource smlResource=method.getAnnotation(SmlResource.class);
				if(smlResource==null) continue;
				Map<String,Object> ele=MapUtils.newLinkedHashMap();
				ele.put("ifId",(baseUrl+"/"+smlResource.value()).replaceAll("/{2,}","/"));
				ele.put("descr",smlResource.descr());
				//对参数进行解析
				data.add(ele);
				Annotation[][] ats=method.getParameterAnnotations();
				List<Map<String,Object>> params=MapUtils.newArrayList();
				ele.put("params",params);
				boolean isBodyRequest=false;
				String requestBody="";
 				for(Annotation[] at:ats){
 					Map<String,Object> param=MapUtils.newLinkedHashMap();
 					if(at.length==0) continue;
 					Annotation ap=at[0];
 					if(ap instanceof Param){
 						Param pa=(Param) ap;
 						param.put("name",pa.value());
 						param.put("descr",pa.descr());
 						param.put("enums", pa.enumStrs());
 						param.put("type",pa.type());
 						param.put("pos",pa.pos());
 						param.put("must",pa.must());
 						param.put("defaultValue",pa.defaultValue());
 					}else if(ap instanceof PathParam){
 						PathParam pa=(PathParam) ap;
 						param.put("name",pa.value());
 						param.put("descr", pa.descr());
 						param.put("type",pa.type());
 						param.put("pos","path");
 						param.put("enums",pa.enumStrs());
 					}else if(ap instanceof Body){
 						isBodyRequest=true;
 						Body pa=(Body) ap;
 						requestBody=pa.descr();
 					}
 					params.add(param);
				}
 				if(isBodyRequest){
 					ele.put("method","body[post]");
 					ele.put("requestBody",requestBody);
 				}else{
 					ele.put("method","form[get|post]");
 				}
			}
		}
		return result;
	}
}
