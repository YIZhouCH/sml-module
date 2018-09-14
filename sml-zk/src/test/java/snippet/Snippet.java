package snippet;

import org.hw.sml.zk.service.ZkMngService;
import org.hw.sml.zk.service.ZkMngService.Bootstrap;

public class Snippet {
	public static void main(String[] args) throws InterruptedException {
		final ZkMngService zkMngService=new ZkMngService();
		zkMngService.setZkHosts("10.222.42.12:2181");
		zkMngService.setServerName("test");
		zkMngService.setBootstrap(new Bootstrap(){
			public void start() throws Exception {
				System.out.println(zkMngService.getId()+" started!");
			}});
		zkMngService.setSessionTimeout(5000);
		zkMngService.setExecuteElp("#{smlDateHelper.date().getTime()}");
		zkMngService.init();
		Thread.sleep(400000);
		
	}
}

