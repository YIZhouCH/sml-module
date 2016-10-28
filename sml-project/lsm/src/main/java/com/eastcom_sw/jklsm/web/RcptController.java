package com.eastcom_sw.jklsm.web;

import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.base.controller.CrudBaseController;
import org.hw.sml.manager.model.PageObject;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.model.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.eastcom_sw.jklsm.service.LsmService;

@Controller
@RequestMapping(value="rs")
public class RcptController extends CrudBaseController{
	
	@Autowired
	private LsmService lsmService;
	@PostConstruct
	public void init(){
		setRcptBaseService(lsmService);
	}


	@RequestMapping(value = "rcpt/flush", method = RequestMethod.GET)
	public void flush(HttpServletRequest request,HttpServletResponse response){
		super.flush(request, response);
	}
	@RequestMapping(value = "rcpt/{ifId}", method = RequestMethod.GET)
	public void query(@PathVariable("ifId")String ifId,HttpServletRequest request,HttpServletResponse response){
		Map<String,String> params=WebTools.toMap(request);
		this.query(ifId,params,request, response);
	}
	@RequestMapping(value = "rcpt/{ifId}", method = RequestMethod.POST)
	public void query(@PathVariable("ifId")String ifId,@RequestBody Map<String,String> params,HttpServletRequest request,HttpServletResponse response){
		params.put("ifId",ifId);
		Object result=getRcptBaseService().query(ifId, params);
		print(response, result);
	}
	@RequestMapping(value = "rcpt/page/{ifId}", method = RequestMethod.POST)
	public void page(@PathVariable("ifId")String ifId,HttpServletRequest request,HttpServletResponse response){
		Map<String,String> param = WebTools.buildJqParams(request);
		Result result=(Result) getRcptBaseService().query(ifId,param);
		PageObject pageObject=new PageObject(result.getDatas(), result.getCount(),Integer.parseInt(param.get("page")), Integer.parseInt(param.get("limit")));
		print(response,pageObject);
	}
	@RequestMapping(value = "rcpt/pagejq/{ifId}", method = RequestMethod.POST)
	public void pagejq(@PathVariable("ifId")String ifId,HttpServletRequest request,HttpServletResponse response){
		this.page(ifId, request, response);
	}
}
