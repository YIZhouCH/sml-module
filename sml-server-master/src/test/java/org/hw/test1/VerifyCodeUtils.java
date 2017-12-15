package org.hw.test1;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.font.FontRenderContext;
import java.awt.font.TextLayout;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Random;

import javax.imageio.ImageIO;

import org.hw.sml.component.RcptFastJsonMapper;

import com.alibaba.fastjson.JSON;

public class VerifyCodeUtils{
    //使用到Algerian字体，系统里没有的话需要安装字体，字体只显示大写，去掉了1,0,i,o几个容易混淆的字符
    public static final String VERIFY_CODES = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static Random random = new Random();
 
 
    /**
     * 使用系统默认字符源生成验证码
     * @param verifySize    验证码长度
     * @return
     */
    public static String generateVerifyCode(int verifySize){
        return generateVerifyCode(verifySize, VERIFY_CODES);
    }
    /**
     * 使用指定源生成验证码
     * @param verifySize    验证码长度
     * @param sources   验证码字符源
     * @return
     */
    public static String generateVerifyCode(int verifySize, String sources){
        if(sources == null || sources.length() == 0){
            sources = VERIFY_CODES;
        }
        int codesLen = sources.length();
        Random rand = new Random(System.currentTimeMillis());
        StringBuilder verifyCode = new StringBuilder(verifySize);
        for(int i = 0; i < verifySize; i++){
            verifyCode.append(sources.charAt(rand.nextInt(codesLen-1)));
        }
        return verifyCode.toString();
    }
     
    /**
     * 生成随机验证码文件,并返回验证码值
     * @param w
     * @param h
     * @param outputFile
     * @param verifySize
     * @return
     * @throws IOException
     */
    public static String outputVerifyImage(int w, int h, File outputFile, int verifySize) throws IOException{
        String verifyCode = generateVerifyCode(verifySize);
        outputImage(w, h, outputFile, verifyCode);
        return verifyCode;
    }
     
    /**
     * 输出随机验证码图片流,并返回验证码值
     * @param w
     * @param h
     * @param os
     * @param verifySize
     * @return
     * @throws IOException
     */
    public static String outputVerifyImage(int w, int h, OutputStream os, int verifySize) throws IOException{
        String verifyCode = generateVerifyCode(verifySize);
        outputImage(os, verifyCode);
        return verifyCode;
    }
     
    /**
     * 生成指定验证码图像文件
     * @param w
     * @param h
     * @param outputFile
     * @param code
     * @throws IOException
     */
    public static void outputImage(int w, int h, File outputFile, String code) throws IOException{
        if(outputFile == null){
            return;
        }
        File dir = outputFile.getParentFile();
        if(!dir.exists()){
            dir.mkdirs();
        }
        try{
            outputFile.createNewFile();
            FileOutputStream fos = new FileOutputStream(outputFile);
            outputImage(fos, code);
            fos.close();
        } catch(IOException e){
            throw e;
        }
    }
     
    /**
     * 输出指定验证码图片流
     * @param w
     * @param h
     * @param os
     * @param code
     * @throws IOException
     */
    public static void outputImage(OutputStream os, String code) throws IOException{
    	int num = 4;
        int imageWidth = num * 29;
        int imageHeight = 40;
        int line_left = 4;
    	BufferedImage bi = new BufferedImage(imageWidth, imageHeight, 13);
        Font font = getFont();
        Graphics2D graphics = bi.createGraphics();
        Color c = getRandColor(220, 250);
        graphics.setColor(c);
        graphics.fillRect(0, 0, bi.getWidth(), bi.getHeight());
        graphics.setColor(Color.black);
        graphics.setFont(font);
        graphics.setColor(getRandColor());
        graphics.drawString(code, 15, 30);
        TextLayout textTl = new TextLayout(code, new Font("Fixedsys", 0, 30), new FontRenderContext(null, true, false));
        textTl.draw(graphics, 10.0F, 70.0F);
        int w = bi.getWidth();
        int h = bi.getHeight();
        //shear(graphics, w, h, c);
        graphics.setColor(getRandColor(160, 200));
        for (int i = 0; i < line_left; i++) {
          int x = random.nextInt(imageWidth - 1);
          int y = random.nextInt(imageHeight - 1);
          int xl = random.nextInt(6) + 1;
          int yl = random.nextInt(12) + 1;
          graphics.drawLine(x, y, x + xl + 40, y + yl + 20);
        }

        for (int i = 0; i < 5; i++) {
          int x = random.nextInt(imageWidth - 1);
          int y = random.nextInt(imageHeight - 1);
          int xl = random.nextInt(12) + 1;
          int yl = random.nextInt(6) + 1;
          graphics.drawLine(x, y, x - xl + 40, y - yl);
        }

        float yawpRate = 0.05F;
        int area = (int)(yawpRate * w * h);
        for (int i = 0; i < area; i++) {
          int x = random.nextInt(w);
          int y = random.nextInt(h);
          int rgb = getRandomIntColor();
          bi.setRGB(x, y, rgb);
        }
        ImageIO.write(bi, "JPEG",os);
    }
     
