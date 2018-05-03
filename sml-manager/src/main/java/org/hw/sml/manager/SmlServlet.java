package org.hw.sml.manager;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.context.ResponseContext;
import org.hw.sml.manager.context.WebRouter;
import org.hw.sml.manager.service.ServiceBean;
import org.hw.sml.manager.service.SmlServletBean;
import org.hw.sml.support.ioc.BeanHelper;

public class SmlServlet extends HttpServlet{
	
	/**
	 * 
	 */
	private ServiceBean targetBean;
	private static final long serialVersionUID = -3935032917542953086L;
	
	private  String   postCharset = "UTF-8";
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		WebRouter.start();
		targetBean=BeanHelper.getBean(config.getServletName());
		if(targetBean==null){
			targetBean=new SmlServletBean();
			BeanHelper.getBeanMap().put(config.getServletName(),targetBean);
		}
	}


	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding(this.postCharset);
		request.setCharacterEncoding(this.postCharset);
		try{
			targetBean.service(request,response);
		}catch(IOException e){
			throw e;
		}finally{
			ResponseContext.release();
		}
	}
	
}
