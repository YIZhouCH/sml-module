<c:set var="jquery_ui_bootstrap" value="${jslib}/jquery-ui-bootstrap" />

<link rel="stylesheet" type="text/css" href="${jquery_ui_bootstrap}/css/custom-theme/jquery-ui-1.10.3.custom.css"></link>
<script src="${jquery_ui_bootstrap}/js/jquery-ui-1.10.3.custom.min.js" type="text/javascript"></script>

<!-- bootstrap-paginator -->
<script src="${jquery_ui_bootstrap}/third-party/bootstrap-paginator/bootstrap-paginator.min.js" type="text/javascript"></script>

<!-- jQuery-UI-Date-Range-Picker -->
<link rel="stylesheet" type="text/css" href="${jquery_ui_bootstrap}/third-party/jQuery-UI-FileInput/css/enhanced.css"></link>
<script src="${jquery_ui_bootstrap}/third-party/jQuery-UI-FileInput/js/enhance.min.js" type="text/javascript"></script>
<script src="${jquery_ui_bootstrap}/third-party/jQuery-UI-FileInput/js/fileinput.jquery.js" type="text/javascript"></script>




<!-- jQuery-UI-jqgrid -->
<link rel="stylesheet" type="text/css" href="${jquery_ui_bootstrap}/third-party/jqGrid/css/ui.jqgrid.css"></link>
<link rel="stylesheet" type="text/css" href="${jquery_ui_bootstrap}/third-party/jqGrid/css/addons/ui.multiselect.css"></link>
<script type="text/javascript">
$(document).ready(function(){
	  	 if(flag2017216143611 == "true"){
	  	    var href2 = '${ctx}/pages/reportManageSys/themes/css/jqGrid.overrides.css'; 
	  		var link2=document.createElement("link");  
	  	    link2.setAttribute("rel", "stylesheet");  
	  	    link2.setAttribute("type", "text/css");  
	  	    link2.setAttribute("href", href2);   
	  		var heads = document.getElementsByTagName("head");  
	  		if(heads.length){
	  	        heads[0].appendChild(link2);  
	  	    }; 
	  	    
	  	 }else{
	  	    var href2 = '${jquery_ui_bootstrap}/third-party/jqGrid/css/jqGrid.overrides.css'; 
	  		var link2=document.createElement("link");  
	  	    link2.setAttribute("rel", "stylesheet");  
	  	    link2.setAttribute("type", "text/css");  
	  	    link2.setAttribute("href", href2);   
	  		var heads = document.getElementsByTagName("head");  
	  		if(heads.length){
	  	        heads[0].appendChild(link2);  
	  	    }; 
	  	 
	  	 };
});
        
</script>

<script src="${jquery_ui_bootstrap}/third-party/jqGrid/js/i18n/grid.locale-cn.js" type="text/javascript"></script>
<script src="${jquery_ui_bootstrap}/third-party/jqGrid/js/jquery.jqGrid.min.js" type="text/javascript"></script>
<script src="${jquery_ui_bootstrap}/third-party/jqGrid/js/jquery.jqGrid.eui.js" type="text/javascript"></script>
