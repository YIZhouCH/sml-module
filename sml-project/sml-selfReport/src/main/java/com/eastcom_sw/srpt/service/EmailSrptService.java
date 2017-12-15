package com.eastcom_sw.srpt.service;

import java.util.List;
import java.util.Map;

import org.hw.sml.manager.service.RcptBaseService;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Inject;

@Bean
public class EmailSrptService extends RcptBaseService{
	
	@Inject
	private SrptRcptService srptRcptService;

	public List<Map<String, String>> queryReportIdAll() {
		List<Map<String,String>> reportIdList = srptRcptService.queryReportIdAll();
		return reportIdList;
	}

	public List<Map<String, String>> queryEamilReportSelfById(String reportId) {
		List<Map<String,String>> reportResult = srptRcptService.queryEamilReportSelfById(reportId);
		return reportResult;
	}

	public List<Map<String, Object>> queryReportLoopAllById(String reportId) {
		List<Map<String,Object>> menuList = srptRcptService.queryReportLoopAllById(reportId,"ori");
		return menuList;
	}
	
	public String queryForLogicSqlByReportId(String report_id){
		String logicSql = srptRcptService.queryForLogicSqlByReportId(report_id);
		return logicSql;
	}
	
	public Map<String,String> queryQryBdByReportId(String report_id){
		Map<String,String> qryBd = srptRcptService.queryQryBdByReportId(report_id);
		return qryBd;
	}
	
	public String getDbidByReport(String report_id) {
		String dbidByReport = srptRcptService.getDbidByReport(report_id);
		return dbidByReport;
	}

	public String queryForFiletitle(String reportId) {
		String fileTitle = srptRcptService.queryForFiletitle(reportId);
		return fileTitle;
	}

	public int findOriginalTask(Map<String, String> params) {
		int insert = srptRcptService.findOriginalTask(params);
		return insert ;
	}
}
