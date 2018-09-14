package org.hw.sml.net;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.hw.sml.component.RcptFastJsonMapper;
import org.hw.sml.tools.Assert;
import org.hw.sml.tools.DateTools;
import org.hw.sml.tools.IOUtils;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;
import org.hw.sml.tools.Strings;
import org.hw.sml.tools.Urls;

public class Ftps {
	private String url;
	private Urls urls;
	private FTPClient ftpClient;
	private DirStrategy dirStrategy;
	private Ftps(){
	}
	private static Map<String,DirStrategy> dirStrategys=MapUtils.newHashMap();
	public static void register(String key,DirStrategy dirStrategy){
		dirStrategys.put(key, dirStrategy);
	}
	static{
		register("default",new DirDefaultStrategy());
	}
	public static Ftps newFtps(String url){
		Ftps ftps=new Ftps();
		ftps.setUrl(url);
		ftps.ftpClient=new FTPClient();
		return ftps;
	}
	public Ftps login(){
		try {
			ftpClient.connect(urls.getHost(),urls.getPort()==0?21:urls.getPort());
			boolean isLogin = ftpClient.login(urls.getUsername(), urls.getPassword());
			Assert.isTrue(isLogin,(String.format("Ftp login failed for Host[%s] UserName[%s] PassWord[%s]", urls.getHost(),urls.getUsername(),urls.getPassword())));
			ftpClient.getReplyCode();
			if(MapUtils.getBoolean(urls.getParams(),"localPassiveMode",true))
				ftpClient.enterLocalPassiveMode();
			if(MapUtils.getBoolean(urls.getParams(),"pasv",false))
				ftpClient.pasv();
			ftpClient.setControlEncoding(MapUtils.getString(urls.getParams(),"controlEncoding","utf-8"));
			if(urls.getParams().containsKey("dirStrategy"))
				dirStrategy=dirStrategys.get(MapUtils.getString(urls.getParams(),"dirStrategy","default"));
			if(urls.getParams().containsKey("controlKeepAliveTimeout"))
				ftpClient.setControlKeepAliveTimeout(MapUtils.getInt(urls.getParams(),"controlKeepAliveTimeout"));
			if(urls.getParams().containsKey("connectTimeout"))
				ftpClient.setConnectTimeout(MapUtils.getInt(urls.getParams(),"connectTimeout"));
			if(urls.getParams().containsKey("controlKeepAliveReplyTimeout"))
				ftpClient.setControlKeepAliveReplyTimeout(MapUtils.getInt(urls.getParams(),"controlKeepAliveReplyTimeout"));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		return this;
	}
	public List<String> list() throws IOException{
		List<String> result=MapUtils.newArrayList();
		String[] filepaths=new String[]{urls.getPrePath()};
		if(dirStrategy!=null&&urls.getPrePath()!=null&&urls.getPrePath().contains("{")&&urls.getPrePath().contains("}")){
			filepaths=dirStrategy.getDir(urls.getPrePath(),urls.getParams());
		}
		List<String> temps=list(filepaths);
		//过滤
		for(String temp:temps){
			String filename=temp.substring(temp.lastIndexOf("/")+1);
			if(filename.matches(urls.getLastPath())){
				result.add(temp);
			}
		}
		return result;
	}
	public List<String> list(String[] filepaths) throws IOException{
		List<String> result=MapUtils.newArrayList();
		for(String filepath:filepaths){
			if(filepath.length()>1)
			cd("~");
			String[] filename=ftpClient.listNames(filepath);
			result.addAll(Arrays.asList(filename));
		}
		return result;
	}
	public Ftps cd(){
		if(!new Strings(urls.getPath()).isEmpty()&&!urls.getPath().equals("/"))
		cd(urls.getPath());
		return this;
	}
	public Ftps cd(String dir){
		try {
			boolean isChanged=ftpClient.changeWorkingDirectory(dir);
			Assert.isTrue(isChanged,"Ftp change dir["+dir+"] failed!");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		return this;
	}
	public FTPFile[] lsFtpFile(){
		try {
			return ftpClient.listFiles();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return new FTPFile[]{};
	}
	public String[] ls(){
		try {
			return ftpClient.listNames();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return new String[]{};
	}
	public void get(OutputStream os) throws IOException{
		 get(urls.getPath(), os);
	}
	public void get(String filepath,OutputStream os) throws IOException{
		String filename=filepath.substring(filepath.lastIndexOf("/")+1);
		if(!filepath.equals(filename)){
			cd(filepath.substring(0,filepath.lastIndexOf("/")));
		}
		ftpClient.setFileType(MapUtils.getInt(urls.getParams(),"fileType",FTP.BINARY_FILE_TYPE));
		ftpClient.setFileTransferMode(MapUtils.getInt(urls.getParams(),"fileTransferMode",FTP.STREAM_TRANSFER_MODE));
		ftpClient.retrieveFile(filename,os);
	}
	public InputStream get() throws IOException{
		return get(urls.getPath());
	}
	public InputStream get(String filepath) throws IOException{
		String filename=filepath.substring(filepath.lastIndexOf("/")+1);
		if(!filepath.equals(filename)){
			cd(filepath.substring(0,filepath.lastIndexOf("/")));
		}
		if(MapUtils.getBoolean(urls.getParams(),"localPassiveMode",true))
		ftpClient.enterLocalPassiveMode();
		ftpClient.setFileType(MapUtils.getInt(urls.getParams(),"fileType",FTP.BINARY_FILE_TYPE));
		ftpClient.setFileTransferMode(MapUtils.getInt(urls.getParams(),"fileTransferMode",FTP.STREAM_TRANSFER_MODE));
		return ftpClient.retrieveFileStream(filename);
	}
	public void put(String filepath,InputStream is) throws IOException{
		String filename=filepath.substring(filepath.lastIndexOf("/")+1);
		if(!filepath.equals(filename)){
			cd(filepath.substring(0,filepath.lastIndexOf("/")));
		}
		if(MapUtils.getBoolean(urls.getParams(),"localPassiveMode",true))
		ftpClient.enterLocalPassiveMode();
		ftpClient.setFileType(MapUtils.getInt(urls.getParams(),"fileType",FTP.BINARY_FILE_TYPE));
		ftpClient.setFileTransferMode(MapUtils.getInt(urls.getParams(),"fileTransferMode",FTP.STREAM_TRANSFER_MODE));
		String name = filename + ".temp";
		ftpClient.storeFile(name, is);
		ftpClient.rename(name,filename);
	}
	public void put(InputStream is) throws IOException{
		put(urls.getPath(),is);
	}
	public void disConnect(){
		try {
			ftpClient.disconnect();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.urls=new Urls(url);
		this.url = url;
	}
	public Urls getUrls() {
		return urls;
	}
	public void setUrls(Urls urls) {
		this.urls = urls;
	}
	
	public static interface DirStrategy{
		public String[] getDir(String dir,Map<String,String> params);
	}
	private static class DirDefaultStrategy implements DirStrategy{
		public String[] getDir(String dir, Map<String, String> params) {
			List<String> result=MapUtils.newArrayList();
			String format=RegexUtils.subString(dir,"{", "}");
			int start=MapUtils.getInt(params,"dirMultiStart",0);
			int end=MapUtils.getInt(params,"dirMultiEnd",1);
			int timeType=MapUtils.getInt(params,"dirMultiTimeType",Calendar.DAY_OF_MONTH);
			for(int i=start;i<=end;i++){
				String dirt=dir.replace("{"+format+"}",new SimpleDateFormat(format).format(DateTools.add(timeType,new Date(),-i)));
				if(!result.contains(dirt))
					result.add(dirt);
			}
			return result.toArray(new String[]{});
		}
		
	}
	
	public FTPClient getFtpClient() {
		return ftpClient;
	}
	public void setFtpClient(FTPClient ftpClient) {
		this.ftpClient = ftpClient;
	}
	public DirStrategy getDirStrategy() {
		return dirStrategy;
	}
	public void setDirStrategy(DirStrategy dirStrategy) {
		this.dirStrategy = dirStrategy;
	}
	public static void main(String[] args) throws IOException {
		//Ftps ftps=Ftps.newFtps("ftp://ftpuser:Mk@83cka@10.221.240.7:21//opt/oss/server/var/fileint/monitor/pmmonitor_{yyyyMMdd}/hw_4g_(.*?).csv?dirStrategy=default").login();
		/*Ftps ftps=Ftps.newFtps("ftp://test1:test,1@118.178.89.14:9333//networkspeed_(*).txt?dirStrategy=default").login();
		//Ftps ftps=Ftps.newFtps("ftp://dongxin:Nokia123-@10.11.169.47:21//nokia_count_group6_ho_rate_201808191702.csv?pasv=true&localPassiveMode=false").login();
		//System.out.println(new RcptFastJsonMapper().toJson(ftps.getUrls()));
		//System.out.println(IOUtils.toString(ftps.get(),"gbk"));
		System.out.println(Arrays.asList(ftps.ls()));
		List<String> filepaths= ftps.list();
		System.out.println(filepaths);
		for(String filepath:filepaths){
			//ftps.get(filepath,new FileOutputStream("d:/temp/"+filepath.substring(filepath.lastIndexOf("/")+1)));
			try{
				System.out.println(filepath);
				System.out.println(IOUtils.toString(ftps.get(filepath), "gbk"));
			}catch(Exception e){
				System.out.println(e.getMessage());
			}
		}*/
	}
}
