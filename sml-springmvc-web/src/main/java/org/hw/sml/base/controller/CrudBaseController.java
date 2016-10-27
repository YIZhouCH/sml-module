package org.hw.sml.base.controller;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hw.sml.manager.model.PageObject;
import org.hw.sml.manager.service.RcptBaseService;
import org.hw.sml.manager.tools.WebTools;
import org.hw.sml.model.Result;
import org.hw.sml.office.excel.ExcelBase.Type;
import org.hw.sml.office.excel.Retriver;
import org.hw.sml.office.excel.creater.Excel03Creater;
import org.hw.sml.office.excel.creater.Excel07Creater;
import org.hw.sml.office.excel.creater.ExcelBaseCreater;
import org.hw.sml.office.excel.creater.ExcelCsvCreater;
import org.hw.sml.report.model.Update;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Maps;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;




public class CrudBaseController extends RcptBaseController{
	public static final Logger logger=LoggerFactory.getLogger(CrudBaseController.class);
	
	private RcptBaseService rcptBaseService;
	
	@RequestMapping(value = "/flush", method = RequestMethod.GET)
	public void flush(HttpServletRequest request,HttpServletResponse response){
		rcptBaseService.clear(request.getParameter("ifId"));
	}
	
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public void add(HttpServletRequest request,
			HttpServletResponse response,@RequestBody Update update) {
		try {
			int flag=rcptBaseService.add(update);
			print(response,buildResult(true, "sucess",flag));
		} catch (Exception e) {
			e.printStackTrace();
			print(response,buildResult(false,e.getMessage(),null));
		}
	}
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public void update(HttpServletRequest request,
			HttpServletResponse response,@RequestBody Update update) {
		try {
			int flag=rcptBaseService.update(update);
			print(response,buildResult(true, "sucess",flag));
		} catch (Exception e) {
			e.printStackTrace();
			print(response,buildResult(false,e.getMessage(),null));
		}
	}
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public void delete(HttpServletRequest request,
			HttpServletResponse response,@RequestBody Update update) {
		try {
			int flag=rcptBaseService.delete(update);
			print(response,buildResult(true, "sucess",flag));
		} catch (Exception e) {
			e.printStackTrace();
			print(response,buildResult(false,e.getMessage(),null));
		}
	}
	@RequestMapping(value = "/adu", method = RequestMethod.POST)
	public void adu(HttpServletRequest request,
			HttpServletResponse response,@RequestBody Update update) {
		try {
			int flag=rcptBaseService.adu(update);
			print(response,buildResult(true, "sucess",flag));
		} catch (Exception e) {
			e.printStackTrace();
			print(response,buildResult(false,e.getMessage(),null));
		}
	}
	@RequestMapping(value = "/query/{id}", method = RequestMethod.POST)
	public void queryById(HttpServletRequest request,
			HttpServletResponse response,@PathVariable("id")String id) {
		try {
			print(response,buildResult(true, "sucess",rcptBaseService.queryById(new Maps<String,String>().put("id",id).getMap())));
		} catch (Exception e) {
			e.printStackTrace();
			print(response,buildResult(false,e.getMessage(),null));
		}
	}
	@RequestMapping(value = "/queryIfId", method = RequestMethod.POST)
	public void queryIfId(HttpServletRequest request,
			HttpServletResponse response,@RequestBody Map<String,String> params) {
		try {
			print(response,buildResult(true, "sucess",rcptBaseService.query(params.get("ifId"), params)));
		} catch (Exception e) {
			e.printStackTrace();
			print(response,buildResult(false,e.getMessage(),null));
		}
	}
	@RequestMapping(value = "/query", method = RequestMethod.POST)
	public void query(HttpServletRequest request,
			HttpServletResponse response,@RequestBody Map<String,String> params) {
		try {
			print(response,buildResult(true, "sucess",rcptBaseService.query(params)));
		} catch (Exception e) {
			e.printStackTrace();
			print(response,buildResult(false,e.getMessage(),null));
		}
	}
	
