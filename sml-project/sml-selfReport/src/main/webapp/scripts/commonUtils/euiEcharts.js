require(["echarts"],function(a){});var ecConfig=require("echarts/config");var zrColor=require("zrender/tool/color");var euiEcharts=(function(){var a=null;var j={__cache:{},_getCacheObj:function(){if(!this.__cache){this.__cache={}}return this.__cache},_bindCache:function(y,x){var w=this._getCacheObj();w[y]=x},_unbindCache:function(x){var w=this._getCacheObj();if(w){delete (w[x])}},_getCache:function(x){var w=this._getCacheObj();if(w){if(x&&x.length){return w[x]}else{return w}}},_clearCache:function(){this.__cache={}}};var q=function(y,x){var w={backgroundColor:"#ffffff",color:t,calculable:false,tooltip:{trigger:"item"},noDataLoadingOption:{text:"暂无数据",effect:"whirling",textStyle:{fontSize:16}},toolbox:{show:true,feature:{mark:{show:false},dataView:{show:false,readOnly:false},magicType:{show:false},dataZoom:{show:false,title:{dataZoom:"区域缩放",dataZoomReset:"区域缩放后退"}},restore:{show:true},saveAsImage:{show:true}}}};(function(A){var z=n(x);A.extend(true,w,z,y)})(jQuery);return w};var n=function(w){var y={};if(w=="line"){y={grid:{y:50,y2:30},xAxis:[{type:"category",boundaryGap:false}]}}else{if(w=="bar"){y={xAxis:[{type:"category",boundaryGap:false}]}}else{if(w=="pie"){y={}}else{if(w=="gauge"){y={}}else{if(w=="scatter"){y={}}else{if(w=="k"){y={}}else{if(w=="radar"){y={}}else{if(w=="map"){y={}}else{if(w=="force"){y={}}else{if(w=="chord"){y={}}else{if(w=="funnel"){y={}}else{if(w=="eventRiver"){y={}}}}}}}}}}}}}if(w=="line"||w=="bar"){var x={grid:{y:50,y2:30},xAxis:[{type:"category",boundaryGap:false}]};(function(z){z.extend(true,y,x)})(jQuery)}return y};var e=function(w,y){if(w&&y){for(var x=0;x<y.length;x++){(function(z){z.extend(true,w[x]=w[x]||{},y[x]=y[x]||{})})(jQuery)}return w}else{if(w){return w}else{if(y){return y}}}};var h=function(x,B){var C=x.chartId;var z=x.option;var y=x.chartType;var w=x.other;var A=j._getCache(C);if(A){p(C,z,y);if(B&&typeof B=="function"){B.call(this,C)}}else{require(["echarts","echarts/theme/"+w.theme+"","echarts/chart/bar","echarts/chart/line","echarts/chart/pie","echarts/chart/gauge","echarts/chart/scatter","echarts/chart/k","echarts/chart/radar","echarts/chart/map","echarts/chart/force","echarts/chart/chord","echarts/chart/funnel","echarts/chart/eventRiver","echarts/chart/heatmap","echarts/chart/treemap","echarts/chart/venn","echarts/chart/tree","echarts/chart/wordCloud"],function(G,J,H,E,D,I){var F=G.init(document.getElementById(C),J);j._bindCache(C,F);p(C,z,y);f(C);A=F;if(B&&typeof B=="function"){B.call(this,C)}})}return A};var p=function(A,y,x){var w=j._getCache(A);if(y==null||y==undefined||y==""||y=={}){y={series:[{}]}}var z=q(y,x);if(z==null){w.dispose();document.getElementById(A).innerHTML=chartHtml;j._unbindCache(A)}else{w.hideLoading();w.clear();w.setOption(z);window.onresize=function(){if(a){clearTimeout(a)}a=setTimeout(function(){var D=j._getCacheObj();for(var E in D){if($("#"+E).is(":visible")){var C=E;var B=D[E];if(B!=null&&B){B.resize()}}}},700)}}};var f=function(w){};var i="<div style='width: 100%;height: 100%;text-align:center;position:relative;top:50%;'><font size='3'>暂无数据</font></div>";var m=["#bbbbff","#bbbdff","#bbc0ff","#bbc2ff","#bbc5ff","#bbc8ff","#bbcaff","#bbcdff","#bbd0ff","#bbd2ff","#bbd5ff","#bbd8ff","#bbdaff","#bbddff","#bbe0ff","#bbe2ff","#bbe5ff","#bbe8ff","#bbeaff","#bbedff"];var t=["#62bdff","#c09ce8","#f5dc5c","#fd6500","#5db75d","#ffbacf","#7e9fcc","#88f1eb","#f9f88c","#9969aa","#b9c600","#fcb247","#2d81cf","#b3f171","#ec9df5","#ffe700","#20b0a9","#f67b98","#8b74c4","#d8e428"];var b=function(w){if(isNaN(w)){w=0}return zrColor.getColor(w)};var d=function(w){if(isNaN(w)){w=0}if(w>=20){w=w%20}return t[w]};var c=function(x){var w=j._getCache(x);if(w!=null&&w){w.showLoading({text:"数据加载中...",effect:"spin",textStyle:{fontSize:16}})}};var g=function(x){var w=j._getCache(x);if(w!=null&&w){w.hideLoading()}};var k=function(C,A,z,x,w){var B={};(function(D){D.extend(B,{theme:"macarons"},x)})(jQuery);var y={other:B,chartId:C,option:A,chartType:z};return h(y,w)};var r=function(x){var w=j._getCache(x);if(w!=null&&w){w.resize()}};var o=function(){return j._getCacheObj()};var l=function(x,w){j._bindCache(x,w)};var u=function(w){j._unbindCache(w)};var v=function(w){return j._getCache(w)};var s=function(){j._clearCache()};return{noDataHtml:i,blueStepColorList:m,getColor:b,getEuiColor:d,create:k,resize:r,showLoading:c,hideLoading:g,getCacheObj:o,addCache:l,delCache:u,getCache:v,clearCache:s}})();