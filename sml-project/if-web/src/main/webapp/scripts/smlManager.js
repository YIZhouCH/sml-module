"use strict";
//depend jquery&&jquery-json&&date.format
var smlManager ={
	metaInfo:{
		baseUrl:window.location.href.split('pages')[0],//结尾带/
		defaultUpdateUrlPre:'sml/update/',
		defaultQueryUrlPre:'sml/query/',
		defaultBeanMethodUrlPre:'sml/invoke/',
		defaultType:'post',
		defaultMime:'application/json; charset=utf-8',
		tables:{}},
	init:function(url,tableMetas){
		this.metaInfo.baseUrl=url||this.metaInfo.baseUrl;
		this.metaInfo.tables=tableMetas||this.metaInfo.tables;
	},
	ajax:function(obj){
		obj.url=this.metaInfo.baseUrl+obj.url;
		obj.type=obj.type||this.metaInfo.defaultType;
		obj.contentType=obj.contentType||this.metaInfo.defaultMime;
		obj.data=typeof(obj.data)=='object'&&obj.type=='post'&&obj.contentType.indexOf('x-www-form-urlencoded')<=0?JSON.stringify(obj.data):obj.data;
		obj.accept=obj.accept||this.metaInfo.defaultMime;
		obj.headers={accept:obj.accept};
		obj.dataType=obj.dataType||'json';
		$.ajax(obj);
	},
	query:function(ifId,params,successCallback,url,type,async){
		this.ajax({url:url||this.metaInfo.defaultQueryUrlPre+ifId,data:params,contentType:params&&params.params&&params.params!='undefined'||type&&type=='get'?'application/x-www-form-urlencoded; charset=utf-8':null,
				success:successCallback,type:type,async:async})
	},
	get:function(ifId,params,successCallback,url,async){
		this.query(ifId,params,successCallback,url,'get',async);
	},
	post:function(ifId,params,successCallback,url,async){
		this.query(ifId,params,successCallback,url,'post',async);
	},
	//operator insert|update|adu|delete|common |ifId
	updateTable:function(tableId,operator,params,successCallback,url,async){
		var sendData={};
		var isArray=params&&params.constructor.toString().indexOf('Array')>-1;
		if(isArray){
			sendData.datas=params;
		}else{
			sendData.data=params;
		}
		if(operator=='insert'||operator=='delete'){
			sendData.tableName=this.metaInfo.tables[tableId].tableName;
			sendData.dbid=this.metaInfo.tables[tableId].dbid;
		}else if(operator=='update'||operator=='adu'){
			sendData.tableName=this.metaInfo.tables[tableId].tableName;
			sendData.conditions=this.metaInfo.tables[tableId].conditions;
			sendData.dbid=this.metaInfo.tables[tableId].dbid;
		}else{
			sendData=params;
		}
		this.ajax({url:url||this.metaInfo.defaultUpdateUrlPre+operator,data:sendData,success:successCallback,async:async});
	},
	add:function(tableId,params,successCallback,url,async){
		this.updateTable(tableId,'insert',params,successCallback,url,async);
	},
	update:function(tableId,params,successCallback,url,async){
		if(this.metaInfo.tables[tableId])
			this.updateTable(tableId,'update',params,successCallback,url,async);
		else
			this.updateTable(null,tableId,params,successCallback,url,async);
	},
	del:function(tableId,params,successCallback,url,async){
		this.updateTable(tableId,'delete',params,successCallback,url,async);
	},
	adu:function(tableId,params,successCallback,url,async){
		this.updateTable(tableId,'adu',params,successCallback,url,async);
	},
	queryBM:function(beanMethod,params,successCallback,uri,type){
		this.query(uri,params,successCallback,this.metaInfo.defaultBeanMethodUrlPre+beanMethod.replace('.','/')+'/'+(uri||beanMethod.split('.')[1]),type);
	},
	getBM:function(beanMethod,params,successCallback,uri){
		this.queryBM(beanMethod,params,successCallback,uri,'get');
	},
	postBM:function(beanMethod,params,successCallback,uri){
		this.queryBM(beanMethod,params,successCallback,uri,'post');
	},
	getBMUrl:function(beanMethod,uri){
		return this.metaInfo.baseUrl+this.metaInfo.defaultBeanMethodUrlPre+beanMethod.replace('.','/')+'/'+(uri||beanMethod.split('.')[1]);
	},
	getQryUrl:function(ifId){
		return this.metaInfo.baseUrl+this.metaInfo.defaultQueryUrlPre+ifId;
	},
	getUpUrl:function(ifId,type){
		return this.metaInfo.baseUrl+this.metaInfo.defaultUpdateUrlPre+ifId+(type?('/'+type):'');
	},
	uuid:function(type){
		if(type&&type=='guid'){
			var guid='';
			for(var i=0;i<8;i++){
				guid+=smlManager.guid();
			}
			return guid;
		}else{
			return new Date().format("yyyyMMddhhmmss");
		}
	},
	guid:function(){
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
	},
	clone:function(obj,arr){
		var result={};
		if(arr){
			for(var i=0;i<arr.length;i++){
				result[arr[i]]=obj[arr[i]];
			}
		}else{
			result=obj;
		}
		return JSON.parse(JSON.stringify(result));
	}
};