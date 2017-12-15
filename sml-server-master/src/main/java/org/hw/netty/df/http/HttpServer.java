package org.hw.netty.df.http;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpContent;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.HttpVersion;
import io.netty.handler.stream.ChunkedWriteHandler;
import io.netty.util.CharsetUtil;

public class HttpServer {
	public static void main(String[] args) throws InterruptedException {
		 EventLoopGroup parentGroup = new NioEventLoopGroup();
         EventLoopGroup childGroup = new NioEventLoopGroup();
         ServerBootstrap b=new ServerBootstrap();
         b.group(parentGroup, childGroup).channel(NioServerSocketChannel.class)
         .childHandler(new ChannelInitializer<Channel>() {
			protected void initChannel(Channel ch) throws Exception {
				 //HTTP 请求消息解码器
                ch.pipeline().addLast("http-decoder",new HttpRequestDecoder());
                //HttpObjectAggregator解码器，将多个消息转换成单一的FullHttpRequest或者FullHTtpResponse，原因是HTTP解码器在每个HTTP消息中会生成多个消息对象（HttpRequst、HttpResponse、Httpontent/LastHttpContent）。
                ch.pipeline().addLast("http-aggregator",new HttpObjectAggregator(65536));
                //HTTP响应结卖钱
                ch.pipeline().addLast("http-encoder",new HttpResponseEncoder());
                //Chunked handler它的作用是支持异步发送大的码流但不占用过多的内存，防止发生java内存溢出错误。
                ch.pipeline().addLast("http-chunked",new ChunkedWriteHandler());
                ch.pipeline().addLast("httpServerHandler",new HttpReceiveHandler());
			}
		}).bind(8080).sync().channel().closeFuture().sync();
	}
	public static class HttpReceiveHandler extends ChannelHandlerAdapter  {
		public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
	        if (msg instanceof HttpContent) {
	            HttpContent httpContent = (HttpContent) msg;
	            ByteBuf content = httpContent.content();
	            StringBuilder buf = new StringBuilder();
	            buf.append(content.toString(CharsetUtil.UTF_8));
	            //转发
	            String responseMessage ="{\"a\":\"b\"}";
	            FullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK);
	            response.headers().set("content-type", "application/json; charset=UTF-8");
	            response.headers().set("content-length", responseMessage.length());
	            ByteBuf buffer = Unpooled.copiedBuffer(responseMessage, CharsetUtil.UTF_8);
	            response.content().writeBytes(buffer);
	            buffer.release();
	            ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
	        }
	    }
	}
}
