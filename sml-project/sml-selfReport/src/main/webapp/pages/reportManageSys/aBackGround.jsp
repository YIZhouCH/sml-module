<%@ include file="aaa.jsp" %>
<script type="text/javascript">
var flag2017216143611 = '${IsBlueThemes}';
 $(document).ready(function(){
	     
	     console.log(flag2017216143611);
	     console.log(typeof flag2017216143611);
	  	 if(flag2017216143611 == "true"){
	  	    var href = '${ctx}/static/reportManageSys/common/style.css'; 
	  		var link=document.createElement("link");  
	  	    link.setAttribute("rel", "stylesheet");  
	  	    link.setAttribute("type", "text/css");  
	  	    link.setAttribute("href", href);   
	  		var heads = document.getElementsByTagName("head");  
	  	    if(heads.length){
	  	        heads[0].appendChild(link);  
	  	      }  
	  	  var oHead = document.getElementsByTagName('HEAD').item(0); 
	      var oScript= document.createElement("script"); 
	      oScript.type = "text/javascript"; 
	      oScript.src="${ctx}/static/reportManageSys/common/bootstrap-eui.js"; 
	      oHead.appendChild( oScript);   
	  	    
	  	     	  		
	  	 };
	  	if(flag2017216143611 == "true"){
		  	 $("button.close").find("img").attr("src","${ctx}/static/reportManageSys/images/close_z.png");
		};
}); 
        
</script>

</head>







