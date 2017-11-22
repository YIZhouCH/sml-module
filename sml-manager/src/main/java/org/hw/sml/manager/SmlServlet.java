package org.hw.sml.manager;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.context.WebRouter;
import org.hw.sml.manager.service.SmlManageService;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.tools.MapUtils;

public class SmlServlet extends HttpServlet{
	public static List<String> igNoreOperator=MapUtils.newArrayList();
	static{
		igNoreOperator.add("index");
		igNoreOperator.add("query");
		igNoreOperator.add("invoke");
		igNoreOperator.add("export");
		igNoreOperator.add("update");
	}
	/**
	 * 
	 */
	private static final long serialVersionUID = -3935032917542953086L;
	
	private  String   postCharset = "UTF-8";
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		WebRouter.start();
		/*//filter-servlet-listener等以bean形式进行管理
		try{
			ServletContext ct=config.getServletContext();
			PropertiesHelper ph=BeanHelper.getBean(PropertiesHelper.class);
			//contextParam
			Map<String,String> contextParams=ph.getValuesByKeyStart("contextParam-");
			for(Map.Entry<String,String> entry:contextParams.entrySet()){
				ct.setInitParameter(entry.getKey(),entry.getValue());
			}
			Map<String,String> listeners=ph.getValuesByKeyStart("listener-");
			for(Map.Entry<String,String> entry:listeners.entrySet()){
				Map<String,String> kvs=MapUtils.transMapFromStr(entry.getValue());
				Assert.notNull(kvs.get("class"),"listener props [class] can't null!");
				ct.addListener(kvs.get("class"));
			}
			Map<String,String> servlets=ph.getValuesByKeyStart("servlet-");
			for(Map.Entry<String,String> entry:servlets.entrySet()){
				String servletName=entry.getKey().replaceFirst("servlet-", "");
				Map<String,String> kvs=MapUtils.transMapFromStr(entry.getValue());
				Assert.notNull(kvs.get("class"),"servlet props [class] can't null!");
				Dynamic dynamic=ct.addServlet(servletName, kvs.get("class"));
				Assert.notNull(kvs.get("mapping"),"servlet props [mapping] can't null!");
				dynamic.addMapping(kvs.get("mapping").split(","));
				if(kvs.containsKey("initParameters"))
					try {
						dynamic.setInitParameters((Map<String,String>)BeanHelper.evelV(kvs.get("initParameters")));
					} catch (ElException e) {
						e.printStackTrace();
					}
				if(kvs.containsKey("loadOnStartup")){
					dynamic.setLoadOnStartup(MapUtils.getInt(kvs,"loadOnStartup"));
				}
			}
			Map<String,String> filters=ph.getValuesByKeyStart("filter-");
			for(Map.Entry<String,String> entry:filters.entrySet()){
				String filterName=entry.getKey().replaceFirst("filter-", "");
				Map<String,String> kvs=MapUtils.transMapFromStr(entry.getValue());
				Assert.notNull(kvs.get("class"),"servlet props [class] can't null!");
				FilterRegistration.Dynamic dynamic=ct.addFilter(filterName, kvs.get("class"));
				Assert.notNull(kvs.get("mapping"),"servlet props [mapping] can't null!");
				
				dynamic.addMappingForUrlPatterns(null, true, kvs.get("mapping").split(","));
				if(kvs.containsKey("initParameters"))
					try {
						dynamic.setInitParameters((Map<String,String>)BeanHelper.evelV(kvs.get("initParameters")));
					} catch (ElException e) {
						e.printStackTrace();
					}
			}
		}catch(Exception e){
			LoggerHelper.error(getClass(),e.toString());
			e.printStackTrace();
		}*/
		//
	}


	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		 response.setContentType("application/json;charset=" + this.postCharset);
		 response.setCharacterEncoding(this.postCharset);
		 request.setCharacterEncoding(this.postCharset);
		 String method=request.getMethod();
		 String uri=request.getRequestURI();
		 uri.replaceAll("/{2,}","/");
		 LoggerHelper.debug(getClass(),String.format("sml request method[%s]-uri[%s]",method,uri));
		 String[] uris=WebTools.getUris(uri);
		 //2开始
		 if(uris.length<3){
			 response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			 return;
		 }
		 String operater=uris[2];
		 if(!igNoreOperator.contains(operater)){
			 try{
				 WebRouter.set(request, response);
				 WebRouter.doService(method,uri);
			 }catch (Throwable e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().print(e.getLocalizedMessage());
				e.printStackTrace();
			}finally{
				WebRouter.release();
			}
			return;
		 }
		 String mark=uris[3];
		 if(uris.length<4){
			 response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			 return;
		 }
		 SmlManageService smlManageService=BeanHelper.getBean(SmlManageService.class);
		 if(smlManageService==null){
			 WebTools.print(response,WebTools.buildResult(false,"bean[smlManageService] not exists!",null));
			 return;
		 }
		try {
			SmlManageService.class.getMethod(operater,String.class,HttpServletRequest.class,HttpServletResponse.class)
				.invoke(smlManageService,mark,request,response);
		}catch (NoSuchMethodException e) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			WebTools.print(response,WebTools.buildResult(false,"method[smlManageService."+operater+"] not exists!",null));
		}catch(InvocationTargetException t){
			Throwable e = t.getTargetException();// 获取目标异常  
			if(!mark.startsWith("export")){
				WebTools.print(response,WebTools.buildResult(false,operater+"."+mark+" error["+e.getMessage()+"]",null));
			}
            e.printStackTrace(); 
		} catch (Exception e) {
			if(!mark.startsWith("export")){
				WebTools.print(response,WebTools.buildResult(false,"smlManageService."+operater+" invoke["+mark+"] error["+e.getMessage()+"]",null));
			}
			e.printStackTrace();
		}finally{
			WebRouter.release();
		}
	}
	
}
