     var slideNo = 5;
	 var curSlide = 2;
	 var slideHandle ;
	 var curPage;
	 var isControlOpen=false;
	 var tourShowInProgress = false;
	 var isContentsSwitching = false;
	 var doc = document;
	 var loadedImagesNumber = 0;
	 var totalImagesNumber  = 48;
	
	function detectBrowser(){
		//alert(navigator.appVersion);
		
		if ((navigator.appVersion.indexOf("MSIE 8")!=-1)||(navigator.appVersion.indexOf("MSIE 7")!=-1)){
			window.location="unsupported.html";
		}
	}
    function startPage(){
		
		var progressPanel = document.getElementById("progressDiv");
		progressPanel.style.visibility = "hidden";
		
		slideHandle =  setTimeout('startScenarioIdAnimationWithCallback("imageShow","slideNextPicture()")',1000);
		setTimeout('startProcessIdAnimation("fadeMenu1")',1000);
		setTimeout('startProcessIdAnimation("fadeMenu2")',1500);
		setTimeout('startProcessIdAnimation("fadeMenu3")',1500);
		setTimeout('startProcessIdAnimation("fadeMenu4")',1500);
		setTimeout('startProcessIdAnimation("fadeMenu5")',1000);
		//setTimeout('startProcessIdAnimation("fadeProgressOut")',1000);
		setTimeout('startProcessIdAnimation("fadeTitleAndDocs")',1000);
		
		
	}
	
	function imageLoaded(imgEl){
		if (loadedImagesNumber==0) checkOffset();
		loadedImagesNumber ++;
		var tableEl = document.getElementById("progressTable");
		var totalWidth = tableEl.offsetWidth;
		log("Image finished loading " + imgEl.id + " count is " + loadedImagesNumber);
		if (loadedImagesNumber==totalImagesNumber){
			startPage();
		}else{
			var loadProgressCell = document.getElementById("loadProgress");
			loadProgressCell.style.width = ((loadedImagesNumber/totalImagesNumber)*totalWidth ) + "px";
		}
	}

	 function slideNextPictureOld(){
		animationProcessCount = 0;
		selfCallingCount = 0;
		var nextImg = doc.getElementById('singleHeaderImg');
		nextImg.src ="images/header/slide/slide_0" + curSlide + ".jpg";
		var nextImgShadow = doc.getElementById('singleHeaderShadowImg');
		nextImgShadow.src ="images/header/slide/slide_0" +curSlide + "_shadow.png";
		if (curSlide>=slideNo){ 
			curSlide = 1; 
		}else{
			curSlide ++;
		}
		clearTimeout(slideHandle);
		slideHandle =  setTimeout('startScenarioIdAnimationWithCallback("imageShow","slideNextPicture()")',500);
		
	 }

	 function slideNextPicture(){
		animationProcessCount = 0;
		selfCallingCount = 0;
		/*
		var nextImg = doc.getElementById('singleHeaderImg');
		nextImg.src ="images/header/slide/slide_0" + curSlide + ".jpg";
		var nextImgShadow = doc.getElementById('singleHeaderShadowImg');
		nextImgShadow.src ="images/header/slide/slide_0" +curSlide + "_shadow.png";
		if (curSlide>=slideNo){ 
			curSlide = 1; 
		}else{
			curSlide ++;
		}
		*/
		clearTimeout(slideHandle);
		slideHandle =  setTimeout('startScenarioIdAnimationWithCallback("imageShow","slideNextPicture()")',500);
		
	 }

	 function handleControl(){
		if (isControlOpen){
			startProcessIdAnimationWithCallback('controlPanel_fold',"controlPopulated(false)");
		}else{
			startProcessIdAnimationWithCallback('controlPanel_populate',"controlPopulated(true)");
		}
	 }
	 
	 function controlPopulated(populated){
		isControlOpen = populated;
	 }

	 function switchContents(targetPage){
		if (!isContentsSwitching){
			isContentsSwitching = true;
			startProcessIdAnimation(curPage + "_fadeOut");
			startProcessIdAnimationWithCallback(targetPage + "_fadeIn","contentsSwitchingFinished()");
			var curPageEl = doc.getElementById(curPage);
			var dstPageEl = doc.getElementById(targetPage);
			if (curPageEl)
				curPageEl.style.zIndex =0;
			dstPageEl.style.zIndex =10;
			pageIsOpened(targetPage);
			pageIsClosed(curPage);
			curPage = targetPage;
		}
	 }

	 function contentsSwitchingFinished(){
		isContentsSwitching = false;
	 }

	 function handleAccordTab(tabId,contentId){
		animationProcessCount = 0;
		var iconEl = doc.getElementById(tabId + "Icon");
		if (iconEl.src.indexOf('arrow_down')!=-1){
			startProcessIdAnimationWithCallback(contentId+"_populate","accordTabAnimationFinished(true,'" +  tabId + "','" +  contentId + "')");
		}else{
			startProcessIdAnimationWithCallback(contentId+"_fold","accordTabAnimationFinished(false,'" +  tabId + "','" +  contentId + "')");
		}
	 } 
	 
	 function accordTabAnimationFinished(populated,tabId,contentId){
		var iconEl = doc.getElementById(tabId + "Icon");
		if (populated){
			iconEl.src = "images/control/arrow_up_white_sm.png";
			tabIsPopulated(contentId);
		}else{
			iconEl.src = "images/control/arrow_down_white_sm.png";
			tabIsFolded(contentId);
		}
	 }
	 
	 function changeBackgroundTheme(theme){
		var shadowEl = doc.getElementById('singleImageShadowReal');
		if (theme=='bk'){
			doc.body.style.backgroundColor = "#000";
			shadowEl.src="images/header/shadow_400_150_bk.png";
		}else if (theme=='bl'){
			doc.body.style.backgroundColor = "#000059";
			shadowEl.src="images/header/shadow_400_150_bl.png";
		}else if (theme=='br'){
			doc.body.style.backgroundColor = "#412200";
			shadowEl.src="images/header/shadow_400_150_br.png";
		}else if (theme=='gr'){
			doc.body.style.backgroundColor = "#023b02";
			shadowEl.src="images/header/shadow_400_150_gr.png";
		}else if (theme=='rd'){
			doc.body.style.backgroundColor = "#580909";
			shadowEl.src="images/header/shadow_400_150_rd.png";
		}else if (theme=='ga'){
			doc.body.style.backgroundColor = "#2f3031";
			shadowEl.src="images/header/shadow_400_150_ga.png";

		}
		
		doc.body.scrollTop=0;
	 }
	 
	 function newAccordTab(tabId,tabTitle,contentId){
		doc.write("<div id=\"" + tabId + "\" class=\"accordTabTitle\" onclick=\"handleAccordTab('" + tabId + "','" + contentId + "');\" >")
		doc.write("<table style=\"width:100%;height:100%;\"><tr><td class=\"accordTabTitleText\">" + tabTitle+ "</td><td class=\"accordTabIcon\"><img id=\"" + tabId + "Icon\" src=\"images/control/arrow_down_white_sm.png\"/></td></tr></table>");
		doc.write("</div>");
		}
	 function newWideAccordTab(tabId,tabTitle,contentId){
		doc.write("<div id=\"" + tabId + "\" class=\"accordTabTitle accordTabWideTitle\" onclick=\"handleAccordTab('" + tabId + "','" + contentId + "');\" >")
		doc.write("<table style=\"width:100%;height:100%;\"><tr><td class=\"accordTabTitleText\">" + tabTitle+ "</td><td class=\"accordTabIcon\"><img id=\"" + tabId + "Icon\" src=\"images/control/arrow_down_white_sm.png\"/></td></tr></table>");
		doc.write("</div>");
		}
		
	function tabIsPopulated(tabId){
		if (tabId=='tourContents'){
			if (!tourShowInProgress){
				var tourTabEl  = doc.getElementById('tourPicsContainer');
				startScenarioIdAnimationWithCallback('tourShow','closeTourTab()');
				tourShowInProgress = true;
				window.scroll(0,doc.height);
			}
		}
		
	}
	function closeTourTab(){
		startProcessIdAnimation("tourContents_fold");
		doc.getElementById('tourTabIcon').src = "images/control/arrow_down_white_sm.png";
		tourShowInProgress = false;
	}
	
	function tabIsFolded(tabId){
		
	}

	function pageIsOpened(pageId){
		
	}
	function pageIsClosed(pageId){
		
	}
	
	function handleCaseShow(picEl,caseId,extContentsHeight,accordContId,origContentsHeight){
		var container  = doc.getElementById(caseId);
		var accordCont = doc.getElementById(accordContId);
		if (picEl.src.indexOf('zoom_in')!=-1){
			container.style.height=500+ "px";
			picEl.src = "images/control/zoom_out_32.png";
			accordCont.style.height = extContentsHeight + "px";
			accordCont.scrollIntoView();
			startScenarioIdAnimation('caseShow');
		}else{
			startScenarioIdAnimation('caseShowEnd');
			container.style.height=0+ "px";
			picEl.src = "images/control/zoom_in_32.png";
			accordCont.style.height = origContentsHeight+ "px";
		}
	}
	
	
	function checkOffset(){
		var bodyOffset = doc.getElementById('bodyOffsetDiv');
		bodyOffset.style.left = ((screen.width - 1280)/2) + "px";
	}
	
	
	detectBrowser();

