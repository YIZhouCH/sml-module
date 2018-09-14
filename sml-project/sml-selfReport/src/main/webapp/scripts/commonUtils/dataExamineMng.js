eastcom.modules.dataExamineMng=(function(){function b(f){return[{xtype:"toolbar",ui:"footer",dock:"bottom",width:500,defaults:{minWidth:75},items:[{xtype:"button",region:"center",style:{align:"center",marginLeft:"313px"},text:"审核通过",handler:function(){var g="";$('input[name="dataExamine_grid_checkbox"]').each(function(){if($(this).attr("checked")){g+=$(this).val()+";"}});if(g==""){Ext.Msg.show({title:MSG_TITLE,msg:"请至少选择一个数据日期审核！",buttons:Ext.Msg.OK,icon:Ext.MessageBox.INFO})}else{Ext.Msg.confirm(MSG_TITLE,"确定要审核通过吗？",function(h){if(h=="yes"){Ext.Ajax.request({url:eastcom.baseURL+"/dataExamine/saveDataExamine",params:{valueIds:g},method:"POST",success:function(k){var i=Ext.JSON.decode(k.responseText);var j=i.success;if(j=="true"){Ext.Msg.show({title:MSG_TITLE,msg:"审核成功",buttons:Ext.Msg.OK,icon:Ext.MessageBox.INFO});Ext.getCmp("showDataExamine").hide()}else{Ext.Msg.show({title:MSG_TITLE,msg:"审核失败",buttons:Ext.Msg.OK,icon:Ext.MessageBox.INFO})}}})}})}}},{xtype:"button",text:"取消",handler:function(){Ext.getCmp("showDataExamine").hide()}}]}]}var d=function(){Ext.define("dataExamineModel",{extend:"Ext.data.Model",fields:[{name:"time",type:"string"},{name:"timeId",type:"string"},{name:"module",type:"string"},{name:"moduleSub",type:"string"},{name:"level",type:"string"},{name:"opera",type:"string"},{name:"checkTime",type:"string"},{name:"stautsCn",type:"string"},{name:"stauts",type:"string"}]});var f=Ext.create("Ext.data.Store",{model:"dataExamineModel",autoLoad:false,pageSize:10,proxy:{type:"ajax",url:eastcom.baseURL+"/dataExamine/getDataExamine",reader:{type:"json",root:"data.elements",totalProperty:"data.total"},actionMethods:{read:"POST"},timeout:240000}});f.on("beforeload",function(){if(Ext.getCmp("showDataExamine")){Ext.getCmp("showDataExamine").getEl().mask(MSG_DATA_LOADING)}});f.on("load",function(){Ext.getCmp("showDataExamine").getEl().unmask()});var i=function(l,k,j){if(l=="0"){return"<input type='checkbox' name='dataExamine_grid_checkbox' value='"+j.get("timeId")+","+j.get("level")+","+j.get("module")+"'>"}else{return""}};var g=[{text:"数据粒度",dataIndex:"level",align:"center",width:80,sortable:false},{text:"数据日期",dataIndex:"time",align:"center",width:150,sortable:false},{text:"数据日期",dataIndex:"timeId",align:"center",width:150,sortable:false,hidden:true},{text:"功能模块",dataIndex:"module",align:"center",width:150,sortable:false},{text:"审核状态",dataIndex:"stautsCn",align:"center",width:80,sortable:false},{text:"审核人",dataIndex:"opera",align:"center",width:120,sortable:false},{text:"审核时间",dataIndex:"checkTime",align:"center",width:140,sortable:false},{text:"操作",dataIndex:"stauts",align:"center",width:60,sortable:false,renderer:i}];var h=Ext.create("Ext.grid.Panel",{id:"dataExamineGridPanel",columns:g,columnLines:true,enableColumnHide:eastcom.enableColumnHide,store:f,dockedItems:[Ext.create("Ext.components.BaseCommonPagingToolbar",{dock:"bottom",store:f}),{dock:"top",xtype:"toolbar",defaults:{xtype:"combo",padding:"0 10 0 0",triggerAction:"all",displayField:"type",valueField:"value",queryMode:"local",width:100,editable:false},items:[{id:"levelCombo",value:"day",width:60,store:Ext.create("Ext.data.Store",{fields:["value","type"],data:[{type:"日",value:"day"},{type:"月",value:"month"},{type:"周",value:"week"}]}),listeners:{change:function(l,k,j){if(k=="day"){Ext.getCmp("weekCombo").hide();Ext.getCmp("monthCombo").hide();Ext.getCmp("dayCombo").show()}else{if(k=="month"){Ext.getCmp("dayCombo").hide();Ext.getCmp("weekCombo").hide();Ext.getCmp("monthCombo").show()}else{if(k=="week"){Ext.getCmp("dayCombo").hide();Ext.getCmp("weekCombo").show();Ext.getCmp("monthCombo").hide()}}}}}},{id:"dayCombo",value:"30",emptyText:"-全部日期-",store:Ext.create("Ext.data.Store",{fields:["value","type"],data:[{type:"-全部日期-",value:""},{type:"最近30日",value:"30"},{type:"最近60日",value:"60"}]})},{id:"weekCombo",value:"10",emptyText:"-全部日期-",hidden:true,store:Ext.create("Ext.data.Store",{fields:["value","type"],data:[{type:"-全部日期-",value:""},{type:"最近10周",value:"10"},{type:"最近20周",value:"20"}]})},{id:"monthCombo",value:"6",emptyText:"-全部日期-",hidden:true,store:Ext.create("Ext.data.Store",{fields:["value","type"],data:[{type:"-全部日期-",value:""},{type:"最近6月",value:"6"},{type:"最近12月",value:"12"}]})},{id:"checkCombo",value:"",emptyText:"-全选-",store:Ext.create("Ext.data.Store",{fields:["value","type"],data:[{type:"-全选-",value:""},{type:"已审核",value:"1"},{type:"未审核",value:"0"}]})},{xtype:"button",formBind:true,iconCls:"icon-search",id:"QueryButton",width:60,text:BUTTON_SEARCH,handler:function(){c()}},{xtype:"hidden",id:"modalValue",value:""},{xtype:"hidden",id:"dayValue",value:"20140801"},{xtype:"hidden",id:"monthValue",value:"20140701"},{xtype:"hidden",id:"weekValue",value:"201431"}]}],animCollapse:false});return h};var e=Ext.create("Ext.window.Window",{id:"showDataExamine",title:"数据审核",closeAction:"hide",width:800,height:424,layout:"fit",modal:true,items:[d()],dockedItems:b("dataExamine-field")});function c(){var f=Ext.getCmp("modalValue").getValue();var g=Ext.getCmp("dayValue").getValue();var i=Ext.getCmp("monthValue").getValue();var k=Ext.getCmp("weekValue").getValue();var m=Ext.getCmp("levelCombo").getValue();var n=Ext.getCmp("checkCombo").getValue();var h=Ext.getCmp("dayCombo").getValue();if(m=="day"){h=Ext.getCmp("dayCombo").getValue()}else{if(m=="weekCombo"){h=Ext.getCmp("weekCombo").getValue()}else{if(m=="monthCombo"){h=Ext.getCmp("monthCombo").getValue()}}}var l=Ext.getCmp("dataExamineGridPanel").getStore();var j=l.proxy;j.extraParams={timeCombo:h,checkCombo:n,levelCombo:m,modalValue:f,dayValue:g,monthValue:i,weekValue:k};l.load()}function a(h,g){if(e){e.show();var i=h.split(",");var j=Ext.getCmp("levelCombo").getStore();for(var f=0;f<i.length;f++){if(i[f]=="day"){j.removeAt(0)}else{if(i[f]=="month"){j.removeAt(1)}else{if(i[f]=="week"){j.removeAt(2)}}}}Ext.getCmp("levelCombo").setValue(j.getAt(0).get("value"));Ext.getCmp("modalValue").setValue(g);c()}else{e.hide()}}return{showDataExamine:a}})();