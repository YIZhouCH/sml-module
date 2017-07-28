package org.hw.sml.helper.plugin.jdbc.resource;

import java.util.Map;

import org.hw.sml.component.RcptFastJsonMapper;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Val;
import org.hw.sml.tools.Https;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Maps;


@SmlResource("/userAuth")
@Bean
public class AccountProxyResource {
	@Val(value="${url.userinfo}",required=false)
	private String url="http://10.221.247.7:8080/INAS/projectInfo-unAuth/userInfo/";
	@SmlResource("getuserinfobyname")
	public String getuserName(@Param("name")String name) throws Exception{
		Https https=Https.newPostFormHttps(url+"getuserinfobyname");
		https.getParamer().add("name",name);
		return https.execute();
	}
	@SmlResource("checkuserbyname")
	public String checkuserbyname(@Param("name")String name) throws Exception{
		Https https=Https.newPostFormHttps(url+"checkuserbyname");
		https.getParamer().add("name",name);
		return https.execute();
	}
	@SmlResource("encrypt")
	public String getToken(@Param(value="key",defaultValue="jzxngl")String key,@Param("userName")String userName) throws Exception{
		String token =AES.encrypt(userName, key);
		return token;
	}
	@SmlResource("decrypt")
	public Object exists(@Param(value="key",defaultValue="jzxngl")String key,@Param("token")String token) throws Exception{
		Map<String,Object> result=MapUtils.newLinkedHashMap();
		result.put("success","false");
		result.put("user","");
		result.put("msg","认证失败");
		try {
			String userName=null;
			userName = AES.decrypt(token,key);
			Map<String,String> rt=new RcptFastJsonMapper().toObj(checkuserbyname(userName),Map.class);
			//{"success":"true","user":{"username":"root"},"msg":""}
			//{"success":"false","user":"","msg":"认证失败"}
			if(rt.get("data")==null){
				
			}else{
				result.put("success","true");
				result.put("user",new Maps<String,String>().put("username",userName).getMap());
				result.put("msg","");
			}
			return result;
		} catch (Exception e) {
			return result;
		}
	}
	
	public static void main(String[] args) throws Exception {
		AccountProxyResource apr=new AccountProxyResource();
		System.out.println(apr.getuserName("liyq"));
		System.out.println(apr.checkuserbyname("liyq"));
		//System.out.println(apr.getToken("", userName));
	}
}
