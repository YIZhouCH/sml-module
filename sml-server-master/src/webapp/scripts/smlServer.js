var smlApp=angular.module('smlApp', []);
smlApp.service('$BuildService',function(){
	this.build=function(server){
		return 'http://' + server.remoteIp+ ':' + server.serverPort + '/'+ (server.serverContextPath==null?'':server.serverContextPath);
	}
});
smlApp.controller(
		'serverCtrl',
		function($scope, $http,$BuildService,$interval,$location) {
			$scope.config={
			 headerCns:['服务url','进程号','主机名','已用内存(M)','总内存(M)','内存使用率(%)','启动时间','活动线程数','操作'],
			 //headerClientCns:['服务url','进程号','主机名','已用内存(M)','总内存(M)','内存使用率(%)','启动时间','活动线程数',"状态",'操作'],
			 isFlush:true
			};
			$scope.config.headerClientCns=angular.copy($scope.config.headerCns);
			$scope.config.headerClientCns.splice($scope.config.headerClientCns.length-1,0,'状态');
			$scope.active=0;
			$scope.unactive=0;
			$scope.logcontent=''
			//$scope.url='http://'+$location.host()+':'+$location.port()+'/master/';
			$scope.log={url:'./status/log',lastNum:50,charset:'utf-8',words:'',from:0,realUrl:''};
			$scope.masterInit=function(){
				$http.get("./status").then(function(response){
					var predata=response.data;
					predata.serverName=$BuildService.build(predata);
					$scope.masterServer=predata;
					$scope.config.isFlush=!$scope.config.isFlush;
				});
			}
			$scope.init = function() {
				$http.get('./server/sources').then(
						function(response) {
							var active=0;
							var unactive=0
							angular.forEach(response.data, function(server,
									index) {
								server.serverName = $BuildService.build(server);
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
				var realUrl=$scope.log.url+'?words='+$scope.log.words+'&lastNum='+$scope.log.lastNum+'&isText=false&from='+$scope.log.lastNum+'&charset='+$scope.log.charset+'&realUrl='+encodeURIComponent($scope.log.realUrl);
				$http({method:'get',url:realUrl}).then(
						function(response) {
							var responseStr='';
							angular.forEach(response.data,function(value,key){
								responseStr+='\n'+value;
								$scope.log.from=parseInt(key)+1;
							});
							if(responseStr.length>0){
								if($scope.logcontent<5000)
									$scope.logcontent+='\n'+responseStr;
								else
									$scope.logcontent=responseStr;
							}
						});
			}
			$scope.reflush=function(time){
				$interval(function() {
					if($scope.config.isFlush){
						$scope.init();
						$scope.masterInit();
					}
				}, time);
			}
			$scope.reflushLog=function(time){
				$interval(function() {
					if($scope.config.isFlush){
						$scope.logshow();
					}
				}, time);
			}
			$scope.setLogUrl=function(url){
				if(angular.isObject(url)){
					$scope.log.url='./server/proxy/'+url.serverContextPath+'/status/log';
					$scope.log.realUrl=url.serverName;
				}else{
					$scope.log.url=url;
					$scope.log.realUrl='';
				}
				$scope.log.from=0;
				$scope.logcontent='';
				$scope.logshow();
			}
			$scope.clearLogContent=function(){
				$scope.logcontent='';
			}
			$scope.init();
			$scope.masterInit();
			$scope.reflush(30000);
			$scope.reflushLog(3000);
		});