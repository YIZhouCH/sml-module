package org.hw.netty.df;

import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.ExecutorService;

import org.hw.sml.tools.DateTools;

public class TimeServerHandleTask implements Runnable {
    SocketChannel socketChannel;
    ExecutorService executorService;
   ByteBuffer byteBuffer = ByteBuffer.allocateDirect(1024);
 
    public TimeServerHandleTask(SocketChannel socketChannel, ExecutorService executorService) {
        this.socketChannel = socketChannel;
        this.executorService = executorService;
    }
 
    public void run() {
            try {
                if(socketChannel.read(byteBuffer)>0){
                    while (true){
                        byteBuffer.flip();
                        if(byteBuffer.remaining()<"GET CURRENT TIME".length()){
                            byteBuffer.compact();
                            socketChannel.read(byteBuffer);
                            continue;
                        }
                        byte[] request=new byte[byteBuffer.remaining()];
                        byteBuffer.get(request);
                        String requestStr=new String(request);
                        byteBuffer.clear();
                        if (!"GET CURRENT TIME".equals(requestStr)) {
                            socketChannel.write(byteBuffer.put("BAD_REQUEST".getBytes()));
                        } else {
                            byteBuffer = this.byteBuffer.put(DateTools.sdf_mis().format(new Date()).getBytes());
                            byteBuffer.flip();
                            socketChannel.write(byteBuffer);
                            byteBuffer.clear();
                        }
                       
                    }
                }
                TimeServerHandleTask currentTask = new TimeServerHandleTask(socketChannel,executorService);
                executorService.submit(currentTask);
            } catch (Exception e) {
                e.printStackTrace();
            }
    }
}