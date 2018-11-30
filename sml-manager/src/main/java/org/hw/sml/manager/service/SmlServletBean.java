package org.hw.sml.manager.service;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.context.WebRouter;
import org.hw.sml.manager.tools.Uris;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.tools.MapUtils;

public class SmlServletBean implements ServiceBean{
	public static List<String> igNoreOperator=MapUtils.newArrayList();
	private String igLogUri="";
	static{
		igNoreOperator.add("index");
		igNoreOperator.add("query");
		igNoreOperator.add("invoke");
		igNoreOperator.add("export");
		igNoreOperator.add("update");
		igNoreOperator.add("cmd");
	}

	private  String   postCharset = "UTF-8";
	private Uris uris;
	
	public void init(){
		uris=Uris.newUris(igLogUri);
	}
	/**
	 * 
	 */

	public void service(HttpServletRequest request, HttpServletResponse response)
			throws  IOException {
         response.setContentType("application/json;charset=" + this.postCharset);
		 String method=request.getMethod();
		 String uri=request.getPathInfo();
		 uri.replaceAll("/{2,}","/");
		 if(!uris.containUri(uri))
		 LoggerHelper.getLogger().debug(getClass(),String.format("sml request method[%s]-uri[%s]-ip[%s]",method,request.getRequestURI(),WebTools.getRemoteIp(request)));
		 String[] uris=WebTools.getUris(uri);
		 //0开始
		 if(uris.length<1){
			 response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			 return;
		 }
		 String operater=uris[0];
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
		 if(uris.length<2){
			 response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			 return;
		 }
		 String mark=uris[1];
		 ISmlManageService smlManageService=BeanHelper.getBean(ISmlManageService.class);
		 if(smlManageService==null){
			 WebTools.print(response,WebTools.buildResult(false,"bean[smlManageService] not exists!",null));
			 return;
		 }
		try {
			 WebRouter.set(request, response);
			 ISmlManageService.class.getMethod(operater,String.class,HttpServletRequest.class,HttpServletResponse.class)
				.invoke(smlManageService,mark,request,response);
		}catch (NoSuchMethodException e) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			WebTools.print(response,WebTools.buildResult(false,"method[smlManageService."+operater+"] not exists!",null));
		}catch(InvocationTargetException t){
			Throwable e = t.getTargetException();// 获取目标异常  
			e.printStackTrace(); 
			if(!mark.startsWith("export")){
				WebTools.print(response,WebTools.buildResult(false,operater+"."+mark+" error["+e.getMessage()+"]",null));
			}
		} catch (Exception e) {
			e.printStackTrace();
			if(!mark.startsWith("export")){
				WebTools.print(response,WebTools.buildResult(false,"smlManageService."+operater+" invoke["+mark+"] error["+e.getMessage()+"]",null));
			}
		}finally{
			WebRouter.release();
		}
	}
	
}
