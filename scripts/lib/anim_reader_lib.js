var animProcesses = new Array(0);
var doc = document;

window.onload=initPage;

function initPage(){
	readTags();
	
}
function readTags(){
	//alert('Reading Tags');
	// Reading scenarios
	//console.log("Reading tags ...");
	var scenarios = doc.getElementsByTagName("my:scenario");
	for (var i = 0; i < scenarios.length; i++) {
		readSingleScenario(scenarios[i]);
	}
	// Reading processes
	var processes = doc.getElementsByTagName("my:process");
	for (i = 0; i < processes.length; i++) {
		readSingleProcess(processes[i]);
	}
	animPrcs=singlePrcs;
	if (doc.getElementById("animationList")){
		var animType = doc.getElementById("animationList").getAttribute("name");
		if(animType=="process"){
			populateDropdownWithProcesses();
		}else{
			populateDropdownWithScenarios();
		}
	}
}
function readSingleScenario(scEl){
	var scId  =  scEl.getAttribute("id");
	var newSc = createAnimScenario();
	newSc.setId(scId);
	readCrossBrowserPrc(scEl,newSc);
	addSingleScenario(newSc);
	
}
function startSingleAnimation(){
	var dropDown = doc.getElementById("animationList");
	//alert("I got alerted the select index is " + dropDown.selectedIndex);
	animPrcs[dropDown.selectedIndex].activate();
	startAnimation(dropDown.selectedIndex);
}


function startSingleScenario(){
	var dropDown = doc.getElementById("animationList");
	//alert("I got alerted the select index is " + dropDown.selectedIndex);
	
	startScenarioSeqAnimation(dropDown.selectedIndex);
}
function startSingleScenarioId(scenId){
	var dropDown = doc.getElementById("animationList");
	//alert("I got alerted the select index is " + dropDown.selectedIndex);
	
	startScenarioSeqAnimation(dropDown.selectedIndex);
}

function populateDropdownWithProcesses(){
	var dropDown = doc.getElementById("animationList");
	for (var i = 0; i < animPrcs.length; i++) {
		var optn = doc.createElement("OPTION");
		optn.text = animPrcs[i].getId();
		optn.value = animPrcs[i].getId();
		dropDown.options.add(optn);
	}
}
function populateDropdownWithScenarios(){
	var dropDown = doc.getElementById("animationList");
	for (var i = 0; i < animScens.length; i++) {
		var optn = doc.createElement("OPTION");
		optn.text = animScens[i].getId();
		optn.value = animScens[i].getId();
		dropDown.options.add(optn);
	}
}

function readSingleProcess(procEl){
	//Code for reading the process object
	var procId =  procEl.getAttribute("id");
	var procInfo =  procEl.getAttribute("info");
	//alert("Reading the process holding the id " + procId + " and info : " + procInfo);
	var newProcess = createAnimProcess();
	newProcess.setId(procId);

	var infos = parseInfo(procInfo);
	for (var i=0;i<infos.length;i++){
		var curInfo = infos[i];
		//alert(curInfo[0] + " = " + curInfo[1]);
		if (curInfo[0]=="type"){
			newProcess.parseType(curInfo[1]);
		}else if (curInfo[0] == "start-type"){
			switch(curInfo[1]){
				case "withPrevious":
					newProcess.setStartType(START_WITH_PREV);
					break;
				case "afterPrevious":
					newProcess.setStartType(START_AFTER_PREV);
					break;
				case "afterTime":
					newProcess.setStartType(START_AFTER_TIME);
					break;
			}
		}else if (curInfo[0] == "start-time"){
			newProcess.setStartTime(curInfo[1]);
		}else if (curInfo[0] == "time"){
			newProcess.setTime(curInfo[1]);	
		}else if (curInfo[0]=="frame"){
			newProcess.setFrames(curInfo[1]);	
		}
	}
	newProcess.setAnimObjs(readCrossBrowserObj(procEl,newProcess));
	
	//alert("Adding the new process : " + procId);
	addSingleAnimation(newProcess);
	return newProcess;
		
}
function readCrossBrowserObj(procEl,newProcess){
	if (navigator.appVersion.indexOf("MSIE 8")!=-1){
		return readOldBrowserObj(procEl,newProcess);
	}else{
		return readNewBrowserObj(procEl,newProcess);
	}
}

