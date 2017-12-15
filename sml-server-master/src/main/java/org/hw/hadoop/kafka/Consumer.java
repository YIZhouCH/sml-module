package org.hw.hadoop.kafka;

import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.TopicPartition;

public class Consumer {
	public static void main(String[] args) {
		Properties props = new Properties();
		props.put("bootstrap.servers", "192.168.27.128:9092");
		// 消费者的组id
		props.put("group.id", "GroupB");// 这里是GroupA或者GroupB
		props.put("enable.auto.commit", "true");
		props.put("auto.commit.interval.ms", "1000");
		// 从poll(拉)的回话处理时长
		//props.put("session.timeout.ms", "30000");
		// poll的数量限制
		// props.put("max.poll.records", "100");
		props.put("key.deserializer","org.apache.kafka.common.serialization.StringDeserializer");
		props.put("value.deserializer","org.apache.kafka.common.serialization.StringDeserializer");
		@SuppressWarnings("resource")
		KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(props);
		// 订阅主题列表topic
		TopicPartition tp=new TopicPartition("test",0);
		List<TopicPartition> tps=Arrays.asList(tp);
		consumer.assign(tps);
		//consumer.beginningOffsets(tps);
		//for(TopicPartition tp:tps){
			consumer.seekToBeginning(Arrays.asList(tp));
		//}
		while (true) {
			ConsumerRecords<String, String> records = consumer.poll(100);
			for (ConsumerRecord<String, String> record : records)
				// 　正常这里应该使用线程池处理，不应该在这里处理
				System.out.printf("offset = %d, key = %s, value = %s",
						record.offset(), record.key(), record.value() + "\n");

		}
	}
}
