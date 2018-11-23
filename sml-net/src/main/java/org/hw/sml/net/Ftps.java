package org.hw.sml.net;

import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipFile;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPFileFilter;
import org.apache.commons.net.ftp.FTPReply;
import org.hw.sml.tools.Assert;
import org.hw.sml.tools.DateTools;
import org.hw.sml.tools.Https;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.RegexUtils;
import org.hw.sml.tools.Strings;
import org.hw.sml.tools.Urls;

public class Ftps {
	private String url;
	private Urls urls;
	private FTPClient ftpClient;
	private DirStrategy dirStrategy;
	private String charset=System.getProperty("file.encoding");
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
			if(urls.getParams().containsKey("dirStrategy"))
				dirStrategy=dirStrategys.get(MapUtils.getString(urls.getParams(),"dirStrategy","default"));
			if(urls.getParams().containsKey("controlKeepAliveTimeout"))
				ftpClient.setControlKeepAliveTimeout(MapUtils.getInt(urls.getParams(),"controlKeepAliveTimeout"));
			if(urls.getParams().containsKey("connectTimeout"))
				ftpClient.setConnectTimeout(MapUtils.getInt(urls.getParams(),"connectTimeout"));
			if(urls.getParams().containsKey("controlKeepAliveReplyTimeout"))
				ftpClient.setControlKeepAliveReplyTimeout(MapUtils.getInt(urls.getParams(),"controlKeepAliveReplyTimeout"));
			if (FTPReply.isPositiveCompletion(ftpClient.sendCommand("OPTS UTF8", "ON"))) {// 开启服务器对UTF-8的支持，如果服务器支持就用UTF-8编码，否则就使用本地编码（GBK）.
				charset = "UTF-8";
			 }
			ftpClient.setControlEncoding(MapUtils.getString(urls.getParams(),"controlEncoding",charset));
			ftpClient.setCharset(Charset.forName(MapUtils.getString(urls.getParams(),"charset",charset)));
			
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
	public Ftps mkdir(String dirs){
		try {
			dirs=encoder(dirs);
			String dirPreStr="";
			for(String dir:dirs.split("/")){
				dirPreStr+=dir+"/";
				if(!dirPreStr.equals("/"))
				ftpClient.makeDirectory(dirPreStr);
			}
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
	public FTPFile getFtpFile(){
		return getFtpFile(getUrls().getPath());
	}
	public FTPFile getFtpFile(String filepath){
		FTPFile[] ftpFiles=null;
		String filename=encoder(filepath);
		String dir=workingDirectory();
		try {
			if(filepath.contains("/")){
				dir=filepath.substring(0,filepath.lastIndexOf("/"));
				filename=filepath.substring(filepath.lastIndexOf("/")+1);
			}
			final String tmpFilename=filename;
			ftpFiles=ftpClient.listFiles(dir,new FTPFileFilter(){
					public boolean accept(FTPFile paramFTPFile) {
						return paramFTPFile.getName().equals(tmpFilename);
					}});
			Assert.isTrue(ftpFiles.length>0,"path["+filepath+"] is not exists!");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		return ftpFiles[0];
	}
	public String[] ls(){
		try {
			return ftpClient.listNames();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return new String[]{};
	}
	public List<String> lsCascade(String filepath){
		return lsCascade(filepath,FileType.file);
	}
	public List<String> lsCascade(String filepath,FileType fileType){
		List<String> result=MapUtils.newArrayList();
		try {
			FTPFile[] ftpFiles=ftpClient.listFiles(encoder(filepath));
			for(FTPFile ftpFile:ftpFiles){
				if(ftpFile.isFile()&&Arrays.asList(FileType.all,FileType.file).contains(fileType)){
					result.add(filepath+"/"+ftpFile.getName());
				}else if(ftpFile.isDirectory()&&Arrays.asList(FileType.all,FileType.dir).contains(fileType)){
					result.add(filepath+"/"+ftpFile.getName());
				}
				if(ftpFile.isDirectory()){
					List<String> tmp=lsCascade(filepath+"/"+ftpFile.getName(),fileType);
					result.addAll(tmp);
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}
	public void get(OutputStream os) throws IOException{
		 get(urls.getPath(), os);
	}
	public void get(String filepath,OutputStream os) throws IOException{
		filepath=encoder(filepath);
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
		filepath=encoder(filepath);
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
		filepath=encoder(filepath);
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
		safeClose(is);
	}
	public String workingDirectory(){
		try {
			String dir=ftpClient.doCommandAsStrings("pwd","")[0];
			return RegexUtils.matchGroup("\"(.*?)\"",dir).get(0).replace("\"","");
		} catch (IOException e) {
		    throw new RuntimeException(e.getMessage());
		}
	}
	/**
	 * 
	 * @param localDirPath 本地目录
	 * @param remoteDirPath 远程ftp目录最后一层跟本地最后一层同级可以一样，不一样为重命名
	 * @throws IOException 
	 * @throws FileNotFoundException 
	 */
	public void putDir(String localDirPath,String remoteDirPath) throws FileNotFoundException, IOException{
		mkdir(remoteDirPath);
		String workDir=workingDirectory();
		remoteDirPath=remoteDirPath.startsWith("/")?remoteDirPath:workDir+"/"+remoteDirPath;
		List<String> localDirs=FileAccess.listNames(new File(localDirPath),FileType.dir);
		cd(remoteDirPath);
		for(String localDir:localDirs){
			mkdir(localDir);
		}
		List<String> localFiles=FileAccess.listNames(new File(localDirPath),FileType.file);
		for(String localFile:localFiles){
			cd(remoteDirPath);
			put(localFile,new FileInputStream(localDirPath+(localDirPath.equals("/")?"":"/")+localFile));
		}
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
	public static void safeClose(Object close){
		if(close!=null){
			if(close instanceof Closeable){
				try {
					((Closeable) close).close();
				} catch (IOException e) {
				}
			}else if(close instanceof ZipFile){
				try {
					((ZipFile)close).close();
				} catch (IOException e) {
				}
			}
		}
	}
	public  String encoder(String filepath){
		try {
			return new String(filepath.getBytes(charset),"iso-8859-1");
		} catch (UnsupportedEncodingException e) {
			return filepath;
		}
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
	public static enum FileType{
		all,dir,file
	}
	public static class FileAccess{
		public static List<File> list(File fileDir,FileType type){
			List<File> lst=MapUtils.newArrayList();
			for(File file:fileDir.listFiles()){
				if(file.isFile()&&Arrays.asList(FileType.all,FileType.file).contains(type)){
					lst.add(file);
				}else if(file.isDirectory()&&Arrays.asList(FileType.all,FileType.dir).contains(type)){
					lst.add(file);
				}
				if(file.isDirectory())
					lst.addAll(list(file, type));
			}
			return lst;
		}
		public static List<String> listNames(File fileDir,FileType type) {
			List<String> result=MapUtils.newArrayList();
			List<File> files=Ftps.FileAccess.list(fileDir,type);
			String dirPath=fileDir.getAbsolutePath();
			for(File file:files){
				result.add(file.getAbsolutePath().replace(dirPath,"").substring(1).replace("\\","/"));
			}
			return result;
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
		//Ftps ftps=Ftps.newFtps("ftp://ftpuser:Mk@83cka@10.222.19.70:21//opt/oss/server/var/fileint/monitor/pmmonitor_{yyyyMMdd}/hw_4g_(.*?).csv?dirStrategy=default").login();
		//ftps.get("/opt/oss/server/var/fileint/monitor/pmmonitor_20181104/hw_4g_20181104151500.csv",new FileOutputStream("d:/temp/hw_4g_201811041515-95.csv"));
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
		Ftps ftps=Ftps.newFtps("ftp://smp:smp1234@192.168.1.234:21/upload/").login();
		System.out.println(ftps.workingDirectory());
		System.out.println(ftps.lsCascade("upload/material/aaa",FileType.file));
		//Ftps.FileAccess.unzip(new File("d:/t.zip"), "d:/temp/");
		//String url="http://10.221.247.50:8161/admin/queues.jsp";
		//String result=Https.newGetHttps(url).basicAuth("admin:admin").execute();
		//System.out.println(result);
		System.out.println(Https.newGetHttps("https://192.168.1.234:8443/").registerTrust().execute());
	}
}