	@RequestMapping(value = "/page", method = RequestMethod.POST)
	public void page(HttpServletRequest request,HttpServletResponse response) {
		try {
			Map<String,String> param = buildParams(request);
			Result result=rcptBaseService.page(param);
			PageObject pageObject=new PageObject(result.getDatas(), result.getCount(),Integer.parseInt(param.get("page")), Integer.parseInt(param.get("limit")));
			print(response,buildResult(true, "sucess",pageObject));
		} catch (Exception e) {
			e.printStackTrace();
			print(response,buildResult(false,e.getMessage(),null));
		}
	}
	//
	@RequestMapping(value = "export", method = RequestMethod.POST)
	public void export(@RequestHeader("User-Agent") String userAgent,HttpServletRequest request,HttpServletResponse response) throws Exception{
		final Map<String,String> param = buildParams(request);
		logger.info("导出参数为："+param);
		String title = param.get("FileTitle");
		String headerTitle=param.get("HeaderTitle");
		HeaderTitle ht=new HeaderTitle(headerTitle);
		String exportType = param.get("exportType");
		ExcelBaseCreater excel = null;
		if(exportType==null||exportType.equals(Type.xls)){
			excel=new Excel03Creater();
		}else if(exportType.equals(Type.xlsx)){
			excel=new Excel07Creater();
		}else if(exportType.equals(Type.csv)){
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
					Object obj= rcptBaseService.query(param.get("ifId"),param);
					if(obj instanceof Result){
						return ((Result)obj).getDatas();
					}else{
						return (List)obj;
					}
				}else{
					return rcptBaseService.page(param).getDatas();
				}
			}
		});
		String rtn=WebTools.getContentDisposition(title+"."+excel.getType().name(),userAgent);
		response.setHeader("Content-Disposition","attachment;" + rtn);
		response.setHeader("Connection", "close");
		response.setHeader("Content-Type", "application/octet-stream");
		OutputStream os = response.getOutputStream();
		excel.setOutputStream(os);
		excel.init();
		excel.execute();
	}
	
	/**
	 * 
	 * @param userAgent
	 * @param param
	 * 			{
					"type":"xls",
					"title":"文件名",
					"propertys":["字段1","字段2"]
					"heads":["表头1","表头2"],
					"ifId":"",
					"params":{}
					"datas":[["1","2"],["11","22"]]
				}
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "exportOriginal", method = RequestMethod.POST)
	public void exportOriginal(@RequestHeader("User-Agent") String userAgent,HttpServletRequest request,HttpServletResponse response) throws Exception{
		Map<String, Object> param = fromGson(request.getParameter("params"),Map.class);
		logger.info("exportOriginal导出参数为："+param);
		String title = String.valueOf(param.get("title"));
		String exportType = String.valueOf(param.get("type"));
		List<String> propertys=(List<String>) param.get("propertys");
		String[] pns = buildList2Arr(propertys);
		List<String> heads=(List<String>) param.get("heads");
		String[] hns = buildList2Arr(heads);
		final Map<String,String> params= (Map<String,String>)param.get("params");
		final List<Map<String,Object>> datas= toObjs(param);
		
		ExcelBaseCreater excel = null;
		if(exportType==null||(exportType!=null&&exportType.equals(Type.xls))){
			excel=new Excel03Creater();
		}else if(exportType.equals(Type.xlsx)){
			excel=new Excel07Creater();
		}else if(exportType.equals(Type.csv)){
			excel=new ExcelCsvCreater();
		}else{
			excel=new Excel03Creater();
		}
		excel.setHeadNames(hns);
		excel.setPropertyNames(pns);
		excel.setSheetName(title);
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
						Object obj= rcptBaseService.query(String.valueOf(params.get("ifId")),params);
						if(obj instanceof Result){
							return ((Result)obj).getDatas();
						}else{
							return (List)obj;
						}
					}else{
						return rcptBaseService.page(params).getDatas();
					}
				}
			});
		}else{//直接使用前台传入的结果数据导出
			excel.setDatas(datas);
		}
		String rtn=WebTools.getContentDisposition(title+"."+excel.getType().name(),userAgent);
		response.setHeader("Content-Disposition","attachment;" + rtn);
		response.setHeader("Connection", "close");
		response.setHeader("Content-Type", "application/octet-stream");
		OutputStream os = response.getOutputStream();
		excel.setOutputStream(os);
		excel.init();
		excel.execute();
	}
	
	

	private List<Map<String, Object>> toObjs(Map<String, Object> param) {
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

	private List<Object[]> toObjs(List<List<Object>> list) {
		List<Object[]> arr = new ArrayList<Object[]>();
		if(list==null||(list!=null&&list.size()==0)){
			return arr;
		}else{
			
			for (int i = 0; i < list.size(); i++) {
				Object[] subArr = buildListObj2Arr(list.get(i));
				arr.add(subArr);
			}
			return arr;
		}
	}

	private String[] buildList2Arr(List<String> ns) {
		String[] arr = new String[ns.size()];
		for (int i = 0; i < ns.size(); i++) {
			arr[i] = ns.get(i);
		}
		return arr;
	}
	
	private Object[] buildListObj2Arr(List<Object> ns) {
		Object[] arr = new Object[ns.size()];
		for (int i = 0; i < ns.size(); i++) {
			arr[i] = ns.get(i);
		}
		return arr;
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
	

	protected Map<String, String> buildParams(HttpServletRequest request) {
		return WebTools.buildJqParams(request);
	}
	
	
	public RcptBaseService getRcptBaseService() {
		return rcptBaseService;
	}

	public void setRcptBaseService(RcptBaseService rcptBaseService) {
		this.rcptBaseService = rcptBaseService;
	}
	
}
