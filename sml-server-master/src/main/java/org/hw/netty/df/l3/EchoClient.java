package org.hw.netty.df.l3;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import io.netty.buffer.ByteBufUtil;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandler.Sharable;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import io.netty.util.CharsetUtil;

import java.io.IOException;

import org.hw.sml.support.LoggerHelper;
import org.hw.sml.support.time.StopWatch;


public class EchoClient {
	static EventLoopGroup group=new NioEventLoopGroup(1);
	public static void test(String[] args) throws InterruptedException, IOException {
		 Bootstrap b = new Bootstrap();
		 b.group(group).option(ChannelOption.SO_KEEPALIVE, true).option(ChannelOption.TCP_NODELAY, true)
		 .channel(NioSocketChannel.class)
		              .handler(new ChannelInitializer<SocketChannel>(){
						protected void initChannel(SocketChannel ch) throws Exception {
							ChannelPipeline pl=ch.pipeline();
							pl.addLast("decoder",new StringDecoder());
							pl.addLast("encoder",new StringEncoder());
							pl.addLast("echoclient",new EchoClientHander());
						}

		              });
		 b.connect("localhost", 8080).sync().channel().closeFuture().sync();
	}
	public static void main(final String[] args) throws InterruptedException, IOException {
		StopWatch sw=new StopWatch("test100");
		sw.start("1");
		for(int i=0;i<1;i++){
			test(args);
		}
		sw.stop();
		System.out.println(sw.prettyPrint());
		group.shutdownGracefully().sync();
	}
	@Sharable
	public static class EchoClientHander extends SimpleChannelInboundHandler<String>{
		protected void channelRead0(ChannelHandlerContext ctx,String msg)
			throws Exception {
			 int i=Integer.parseInt(msg)+1; 
			 if(i>=10001){
				 return;
			 }
			 System.out.println(i);
			 ctx.writeAndFlush(String.valueOf(i));
		}

		@Override
		public void channelActive(ChannelHandlerContext ctx) throws Exception {
			ctx.writeAndFlush(Unpooled.copiedBuffer("1",CharsetUtil.UTF_8));
			LoggerHelper.getLogger().info(EchoClient.class,"上线了");
			super.channelActive(ctx);
		}
		public void channelInactive(ChannelHandlerContext ctx) throws Exception {
			LoggerHelper.getLogger().info(EchoClient.class," 下线了!");
			super.channelInactive(ctx);
		}
	}

}
