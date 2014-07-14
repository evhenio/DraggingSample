goog.require('goog.fx.Dragger');
goog.require('goog.dom');
goog.require('goog.style');

var timer = null;

function showSample() {    
	var $ = goog.dom.getElement;
	var windows = new Array();

	var DraggableWindow = function(id){
		this.element = $(id);
		this.dragger = null;
		this.endabled = false;
		var self = this;
		if (window.navigator.msPointerEnabled ) {
			this.element.addEventListener('MSPointerDown', function(e){ self.onTouch(e); }, false);			
			this.element.addEventListener('MSPointerUp', function(e){ clearTimier();  }, false);					
		}  else  if (goog.userAgent.MOBILE) {
			goog.events.listen(this.element, 'touchstart', function(e){ self.onTouch(e); }, false);			
		} else {
			this.dragger = new goog.fx.Dragger(this.element);			
		}					

		this.element.style.msTouchAction = 'auto';
		windows.push(this);
	}
	
	DraggableWindow.prototype.onTouch = function(e){		
		this.startDrag(e); 
		e.stopPropagation(); 
		return true;			
	}
        DraggableWindow.prototype.startDrag = function(e){					
		var self = this;
		timer = setTimeout(function(){ 
			disableAllWindows(); 
			self.element.style.msTouchAction = 'none';
		        self.dragger = new goog.fx.Dragger(self.element);
			self.enabled = true;			
			goog.events.listen(self.dragger, 'beforedrag', function(e){ return self.enabled; });
			if (goog.userAgent.MOBILE) {
				goog.events.listen(self.dragger, 'end', function(e){ clearTimer();});
			}

			self.dragger.startDrag(e); 
		}, 400);				
	}
	DraggableWindow.prototype.disable = function(){		
		this.element.style.msTouchAction = 'auto';
		this.enabled = false;
		var dragger = this.dragger;
		if(dragger !== null){						
			dragger.endDragCancel(new goog.events.BrowserEvent(goog.events.TOUCHCANCEL));						
			dragger.dispose();	
			this.dragger = null;
		}
	}		



	

	function disableAllWindows(){
		for(var i = 0; i < windows.length; ++i){
			windows[i].disable();						
		}

	}

	function clearTimer(){		
		disableAllWindows();
		clearTimeout(timer); 
		timer = null; 
	}


        var window1 = new DraggableWindow('win1');
	var window2 = new DraggableWindow('win2');

	if (goog.userAgent.MOBILE || window.navigator.msPointerEnabled) {	
		if (window.navigator.msPointerEnabled) {
			goog.events.listen(window, 'MSPointerUp', function(e) { clearTimer();});						
			goog.events.listen(window, 'pointerup', function(e) { clearTimer();});						
			goog.events.listen(window, 'MSPointerDown', function(e) { clearTimer(); });						
		}
		goog.events.listen(window, 'touchend', function(e) { clearTimer();});
		goog.events.listen(window, 'touchstart', function(e) { clearTimer();});
	}



	
	goog.events.listen(window, 'unload', function(e) {
	    window1.window.dispose();
	    window2.window.dispose();
	});
}


