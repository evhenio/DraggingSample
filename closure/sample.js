goog.require('goog.fx.Dragger');
goog.require('goog.dom');
goog.require('goog.style');


function showSample() {    
	var $ = goog.dom.getElement;

        var window1 = new goog.fx.Dragger($('win1'));
	var window2 = new goog.fx.Dragger($('win2'));


	goog.events.listen(window, 'unload', function(e) {
	     window1.dispose();
	     window2.dispose();
	});
}


