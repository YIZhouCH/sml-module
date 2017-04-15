package org.hw.sml.status.tools;


import java.io.ByteArrayInputStream;
import java.io.StringWriter;

import javax.xml.namespace.QName;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.MimeHeaders;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;



public class SoapUtils {
	/**
	 * 生成webservice 回执报文，报文为字符串
	 * @param args
	 */
    public static String createSoapResponseMsg(String responseStr){
    	try {
			SOAPMessage sm= MessageFactory.newInstance().createMessage();
			sm.getSOAPBody().addBodyElement(new QName("response")).addChildElement(new QName("out")).addTextNode(responseStr);
			return formartSoapToString(sm);
		} catch (SOAPException e) {
			e.printStackTrace();
		}
    	return null;
    }
    /**
     * 把soap对象格式化为字符串
     * @param soapPart
     * @return 
    */
	public static String formartSoapToString(SOAPMessage soapMessage) {
		String str = "";
		try {
			SOAPPart soapPart = soapMessage.getSOAPPart();
			Transformer trans = TransformerFactory.newInstance().newTransformer();
			StringWriter sw = new StringWriter();
			trans.transform(new DOMSource(soapPart.getEnvelope()),new StreamResult(sw));
			sw.flush();
			sw.close();
			str = sw.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return str;
	}

    /**
     * 把soap字符串格式化为SOAPMessage
     * 
     * @param soapString
     * @param protocol
     * @return
     * @see [类、类#方法、类#成员]
     */
    public static SOAPMessage formatStringToSoap(String soapString, String protocol) {
        try {
        	SOAPMessage reqMsg = null;
        	if(protocol==null||protocol.trim().length()==0){
        		reqMsg = MessageFactory.newInstance().createMessage(new MimeHeaders(), new ByteArrayInputStream(soapString.getBytes("UTF-8")));
        	}else{
        		reqMsg = MessageFactory.newInstance(protocol).createMessage(new MimeHeaders(), new ByteArrayInputStream(soapString.getBytes("UTF-8")));
        	}
            reqMsg.saveChanges();
            return reqMsg;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
