(function(a){a.jgrid=a.jgrid||{};a.extend(a.jgrid.defaults,{windowresize:true,rowNum:10,scrollOffset:18,altRows:true,viewrecords:true,hidegrid:false,shrinkToFit:true,autowidth:false,datatype:"json",mtype:"POST",prmNames:{page:"page",rows:"limit"},loadComplete:function(){var f=a(this).closest("table.ui-jqgrid-btable").attr("id").replace(/_frozen([^_]*)$/,"$1");var h=f;var e=f+"norecords_";var c=a("#"+h);var i=c.jqGrid("getGridParam","records");if(i==0||i==null){if(a("#"+e).html()==null){var d=c.jqGrid("getGridParam","colModel");var g=0;if(d!=null&&d.length>0){for(var b=0;b<d.length;b++){if(!d[b].hidden||d[b].hidden=="false"){g++}}}if(g<4){g=3}c.append("<tr id='"+e+"' class='ui-widget-content ui-row-ltr'><td colspan='"+g+"' style='text-align:center;' >无数据显示</td></tr>")}a("#"+e).show()}else{a("#"+e).remove()}},gridComplete:function(){var f=a(this).closest("table.ui-jqgrid-btable").attr("id").replace(/_frozen([^_]*)$/,"$1");var h=f;var e=f+"norecords_";var c=a("#"+h);var i=c.jqGrid("getGridParam","records");if(i==0||i==null){if(a("#"+e).html()==null){var d=c.jqGrid("getGridParam","colModel");var g=0;if(d!=null&&d.length>0){for(var b=0;b<d.length;b++){if(!d[b].hidden||d[b].hidden=="false"){g++}}}if(g<4){g=3}c.append("<tr id='"+e+"' class='ui-widget-content ui-row-ltr'><td colspan='"+g+"' style='text-align:center;' >无数据显示</td></tr>")}a("#"+e).show()}else{a("#"+e).remove()}},jsonReader:{root:"data.elements",page:"data.pageNo",records:"data.total",total:"data.pageNum",repeatitems:false}});a.jgrid.extend({jqGridResize:function(e){var c=a.extend(true,{compel:false},e);var g=this[0];if(!g.grid){return}var f=a("#gbox_"+g.id).parent().width();var d=a("#gbox_"+g.id).width();var b=f-1;if(Math.abs(b-d)>2||c.compel){if(b<(d-3)){a("#"+g.id).setGridWidth(100)}a("#"+g.id).setGridWidth(b)}},_jqgridResizeObj:{},onWindowResize:function(c){var b=this;var d=this[0];if(!d.grid){return}a(window).on("resize",function(e,f){if(b._jqgridResizeObj[d.id]){clearTimeout(b._jqgridResizeObj[d.id])}b._jqgridResizeObj[d.id]=setTimeout(function(){b.jqGridResize(d.id)},700)}).trigger("resize")},setComplexGroupHeaders:function(s){var w=this[0];if(!w.grid){return}var g;if(s.groupHeaders){g=s.groupHeaders;a(this).setGroupHeaders(s)}else{g=w.p.groupHeader}var A=s.complexGroupHeaders;if(!A){return}var l=w.p.colModel;var e=a("#gbox_"+w.id+" .ui-jqgrid-htable .jqg-second-row-header > th");for(var v=0;v<g.length;v++){var z=g[v];var q=0;for(var u=0;u<l.length;u++){if(l[u].name==z.startColumnName){break}q++}for(var u=0;u<v;u++){q=q-(g[u].numberOfColumns-1)}a(e[q]).attr("startColName","s_"+z.startColumnName).attr("numberOfColumns",z.numberOfColumns)}var B=a('<tr role="rowheader" class="ui-jqgrid-labels jqg-four-row-header"></tr>');var k={};var p=function(j,o,i){var C=k[j];if(!C){k[j]=o;C=o}if(C.attr("status")!=0&&C.attr("status")!=3){C.attr("status",i)}};var d,c;for(var v=0;v<A.length;v++){for(var u=0;u<l.length;u++){var m=l[u];if(m.name==A[v].startColumnName){d=u;c=d+A[v].numberOfColumns;break}}for(var u=0;u<l.length;u++){var m=l[u];var r=a("thead #"+w.id+"_"+m.name);if(u<d||u>=c){if(r.attr("rowspan")==2){r.attr("sortable",m.sortable);r.attr("colmodeName",m.name);p(m.name,r,1)}else{if(!r.attr("rowspan")){var f=a("#gbox_"+w.id+" .ui-jqgrid-htable .jqg-second-row-header th[startcolname='s_"+m.name+"']");if(f.length!=0){p("s_"+m.name,f,2)}}}}else{if(u==d){var b=a('<th role="columnheader" class="ui-state-default ui-th-column-header ui-th-ltr" style="height: 22px; border-top-width: 0px; border-top-style: none; border-top-color: initial; "></th>');b.attr("colspan",A[v].numberOfColumns).html(A[v].titleText);p(m.name,r,0);p("n_"+m.name,b,3);var f=a("#gbox_"+w.id+" .ui-jqgrid-htable .jqg-second-row-header th[startcolname='s_"+m.name+"']");if(f.length!=0){var n=f.clone(true);p("s_"+m.name,n,0)}}else{p(m.name,r,0);var f=a("#gbox_"+w.id+" .ui-jqgrid-htable .jqg-second-row-header th[startcolname='s_"+m.name+"']");if(f.length!=0){var n=f.clone(true);p("s_"+m.name,n,0)}}}}}for(prop in k){var y=k[prop];var t=y.attr("status");if(t==1){y.attr("rowSpan","3");var x=y.clone(true);if(x.attr("sortable")=="true"){x.unbind("click");x.click(function(){a("#gbox_"+w.id+" .ui-jqgrid-htable .s-ico").css("display","none");var j=a(this).attr("colmodeName");w.p.sortname=j;a(this).find("span.s-ico").css("display","inline");var C=a(this).find("span.ui-icon-asc").attr("class");var o=/.*ui-state-disabled.*/ig;var i=o.test(C);if(i){w.p.sortorder="asc";a(this).find("span.ui-icon-asc").removeClass("ui-state-disabled");a(this).find("span.ui-icon-desc").addClass("ui-state-disabled")}else{w.p.sortorder="desc";a(this).find("span.ui-icon-desc").removeClass("ui-state-disabled");a(this).find("span.ui-icon-asc").addClass("ui-state-disabled")}a(w).trigger("reloadGrid")})}B.append(x);y.remove()}else{if(t==2){y.attr("rowSpan","2");var x=y.clone(true);B.append(x);y.remove()}else{if(t==3){B.append(y)}}}}var h=a("#gbox_"+w.id+" .ui-jqgrid-htable .jqg-second-row-header");B.insertBefore(h)}})})(jQuery);