    private void drawThickLine(Graphics g, int x1, int y1, int x2, int y2, int thickness, Color c)
    {
      g.setColor(c);
      int dX = x2 - x1;
      int dY = y2 - y1;
      double lineLength = Math.sqrt(dX * dX + dY * dY);

      double scale = thickness / (2.0D * lineLength);

      double ddx = -scale * dY;
      double ddy = scale * dX;
      ddx += (ddx > 0.0D ? 0.5D : -0.5D);
      ddy += (ddy > 0.0D ? 0.5D : -0.5D);
      int dx = (int)ddx;
      int dy = (int)ddy;

      int[] xPoints = new int[4];
      int[] yPoints = new int[4];

      xPoints[0] = (x1 + dx);
      yPoints[0] = (y1 + dy);
      xPoints[1] = (x1 - dx);
      yPoints[1] = (y1 - dy);
      xPoints[2] = (x2 - dx);
      yPoints[2] = (y2 - dy);
      xPoints[3] = (x2 + dx);
      yPoints[3] = (y2 + dy);

      g.fillPolygon(xPoints, yPoints, 4);
    }

    private static void shear(Graphics g, int w1, int h1, Color color)
    {
      shearX(g, w1, h1, color);
      shearY(g, w1, h1, color);
    }

    private static void shearX(Graphics g, int w1, int h1, Color color)
    {
      int period = random.nextInt(80);

      boolean borderGap = true;
      int frames = 1;
      int phase = random.nextInt(80);

      for (int i = 0; i < h1; i++) {
        double d =Math.sin(i / period + 6.283185307179586D * phase / frames);
        g.copyArea(0, i, w1, 1, (int)d, 0);
        if (borderGap) {
          g.setColor(color);
          g.drawLine((int)d, i, 0, i);
          g.drawLine((int)d + w1, i, w1, i);
        }
      }
    }

    private static void shearY(Graphics g, int w1, int h1, Color color)
    {
      int period = random.nextInt(15) + 1;

      boolean borderGap = true;
      int frames = 20;
      int phase = 7;
      for (int i = 0; i < w1; i++) {
        double d =  Math.sin(i / period + 6.283185307179586D * phase / frames);

        g.copyArea(i, 0, 1, h1, 0, (int)d);
        if (borderGap) {
          g.setColor(color);
          g.drawLine(i, (int)d, i, 0);
          g.drawLine(i, (int)d + h1, i, h1);
        }
      }
    }

    private static Font getFont()
    {
      Random random = new Random();
      Font[] font = new Font[5];
      font[0] = new Font("Ravie", 1, 30);
      font[1] = new Font("Times New Roman", 1, 30);
      font[2] = new Font("Fixedsys", 1, 30);
      font[3] = new Font("SansSerif", 1, 30);
      font[4] = new Font("Palatino Linotype", 1, 30);
      return font[random.nextInt(5)];
    }

    private  static Color getRandColor()
    {
      Random random = new Random();
      Color[] color = new Color[10];
      color[0] = new Color(72, 72, 72);
      color[1] = new Color(147, 89, 26);
      color[2] = new Color(101, 61, 123);
      color[3] = new Color(54, 129, 96);
      color[4] = new Color(214, 164, 76);
      return color[random.nextInt(5)];
    }

    private static  Color getRandColor(int fc, int bc)
    {
      if (fc > 255)
        fc = 255;
      if (bc > 255)
        bc = 255;
      int r = fc + random.nextInt(bc - fc);
      int g = fc + random.nextInt(bc - fc);
      int b = fc + random.nextInt(bc - fc);
      return new Color(r, g, b);
    }

    private static  int getRandomIntColor()
    {
      int[] rgb = getRandomRgb();
      int color = 0;
      for (int c : rgb) {
        color <<= 8;
        color |= c;
      }
      return color;
    }

    private static  int[] getRandomRgb() {
      int[] rgb = new int[3];
      for (int i = 0; i < 3; i++) {
        rgb[i] = random.nextInt(255);
      }
      return rgb;
    }
    public static void main(String[] args) throws IOException{
    	class A{
    		private String a="1";
    		private String b;
			public String getA() {
				return a;
			}
			public void setA(String a) {
				this.a = a;
			}
			public String getB() {
				return b;
			}
			public void setB(String b) {
				this.b = b;
			}
			@Override
			public String toString() {
				return "A [a=" + a + ", b=" + b + "]";
			}
    		
    	};
    	RcptFastJsonMapper jm=new RcptFastJsonMapper();
        Object d=jm.toObj(jm.toJson(new A()),A.class);
        System.out.println(d);
    }
}