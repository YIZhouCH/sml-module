package org.hw;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;

import org.hw.sml.tools.Https;

public class HttpUpload {
	public static void main(String[] args) throws IOException {
		Https https=Https.newPostFormHttps("http://localhost:1202/master/jdbc/import").upFile();
		https.getParamer().add("dbid", "defJt");
		https.getParamer().add("tableName","DM_CO_BA_CFG_RCPT_IF");
		https.body(Https.newUpFile(URLEncoder.encode("黄文.csv","utf-8"),new FileInputStream("d://DM_CO_BA_CFG_RCPT_IF.csv")));
		String result=https.execute();
		System.out.println(result);
	}
}
