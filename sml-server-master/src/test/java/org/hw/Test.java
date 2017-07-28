package org.hw;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.Map;

import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.time.StopWatch;
import org.hw.sml.tools.Https;

@Bean
@SmlResource("test")
public class Test {
	String url="http://localhost:1202/master/test";
	@SmlResource("proxy0")
	public Object query1(String params){
		return params;
	}
	StopWatch sw=null;
	@SmlResource("proxy1")
	public Object query2(String params) throws IOException{
	
		return params;
	}
	@SmlResource("proxy2")
	public Object query3(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy1").body(params).execute();
	}
	@SmlResource("proxy3")
	public Object query4(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy2").body(params).execute();
	}
	@SmlResource("proxy4")
	public Object query5(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy3").body(params).execute();
	}
	@SmlResource("proxy5")
	public Object query6(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy4").body(params).execute();
	}
	@SmlResource("proxy6")
	public Object query7(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy5").body(params).execute();
	}
	@SmlResource("proxy7")
	public Object query8(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy6").body(params).execute();
	}
	@SmlResource("proxy8")
	public Object query9(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy7").body(params).execute();
	}
	@SmlResource("proxy9")
	public Object query10(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy8").body(params).execute();
	}
	@SmlResource("proxy10")
	public Object query11(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy9").body(params).execute();
	}
	@SmlResource("proxy11")
	public Object query12(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy10").body(params).execute();
	}
	@SmlResource("proxy12")
	public Object query13(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy11").body(params).execute();
	}
	@SmlResource("proxy13")
	public Object query14(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy12").body(params).execute();
	}
	@SmlResource("proxy14")
	public Object query15(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy13").body(params).execute();
	}
	@SmlResource("proxy15")
	public Object query16(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy14").body(params).execute();
	}
	@SmlResource("proxy16")
	public Object query17(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy15").body(params).execute();
	}
	@SmlResource("proxy17")
	public Object query18(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy16").body(params).execute();
	}
	@SmlResource("proxy18")
	public Object query19(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy17").body(params).execute();
	}
	@SmlResource("proxy19")
	public Object query20(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy18").body(params).execute();
	}
	@SmlResource("proxy20")
	public Object query21(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy19").body(params).execute();
	}
	@SmlResource("proxy21")
	public Object query22(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy20").body(params).execute();
	}
	@SmlResource("proxy22")
	public Object query23(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy21").body(params).execute();
	}
	@SmlResource("proxy23")
	public Object query24(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy22").body(params).execute();
	}
	@SmlResource("proxy24")
	public Object query25(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy23").body(params).execute();
	}
	@SmlResource("proxy25")
	public Object query26(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy24").body(params).execute();
	}
	@SmlResource("proxy26")
	public Object query27(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy25").body(params).execute();
	}
	@SmlResource("proxy27")
	public Object query28(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy26").body(params).execute();
	}
	@SmlResource("proxy28")
	public Object query29(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy27").body(params).execute();
	}
	@SmlResource("proxy29")
	public Object query30(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy28").body(params).execute();
	}
	@SmlResource("proxy30")
	public Object query31(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy29").body(params).execute();
	}
	@SmlResource("proxy31")
	public Object query32(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy30").body(params).execute();
	}
	@SmlResource("proxy32")
	public Object query33(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy31").body(params).execute();
	}
	@SmlResource("proxy33")
	public Object query34(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy32").body(params).execute();
	}
	@SmlResource("proxy34")
	public Object query35(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy33").body(params).execute();
	}
	@SmlResource("proxy35")
	public Object query36(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy34").body(params).execute();
	}
	@SmlResource("proxy36")
	public Object query37(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy35").body(params).execute();
	}
	@SmlResource("proxy37")
	public Object query38(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy36").body(params).execute();
	}
	@SmlResource("proxy38")
	public Object query39(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy37").body(params).execute();
	}
	@SmlResource("proxy39")
	public Object query40(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy38").body(params).execute();
	}
	@SmlResource("proxy40")
	public Object query41(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy39").body(params).execute();
	}
	@SmlResource("proxy41")
	public Object query42(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy40").body(params).execute();
	}
	@SmlResource("proxy42")
	public Object query43(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy41").body(params).execute();
	}
	@SmlResource("proxy43")
	public Object query44(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy42").body(params).execute();
	}
	@SmlResource("proxy44")
	public Object query45(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy43").body(params).execute();
	}
	@SmlResource("proxy45")
	public Object query46(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy44").body(params).execute();
	}
	@SmlResource("proxy46")
	public Object query47(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy45").body(params).execute();
	}
	@SmlResource("proxy47")
	public Object query48(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy46").body(params).execute();
	}
	@SmlResource("proxy48")
	public Object query49(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy47").body(params).execute();
	}
	@SmlResource("proxy49")
	public Object query50(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy48").body(params).execute();
	}
	@SmlResource("proxy50")
	public Object query51(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy49").body(params).execute();
	}
	@SmlResource("proxy51")
	public Object query52(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy50").body(params).execute();
	}
	@SmlResource("proxy52")
	public Object query53(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy51").body(params).execute();
	}
	@SmlResource("proxy53")
	public Object query54(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy52").body(params).execute();
	}
	@SmlResource("proxy54")
	public Object query55(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy53").body(params).execute();
	}
	@SmlResource("proxy55")
	public Object query56(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy54").body(params).execute();
	}
	@SmlResource("proxy56")
	public Object query57(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy55").body(params).execute();
	}
	@SmlResource("proxy57")
	public Object query58(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy56").body(params).execute();
	}
	@SmlResource("proxy58")
	public Object query59(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy57").body(params).execute();
	}
	@SmlResource("proxy59")
	public Object query60(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy58").body(params).execute();
	}
	@SmlResource("proxy60")
	public Object query61(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy59").body(params).execute();
	}
	@SmlResource("proxy61")
	public Object query62(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy60").body(params).execute();
	}
	@SmlResource("proxy62")
	public Object query63(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy61").body(params).execute();
	}
	@SmlResource("proxy63")
	public Object query64(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy62").body(params).execute();
	}
	@SmlResource("proxy64")
	public Object query65(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy63").body(params).execute();
	}
	@SmlResource("proxy65")
	public Object query66(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy64").body(params).execute();
	}
	@SmlResource("proxy66")
	public Object query67(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy65").body(params).execute();
	}
	@SmlResource("proxy67")
	public Object query68(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy66").body(params).execute();
	}
	@SmlResource("proxy68")
	public Object query69(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy67").body(params).execute();
	}
	@SmlResource("proxy69")
	public Object query70(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy68").body(params).execute();
	}
	@SmlResource("proxy70")
	public Object query71(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy69").body(params).execute();
	}
	@SmlResource("proxy71")
	public Object query72(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy70").body(params).execute();
	}
	@SmlResource("proxy72")
	public Object query73(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy71").body(params).execute();
	}
	@SmlResource("proxy73")
	public Object query74(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy72").body(params).execute();
	}
	@SmlResource("proxy74")
	public Object query75(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy73").body(params).execute();
	}
	@SmlResource("proxy75")
	public Object query76(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy74").body(params).execute();
	}
	@SmlResource("proxy76")
	public Object query77(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy75").body(params).execute();
	}
	@SmlResource("proxy77")
	public Object query78(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy76").body(params).execute();
	}
	@SmlResource("proxy78")
	public Object query79(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy77").body(params).execute();
	}
	@SmlResource("proxy79")
	public Object query80(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy78").body(params).execute();
	}
	@SmlResource("proxy80")
	public Object query81(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy79").body(params).execute();
	}
	@SmlResource("proxy81")
	public Object query82(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy80").body(params).execute();
	}
	@SmlResource("proxy82")
	public Object query83(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy81").body(params).execute();
	}
	@SmlResource("proxy83")
	public Object query84(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy82").body(params).execute();
	}
	@SmlResource("proxy84")
	public Object query85(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy83").body(params).execute();
	}
	@SmlResource("proxy85")
	public Object query86(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy84").body(params).execute();
	}
	@SmlResource("proxy86")
	public Object query87(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy85").body(params).execute();
	}
	@SmlResource("proxy87")
	public Object query88(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy86").body(params).execute();
	}
	@SmlResource("proxy88")
	public Object query89(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy87").body(params).execute();
	}
	@SmlResource("proxy89")
	public Object query90(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy88").body(params).execute();
	}
	@SmlResource("proxy90")
	public Object query91(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy89").body(params).execute();
	}
	@SmlResource("proxy91")
	public Object query92(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy90").body(params).execute();
	}
	@SmlResource("proxy92")
	public Object query93(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy91").body(params).execute();
	}
	@SmlResource("proxy93")
	public Object query94(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy92").body(params).execute();
	}
	@SmlResource("proxy94")
	public Object query95(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy93").body(params).execute();
	}
	@SmlResource("proxy95")
	public Object query96(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy94").body(params).execute();
	}
	@SmlResource("proxy96")
	public Object query97(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy95").body(params).execute();
	}
	@SmlResource("proxy97")
	public Object query98(String params) throws IOException{
		System.err.println(97);
		return Https.newPostBodyHttps(url+"/proxy96").body(params).execute();
	}
	@SmlResource("proxy98")
	public Object query99(String params) throws IOException{
		return Https.newPostBodyHttps(url+"/proxy97").body(params).execute();
	}
	@SmlResource("proxy99")
	public Object query100(String params) throws IOException{
		sw=new StopWatch("100次测试");
		sw.start("proxy99");
		Https https=Https.newPostBodyHttps(url+"/proxy98").body(params);
		https.connectTimeout(100);
		//https.withReadTimeout(1000*9);
		Object result= https.execute();
		sw.stop();
		System.out.println(sw.prettyPrint());
		return result;
	}

	public static void main(String[] args) throws IOException {
		Https https=Https.newPostBodyHttps("http://localhost:1202/master/test/proxy98").body("{}");
		https.connectTimeout(1000);
		https.withReadTimeout(400);
		Object result= https.execute();
		System.out.println(result);
	}
}
