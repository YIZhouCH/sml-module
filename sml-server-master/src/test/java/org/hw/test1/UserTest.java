package org.hw.test1;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.hw.sml.office.excel.parser.ExcelBaseParser;
import org.hw.sml.office.excel.parser.ExcelParser;
import org.hw.sml.report.model.Constants;
import org.hw.sml.report.model.Update;
import org.hw.sml.tools.Https;

import com.alibaba.fastjson.JSON;
import com.sun.jna.Function.PostCallRead;

public class UserTest {
	public static void main(String[] args) throws Exception {
		ExcelBaseParser ep=new ExcelParser();
		ep.setFilename("d:/t.xlsx");
		ep.setSheetName("2");
		ep.init();
		ep.execute();
		List<Map<String,String>> datas=ep.getDatas();
		Update update=new Update();
		update.setDatas((List)datas);
		update.setTableName("ipmsp.sys_tel");
		update.setType(Constants.TYPE_INSERT);
		update.setConditions(Arrays.asList("TEL"));
		post(JSON.toJSONString(update));
	}
	public static String post(String post) throws IOException{
		Https https=Https.newPostBodyHttps("http://10.221.247.7:8080/INAS/sml/update/insert");
		return https.body(post).execute();
	}
}
