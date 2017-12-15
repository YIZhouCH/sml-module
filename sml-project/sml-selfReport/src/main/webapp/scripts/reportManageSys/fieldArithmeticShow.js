var fieldArithmeticShow = {
	init: function() {
		fieldArithmeticShow.query();
	},
	query: function() {
		var report_name = $("#report_name").val();
		var field_name = $("#field_name").val();
		var need_table_name = $("#need_table_name").val();

		fieldArithmeticShow.initGrid(report_name, field_name, need_table_name);

	},
	initGrid: function(name_, name, strategy) {
		var columnsName = ['报表名称', '中文字段名', '英文字段名', '算法', '字段说明','报表说明',''];
		var columnsConfig = [
			/*{name:'indicator_name',index:'indicator_name', width:40,align:"center",sortable:false,formatter:function(cellVal,options,rowObjs){
							                                     	return "<input type='checkbox' name='checkedBox' values='"+cellVal+"' />"
					                                                }
					                                      }*/
			//{name:'name',index:'name', width:120,align:"center",sortable:false,hidden:true}
			{
				name: 'NAME_',
				index: 'NAME_',
				width: 150,
				align: "center"
			}, {
				name: 'NAME_Z',
				index: 'NAME_Z',
				width: 150,
				align: "center"
			}, {
				name: 'NAME',
				index: 'NAME',
				width: 150,
				align: "center",
				hidden: true
			}, {
				name: 'DESCR_',
				index: 'DESCR_',
				width: 150,
				align: "center"
			}, {
				name: 'STRATEGY',
				index: 'STRATEGY',
				width: 400,
				align: "center",
				formatter: function(cellVal, options, rowObjs) {
					var str = cellVal.replace(new RegExp('tn', "gmi"), '表名');
					str = str.replace(new RegExp('cn', "gmi"), '字段名');
					return str;
				}
			}, {
				name: 'ALGO_INSTRU_TRIM',
				index: 'ALGO_INSTRU_TRIM',
				width: 400,
				align: "center"
			}, {
				name: 'ALGO_INSTRU',
				index: 'ALGO_INSTRU',
				width: 400,
				align: "center",
				hidden:true
			}
		];
		//初始化表格
		$("#con_grid_div_grid").jqGrid({
			height: 420,
			rowNum: 12,
			datatype: "local",
			colNames: columnsName,
			colModel: columnsConfig,
			shrinkToFit: false,
			autoScroll: true,
			//rownumbers:true,
			//rownumWidth:80,
			pgbuttons: true,
			pager: "#con_grid_div_gridPager",
			pgtext: "{0}共{1}页",
			onSelectRow: function(rowid, status) {

			},
			ondblClickRow: function(rowid, iRow, iCol, e) {
                   fieldArithmeticShow.showSuanfaDetail(rowid);
			}
		});

		var postJson = {
			"ifId": "srpt-cfg-alQueryByName",
			"name": name, //"字段名",
			"strategy": strategy, //"表名",
			"name_": name_, // 报表名称"
		};

		$("#con_grid_div_grid").jqGrid("setGridParam", {
			url: eastcom.baseURL + configUrl_main.srpt_rcpt_page,
			//url : eastcom.baseURL+"/srpt/rcpt/page", 
			datatype: "json",
			mtype: 'POST',
			jsonReader: {
				root: "data.elements",
				records: "data.total",
				total: "data.pageNum",
				page: "data.pageNo"
			},
			postData: {
				params: JSON.stringify(postJson)
			},
			page: 1
		}).trigger("reloadGrid");
		/*---------------------------------------------------------------------------*/
		/* var mydata = [
                                          {'name':'www','level':'去去去','group':'端到端','alarm':'对的'},
                                          {'name':'rrr','level':'去去去','group':'端到端','alarm':'对的'},
                                          {'name':'qqq','level':'去去去','group':'端到端','alarm':'对的'},
                                          {'name':'lll','level':'去去去','group':'端到端','alarm':'对的'},
                                       ];  
		                for(var i=0;i<=mydata.length;i++){
		                       jQuery("#con_grid_div_grid").jqGrid('addRowData',i+1,mydata[i]);
		                  };
		                  $("#con_grid_div_grid").trigger("reloadGrid");*/

		/*---------------------------------------------------------------------------*/

	},
	showSuanfaDetail : function(rowid){
			$("#suanfaDetail").modal("toggle");
			var ret = $("#con_grid_div_grid").jqGrid('getRowData',rowid);
			//console.log("NAME_="+ret.NAME_ + " NAME_Z=" + ret.NAME_Z  + " DESCR_=" + ret.DESCR_ + " STRATEGY=" + ret.STRATEGY + " ALGO_INSTRU=" + ret.ALGO_INSTRU+ "....");
			$("#NAME_").html(ret.NAME_);
			$("#NAME_Z").html(ret.NAME_Z);
			$("#DESCR_").html(ret.DESCR_);
			$("#STRATEGY").html(ret.STRATEGY);
			$("#ALGO_INSTRU").val(ret.ALGO_INSTRU);
	},

	/*alterData : function(){
		    	       var select_id = $("#con_grid_div_grid").jqGrid('getGridParam','selrow'); 
		    	       if (select_id == "" || select_id == null){alert("请选择要修改的列......");return;};
                       var ret = $("#con_grid_div_grid").jqGrid('getRowData',select_id);
                       $("#muluName").val(ret.name);
                       $("#mymodal").modal("toggle");
		    },
            alterDatas : function(){
            	       alert("修改成功!"); 
            }, 
		    deleData : function(){
                       var select_id = $("#con_grid_div_grid").jqGrid('getGridParam','selrow');
		    	       if (select_id == "" || select_id == null){alert("请选择要删除的列......");return;};
                       if(confirm("确定要删除吗")){
                        //页面删除
                               var su = $("#con_grid_div_grid").jqGrid('delRowData',select_id);
                                   if(su){
                                       //alert("成功删除!");
                                   }else{
                                       alert("已经删除,或删除行不存在!");
                                   };
                        //数据库删除           
                       };

		    }*/
};

fieldArithmeticShow.exportEXCEL = function() {
	// var action = eastcom.baseURL + configUrl_main.srpt_rcpt_exportAll;
	var action = eastcom.baseURL + '/srpt/rcpt/export';
	ToExcelOrCSVPage({
		myGrid: $("#con_grid_div_grid").jqGrid("getGridParam"),
		action: action,
		title: '算法管理',
		isThereCheckBox: false, //第一列是否有选择框或序号，是否导出第一列
		isHidden: false, //是否导出隐藏列，true 导出
		isComplexHeader: true //是否多级表头，暂支持两级表头
	});
};