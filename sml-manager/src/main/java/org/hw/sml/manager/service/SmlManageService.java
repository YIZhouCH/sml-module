package org.hw.sml.manager.service;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.core.build.SmlTools;
import org.hw.sml.manager.model.PageObject;
import org.hw.sml.manager.tools.HtmlHelp;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.model.Result;
import org.hw.sml.office.excel.ExcelBase.Type;
import org.hw.sml.office.excel.Retriver;
import org.hw.sml.office.excel.creater.Excel03Creater;
import org.hw.sml.office.excel.creater.Excel07Creater;
import org.hw.sml.office.excel.creater.ExcelBaseCreater;
import org.hw.sml.office.excel.creater.ExcelCsvCreater;
import org.hw.sml.report.model.Constants;
import org.hw.sml.report.model.Update;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ClassHelper;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.tools.ClassUtil;
import org.hw.sml.tools.MapUtils;
/**
 * 用传统servlet发布资源
 * @author wen
 *
 */
//@SmlResource
public class SmlManageService extends RcptBaseService implements ISmlManageService{
	private static final String COMMON="common";
	/**
	 * 接口概览
	 * @param uri
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	public void index(String uri,HttpServletRequest request,HttpServletResponse response) throws Exception{
		if(uri.equals("default")||uri.equals(COMMON))
			uri="com.eastcom_sw";
		List<Class<?>>  smlLstClass=ClassHelper.getClassListByAnnotation(uri, SmlResource.class);
		response.setContentType("text/html;charset=utf-8");
		HtmlHelp ht=new HtmlHelp();
		ht.append("sml resource manager",new String[]{"类名","方法名","访问"});
		for(Class<?> smlClass:smlLstClass){
			Method[] methods=ClassUtil.getMethods(smlClass);
			String className=smlClass.getName();
			for(Method method:methods){
				java.lang.reflect.Type[] types=method.getGenericParameterTypes();
				if(types==null||types.length!=3||!types[1].equals(HttpServletRequest.class)||!types[2].equals(HttpServletResponse.class)){
					continue;
				}
				//
				String methodName=method.getName();
				ht.append(new Object[]{className,methodName,"<a href='../invoke/"+(smlClass.getSimpleName().substring(0,1).toLowerCase()+smlClass.getSimpleName().substring(1))+"/"+methodName+"/all'>点击</a>"});
			}
		}
		ht.endInnerBody();
		response.getWriter().append(ht.toString());
	}
	/**
	 * 修改操作
	 * @throws IOException 
	 * @throws Exception 
	 */
	public void update(String updateStatus,HttpServletRequest request,HttpServletResponse response){
		try{
			if(!request.getMethod().equals("POST")){
				throw new Exception("method not support ["+request.getMethod()+"]");
			}
			Object result=null;
			String requestBody=null;
			if(WebTools.isFormMethod(request)){
				requestBody=WebTools.toGson(WebTools.toMap(request));
			}else{
				requestBody= WebTools.getRequestBody(request);
			}
			if(requestBody==null||requestBody.length()<3){
				throw new Exception("reqeuest body is empty!");
			}
			if(requestBody.startsWith("[")&&requestBody.endsWith("]")&&updateStatus.equals(COMMON)){
				List<Update> updateDatas=MapUtils.newArrayList();
				@SuppressWarnings("unchecked")
				List<Map<String,Object>> updates=WebTools.fromGson(requestBody,List.class);
				for(Map<String,Object> update:updates){
					updateDatas.add(WebTools.fromGson(WebTools.toGson(update),Update.class));
				}
				result=super.update(updateDatas);
			}else{
				Update update=null;
				if(updateStatus.equals(Constants.TYPE_INSERT)){
					update=WebTools.fromGson(requestBody,Update.class);
					result=super.add(update);
				}else if(updateStatus.equals(Constants.TYPE_UPDATE)){
					update=WebTools.fromGson(requestBody,Update.class);
					result=super.update(update);
				}else if(updateStatus.equals(Constants.TYPE_DELETE)){
					update=WebTools.fromGson(requestBody,Update.class);
					result=super.delete(update);
				}else if(updateStatus.equals(Constants.TYPE_ADU)){
					update=WebTools.fromGson(requestBody,Update.class);
					result=super.adu(update);
				}else if(updateStatus.equals(COMMON)){
					update=WebTools.fromGson(requestBody,Update.class);
					if(update.getType().equals(Constants.TYPE_INSERT)){
						result=super.add(update);
					}else if(update.getType().equals(Constants.TYPE_UPDATE)){
						result=super.update(update);
					}else if(update.getType().equals(Constants.TYPE_ADU)){
						result=super.adu(update);
					}else if(update.getType().equals(Constants.TYPE_DELETE)){
						result=super.delete(update);
					}
				}else{ 
					Map<String,Object> paramt = WebTools.fromGson(requestBody,Map.class);
					Map<String,String> param=SmlTools.rebuildSimpleKv(paramt);
					param.put("ifId", updateStatus);
					result = super.update(param);
				}
			}
			WebTools.print(response,WebTools.buildResult(true,"success", result));
		}catch(Exception e){
			e.printStackTrace();
			WebTools.print(response,WebTools.buildResult(false,e.getMessage(), e.getMessage()));
		}
	}
	/**
	 * 查询操作
	 * @param uri
	 * @param requestBody
	 * @param request
	 * @param response
	 */
	public void query(String queryStatus,HttpServletRequest request,HttpServletResponse response){
		Object result=null;
		try{
			if(request.getMethod().equals("GET")){
				Map<String,String> params=WebTools.toMap(request);
				if(!queryStatus.equals(COMMON))
				params.put("ifId",queryStatus);
				result=super.query(params.get("ifId"),params);
			}else{
				if(request.getParameter("params")!=null){//jqGrid分页
					Map<String,String> params=WebTools.buildJqParams(request);
					if(!queryStatus.equals(COMMON))
					params.put("ifId",queryStatus);
					Result pages=super.page(params);
					PageObject resultt=new PageObject(pages.getDatas(),pages.getCount(),Integer.parseInt(params.get("page")),Integer.parseInt(params.get("limit")));
					resultt.setExtInfo(pages.getExtInfo());
					result=resultt;
				}else{//body接参数或者
					Map<String,String> params=WebTools.toMap(request);
					String body=WebTools.getRequestBody(request);
					if(body!=null&&body.length()>2&&body.contains("{")&&body.contains("}")){//body参数处理
						Map<String,String> bodyParams=WebTools.fromGson(body,Map.class);
						params.putAll(bodyParams);
					}
					if(!queryStatus.equals(COMMON))
					params.put("ifId",queryStatus);
					result=super.query(params.get("ifId"),params);
				}
			}
			WebTools.print(response,WebTools.buildResult(true,"success", result));
		}catch(Exception e){
			e.printStackTrace();
			WebTools.print(response,WebTools.buildResult(false,e.getMessage(),e.getMessage()));
		}
	}
	/**
	 * 导出方法
	 * @param queryStatus  :export|exportOriginal
	 * @param request
	 * @param response
	 * @throws Exception 
	 */
	public void export(String queryStatus,HttpServletRequest request,HttpServletResponse response) throws Exception{
		ExcelBaseCreater excel = null;
		String title = null;
		String sheetName = null;
		if(queryStatus.equals("export")){//jqGrid
			final Map<String,String> param = WebTools.buildJqParams(request);
			LoggerHelper.getLogger().info(getClass(),"export params:"+param);
			System.out.println("export params:"+param);
			title = param.get("FileTitle");
			String headerTitle=param.get("HeaderTitle");
			HeaderTitle ht=new HeaderTitle(headerTitle);
			String exportType = param.get("exportType");
			
			
			if(exportType==null||exportType.equals(Type.xls.toString())){
				excel=new Excel03Creater();
			}else if(exportType.equals(Type.xlsx.toString())){
				excel=new Excel07Creater();
			}else if(exportType.equals(Type.csv.toString())){
				excel=new ExcelCsvCreater();
			}else{
				excel=new Excel03Creater();
			}
			excel.setHeadNames(ht.hns);
			excel.setPropertyNames(ht.pns);
			excel.setSheetName(title);
			if(param.get("exportType")==null)
				excel.setType(Type.xls);
			else{
				excel.setType(Type.valueOf(param.get("exportType")));
			}
			excel.setTitle(title);
			excel.setRetriver(new Retriver() {
				public  List<Map<String,Object>> retrive(int start, int limit) {
					param.put("pageNo",String.valueOf(1+(start/limit)));
					param.put("page",String.valueOf(1+(start/limit)));
					param.put("limit",String.valueOf(limit));
					if(param.containsKey("ifId")){
						Object obj= query(param.get("ifId"),param);
						if(obj instanceof Result){
							return ((Result)obj).getDatas();
						}else{
							return (List)obj;
						}
					}else{
						return page(param).getDatas();
					}
				}
			});
		}else if(queryStatus.equals("exportOriginal")){
			
			Map<String, Object> param = WebTools.fromGson(request.getParameter("params"),Map.class);
			LoggerHelper.getLogger().debug(getClass(),"export params:"+param);
			title = param.get("title")==null?null:String.valueOf(param.get("title"));
			sheetName = String.valueOf(param.get("sheetName"));
			System.out.println("sheetName:"+sheetName+"---title:"+title);
			String exportType = String.valueOf(param.get("type"));
			List<String> propertys=(List<String>) param.get("propertys");
			String[] pns = WebTools.buildList2Arr(propertys);
			List<String> heads=(List<String>) param.get("heads");
			String[] hns = WebTools.buildList2Arr(heads);
			final Map<String,String> params= (Map<String,String>)param.get("params");
			final List<Map<String,Object>> datas= WebTools.toObjs(param);
			
			if(exportType==null||(exportType!=null&&exportType.equals(Type.xls.toString()))){
				excel=new Excel03Creater();
			}else if(exportType.equals(Type.xlsx.toString())){
				excel=new Excel07Creater();
			}else if(exportType.equals(Type.csv.toString())){
				excel=new ExcelCsvCreater();
			}else{
				excel=new Excel03Creater();
			}
			excel.setHeadNames(hns);
			excel.setPropertyNames(pns);
			excel.setSheetName(title==null?sheetName:title);
			if(exportType==null)
				excel.setType(Type.xls);
			else{
				excel.setType(Type.valueOf(exportType));
			}
			excel.setTitle(title);

			if(datas==null||(datas!=null&&datas.size()==0)){//根据ifId查询数据导出
				excel.setRetriver(new Retriver() {
					public  List<Map<String,Object>> retrive(int start, int limit) {
						params.put("pageNo",String.valueOf(1+(start/limit)));
						params.put("page",String.valueOf(1+(start/limit)));
						params.put("limit",String.valueOf(limit));
						if(params.containsKey("ifId")){
							Object obj= query(String.valueOf(params.get("ifId")),params);
							if(obj instanceof Result){
								return ((Result)obj).getDatas();
							}else{
								return (List)obj;
							}
						}else{
							return page(params).getDatas();
						}
					}
				});
			}else{//直接使用前台传入的结果数据导出
				excel.setDatas(datas);
			}
		}
		WebTools.exportPreDone(title==null?sheetName+"."+excel.getType().name():title+"."+excel.getType().name(), request.getHeader("User-Agent"), response);
		OutputStream os = response.getOutputStream();
		excel.setOutputStream(os);
		excel.init();
		excel.execute();
	}
	/**
	 *uri      /sml/invoke/{beanName}/{method}/{mark}
	 *所有bean只要符合上面uri都可以调用并用有@SmlResource注解
	 * @param mark
	 * @param request
	 * @param response
	 */
	public void invoke(String mark,HttpServletRequest request,HttpServletResponse response){
		Object invokeBean=BeanHelper.getBean(mark);
		if(invokeBean==null){
			 WebTools.print(response,WebTools.buildResult(false,"bean["+mark+"] not exists!",null));
			 return;
		}
		SmlResource smlResource=invokeBean.getClass().getAnnotation(SmlResource.class);
		if(smlResource==null){
			WebTools.print(response,WebTools.buildResult(false,"bean["+mark+"] not support[@SmlResource]!",null));
			 return;
		}
		String[] uris=WebTools.getUris(request.getPathInfo());
		if(uris.length<3){
			WebTools.print(response,WebTools.buildResult(false,"uri error["+request.getRequestURI()+"]",null));
			return;
		}
		String invokeMethod=uris[2];
		String invokeMark=uris.length>=4?uris[3]:"";
		try {
			Method method=invokeBean.getClass().getMethod(invokeMethod,String.class,HttpServletRequest.class,HttpServletResponse.class);
			Object obj=method.invoke(invokeBean,invokeMark,request,response);
			if(obj!=null){
				if(obj instanceof String&&obj.toString().startsWith(WebTools.REDIRECT)){
					request.getRequestDispatcher(obj.toString().replaceFirst(WebTools.REDIRECT,"")).forward(request, response);
					return;
				}
				WebTools.print(response,WebTools.buildResult(true,"success",obj));
			}
		}catch (NoSuchMethodException e) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			WebTools.print(response,WebTools.buildResult(false,"["+mark+"."+invokeMethod+"] not exists!",null));
		}catch(InvocationTargetException t){
			Throwable e = t.getTargetException();// 获取目标异常  
			WebTools.print(response,WebTools.buildResult(false,mark+"."+invokeMethod+" error["+e.getMessage()+"]",null));
            e.printStackTrace(); 
		} catch (Throwable e) {
			WebTools.print(response,WebTools.buildResult(false,mark+"."+invokeMethod+" error["+e.getMessage()+"]",null));
			e.printStackTrace();
		} 
	}
	
	public static class HeaderTitle{
		String[] pns;
		String[] hns;
		public HeaderTitle(String htStr){
			String[] hts=htStr.split(",#,;#;");
			List<String> pnLst=MapUtils.newArrayList();
			List<String> hnLst=MapUtils.newArrayList();
			for(String ht:hts){
				String[] hs=ht.split(",#,");
				if(hs.length==2){
					pnLst.add(hs[1]);
					hnLst.add(hs[0]);
				}
			}
			pns=pnLst.toArray(new String[pnLst.size()]);
			hns=hnLst.toArray(new String[hnLst.size()]);
		}
	}

	public void cmd(String mark, HttpServletRequest request, HttpServletResponse response) {
		try {
			boolean wrapper=Boolean.valueOf(mark);
			String elp=WebTools.getRequestBody(request);
			if(wrapper){
				elp="#{"+elp+"}";
			}
			WebTools.print(response,WebTools.buildResult(true,"success",BeanHelper.evelV(elp)));
		} catch (Exception e) {
			e.printStackTrace();
			WebTools.print(response,WebTools.buildResult(false,e.getMessage(),e.getMessage()));
		}
	}
	
}
