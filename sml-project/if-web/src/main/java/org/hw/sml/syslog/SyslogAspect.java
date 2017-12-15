package org.hw.sml.syslog;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.hw.sml.component.RcptFastJsonMapper;
import org.hw.sml.core.build.SmlTools;
import org.hw.sml.manager.service.SmlManageService;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.report.model.Update;
import org.hw.sml.shiro.model.ShiroUser;
import org.hw.sml.support.aop.AbstractAspect;
import org.hw.sml.support.aop.Invocation;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.queue.ManagedQuene;
import org.hw.sml.support.queue.Task;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Maps;

@Bean
public class SyslogAspect extends AbstractAspect{
	private ManagedQuene<Task> mq=new ManagedQuene<Task>();
	{
		setOrderId(1);
		setPackageMatchs("org.hw.sml.manager.service.SmlServletBean.service");
		mq.setConsumerThreadSize(1);
		mq.init();
	}
	public String getLoginName(){
		try{
			Subject subject= SecurityUtils.getSubject();
			ShiroUser u= (ShiroUser) subject.getPrincipal();
			return u.getUsername();
		}catch(Exception e){
			try{
				return SecurityUtils.getSubject().getSession().getAttribute("c_user").toString();
			}catch(Exception e1){
				return "anon";
			}
		}
	}
	public void doBefore(Invocation invocation) throws Throwable {
		HttpServletRequest request=(HttpServletRequest) invocation.getArgs()[0];
		invocation.getExtInfo().put("pathInfo", request.getPathInfo());
		invocation.getExtInfo().put("params",SmlTools.rebuildSimpleKv(request.getParameterMap()));
		invocation.getExtInfo().put("remote_ip",WebTools.getRemoteIp(request));
		invocation.getExtInfo().put("start",System.currentTimeMillis());
		invocation.getExtInfo().put("username",getLoginName());
	}
	@SuppressWarnings("unchecked")
	public void doAfter(Invocation invocation) throws Throwable {
		invocation.getExtInfo().put("end",System.currentTimeMillis());
		if(MapUtils.getInt((Map<String,Object>)invocation.getExtInfo().get("params"),"page",1)==1)
		add(invocation);
	}
	
	@Override
	public void doException(Invocation invocation) throws Throwable {
	}
	public void add(final Invocation invocation){
		mq.add(new Task() {
			public void execute() throws Exception {
				String path=invocation.getExtInfo().get("pathInfo").toString();
				String remote_ip=invocation.getExtInfo().get("remote_ip").toString();
				Map<String,Object> params=(Map<String,Object>) invocation.getExtInfo().get("params");
				params.remove("password");
				long timeCast=(Long)invocation.getExtInfo().get("end")-(Long)invocation.getExtInfo().get("start");
				Date reqTime=new Date((Long)invocation.getExtInfo().get("start"));
				String username=invocation.getExtInfo().get("username").toString();
				Object value=invocation.getValue();
				String result="";
				if(value!=null){
					if(!(value instanceof String)){
						value=new RcptFastJsonMapper().toJson(value);
					}
					result=value.toString().length()<1000?value.toString():value.toString().substring(0,1000);
				}
				Update update=new Update();
				update.setInLog(true);
				update.setTableName("sys_log");
				update.setDbId("master");
				update.setData(new Maps<String,Object>()
						.put("id",UUID.randomUUID().toString().replace("-", ""))
						.put("module_name",path)
						.put("login_name",username)
						.put("req_content",params.toString())
						.put("resp_content",invocation.getThrowable()!=null?invocation.getThrowable().getMessage():result)
						.put("client_ip",remote_ip)
						.put("status",invocation.getThrowable()!=null?1:0)
						.put("create_time",reqTime)
						.put("time_cast",timeCast)
						.getMap());
				BeanHelper.getBean(SmlManageService.class).add(update);
			}
		});
	}
	
}
