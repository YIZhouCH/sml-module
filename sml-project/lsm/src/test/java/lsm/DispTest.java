package lsm;

import java.io.FileInputStream;

import org.hw.sml.tools.IOUtils;
import org.springframework.remoting.caucho.HessianProxyFactoryBean;


public class DispTest {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main1(String[] args) throws Exception {
		
		String xmlData = IOUtils.toString(DispTest.class.getResourceAsStream("disp.txt"), "GBK");
		System.out.println(xmlData);
		//String serviceUrl="http://10.221.18.29:30013/disp";
		//String serviceUrl="http://localhost:8082/disp";
		String serviceUrl="http://localhost:8083/httpd/sml/proxy/disp?realUrl=http://10.221.18.29:30013/disp";
		HessianProxyFactoryBean factory = new HessianProxyFactoryBean();
		factory.setServiceUrl(serviceUrl);
		factory.setServiceInterface(EmosSend.class);
		factory.setReadTimeout(30000);
		factory.afterPropertiesSet();
		
		String operation="newAlarm";
		String serviceCode="DATA.ORDER.ASS.CS.EOMS_APP";
		
		

		EmosSend send = (EmosSend) factory.getObject();
		String response =  send.request(operation, xmlData, serviceCode);
		System.out.println(response);
	}
	public static void main(String[] args) {
	
	}

}
