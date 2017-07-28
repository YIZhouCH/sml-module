package org.hw.sml.helper.plugin.jdbc.resource;

import java.io.PrintStream;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class AES {
	private static final String key = "ASDFGHJKLzxcvbn6";

	private static String pad(String moduleName) {
		int nameLength = moduleName.length();
		if (nameLength > 16) {
			return moduleName.substring(0, 16);
		}
		String result = moduleName + "ASDFGHJKLzxcvbn6".substring(nameLength);
		return result;
	}

	public static String decrypt(String sSrc, String moduleName)
			throws AesException {
		try {
			String sKey = pad(moduleName);
			byte[] raw = sKey.getBytes("ASCII");
			SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
			Cipher cipher = Cipher.getInstance("AES");
			cipher.init(2, skeySpec);
			byte[] encrypted1 = hex2byte(sSrc);
			try {
				byte[] original = cipher.doFinal(encrypted1);
				String originalString = new String(original);
				return originalString;
			} catch (Exception e) {
				return null;
			}
		} catch (Exception ex) {
			throw new AesException(ex.getMessage());
		}

	}

	public static String encrypt(String sSrc, String moduleName)
			throws AesException {
		String sKey = pad(moduleName);
		if (sKey == null) {
			return null;
		}

		if (sKey.length() != 16) {
			return null;
		}
		try {
			byte[] raw = sKey.getBytes("ASCII");
			SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
			Cipher cipher = Cipher.getInstance("AES");
			cipher.init(1, skeySpec);
			byte[] encrypted = cipher.doFinal(sSrc.getBytes());
			return byte2hex(encrypted).toLowerCase();
		} catch (Exception e) {
			throw new AesException(e.getMessage());
		}

	}

	public static byte[] hex2byte(String strhex) {
		if (strhex == null) {
			return null;
		}
		int l = strhex.length();
		if (l % 2 == 1) {
			return null;
		}
		byte[] b = new byte[l / 2];
		for (int i = 0; i != l / 2; i++) {
			b[i] = (byte) Integer.parseInt(strhex.substring(i * 2, i * 2 + 2),
					16);
		}
		return b;
	}

	public static String byte2hex(byte[] b) {
		String hs = "";
		String stmp = "";
		for (int n = 0; n < b.length; n++) {
			stmp = Integer.toHexString(b[n] & 0xFF);
			if (stmp.length() == 1)
				hs = hs + "0" + stmp;
			else {
				hs = hs + stmp;
			}
		}
		return hs.toUpperCase();
	}

	public static void main(String[] args) {
		String cSrc = "Email : abc@xxx.com";

		long lStart = System.currentTimeMillis();
		try {
			String enString = encrypt(cSrc, "eHR");
			System.out.println("加密后的字串是：" + enString);
			String DeString = decrypt(enString, "eHR");
			System.out.println("解密后的字串是：" + DeString);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}