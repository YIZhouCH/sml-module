package org.hw.sml.status.tools;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;

import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;

public class Files {
	private static boolean in(String line,String regexp) {
		return RegexUtils.matchGroup(regexp, line).size()>0;
	}

	public static Map<Long,String> readLastNLine(File file, Charset charset,int numRead,int from,String regexp) {
		Map<Long,String> result=MapUtils.newLinkedHashMap();
		int count = 0;
		if (!file.exists() || file.isDirectory() || !file.canRead()) {
			return result;
		}
		RandomAccessFile fileRead = null;
		try {
			fileRead = new RandomAccessFile(file, "r");
			long length = fileRead.length();
			if (length == 0L) {
				return result;
			} else {
				long pos = length - 1;
				while (pos > 0) {
					pos--;
					fileRead.seek(pos);
					if (fileRead.readByte() == '\n') {
						String line = new String(fileRead.readLine().getBytes("iso-8859-1"), charset);
						if(regexp==null||regexp.length()==0||in(line, regexp)){
							result.put(pos,line);count++;
						}
						if (count == numRead)break;
					}
					if(pos==from) break;
				}
				if (pos == 0) {
					fileRead.seek(0);
					String line = new String(fileRead.readLine().getBytes("iso-8859-1"), charset);
					if(regexp==null||regexp.length()==0||in(line, regexp)){
						result.put(pos,line);count++;
					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fileRead != null) {
				try {
					fileRead.close();
				} catch (Exception e) {
				}
			}
		}
		return result;
	}
	public static String readLastNLineString(File file,Charset charset,int numRead,int from,String regexp){
		Map<Long,String> rt=readLastNLine(file, charset, numRead, from, regexp);
		StringBuilder sb=new StringBuilder();
		int i=0;
		for(Map.Entry<Long,String> entry:rt.entrySet()){
			if(i++>0)
			sb.insert(0,"\n");
			sb.insert(0,entry.getValue());
		}
		return sb.toString();
	}
	public static List<String> listFiles(String dir){
		List<String> result=MapUtils.newArrayList();
		File file=new File(dir);
		File[] fts=file.listFiles();
		for(File ft:fts){
			if(ft.isDirectory())
				result.addAll(listFiles(ft.getAbsolutePath()));
			else
				result.add(ft.getAbsolutePath());
			
		}
		return result;
	}
	public static void main(String[] args) {
		System.out.println(readLastNLineString(new File("e:/temp/tt.txt"), Charset.forName("gbk"),1000,0,null));
	}
}
