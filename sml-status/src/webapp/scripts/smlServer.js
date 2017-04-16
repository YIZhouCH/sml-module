function buildServerName(server){
	return 'http://' + server.remoteIp+ ':' + server.serverPort + '/'+ (server.serverContextPath==null?'':server.serverContextPath);
}
angular.module('smlApp', []).controller(
		'serverCtrl',
		function($scope, $http) {
			$scope.active=0;
			$scope.unactive=0;
			$scope.log={url:'./status/log',lastNum:50,charset:'utf-8',words:'',content:'',from:0};
			$scope.masterInit=function(){
				$http.get("./status").then(function(response){
					var predata=response.data;
					predata.serverName=buildServerName(predata);
					$scope.masterServer=predata;
				});
			}
			$scope.init = function() {
				$http.get("./server/sources").then(
						function(response) {
							var active=0;
							var unactive=0
							angular.forEach(response.data, function(server,
									index) {
								server.serverName = buildServerName(server);
								server.status=new Date().getTime()-new Date(server.lastTime).getTime()<65000;
								if(server.status){
									active++;
								}else{
									unactive++;
								}
							});
							$scope.active=active;
							$scope.unactive=unactive;
							$scope.servers = response.data;
						});
			}
			$scope.remove = function(server) {
				$http.get('./server/clear?key=' + server.serverName).then(
						function(response) {
							$scope.init();
						});
			}
			
			$scope.logshow=function(){
				$http({method:'get','Content-Type':'text/plain',url:$scope.log.url+'?words='+$scope.log.words+'&lastNum='+$scope.log.lastNum+'&isText=false&from='+$scope.log.lastNum+'&charset='+$scope.log.charset}).then(
						function(response) {
							var responseStr='';
							angular.forEach(response.data,function(value,key){
								responseStr+='\n'+value;
								$scope.log.from=parseInt(key)+1;
							});
							if(responseStr.length>0){
								if($scope.log.content<5000)
									$scope.log.content=$scope.log.content+'\n'+responseStr;
								else
									$scope.log.content=responseStr;
							}
						});
			}
			$scope.reflush=function(time){
				setInterval(function() {
					$scope.init();
					$scope.masterInit();
				}, time);
			}
			$scope.reflushLog=function(time){
				setInterval(function() {
					$scope.logshow();
				}, time);
			}
			$scope.setLogUrl=function(url){
				if(angular.isObject(url)){
					$scope.log.url='./server/proxy/'+url.serverContextPath+'/status/log';
				}else{
					$scope.log.url=url;
				}
				$scope.log.from=0;
				$scope.log.content='';
				$scope.logshow();
			}
			$scope.clearLogContent=function(){
				$scope.log.content='';
			}
			$scope.init();
			$scope.masterInit();
			$scope.reflush(30000);
			$scope.reflushLog(3000);
		});