   // Animation type
  	var ANIM_FADE = 1;
  	var ANIM_MOVE = 2;
  	var ANIM_SIZE = 4;
  	
  	// Animatino start type
  	var START_WITH_PREV  = 1;
  	var START_AFTER_PREV = 2;
  	var START_AFTER_TIME = 3;
  	
  	var animIndex = 0;
  	var animPrcs   = new Array(0);
  	var singlePrcs = new Array(0);
  	var animScens  = new Array(0);
	
	
	// For debugging purpose
	var animationProcessCount = 0;
	var selfCallingCount=0;
	var doc = document;
	var debugEnabled = false; 
	

function log(message){
	if (debugEnabled){
		console.log(message);
	}
}
 function createAnimObject(){
		var obj  = new Object();
		obj.status;
		obj.element;
		obj.id;
		obj.fadeId;
		obj.sizeId;
		obj.moveId;
		obj.fadeEl;
		obj.moveEl;
		obj.sizeEl;
		obj.mainEl;
		obj.opacity=0;
		obj.timeIndex;
		obj.width;
		obj.height;
		obj.x;
		obj.y;
		// Info for animation calculations
		obj.fadeIn;
		obj.stX;
		obj.stY;
		obj.enX;
		obj.enY;
		obj.stW;
		obj.stH;
		obj.enW;
		obj.enH;
		obj.dtX;
		obj.dtY;
		obj.dtW;
		obj.dtH;
		obj.dtO;
		
		
		obj.setId=function(newValue){
			this.id     = newValue;
			this.fadeId = newValue;
			this.moveId = newValue;
			this.sizeId = newValue;
			
		}
		obj.getId=function(){return this.id;}
		obj.setFadeId=function(newValue){
			this.fadeId = newValue;
		}
		obj.getFadeId=function(){return this.fadeId;}
		obj.setMoveId=function(newValue){
			this.moveId = newValue;
		}
		obj.getMoveId=function(){return this.moveId;}
		obj.setSizeId=function(newValue){
			this.sizeId = newValue;
		}
		obj.getSizeId=function(){return this.sizeId;}

		obj.getElement=function(){
				return this.element;
			}
		obj.setElement=function(newvalue){
			this.element= newvalue;
		}

		obj.getStatus=function(){
				return this.status;
		}
		obj.setStatus=function(value){
			this.status = value;
		}
	  obj.activate=function(){
		    this.fadeEl  = doc.getElementById(this.fadeId);
		    this.moveEl  = doc.getElementById(this.moveId);
		    this.sizeEl  = doc.getElementById(this.sizeId);
		    this.mainEl  = doc.getElementById(this.id);
		    
		}
		
		obj.getHolder=function(){	
			return this.holder;
		}
		obj.setTimeindex=function(value){
			window.clearTimeout(this.timeIndex);
			this.timeIndex = value;
		}
		obj.setWidth=function(value){
			this.sizeEl.style.width=value+ "px";
		}
		obj.getWidth=function(value){
			return this.sizeEl.offsetWidth;	
		}
		obj.setHeight=function(value){
			this.sizeEl.style.height=value;
		}
		obj.getHeight=function(value){
			return this.sizeEl.offsetHeight;	
		}

		obj.setX=function(value){
			this.moveEl.style.left=(value)+ "px";
		}
		
		obj.getX=function(value){
			return this.moveEl.offsetLeft;	
		}
		obj.setY=function(value){
			this.moveEl.style.top=value + "px";
		}
		
		obj.getY=function(value){
			return this.moveEl.offsetTop;	
		}
		
		obj.setZIndex=function(value){
			this.fadeEl.style.zIndex = value;
		}
		
		obj.moveTo=function(x,y){
			this.moveEl.style.left   = x+ "px" ;
			this.moveEl.style.top    = y+ "px";      
		}
		
		obj.displace=function(x,y){
			//alert('Before: ' + this.moveEl.offsetLeft);
			this.moveEl.style.left   = (this.moveEl.offsetLeft + x) + "px";
			//alert('After: ' + this.moveEl.offsetLeft);
			this.moveEl.style.top    = (this.moveEl.offsetTop + y ) + "px";      
		}
		
		obj.resize=function(wd,hi){
			this.sizeEl.style.width  = wd+ "px";
			this.sizeEl.style.height = hi+ "px";
		}
		obj.appendSize=function(wd,hi){
			//alert("Width before appending " + this.sizeEl.offsetWidth  );
			var resWidth = this.sizeEl.offsetWidth + wd;
			if(resWidth>=0)
				this.sizeEl.style.width  = resWidth + "px";
			var resHeight = this.sizeEl.offsetHeight + hi;
			//alert("Width after appending " + this.sizeEl.offsetWidth  );
			if(resHeight>=0)
				this.sizeEl.style.height = resHeight + "px";
		}
		obj.setOpacity=function(op){
			//alert("Setting the opacity to " + op);
			this.opacity               = op;
		    this.fadeEl.style.opacity  = op;
		    this.fadeEl.style.filter   = 'alpha(opacity=' + (op * 100) + ')';
		}
		obj.getOpacity=function(){return this.opacity;}		
		return obj;
    }

	function createAnimProcess(){
		var obj = new Object();
		obj.id;
		obj.params;
		obj.animObjs;
		obj.type;
		obj.time;
		obj.frames;
		obj.startType;
		obj.startTime;
		obj.stp;
		obj.dtm,
		obj.timeOutHandle;
		obj.isLastProcess = false;
		obj.callBankFunc;
		obj.inAction = false;

		obj.stop=function(){
			this.stp = true;
		}
		obj.resume=function(){
			this.stp = false;
		}

		obj.isStopped=function(){return this.stp;}
		obj.setStartType=function(newValue){
			this.startType = newValue;
		}
		obj.getStartType=function(){return this.startType;}

		obj.setStartTime=function(newValue){
			this.startTime = newValue;
		}
		obj.getStartTime=function(){return this.startTime;}
		
		obj.setStartInfo=function(type,time){
			this.startType = type;
			this.startTime = time;
		}

		obj.setParams=function(newValue){
			this.params = newValue;
		}
		obj.setId=function(newValue){
			this.id = newValue;
		}
		obj.getId=function(){
			return this.id ;
		}

		obj.getParams=function(){return this.params;}
		obj.setAnimObjs=function(newValue){
			this.animObjs = newValue;
		}
		obj.getAnimObjs=function(){return this.animObjs;}
		obj.setType=function(newValue){
			this.type = newValue;
		}
		obj.getType=function(){return this.type;}
		/*
		obj.setInfo=function(startType,startTime,typ,aniObjs,para,time,frames){
			this.setInfo(typ,aniObjs,para,time,frames);
			this.startType = startType;
			this.startTime = startTime;
		}
		*/

		obj.setInfo=function(typ,aniObjs,para,time,frames){
			this.type     = typ;
			this.animObjs = aniObjs;
			this.params   = para;
			this.time     = time;
			this.frames   = frames;
		}
		obj.setAnimInfo=function(time,frames){
		  this.time = time;
		  this.frames = frames;
		}
		obj.setTime=function(newValue){
			this.time = newValue;
		}
		obj.getTime=function(){return this.time;}
		obj.setFrames=function(newValue){
			this.frames = newValue;
		}
		obj.getFrames=function(){return this.frames;}
		obj.activate=function(){
			for(var i=0;i<this.animObjs.length;i++){
				var curOb = this.animObjs[i];
				this.dtm = this.getTime()/this.getFrames();
				if (this.isType(ANIM_FADE)){
					if (curOb.fadeIn){
						curOb.setOpacity(0);
					}else{
						curOb.setOpacity(1);	
					}
					curOb.dtO = 1/this.frames;
				}
				if (this.isType(ANIM_MOVE)){
					var moveEl = curOb.moveEl;
					if (isNaN(curOb.stX)) curOb.stX = moveEl.offsetLeft;
					if (isNaN(curOb.enX)) curOb.enX = moveEl.offsetLeft;
					if (isNaN(curOb.stY)) curOb.stY = moveEl.offsetTop;
					if (isNaN(curOb.enY)) curOb.enY = moveEl.offsetTop;
					curOb.dtX = (curOb.enX-curOb.stX)/this.frames;
					curOb.dtY = (curOb.enY-curOb.stY)/this.frames;
					curOb.moveTo(curOb.stX,curOb.stY);
					//console.log("curOb.dtX : " + curOb.dtX + " , curOb.dtY : " + curOb.dtY ); 
				}
				if (this.isType(ANIM_SIZE)){
					var sizeEl = curOb.sizeEl;
					if (isNaN(curOb.stW)) curOb.stW = sizeEl.offsetWidth;
					if (isNaN(curOb.enW)) curOb.enW = sizeEl.offsetWidth;
					if (isNaN(curOb.stH)) curOb.stH = sizeEl.offsetHeight;
					if (isNaN(curOb.enH)) curOb.enH = sizeEl.offsetHeight;

					//curOb.setOpacity(1);
					curOb.dtW = (curOb.enW-curOb.stW)/this.frames;
					curOb.dtH = (curOb.enH-curOb.stH)/this.frames;
					curOb.resize(curOb.stW,curOb.stH);	
				}
			}
		}
		obj.parseType=function(value){
			if (value.indexOf("m")!=-1){
				this.setType(ANIM_MOVE);
			}
			if (value.indexOf("f")!=-1){
				this.setType(this.getType()|ANIM_FADE);
			}
			if (value.indexOf("s")!=-1){
				this.setType(this.getType()|ANIM_SIZE);
			}
			//	alert("Parsing type result : " + this.getType());
				
		}
		obj.isType=function(animType){
			return ((this.type&animType)==animType);
		}
	
		obj.getDtm=function(){return this.dtm;}

		return obj;
	}

	function createAnimScenario(){
		var obj = new Object();
		obj.id;
		obj.timeOutHandle;
		obj.callBankFunc;
		obj.animPrcs = new Array();
		obj.setId= function (newValue){
			  this.id = newValue;
			}		
		obj.getId=function(){
			  return this.id;
			}		
		obj.setAnimPrcs= function (newValue){
		  this.animPrcs = newValue;
		}		
		obj.getAnimPrcs=function(){
		  return this.animPrcs;
		}
		obj.addAnimProcess=function(newProcess){
		  this.animPrcs[this.animPrcs.length]  = newProcess;
		}
			return obj;
	}
	
	function stop(seq){
		animPrcs[seq].stop();
	}  

	function resume(seq){
		animPrcs[seq].resume();
	}  
	
  	function addFadeObject(objectId, fadingIn,time, frames){
		var tobj = createAnimObject();
		tobj.setId(objectId );
		tobj.activate();
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(1);
		params[0]  = fadingIn;
		anim.setInfo(ANIM_FADE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);
	}
	

	function addMoveObject(objectId,stX,stY,enX,enY,time,frames){
		var tobj = createAnimObject();
		tobj.setId(objectId);
		tobj.activate();
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(4);
		params[0]  = stX;
		params[1]  = stY;
		params[2]  = enX;
		params[3]  = enY;
		anim.setInfo(ANIM_MOVE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);
	}

	function addSizeObject(objectId,stWd,stHi,enWd,enHi,time,frames){
		var tobj = createAnimObject();
		tobj.setId(objectId);
		tobj.activate();
		tobj.stW = stWd;
		tobj.stH = stHi;
		tobj.enW = enWd;
		tobj.enH = enHi;
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(4);
		params[0]  = stWd;
		params[1]  = stHi;
		params[2]  = enWd;
		params[3]  = enHi;
		anim.setInfo(ANIM_SIZE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);
	}
	function addSizePicObject(objectId,picId,stWd,stHi,enWd,enHi,time,frames){
		var tobj = createAnimObject();
		tobj.setId(objectId);
		tobj.setSizeId(picId);
		tobj.activate();
		tobj.stW = stWd;
		tobj.stH = stHi;
		tobj.enW = enWd;
		tobj.enH = enHi;
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(4);
		params[0]  = stWd;
		params[1]  = stHi;
		params[2]  = enWd;
		params[3]  = enHi;
		anim.setInfo(ANIM_SIZE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);
	}

  	function addFadeMoveObject(objectId, fadingIn,stX,stY,enX,enY,time, frames){
		var tobj = createAnimObject();
		tobj.setId(objectId);
		tobj.activate();
		//*
		tobj.fadeIn = fadingIn;
		tobj.stX  = stX;
		tobj.stY  = stY;
		tobj.enX  = enX;
		tobj.enY  = enY;
		//*/
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(5);
		params[0]  = fadingIn;
		params[1]  = stX;
		params[2]  = stY;
		params[3]  = enX;
		params[4]  = enY;
		anim.setInfo(ANIM_FADE|ANIM_MOVE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);		
	}
	
  	function addFadeSizeObjects(objectId,sizeId, fadingIn,stWd,stHi,enWd,enHi,time, frames){
		var tobj = createAnimObject();
		tobj.setId(objectId);
		tobj.setSizeId(sizeId);
		tobj.activate();
		
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(5);
		params[0]  = fadingIn;
		params[1]  = stWd;
		params[2]  = stHi;
		params[3]  = enWd;
		params[4]  = enHi;
		anim.setInfo(ANIM_FADE|ANIM_SIZE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);		
		
	}
  	function addFadeSizeObject(objectId,fadingIn,stWd,stHi,enWd,enHi,time, frames){
		var tobj = createAnimObject();
		tobj.setId(objectId);
		tobj.activate();
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(5);
		params[0]  = fadingIn;
		params[1]  = stWd;
		params[2]  = stHi;
		params[3]  = enWd;
		params[4]  = enHi;
		anim.setInfo(ANIM_FADE|ANIM_SIZE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);		
	}

  	function addFadeMoveSizeObjects(objectId,sizeId, fadingIn,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time, frames){
		var tobj = createAnimObject();
		tobj.setId(objectId);
		tobj.setSizeId(sizeId);
		tobj.activate();
		tobj.fadeIn = fadingIn;
		tobj.stX  = stX;
		tobj.stY = stY;
		tobj.enX  = enX;
		tobj.enY  = enY;
		/*
		tobj.stW  = stWd;
		tobj.stH  = stHi;
		tobj.enW  = enWd;
		tobj.enH  = enHi;
		*/
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(9);
		params[0]  = fadingIn;
		//*
		params[1]  = stX;
		params[2]  = stY;
		params[3]  = enX;
		params[4]  = enY;
		params[5]  = stWd;
		params[6]  = stHi;
		params[7]  = enWd;
		params[8]  = enHi;
		anim.setInfo(ANIM_FADE|ANIM_MOVE|ANIM_SIZE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);
  	}
  	function addFadeMoveSizeObject(objectId,fadingIn,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time, frames){
		var tobj = createAnimObject();
		tobj.setId(objectId );
		tobj.activate();
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(9);
		params[0]  = fadingIn;
		params[1]  = stX;
		params[2]  = stY;
		params[3]  = enX;
		params[4]  = enY;
		params[5]  = stWd;
		params[6]  = stHi;
		params[7]  = enWd;
		params[8]  = enHi;
		anim.setInfo(ANIM_FADE|ANIM_MOVE|ANIM_SIZE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);
  	}

	function addSizeMoveObject(objectId,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time,frames){
		var tobj = createAnimObject();
		tobj.setId(objectId );
		tobj.activate();
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(8);
		params[0]  = stX;
		params[1]  = stY;
		params[2]  = enX;
		params[3]  = enY;
		params[4]  = stWd;
		params[5]  = stHi;
		params[6]  = enWd;
		params[7]  = enHi;
		anim.setInfo(ANIM_MOVE|ANIM_SIZE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);		
	}
	    
	function addSizeMoveObjects(objectId,sizeId,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time,frames){
		var tobj = createAnimObject();
		tobj.setId(objectId );
		tobj.setSizeId(sizeId);
		tobj.activate();
		var objs   = new Array(1);
		objs[0]    = tobj;
		var anim   = createAnimProcess();
		var params = new Array(8);
		params[0]  = stX;
		params[1]  = stY;
		params[2]  = enX;
		params[3]  = enY;
		params[4]  = stWd;
		params[5]  = stHi;
		params[6]  = enWd;
		params[7]  = enHi;
		anim.setInfo(ANIM_MOVE|ANIM_SIZE,objs,params,time,frames);
		anim.activate();
		return addSingleAnimation(anim);		
	}

  	function fadeObject(objectId, fadingIn,time, frames){
  		startAnimation(addFadeObject(objectId, fadingIn,time, frames));		
	}
	

	function moveObject(objectId,stX,stY,enX,enY,time,frames){
		startAnimation(addMoveObject(objectId,stX,stY,enX,enY,time,frames));
	}

	function sizeObject(objectId,stWd,stHi,enWd,enHi,time,frames){
		startAnimation(addSizeObject(objectId,stWd,stHi,enWd,enHi,time,frames));
	}
	function sizePicObject(objectId,sizeId,stWd,stHi,enWd,enHi,time,frames){
		startAnimation(addSizePicObject(objectId,sizeId,stWd,stHi,enWd,enHi,time,frames));
	}

  	function fadeMoveObject(objectId, fadingIn,stX,stY,enX,enY,time, frames){
  		startAnimation(addFadeMoveObject(objectId, fadingIn,stX,stY,enX,enY,time, frames));
	}
	
  	function fadeSizeObjects(objectId,sizeId, fadingIn,stWd,stHi,enWd,enHi,time, frames){
  		startAnimation(addFadeSizeObjects(objectId,sizeId, fadingIn,stWd,stHi,enWd,enHi,time, frames));
	}
  	function fadeSizeObject(objectId,fadingIn,stWd,stHi,enWd,enHi,time, frames){
  		startAnimation(addFadeSizeObject(objectId,fadingIn,stWd,stHi,enWd,enHi,time, frames));
	}

  	function fadeMoveSizeObjects(objectId,sizeId, fadingIn,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time, frames){
  		startAnimation(addFadeMoveSizeObjects(objectId,sizeId, fadingIn,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time, frames));
  	}
  	function fadeMoveSizeObject(objectId,fadingIn,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time, frames){
  		startAnimation(addFadeMoveSizeObject(objectId,fadingIn,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time, frames));
  	}

	function sizeMoveObject(objectId,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time,frames){
		startAnimation(addSizeMoveObject(objectId,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time,frames));
	}
	    
	function sizeMoveObjects(objectId,sizeId,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time,frames){
		startAnimation(addSizeMoveObjects(objectId,sizeId,stX,stY,enX,enY,stWd,stHi,enWd,enHi,time,frames));
	}


  function timeForObject(animPrc){
	  alert('Animation Process type   : ' + animPrc.getType());
		alert('Animation Process object : ' + animPrc.getAnimObjs()[0].getFadeId());
		alert('Animation Process time   : ' + animPrc.getTime());
		alert('Animation Process frames : ' + animPrc.getFrames());
		alert('Animation Param 1        : ' + animPrc.getParams()[0]);
  }


	
	function processAnimScenario(anSc){
	  //alert("processAnimScenario");
	  animPrcs = anSc.getAnimPrcs();
	  //var targetAnimPrcs = new Array();
	  for(var i=animIndex;i<animPrcs.length;i++){
	    var curStartType = animPrcs[i].getStartType();
	    var curAnimPrc = animPrcs[i];
	    switch(curStartType){
//  	    case START_WITH_PREV:
//  	      break;
      	case START_AFTER_PREV:
      	  // we should wait
      	  break;
      	case START_AFTER_TIME:
      	  //alert("Have a start after time process for " + animPrcs[i].getStartTime());
      	  //window.setTimeout(function(){startAnimation(curAnimPrc);},curAnimPrc.getStartTime());
      	  animPrcs[i].timeOutHandle = window.setTimeout('startAnimation(' + i + ')',animPrcs[i].getStartTime());
      	  
      	  /*
      	  window.setTimeout(function(){
      	    //alert('Inside the timeout funcion : ' + i);
      	    startAnimation(animArr[i]);
      	  },animArr[i].getStartTime());
      	  */
      	  break;
	      
	    }
	  }
	}
	
	function addSingleAnimation(anim){
		singlePrcs[singlePrcs.length]  = anim;
		return singlePrcs.length-1;
	}
	function addSingleScenario(scen){
		animScens[animScens.length]  = scen;
		return animScens.length-1;
	}
	function proAnimateProcess(scenId,procId){
	    var curAnimPrc = animScens[scenId].getAnimPrcs()[procId];
	    curAnimPrc.activate();
	    startAnimationForProcessInScenario(scenId,procId);
	    
	}
	function startScenarioSeqAnimation(seq){
		var scenAnimPrcs = animScens[seq].getAnimPrcs();
		//console.log("Starting the animation process");
		var curAnimationTime = 0;
		var curAnimPrc = null;
		for(var j=0;j<scenAnimPrcs.length;j++){
			curAnimPrc = scenAnimPrcs[j];
			var curStartType = curAnimPrc.getStartType();
		    
		    //curAnimPrc.activate();
		    switch(curStartType){
		  	    case START_WITH_PREV:
		  	    	curAnimPrc.timeOutHandle = window.setTimeout('proAnimateProcess(' + seq + ',' +  j + ')',curAnimationTime);
			  	    break;
		      	case START_AFTER_PREV:
		      		curAnimationTime += parseInt(scenAnimPrcs[j-1].getTime()) + parseInt(curAnimPrc.getStartTime());
		      		curAnimPrc.timeOutHandle = window.setTimeout('proAnimateProcess(' + seq + ',' +  j + ')',curAnimationTime);
		      		break;
		      	case START_AFTER_TIME:
		      	  //alert("Have a start after time process for " + animPrcs[i].getStartTime());
		      	  //window.setTimeout(function(){startAnimation(curAnimPrc);},curAnimPrc.getStartTime());
		      		//window.setTimeout('startAnimation(' + j + ')',animPrcs[j].getStartTime());
		      		curAnimationTime += parseInt(curAnimPrc.getStartTime());
		      		//curAnimPrc.timeOutHandle = window.setTimeout('proAnimateProcess(' + j + ')',curAnimationTime);
					window.setTimeout('proAnimateProcess(' + seq + ',' +  j + ')',curAnimationTime);
		      	  
		      	  /*
		      	  window.setTimeout(function(){
		      	    //alert('Inside the timeout funcion : ' + i);
		      	    startAnimation(animArr[i]);
		      	  },animArr[i].getStartTime());
		      	  */
		      	  break;
		    }
		}
		if((animScens[seq].callBankFunc!=null)&&(curAnimPrc!=null)){
			curAnimPrc.isLastProcess=true;
			curAnimPrc.callBankFunc = animScens[seq].callBankFunc;
		}

		
		
	}
  


	function startAnimationForProcess(animPrc,nextCallFn){
		//console.log(" startAnimation called for  " + animPrc.getId());
		//if (
		//	(animPrc.getId()!='fade') &&
		//	(animPrc.getId()!='slide')){
			//console.log(" startAnimation called for  " + animPrc.getId());
		//}
		animationProcessCount ++;
		var stop     = false;
		var stopFade = false;
		var stopMove = false;
		var stopSize = false;
		if (animPrc.isStopped()) return;
		for(var i=0;i<animPrc.getAnimObjs().length;i++){
			var animObj = animPrc.getAnimObjs()[i];
			//alert("animObj id " + animObj.id + " stX " + animObj.stX + " dtX " + animObj.dtX);

			if (animPrc.isType(ANIM_FADE)){
				var fadeIn = animObj.fadeIn;
				if ((fadeIn)&&(animObj.getOpacity()<1)){
					animObj.setOpacity(animObj.getOpacity()+animObj.dtO);
				}else if ((!fadeIn)&&(animObj.getOpacity()>0)){
					animObj.setOpacity(animObj.getOpacity()-animObj.dtO);
				}else{
					animObj.setOpacity(fadeIn?1:0);
					stopFade = true;
				}
			}else{stopFade=true;}
			if (animPrc.isType(ANIM_MOVE)){
				var stopXMove= animObj.dtX==0;
				var stopYMove= animObj.dtY==0;
				var curX = animObj.getX();
				var curY = animObj.getY();
				if (((animObj.dtX>0)&&(curX>=animObj.enX))||
						   ((animObj.dtX<0)&&(curX<=animObj.enX))){
					stopXMove = true
				}
				if (((animObj.dtY>0)&&(curY>=animObj.enY))||
						   ((animObj.dtY<0)&&(curY<=animObj.enY))){
					stopYMove = true;
				}
				stopMove = stopYMove&stopXMove;
				if (!stopMove){
					//console.log(" Object position , ID : " + animObj.getId() + " , x: " + animObj.getX() + " , y: " + animObj.getY() + " , end X : " + animObj.enX + " , end Y : " + animObj.enY ); 
					if (stopXMove){
						animObj.displace(0,animObj.dtY);
					}else if(stopYMove){
						animObj.displace(animObj.dtX,0);
					}else{
						animObj.displace(animObj.dtX,animObj.dtY);
					}

				}else{
					animObj.moveTo(animObj.enX,animObj.enY);
				}
			}else{stopMove=true;}	
			if (animPrc.isType(ANIM_SIZE)){
				var stopWSize=animObj.dtW==0;
				var stopHSize=animObj.dtH==0;
				if (((animObj.dtW>0)&&(animObj.getWidth()>=animObj.enW))||
				   ((animObj.dtW<0)&&(animObj.getWidth()<=animObj.enW))){	 
					stopWSize=true;
				}
				if (((animObj.dtH>0)&&(animObj.getHeight()>=animObj.enH))||
				   ((animObj.dtH<0)&&(animObj.getHeight()<=animObj.enH))){	 
					stopHSize=true;
				}
				
				stopSize=stopWSize&stopHSize;
				if(!stopSize){
					
					if (stopWSize){
						animObj.appendSize(0,animObj.dtH);
					}else if(stopHSize){
						animObj.appendSize(animObj.dtW,0);
					}else{
						//console.log("Appending size : " + animObj.getWidth());
						animObj.appendSize(animObj.dtW,animObj.dtH);
					}
				}else{
					animObj.resize(animObj.enW,animObj.enH);
				}	
				
				
			}else{stopSize=true;}	
			
		}
	
    stop = stopSize&stopMove&stopFade;
    clearTimeout(animPrc.timeOutHandle);
	//console.log("Animation for " + animPrc.getId() + " process");
    if (!stop) {
		selfCallingCount++;
		//animPrc.timeOutHandle = window.setTimeout('startAnimation(' + seq +')',animPrc.getDtm());
		animPrc.timeOutHandle = window.setTimeout(nextCallFn,animPrc.getDtm());
		//console.log("Setting for time difference of : " + animPrc.getDtm());
	}else{ 
		//console.log("Should stop now!!!");
		animPrc.inAction=false;
		if ((animPrc.callBankFunc!=null)&&(animPrc.isLastProcess)){
			window.setTimeout(animPrc.callBankFunc,0);
		}
	}
  }    

 
	function startScenarioIdAnimation(scenId){
		for (var i = 0; i < animScens.length; i++) {
			if(animScens[i].getId()==scenId){
				startScenarioSeqAnimation(i);
			}
		}
	}
	function startScenarioIdAnimationWithCallback(scenId,callBackFn){
		//callBackFunction = callBackFn;
		for (var i = 0; i < animScens.length; i++) {
			if(animScens[i].getId()==scenId){
				animScens[i].callBankFunc = callBackFn;
				startScenarioSeqAnimation(i);
			}
		}
	}

	function startProcessIdAnimationWithCallback(procId,callBackFn){
		animPrcs = singlePrcs;
		//console.log("startProcessIdAnimation(procId)" + procId);
		//alert("Processes number is : " + animPrcs.length);
		for (var i = 0; i < animPrcs.length; i++) {
			if(animPrcs[i].getId()==procId){
				if(animPrcs[i].inAction){
					log("Dropping the process animation because it is busy : " + procId);
				}else{
					//alert('found it : ' + procId);
					animPrcs[i].callBankFunc = callBackFn;
					animPrcs[i].isLastProcess = true;
					animPrcs[i].activate();
					animPrcs[i].inAction=true;
					startAnimation(i);  
				}
			}
			//alert("Printing available printing processes ids : " + animProcesses[i].getId());
		}
	}

	function startProcessIdAnimation(procId){
		animPrcs = singlePrcs;
		//console.log("startProcessIdAnimation(procId)" + procId);
		//alert("Processes number is : " + animPrcs.length);
		for (var i = 0; i < animPrcs.length; i++) {
			if(animPrcs[i].getId()==procId){
				if(animPrcs[i].inAction){
					log("Dropping the process animation because it is busy : " + procId);
				}else{
					//alert('found it : ' + procId);
					
					animPrcs[i].activate();
					animPrcs[i].inAction=true;
					startAnimation(i);  
				}
			}
			//alert("Printing available printing processes ids : " + animProcesses[i].getId());
		}
	}
	
	function startAnimationForProcessInScenario(scenId,procId){
		//console.log(" startAnimation called at " + new Date().getTime());
		//animationProcessCount ++;
		var animPrc = animScens[scenId].getAnimPrcs()[procId];
		if (undefined ==animPrc) {
			log("Func: startAnimationForProcessInScenario , Msg : Received undefined process sequence " + seq);
		}else{
			startAnimationForProcess(animPrc,'startAnimationForProcessInScenario(' + scenId + ',' + procId +')');
		}
	}
	function startAnimation(seq){
		//console.log(" startAnimation called at " + new Date().getTime());
		var animPrc = animPrcs[seq];
		if (undefined ==animPrc){
			log("Func: startAnimation , Msg : Received undefined process sequence " + seq);
		}else{
			
			startAnimationForProcess(animPrc,"startAnimation(" +seq + ")");
		}
	}    
    
	
  function testArray(){
    var arr = new Array();
    alert('Array initial length is : ' + arr.length);
    arr[3] = 12;
    alert('Array initial length is : ' + arr.length);    
  }
  
	function testBinary(){
		var anim   = createFadeAnimationProcess2("startHolder",true);
		window.setTimeout(function(){startAnimation(anim);},anim.getDtm());
	}
	function createElement(seq){
    var divTag = doc.createElement("div");
        divTag.id = "siHolder" + seq ;
        divTag.className ="singleImgHolder";
        divTag.innerHTML = "<img id='siObj" + seq + "' src='images/slide/sml_cln_" + seq + ".png' class='singleImage' >";
     doc.body.appendChild(divTag);
	
	}

  