function readOldBrowserObj(procEl,newProcess){
	var objEl = procEl.nextSibling;
	var procObjs = new Array();
	// step through child elements one by one
	var count = procEl.getAttribute("count");
	for(var i= 0;i<count*2;i++){
		// do something useful here...
		if (objEl.nodeName.toLowerCase()=="my:object"){
			var newObj = readSingleObject(objEl,newProcess);
			if (newObj!=null) {
				procObjs[procObjs.length]  = newObj;
			}
		}	
		// then navigate to next child element
		objEl = objEl.nextSibling;
	}	
	return procObjs;
}
function readNewBrowserObj(procEl,newProcess){
	var objEl = procEl.firstElementChild;
	var procObjs = new Array();
	// step through child elements one by one
	var index = 0;
	while (objEl) {
		// do something useful here...
		if (objEl.nodeName.toLowerCase()=="my:object"){
			var newObj = readSingleObject(objEl,newProcess);
			if (newObj!=null) {
				procObjs[procObjs.length]  = newObj;
			}
		}	
		// then navigate to next child element
		objEl = objEl.nextElementSibling;
	}	
	return procObjs;
}

function readCrossBrowserPrc(scEl,newSc){
	if (navigator.appVersion.indexOf("MSIE 8")!=-1){
		return readOldBrowserPrc(scEl,newSc);
	}else{
		return readNewBrowserPrc(scEl,newSc);
	}
}

function readOldBrowserPrc(scEl,newSc){
	var prcEl = scEl.nextSibling;
	var count = scEl.getAttribute("count");
	for(var i= 0;i<count*2;i++){
		// do something useful here...
		if (prcEl.nodeName.toLowerCase()=="my:process"){
			var newPrc = readSingleProcess(prcEl);
			if (newPrc!=null) {
				newSc.addAnimProcess(newPrc);
			}
		}	
		// then navigate to next child element
		prcEl = prcEl.nextSibling;
	}	
}
function readNewBrowserPrc(scEl,newSc){
	var prcEl = scEl.firstElementChild;
	var index = 0;
	while (prcEl) {
		// do something useful here...
		if (prcEl.nodeName.toLowerCase()=="my:process"){
			var newPrc = readSingleProcess(prcEl);
			if (newPrc!=null) {
				newSc.addAnimProcess(newPrc);
			}
		}	
		// then navigate to next child element
		prcEl = prcEl.nextElementSibling;
	}	
}

function parseInfo(value){
	//alert('Parsing = ' +value); 
	var parsedInfo = new Array(2,0);
	var elements = value.split(";");
	for (var i=0;i<elements.length;i++){
		parsedInfo[i] = elements[i].split(":");
	}
	return parsedInfo;
}

function readSingleObject(objEl,newProcess){
	//alert("Reading object with id : " + objEl.id + " and info " + objEl.getAttribute('info'));
	var newObject = createAnimObject();
	newObject.setId(objEl.id);
	var infos = parseInfo(objEl.getAttribute('info'));
	for (var i=0;i<infos.length;i++){
		var curInfo = infos[i];
		//alert(curInfo[0] + " = " + curInfo[1]);
		if (curInfo[0]=="fade"){
			newObject.fadeIn = curInfo[1].toLowerCase()=="true"?true:false;
		}else if (curInfo[0]=="srcX"){
			newObject.stX = curInfo[1];
		}else if (curInfo[0]=="srcY"){
			newObject.stY = curInfo[1];
		}else if (curInfo[0]=="dstX"){
			newObject.enX = curInfo[1];
		}else if (curInfo[0]=="dstY"){
			newObject.enY = curInfo[1];
		}else if (curInfo[0]=="srcW"){
			newObject.stW = curInfo[1];
		}else if (curInfo[0]=="srcH"){
			newObject.stH = curInfo[1];
		}else if (curInfo[0]=="dstW"){
			newObject.enW = curInfo[1];
		}else if (curInfo[0]=="dstH"){
			newObject.enH = curInfo[1];
		}else if (curInfo[0]=="picId"){
			newObject.setSizeId(curInfo[1]);


		}
	}
	newObject.activate();
	return newObject;
	
}
function showProcesses(){
	for (var i = 0; i < animProcesses.length; i++) {
		//alert("Printing available printing processes ids : " + animProcesses[i].getId());

	}
		
}


