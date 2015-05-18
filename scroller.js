/**
 * jQuery scrollbar 
 * @date 2012.3.29
 * @updateDate 2012.6.10
 * @version 1.6
 */
(function($) {
	$.fn.scrollable = function(options) {
		var s = $.extend({
			time: 0,
			overflow_x: true,
			overflow_y: true
		},options||{});
		
		var o = {
			create: function(element, scrollContent, vScroll, vScrollArea, vScrollBlock, vScrollUp, vScrollDown, hScroll, hScrollArea, hScrollBlock, hScrollUp, hScrollDown) {
				if(s.overflow_x || s.overflow_y) {
					o.setStyle(element);
					element.wrapInner(scrollContent.css({'float': 'left', 'width': 'auto'}));
				}
				if(s.overflow_y) {
					vScrollArea.append(vScrollBlock);
					vScroll.append(vScrollUp, vScrollArea, vScrollDown).hide();
					element.append(vScroll);
				}
				if(s.overflow_x) {
					hScrollArea.append(hScrollBlock);
					hScroll.append(hScrollUp, hScrollArea, hScrollDown).hide();
					element.append(hScroll);
				}
			},
			update: function(element, scrollContent, vScroll, vScrollArea, vScrollBlock, vScrollUp, vScrollDown, hScroll, hScrollArea, hScrollBlock, hScrollUp, hScrollDown) {
				o.setStyle(element);
				if(element.width() > scrollContent.width()) {
					scrollContent.css({'width': '100%'});
				}
				var hasVScroll = element.innerHeight() / scrollContent.outerHeight();
				var hasHScroll = element.innerWidth() / scrollContent.outerWidth();
				var vscale =  vScrollArea.innerHeight() / scrollContent.outerHeight();
				var hscale =  hScrollArea.innerWidth() / scrollContent.outerWidth();
				if(hasVScroll<1){
					vScroll.show();
					if(hasHScroll<1){
						vScroll.height(element.innerHeight() - hScroll.outerHeight());
					}
					var vp = vScrollBlock.outerHeight() - vScrollBlock.height();
					vScrollArea.height(vScroll.outerHeight() - vScrollUp.outerHeight() - vScrollDown.outerHeight());
					var newHeight = vScrollArea.height() * hasVScroll - vp;
					var newTop = -parseInt(scrollContent.css('top')) * vscale;
					vScrollBlock.css({'height': newHeight,'top': newTop}).attr('newHeight', newHeight + vp);
				}else{
					scrollContent.css({'top': '0'});
					vScrollBlock.css({'top': '0'});
					vScroll.hide();
				}
				
				if(hasHScroll<1){
					hScroll.show();
					if(hasVScroll<1){
						hScroll.width(element.innerWidth() - vScroll.outerWidth());
					}
					var hp = hScrollBlock.outerWidth() - hScrollBlock.width();
					hScrollArea.width(hScroll.outerWidth() - hScrollUp.outerWidth() - hScrollDown.outerWidth());
					var newWidth = hScrollArea.width() * hasHScroll - hp;
					var newLeft = -parseInt(scrollContent.css('left')) * hscale;
					hScrollBlock.css({'width':newWidth, 'left':newLeft}).attr('newWidth', newWidth + hp);
				}else{
					scrollContent.css({'left': '0'});
					hScrollBlock.css({'left': '0'});
					hScroll.hide();
				}
				
			},
			scrollVertical: function(maxTop,newTop,vScrollBlock,scrollContent,vScale,scMaxTop){
				if(newTop < 0){
					newTop = 0;
				}
				if(newTop > maxTop){
					newTop = maxTop;
				}
				vScrollBlock.css({'top': newTop});
				var scNewTop = (newTop * vScale);
				if(scNewTop > scMaxTop){
					scNewTop = scMaxTop;
				}
				scrollContent.css({'top': -scNewTop});
			},
			scrollHorizontal: function(maxLeft,newLeft,hScrollBlock,scrollContent,hScale,scMaxLeft){
				if(newLeft < 0){
					newLeft = 0;
				}
				if(newLeft > maxLeft){
					newLeft = maxLeft;
				}
				hScrollBlock.css({'left': newLeft});
				var scNewLeft = (newLeft * hScale);
				if(scNewLeft > scMaxLeft){
					scNewLeft = scMaxLeft;
				}
				scrollContent.css({'left': -scNewLeft});
			},
			updateClass: function(element,hoverClass,downClass,ud){
				element.bind({
					mouseenter: function() {
						$(this).addClass(hoverClass);
					},
					mouseleave: function() {
						if(ud){
							$(this).removeClass(hoverClass+' '+downClass);
						}else{
							$(this).removeClass(hoverClass);	
						}
					},
					mousedown: function() {
						$(this).addClass(downClass);
						return false;
					},
					mouseup: function() {
						$(this).removeClass(downClass);
					}
				});
			},
			setStyle: function (element) {
				if(element.css('overflow') != 'hidden') {
					element.css({'overflow': 'hidden'});
				}
				if(element.css('position') == 'static') {
					element.css({'position': 'relative'});
				}
			}
		};
		
		return this.each(function() {
			var that = $(this);
			var	scrollContent = $('<div>',{'class':'scrollcontent'}),
				vScroll       = $('<div>',{'class':'vscroll'}),
				vScrollArea   = $('<div>',{'class':'vscrollarea'}),
				vScrollBlock  = $('<div>',{'class':'vscrollblock'}),
				vScrollUp     = $('<div>',{'class':'vscrollup'}).html('&and;'),
				vScrollDown   = $('<div>',{'class':'vscrolldown'}).html('&or;'),
				hScroll       = $('<div>',{'class':'hscroll'}),
				hScrollArea   = $('<div>',{'class':'hscrollarea'}),
				hScrollBlock  = $('<div>',{'class':'hscrollblock'}),
				hScrollUp     = $('<div>',{'class':'hscrollup'}).html('&lt;'),
				hScrollDown   = $('<div>',{'class':'hscrolldown'}).html('&gt;');
			
			var vScrollAreaHover = 'vscrollareahover',
				vScrollBlockHover = 'vscrollblockhover',
				vScrollUpHover = 'vscrolluphover',
				vScrollDownHover = 'vscrolldownhover',
				vScrollAreaDown = 'vscrollareadown',
				vScrollBlockDown = 'vscrollblockdown',
				vScrollUpDown = 'vscrollupdown',
				vScrollDownDown = 'vscrolldowndown',
				hScrollAreaHover = 'hscrollareahover',
				hScrollBlockHover = 'hscrollblockhover',
				hScrollUpHover = 'hscrolluphover',
				hScrollDownHover = 'hscrolldownhover',
				hScrollAreaDown = 'hscrollareadown',
				hScrollBlockDown = 'hscrollblockdown',
				hScrollUpDown = 'hscrollupdown',
				hScrollDownDown = 'hscrolldowndown';
			
			o.create(that, scrollContent, vScroll, vScrollArea, vScrollBlock, vScrollUp, vScrollDown, hScroll, hScrollArea, hScrollBlock, hScrollUp, hScrollDown);
			
			scrollContent  = that.children('.scrollcontent');
			vScroll        = that.children('.vscroll');
			vScrollArea    = vScroll.find('.vscrollarea');
			vScrollBlock   = vScroll.find('.vscrollblock');
			vScrollUp      = vScroll.find('.vscrollup');
			vScrollDown    = vScroll.find('.vscrolldown');
			hScroll        = that.children('.hscroll');
			hScrollArea    = hScroll.find('.hscrollarea');
			hScrollBlock   = hScroll.find('.hscrollblock');
			hScrollUp      = hScroll.find('.hscrollup');
			hScrollDown    = hScroll.find('.hscrolldown');
			
			var	vScale,maxTop,scMaxTop,hScale,maxLeft,scMaxLeft;
			
			function resetScroll(){
				vScale = scrollContent.outerHeight() / vScrollArea.innerHeight();
				maxTop = vScrollArea.innerHeight() - Math.floor(parseInt(vScrollBlock.attr('newHeight')));
				scMaxTop = scrollContent.outerHeight() - that.innerHeight();
				
				hScale = scrollContent.outerWidth() / hScrollArea.innerWidth();
				maxLeft = hScrollArea.innerWidth() - Math.floor(parseInt(hScrollBlock.attr('newWidth')));
				scMaxLeft = scrollContent.outerWidth() - that.innerWidth();
			}
			
			o.update(that, scrollContent, vScroll, vScrollArea, vScrollBlock, vScrollUp, vScrollDown, hScroll, hScrollArea, hScrollBlock, hScrollUp, hScrollDown);
			resetScroll();

			that.resize(function() {
				o.update(that, scrollContent, vScroll, vScrollArea, vScrollBlock, vScrollUp, vScrollDown, hScroll, hScrollArea, hScrollBlock, hScrollUp, hScrollDown);
				resetScroll();
			});
			
			scrollContent.resize(function() {
				o.update(that, scrollContent, vScroll, vScrollArea, vScrollBlock, vScrollUp, vScrollDown, hScroll, hScrollArea, hScrollBlock, hScrollUp, hScrollDown);
				resetScroll();
			});
			
			var step = 100, newTop, newLeft;
			
			o.updateClass(vScrollArea,vScrollAreaHover,vScrollAreaDown,0);
			o.updateClass(vScrollBlock,vScrollBlockHover,vScrollBlockDown,0);
			o.updateClass(vScrollUp,vScrollUpHover,vScrollUpDown,1);
			o.updateClass(vScrollDown,vScrollDownHover,vScrollDownDown,1);
			
			vScrollBlock.bind({
				mousedown: function(event){
					var vs = $(this);
					var top = event.pageY - vs.offset().top;
					vScrollArea.addClass(vScrollAreaDown);
					$(document).bind('mousemove',function(event){
						var newTop = event.pageY - vScrollArea.offset().top - top;
						o.scrollVertical(maxTop,newTop,vs,scrollContent,vScale,scMaxTop);
						return false;
					}).bind('mouseup', function(event) {
					  	$(this).unbind('mousemove');
					  	vs.removeClass(vScrollBlockDown);
					  	vScrollArea.removeClass(vScrollAreaDown);
					});
					return false;
				}
			});
			
			vScrollUp.mousehold(20,function(){
				newTop = parseInt(vScrollBlock.css('top')) - step;
				o.scrollVertical(maxTop,newTop,vScrollBlock,scrollContent,vScale,scMaxTop);
				return false;
			});
			
			vScrollDown.mousehold(20,function(){
				newTop = parseInt(vScrollBlock.css('top')) + step;
				o.scrollVertical(maxTop,newTop,vScrollBlock,scrollContent,vScale,scMaxTop);
				return false;
			});
			
			vScrollArea.bind('mousedown',function(event){
				newTop = event.pageY-$(this).offset().top - (vScrollBlock.height() * .5);
				o.scrollVertical(maxTop,newTop,vScrollBlock,scrollContent,vScale,scMaxTop);
				return false;
			});
			
			that.mousewheel(function(){
				if(that.innerHeight() < scrollContent.outerHeight()) {
					if(this.D > 0){	
						newTop = parseInt(vScrollBlock.css('top')) - (step / vScale);
						o.scrollVertical(maxTop,newTop,vScrollBlock,scrollContent,vScale,scMaxTop);
					}else{
						newTop = parseInt(vScrollBlock.css('top')) + (step / vScale);
						o.scrollVertical(maxTop,newTop,vScrollBlock,scrollContent,vScale,scMaxTop);
					}
				}//else if(that.innerWidth() < scrollContent.outerWidth()) {
					//if(this.D > 0){	
						//newLeft = parseInt(hScrollBlock.css('left')) - (step / hScale);
						//o.scrollHorizontal(maxLeft,newLeft,hScrollBlock,scrollContent,hScale,scMaxLeft);
					//}else{
						//newLeft = parseInt(hScrollBlock.css('left')) + (step / hScale);
						//o.scrollHorizontal(maxLeft,newLeft,hScrollBlock,scrollContent,hScale,scMaxLeft);
					//}
				//}
			});
			
			o.updateClass(hScrollArea,hScrollAreaHover,hScrollAreaDown,0);
			o.updateClass(hScrollBlock,hScrollBlockHover,hScrollBlockDown,0);
			o.updateClass(hScrollUp,hScrollUpHover,hScrollUpDown,1);
			o.updateClass(hScrollDown,hScrollDownHover,hScrollDownDown,1);
			
			hScrollBlock.bind({
				mousedown: function(event) {
					var hs = $(this);
					var left = event.pageX - hs.offset().left;
					hScrollArea.addClass(hScrollAreaDown);
					$(document).bind({
						mousemove: function(event) {
							var newLeft = event.pageX - hScrollArea.offset().left - left;
							o.scrollHorizontal(maxLeft,newLeft,hs,scrollContent,hScale,scMaxLeft);
							return false;
						},
						mouseup: function(event) {
							$(this).unbind('mousemove');
							hs.removeClass(hScrollBlockDown);
							hScrollArea.removeClass(hScrollAreaDown);
							return false;
						}
					});
					return false;
				}
			});
			
			hScrollUp.mousehold(20,function(){
				newLeft = parseInt(hScrollBlock.css('left')) - step;
				o.scrollHorizontal(maxLeft,newLeft,hScrollBlock,scrollContent,hScale,scMaxLeft);
				return false;
			});
			
			hScrollDown.mousehold(20,function(){
				newLeft = parseInt(hScrollBlock.css('left')) + step;
				o.scrollHorizontal(maxLeft,newLeft,hScrollBlock,scrollContent,hScale,scMaxLeft);
				return false;
			});
			
			hScrollArea.bind('mousedown',function(event){
				newLeft = event.pageX - $(this).offset().left - (hScrollBlock.width() * .5);
				o.scrollHorizontal(maxLeft,newLeft,hScrollBlock,scrollContent,hScale,scMaxLeft);
				return false;
			});

		});
	}
})(jQuery);