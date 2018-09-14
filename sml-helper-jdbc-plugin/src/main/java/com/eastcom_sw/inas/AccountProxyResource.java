package com.eastcom_sw.inas;

import java.io.PrintStream;
import java.util.List;
import java.util.Map;

import org.hw.sml.component.RcptFastJsonMapper;
import org.hw.sml.rest.annotation.Param;
import org.hw.sml.rest.annotation.SmlResource;
import org.hw.sml.support.SmlAppContextUtils;
import org.hw.sml.support.ioc.annotation.Bean;
import org.hw.sml.support.ioc.annotation.Val;
import org.hw.sml.tools.Https;
import org.hw.sml.tools.Https.Paramer;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Maps;

@SmlResource("/userAuth")
@Bean
public class AccountProxyResource
{

  @Val(value="${url.userinfo}", required=false)
  private String url = "http://10.221.247.7:8080/INAS/projectInfo-unAuth/userInfo/";

  @SmlResource("getuserinfobyname")
  public String getuserName(@Param("name") String name) throws Exception { Https https = Https.newPostFormHttps(this.url + "getuserinfobyname");
    https.getParamer().add("name", name);
    return https.execute(); }

  @SmlResource("checkuserbyname")
  public List<Map<String,Object>> checkuserbyname(@Param("name") String name) throws Exception {
    return SmlAppContextUtils.getSmlContextUtils().getJdbc("defJt").queryForList("select * from ipmsp.sys_user where username=?",name);
  }
  @SmlResource("encrypt")
  public String getToken(@Param(value="key", defaultValue="jzxngl") String key, @Param("userName") String userName) throws Exception {
    String token = AES.encrypt(userName, key);
    return token;
  }
  @SmlResource("decrypt")
  public Object exists(@Param(value="key", defaultValue="jzxngl") String key, @Param("token") String token) throws Exception {
    Map result = MapUtils.newLinkedHashMap();
    result.put("success", "false");
    result.put("user", "");
    result.put("msg", "认证失败");
    try {
      String userName = null;
      userName = AES.decrypt(token, key);
      if (checkuserbyname(userName).size()>0)
      {
        result.put("success", "true");
        result.put("user", new Maps().put("username", userName).getMap());
        result.put("msg", "");
      }
      return result; } catch (Exception e) {
    }
    return result;
  }

  public static void main(String[] args) throws Exception
  {
    AccountProxyResource apr = new AccountProxyResource();
    System.out.println(apr.getuserName("zhengchun"));
    System.out.println(apr.checkuserbyname("liyq"));
  }
}