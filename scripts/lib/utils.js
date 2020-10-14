var http_request;	
var responseFunc;
var requests = new Array();

function getCookieWithDef(c_name,c_default){
	var result = getCookie(c_name);
	if (result==null) return c_default;
	return result;	
	
}

function getLanguage(){
	return getCookieWithDef('lang','german');	
}


function getCookie(c_name){
	if (document.cookie.length>0){
		//alert(document.cookie);
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1){ 
			c_start = c_start + c_name.length+1 ;
			c_end   = document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end));
		} 
	}
	return null;
}



function setCookie(c_name,value,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : "; expires="+exdate.toGMTString());
}

function getElementsByClassName(searchClass, node, tag){
	var classElements = new Array();
	if (node == null){
		node = document;
	}
	if (tag == null){
		tag = '*';
	}
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
	for (var i = 0, j = 0; i < elsLen; i++){
		if (pattern.test(els[i].className)){
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

function updateThemeForClass(className,theme){
	var tableTitles = getElementsByClassName(className);
	for(var i=0;i<tableTitles.length;i++){
		tableTitles[i].className=  className + '_' + theme;
	};

}	
function switchThemes( classes){
	var cookieTheme = getCookie("theme");
	if (cookieTheme==null) cookieTheme = "bl";
	//alert('Current Theme is ' + cookieTheme);
	for(var i=0;i<classes.length;i++){
		updateThemeForClass(classes[i],cookieTheme);
	}	
}

function sendRequest(server,responseFunction){
    http_request = false;
    responseFunc = responseFunction;
    if (window.XMLHttpRequest) { // Mozilla, Safari,...
        http_request = new XMLHttpRequest();
        if (http_request.overrideMimeType) {
            http_request.overrideMimeType('text/xml');
        }
    } else if (window.ActiveXObject) { // IE
        try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
            http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }

    if (!http_request) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    http_request.onreadystatechange = showResponse;
    http_request.open('GET', server,true);
    http_request.send(null);
	
}

function calcTime(city, offset) {
    // create Date object for current location
    d = new Date();
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    // create new Date object for different city
    // using supplied offset
    nd = new Date(utc + (3600000*offset));
    // return time as a string
    //return "The local time in " + city + " is " + nd.toLocaleString();
    return nd;
}


function getURLParam(strParamName){
  var strReturn = "";
  var strHref = window.location.href;
  if ( strHref.indexOf("?") > -1 ){
    var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
    var aQueryString = strQueryString.split("&");
    for ( var iParam = 0; iParam < aQueryString.length; iParam++ ){
      if ( 
		aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1 ){
        var aParam = aQueryString[iParam].split("=");
        strReturn = aParam[1];
        return unescape(strReturn);
      }
    }
  }
  return null;
	  
} 
function showResponse(){
	
	if (http_request.readyState == 4) {
	    if (http_request.status == 200) {
			//alert('Got the response!');
	    	eval(responseFunc + "(http_request.responseText)");
	    } else {
	        alert('There was a problem with the request.');
	    }
	}
}

function loadExtfile(filename, filetype){
	 if (filetype=="js"){ //if filename is a external JavaScript file
	  var fileref=document.createElement('script')
	  fileref.setAttribute("type","text/javascript")
	  fileref.setAttribute("src", filename)
	 }
	 else if (filetype=="css"){ //if filename is an external CSS file
	  var fileref=document.createElement("link")
	  fileref.setAttribute("rel", "stylesheet")
	  fileref.setAttribute("type", "text/css")
	  fileref.setAttribute("href", filename)
	 }
	 if (typeof fileref!="undefined")
	  document.getElementsByTagName("head")[0].appendChild(fileref)
}


function searchText(allText,searchKey,fromIndex){
	var startIndex = allText.indexOf(searchKey,fromIndex);
	var result     = allText.substring(startIndex,allText.indexOf("\n",startIndex));
	return result;
}
function loadCityPrays(cityName,methodName){
	var gregYear  = new Date().getFullYear()+ '';
	var url       = 'php/info.php?fileName=gebet_zeiten/' + gregYear + '/' + cityName + '.txt';
	sendRequest(url,methodName);
	
	
}

	
function sendAjaxRequestAsArray(server,responseFunction){
    if (window.XMLHttpRequest) { // Mozilla, Safari,...
        var xmlhttp = new XMLHttpRequest();
        if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType('text/xml');
        }
    } else if (window.ActiveXObject) { // IE
        try {
           var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
            var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }

    if (!xmlhttp) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    xmlhttp.onreadystatechange=function()
		{
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				eval("var rows = xmlhttp.responseText.split(\"\\n\"); " + responseFunction + "(rows)");
			}
		  };
    xmlhttp.open('GET', server,true);
    xmlhttp.send(null);
	
}
function sendAjaxRequestAsText(server,responseFunction){
    if (window.XMLHttpRequest) { // Mozilla, Safari,...
       var xmlhttp = new XMLHttpRequest();
        if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType('text/xml');
        }
    } else if (window.ActiveXObject) { // IE
        try {
           var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
            var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }

    if (!xmlhttp) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    xmlhttp.onreadystatechange=function()
		{
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				eval(responseFunction + "(\"" + xmlhttp.responseText + "\")");
			}
		  };
    xmlhttp.open('GET', server,true);
    xmlhttp.send(null);
	
}
function getBrowserName(){
	if (navigator.appVersion.indexOf("MSIE")!=-1) return "IE";
	if (navigator.appVersion.indexOf("Chrome")!=-1) return "CH";
	if (navigator.userAgent.indexOf("Firefox")!=-1) return "FF";
	if (navigator.userAgent.indexOf("Opera")!=-1) return "OP";
	return "XX";
	

}
function draw_zoom_1 (small,big,width,height)

{
	//alert("hi there");
	var result = "<div  align='center'>"+
			"<table border='0' cellspacing='2' cellpadding='0'>" +
				"<tr>"+
					"<td><img src='" + small + "' alt='' height='" + height + "' width='" + width + "' border='1'/></td>"+
				"</tr>" +
				//"<tr bgcolor='0000ee'>"+
				"<tr bgcolor='C5D9F9'>"+
					"<td><a href='" + big + "' target='new'><img src='../../images/control/view_16.png' alt='' border='0' /></a></td>" +
				"</tr>"+
			"</table>"+
		"</div>";
	//return result;
	document.write(result);

}

function draw_zoom_2 (small,big,width,height)

{
	//alert("hi there");
	var result = 
	 "<div 	align='center'>"+ 
		"<div style='width:" + width + ";height:" + height + ";background:url(" + small + ");'>"+
			"<table style='width:100%;height:100%;border:1;cellspacing:2;cellpadding:0;'>" +
				"<tr>"+
					"<td align='right' valign='bottom'><a href='" + big + "' target='new'><img src='../../images/control/view_16.png' alt='' border='0' /></a></td>" +
				"</tr>"+
			"</table>"+
		"</div></div><br/>";
	//return result;
	document.write(result);

}
function draw_zoom (small,big,width,height)

{
	//alert("hi there");
	var result = 
	 "<div 	align='center'>"+ 
		"<div align='right' valign='bottom' style='position:relative;border:1px outset #003399;width:" + width + ";height:" + height + ";background:url(" + small + ");'>"+
			"<div align='center'style='-moz-opacity:0.7; -khtml-opacity:0.7; opacity:0.7;filter: Alpha(Opacity=70);left:50px;z-index:20;cursor:pointer;background-color:#BCD1FE;border-left:1px outset #003399;border-bottom:1px solid #003399;width:25px;height:16px' ><a href='" + big + "' target='new'><img src='../../images/control/view_16.png' alt='' border='0' /></a></div>" +
			//"<div align='right' class='picture' ><a href='" + big + "' target='new'><img src='../bilder/view_16.png' alt='' border='0' /></a></div>" +
		"</div></div><br/>";
	//return result;
	document.write(result);

}










