(function(a){a.jgrid=a.jgrid||{};a.extend(a.jgrid.defaults,{windowresize:true,rowNum:10,altRows:true,viewrecords:true,hidegrid:false,shrinkToFit:true,autowidth:false,datatype:"json",mtype:"POST",prmNames:{page:"page",rows:"limit"},loadComplete:function(){var f=a(this).closest("table.ui-jqgrid-btable").attr("id").replace(/_frozen([^_]*)$/,"$1");var h=f;var e=f+"norecords_";var c=a("#"+h);var i=c.jqGrid("getGridParam","records");if(i==0||i==null){if(a("#"+e).html()==null){var d=c.jqGrid("getGridParam","colModel");var g=0;if(d!=null&&d.length>0){for(var b=0;b<d.length;b++){if(!d[b].hidden||d[b].hidden=="false"){g++}}}if(g<4){g=3}c.append("<tr id='"+e+"' class='ui-widget-content ui-row-ltr'><td colspan='"+g+"' style='text-align:center;' >无数据显示</td></tr>")}a("#"+e).show()}else{a("#"+e).remove()}},gridComplete:function(){var f=a(this).closest("table.ui-jqgrid-btable").attr("id").replace(/_frozen([^_]*)$/,"$1");var h=f;var e=f+"norecords_";var c=a("#"+h);var i=c.jqGrid("getGridParam","records");if(i==0||i==null){if(a("#"+e).html()==null){var d=c.jqGrid("getGridParam","colModel");var g=0;if(d!=null&&d.length>0){for(var b=0;b<d.length;b++){if(!d[b].hidden||d[b].hidden=="false"){g++}}}if(g<4){g=3}c.append("<tr id='"+e+"' class='ui-widget-content ui-row-ltr'><td colspan='"+g+"' style='text-align:center;' >无数据显示</td></tr>")}a("#"+e).show()}else{a("#"+e).remove()}},jsonReader:{root:"data.elements",page:"data.pageNo",records:"data.total",total:"data.pageNum",repeatitems:false}})})(jQuery);function jqGridResize(b){var d=$("#gbox_"+b).parent().width();var c=$("#gbox_"+b).width();var a=d-1;if(Math.abs(a-c)>2){$("#"+b).setGridWidth(a)}}var _jqgridResizeObj={};function onWindowResize(a){$(window).on("resize",function(b,c){if(_jqgridResizeObj[a]){clearTimeout(_jqgridResizeObj[a])}_jqgridResizeObj[a]=setTimeout(function(){jqGridResize(a)},700)}).trigger("resize")};