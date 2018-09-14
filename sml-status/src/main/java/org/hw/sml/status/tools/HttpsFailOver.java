package org.hw.sml.status.tools;

import java.io.IOException;

import org.hw.sml.tools.Https;

public class HttpsFailOver {
	public static void main(String[] args) throws IOException {
		//System.out.println(Https.newGetHttps("http://localhost:8081/aa").failover("http://localhost:8080/","http://localhost:8082/aa","http://localhost:8083/aa").connectTimeout(1000).withReadTimeout(1000).execute());
		/*System.out.println(Https.newGetHttps("http://localhost:8083/aa")
				.failover(new Https.Failover("http://localhost:8081/aa",30),new Https.Failover("http://localhost:8082/aa",2),new Https.Failover("http://localhost:8080/aa",1))
				.connectTimeout(1000)
				.withReadTimeout(1000)
				.execute());*/
		System.out.println(Https.newGetHttps("failover:http://localhost:8081/aa,http://localhost:8082/aa,http://localhost:8080/aa").connectTimeout(10).execute());
	}
}
