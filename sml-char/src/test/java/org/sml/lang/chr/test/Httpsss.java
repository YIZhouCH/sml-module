package org.sml.lang.chr.test;

import java.io.FileOutputStream;
import java.io.IOException;

import org.hw.sml.tools.Https;

public class Httpsss {
	public static void main(String[] args) throws IOException {
		Https.newPostHttps("http://10.78.220.191:8081/ODSP/sml/invoke/esbFileHandler/downloadFile/download").body("{\"path\":\"/app/odcweb/tomcat-test/bin/浙江移动数据共享平台系统操作手册.docx\"}").bos(new FileOutputStream("d:/temp/helper.docx")).execute();
	}
}
