package org.hw.netty.df.l3;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.Delimiters;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;

import org.hw.sml.support.LoggerHelper;

public class EchoServer {
	public static void main(String[] args) {
		 ServerBootstrap b = new ServerBootstrap();
		 EventLoopGroup bossGroup = new NioEventLoopGroup(1);
	     EventLoopGroup workerGroup = new NioEventLoopGroup(1);
	     try{
		     b.group(bossGroup,workerGroup);
		     b.channel(NioServerSocketChannel.class).childHandler(new ChannelInitializer<SocketChannel>() {
				protected void initChannel(SocketChannel ch) throws Exception {
					ChannelPipeline pl=ch.pipeline();
					//pl.addLast("framer", new DelimiterBasedFrameDecoder(8192, Delimiters.lineDelimiter()));//默认情况下都是字节传输
					pl.addLast("decoder",new StringDecoder());
					pl.addLast("encoder",new StringEncoder());
					pl.addLast("echoHandler",new EchoHandler());
				}
		     });
		     b.bind(8080).sync().channel().closeFuture().sync();
	     }catch(Exception e){
	    	 e.printStackTrace();
	     }finally{
	    	 bossGroup.shutdownGracefully();
		     workerGroup.shutdownGracefully();
	     }
	    
	}
	public static class EchoHandler extends  ChannelInboundHandlerAdapter{
		public void channelRead(ChannelHandlerContext ctx, Object in)
				throws Exception {
			 String msg=in.toString();
			 int i=Integer.parseInt(msg);
			 if(i>=10000){
				 System.out.println(ctx.channel().remoteAddress() + " Say : " + i);
				 ctx.writeAndFlush(Unpooled.EMPTY_BUFFER).addListener(ChannelFutureListener.CLOSE);
			 }else{
				 ctx.writeAndFlush(String.valueOf(i));
			 }
		}
		public void channelReadComplete(ChannelHandlerContext ctx)
				throws Exception {
			//
		}
		public void channelActive(ChannelHandlerContext ctx) throws Exception {
			LoggerHelper.getLogger().info(EchoClient.class,ctx.channel().remoteAddress()+" 上线了!");
			super.channelActive(ctx);
		}
		public void channelInactive(ChannelHandlerContext ctx) throws Exception {
			LoggerHelper.getLogger().info(EchoClient.class,ctx.channel().remoteAddress()+" 下线了!");
			super.channelInactive(ctx);
		}
		public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause)
				throws Exception {
			cause.printStackTrace();
			ctx.close();
			super.exceptionCaught(ctx, cause);
		}
	
	}
}
