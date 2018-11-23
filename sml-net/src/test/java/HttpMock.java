import java.io.IOException;

import org.hw.sml.tools.Https;


public class HttpMock {
	public static void main(String[] args) throws IOException {
		String result=Https.newGetHttps("http://www.baidu.com").proxy("localhost",1080,"admin:admin").execute();
		System.out.println(result);
	}
}
