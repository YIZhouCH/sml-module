package org.hw.netty.df.http;

import java.io.IOException;

import org.hw.sml.tools.Https;

public class Client {
	public static void main(String[] args) throws IOException {
		System.out.println(Https.newGetHttps("http://localhost:8080/").execute());
	}
}
