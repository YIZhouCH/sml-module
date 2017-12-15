package org.hw.netty.df.l1;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.SocketChannel;
import java.util.Calendar;

public class TimeServerTask implements Runnable{
    private SelectionKey selectionKey;
 
    public TimeServerTask(SelectionKey selectionKey) {
        this.selectionKey = selectionKey;
    }
 
    public void run() {
        SocketChannel channel = (SocketChannel) selectionKey.channel();
        ByteBuffer byteBuffer = ByteBuffer.allocateDirect(1024);
        try {
            int count =0;
            while ((count = channel.read(byteBuffer)) > 0) {
                byteBuffer.flip();
                byte[] request=new byte[byteBuffer.remaining()];
                byteBuffer.get(request);
                String requestStr=new String(request);
                byteBuffer.clear();
                if (!"GET CURRENT TIME".equals(requestStr)) {
                    channel.write(byteBuffer.put("BAD_REQUEST".getBytes()));
                } else {
                    byteBuffer.put(Calendar.getInstance().getTime().toLocaleString().getBytes());
                    byteBuffer.flip();
                    channel.write(byteBuffer);
                }
            }
 
        } catch (IOException e) {
            e.printStackTrace();
            selectionKey.cancel();
        }
    }
}