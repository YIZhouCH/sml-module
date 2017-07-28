package org.hw.sml.helper.plugin.jdbc.resource;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.List;
import java.util.Map;

import org.hw.sml.tools.MapUtils;

public class Test {
	public static void test1() throws FileNotFoundException, IOException{
		List<Tt> ts=MapUtils.newArrayList();
		for(int i=0;i<1000;i++){
			Tt t=new Tt();
			t.setAge(i);
			t.setId(String.valueOf(i));
			t.setName(String.valueOf(i));
			ts.add(t);
		}
		ObjectOutputStream os=new ObjectOutputStream(new FileOutputStream("d://temp1.txt"));
		os.writeObject(ts);
		os.close();
	}
	public static void test2() throws FileNotFoundException, IOException{
		List<Map<String,Object>> ts=MapUtils.newArrayList();
		for(int i=0;i<1000;i++){
			Map<String,Object> t=MapUtils.newHashMap();
			t.put("age",i);
			t.put("id",String.valueOf(i));
			t.put("name",String.valueOf(i));
			for(int j=0;j<999;j++){
				t.put("temp"+j, j+"");
			}
			ts.add(t);
		}
		ObjectOutputStream os=new ObjectOutputStream(new FileOutputStream("d://temp2.txt"));
		os.writeObject(ts);
		os.close();
	}
	public static void main(String[] args) throws FileNotFoundException, IOException {
		// TODO Auto-generated method stub
		test1();
		test2();
	}

}
