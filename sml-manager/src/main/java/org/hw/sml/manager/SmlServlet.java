package org.hw.sml.manager;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.context.SmlWebContext;
import org.hw.sml.manager.service.SmlManageService;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.support.ioc.BeanHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SmlServlet extends HttpServlet{
	public static final Logger logger=LoggerFactory.getLogger(SmlServlet.class);
	/**
	 * 
	 */
	private static final long serialVersionUID = -3935032917542953086L;
	
	private  String   postCharset = "UTF-8";
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		BeanHelper.start();
	}


	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		 response.setContentType("application/json;charset=" + this.postCharset);
		 response.setCharacterEncoding(this.postCharset);
		 request.setCharacterEncoding(this.postCharset);
		 String method=request.getMethod();
		 String uri=request.getRequestURI();
		 logger.debug("sml request method[{}]-uri[{}]",method,uri);
		 String[] uris=WebTools.getUris(uri);
		 //2开始
		 if(uris.length<4){
			 WebTools.print(response,WebTools.buildResult(false,"uri error["+uri+"]",null));
			 return;
		 }
		 String operater=uris[2];
		 String mark=uris[3];
		 SmlManageService smlManageService=BeanHelper.getBean(SmlManageService.class);
		 if(smlManageService==null){
			 WebTools.print(response,WebTools.buildResult(false,"bean[smlManageService] not exists!",null));
			 return;
		 }
		try {
			SmlManageService.class.getMethod(operater,String.class,HttpServletRequest.class,HttpServletResponse.class)
				.invoke(smlManageService,mark,request,response);
		}catch (NoSuchMethodException e) {
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
			SmlWebContext.release();
		}
	}
	
}
