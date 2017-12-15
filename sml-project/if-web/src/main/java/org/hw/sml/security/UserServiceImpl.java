package org.hw.sml.security;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hw.sml.core.build.SmlTools;
import org.hw.sml.model.Result;
import org.hw.sml.shiro.model.ShiroUser;
import org.hw.sml.shiro.service.IShiroUserService;
import org.hw.sml.support.SmlAppContextUtils;
import org.hw.sml.tools.MapUtils;
import org.hw.sml.tools.Maps;

public class UserServiceImpl implements IShiroUserService{
	public ShiroUser queryShiroUser(String username) {
		ShiroUser user=new ShiroUser();
		user.setUsername(username);
		List<Map<String,Object>> users=((Result)SmlAppContextUtils.getSmlContextUtils().query("system-user-qry",new Maps<String,String>().put("name",username).getMap())).getDatas();
		if(users!=null&&users.size()>0){
			Map<String,Object> u=users.get(0);
			user.setPassword(u.get("password").toString());
			user.setSalt(u.get("salt").toString());
			String[] roleLst=MapUtils.getString(u,"roleLst","").split(",");
			Set<String> roles=new HashSet<String>();
			for(String r:roleLst){
				roles.add(r);
			}
			user.setRoles(roles);
			//perms
			List<Map<String,Object>> perms=SmlAppContextUtils.getSmlContextUtils().query("system-resource-qry",new Maps<String,String>().put("user_name",username).getMap());
			Set<String> resources=new HashSet<String>();
			for(Map<String,Object> perm:perms){
				String url=MapUtils.getString(perm,"urls");
				if(!SmlTools.isEmpty(url))
				resources.add(url);
			}
			user.setResources(resources);
		}
		return user;
	}
	

}
