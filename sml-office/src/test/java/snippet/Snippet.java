package snippet;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.hw.sml.office.excel.creater.Excel03Creater;
import org.hw.sml.office.excel.creater.ExcelBaseCreater;
import org.hw.sml.tools.Maps;


public class Snippet {
	public static void main(String[] args) throws Exception {
		//--data--
		List<Map<String,Object>> datas=new ArrayList<Map<String,Object>>();
		datas.add(new Maps<String,Object>().put("a","一").put("b",1).put("c","a").put("d","a").getMap());
		datas.add(new Maps<String,Object>().put("a","二").put("b",21).put("c","a").put("d","a").getMap());
		datas.add(new Maps<String,Object>().put("a","三").put("b",31).put("c","a").put("d","a").getMap());
		datas.add(new Maps<String,Object>().put("a","四").put("b",25).put("c","a").put("d","a").getMap());
		//--data--
		ExcelBaseCreater creater=new Excel03Creater();
			creater.setHeadNames(new String[]{"列1111111111111111111","列2","列3","列4"});
			creater.setPropertyNames(new String[]{"a","b","c","d"});
			//着色
			creater.setFilename("d:/temp.xlsx");
			creater.setCreator("黄文");
			creater.setSheetName("sheetname1");
			creater.setTitle("标题");
			creater.setDatas(datas);
			creater.init();
			creater.execute();
		}
}

