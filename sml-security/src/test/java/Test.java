import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import org.apache.shiro.config.ConfigurationException;
import org.apache.shiro.config.Ini;
import org.apache.shiro.web.config.WebIniSecurityManagerFactory;
import org.apache.shiro.web.env.EnvironmentLoaderListener;
import org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter;
import org.apache.shiro.web.filter.mgt.DefaultFilter;
import org.apache.shiro.web.servlet.ShiroFilter;


public class Test {

	public static void main(String[] args) throws ConfigurationException, FileNotFoundException {
		// TODO Auto-generated method stub
		PermissionsAuthorizationFilter f;
		ShiroFilter sf;
		DefaultFilter df;
		EnvironmentLoaderListener ell;
		Ini ini=new Ini();
		ini.load(new FileInputStream("classpath:shiro.in"));
		WebIniSecurityManagerFactory wsmf=new WebIniSecurityManagerFactory();
		SecurityManager sm=(SecurityManager) wsmf.createInstance();
		
	}

}
