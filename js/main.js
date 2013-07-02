/* ---------------------------------------------------------------------- */
/*	CUSTOM SCROLL BAR
/* ---------------------------------------------------------------------- */

	(function($){

		var $container = $('#main-container'),
			$navLinks = $('nav li a[href^="#"]');


		$navLinks.each(function(){
			var target = $(this).attr('href').replace(/#/, '');
				$('#'+target).attr('id', target+'_modified'); // Change ID
		});


		$(window).hashchange(function(){
			hash_handler();
		});	


		$("#main-container").mCustomScrollbar({
			set_width:false, /*optional element width: boolean, pixels, percentage*/
			set_height:"100%", /*optional element height: boolean, pixels, percentage*/
			horizontalScroll:false, /*scroll horizontally: boolean*/
			scrollInertia:1000, /*scrolling inertia: integer (milliseconds)*/
			scrollEasing:"easeOutCirc", /*scrolling easing: string*/
			mouseWheel:20, /*mousewheel support and velocity: boolean, "auto", integer*/
			mouseWheelPixels: 250,
			autoDraggerLength:true, /*auto-adjust scrollbar dragger length: boolean*/
			theme: "dark",
			scrollButtons:{ /*scroll buttons*/
				enable:true, /*scroll buttons support: boolean*/
				scrollType:"continuous", /*scroll buttons scrolling type: "continuous", "pixels"*/
				scrollSpeed:20, /*scroll buttons continuous scrolling speed: integer*/
				scrollAmount:40 /*scroll buttons pixels scroll amount: integer (pixels)*/
			},
			advanced:{
				updateOnBrowserResize:true, /*update scrollbars on browser resize (for layouts based on percentages): boolean*/
				updateOnContentResize:true, /*auto-update scrollbars on content resize (for dynamic content): boolean*/
				autoExpandHorizontalScroll:false,  /*auto expand width for horizontal scrolling: boolean*/
				autoScrollOnFocus: false  /*scroll on input focus: boolean*/
			},
			callbacks:{
				onScroll:function(){ OnScroll(); }, /*user custom callback function on scroll event*/
				onTotalScroll:function(){}, /*user custom callback function on bottom reached event*/
				onTotalScrollOffset:0 /*bottom reached offset: integer (pixels)*/
			}
		});
		

		function OnScroll(){
			$navLinks.each(function(){
				var target = $(this).attr('href'),
					targetPosition = $container.scrollTop() + $(target+'_modified').offset().top,
					targetLimit = 320;
				
				if ($container.scrollTop() > (targetPosition - targetLimit)) {
					$('nav a.selected').removeClass('selected');
					$(this).addClass('selected');
				}
			});			
		}


		getContainerHeight ();

		var waitForFinalEvent = (function () {
		  var timers = {};
		  return function (callback, ms, uniqueId) {
		    if (!uniqueId) {
		      uniqueId = "Don't call this twice without a uniqueId";
		    }
		    if (timers[uniqueId]) {
		      clearTimeout (timers[uniqueId]);
		    }
		    timers[uniqueId] = setTimeout(callback, ms);
		  };
		})();

		$(window).resize(function () {
		    waitForFinalEvent(function(){
		    	getContainerHeight();	
		    }, 500, "resize-event-1");
		});


		function getContainerHeight () {
				//update container height on resize
		      	$winHeight = $(window).height();
		      	$position = $container.position();
		      	$container.css('height', $winHeight-$position.top-10);	
		      	$container.mCustomScrollbar('update');
		}


		$(window).load(function() {
			hash_handler(); 
		});


		function hash_handler () {
			hash = window.location.hash;

			if(hash) {
			 	$container.mCustomScrollbar("scrollTo",hash+'_modified');
			 	removeAddSelected(hash);
			} else {
			 	removeAddSelected();
			}

		}

		function removeAddSelected(target) {

			$navLinks.removeClass('selected');	

			if(target) {
			 	$('a[href='+target+']').addClass('selected');
			} else {
			 	$navLinks.first().addClass('selected');
			}
		}



	})(jQuery);


/* ---------------------------------------------------------------------- */
/*	ISOTOPE Portfolio
/* ---------------------------------------------------------------------- */

$.Isotope.prototype._getCenteredMasonryColumns = function() {
this.width = this.element.width();

var parentWidth = this.element.parent().width();

              // i.e. options.masonry && options.masonry.columnWidth
var colW = this.options.masonry && this.options.masonry.columnWidth ||
              // or use the size of the first item
              this.$filteredAtoms.outerWidth(true) ||
              // if there's no items, use size of container
              parentWidth;

var cols = Math.floor( parentWidth / colW );
cols = Math.max( cols, 1 );

// i.e. this.masonry.cols = ....
this.masonry.cols = cols;
// i.e. this.masonry.columnWidth = ...
this.masonry.columnWidth = colW;
};

$.Isotope.prototype._masonryReset = function() {
// layout-specific props
this.masonry = {};
// FIXME shouldn't have to call this again
this._getCenteredMasonryColumns();
var i = this.masonry.cols;
this.masonry.colYs = [];
while (i--) {
  this.masonry.colYs.push( 0 );
}
};

$.Isotope.prototype._masonryResizeChanged = function() {
var prevColCount = this.masonry.cols;
// get updated colCount
this._getCenteredMasonryColumns();
return ( this.masonry.cols !== prevColCount );
};

$.Isotope.prototype._masonryGetContainerSize = function() {
var unusedCols = 0,
    i = this.masonry.cols;
// count unused columns
while ( --i ) {
  if ( this.masonry.colYs[i] !== 0 ) {
    break;
  }
  unusedCols++;
}

return {
      height : Math.max.apply( Math, this.masonry.colYs ),
      // fit container to columns that have been used;
      width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
    };
};

$(function(){

	var $container = $('#portfolio-items');

	if( $container.length ) {

		var $itemsFilter = $('#portfolio-filters');

		// Copy categories to item classes
 		$('.item', $container).each(function(i) {
			var $this = $(this);
			var $thumbAnchor = $this.find('.thumb-image a');
			$this.addClass( $this.attr('data-categories') );
			
			if($thumbAnchor.hasClass('video')){
				$thumbAnchor.append('<div class="thumb-image-hover"><img class="play-video" src="img/empty.gif" /></div>');
				
			} else {
				$thumbAnchor.append('<div class="thumb-image-hover"><img class="zoom-image" src="img/empty.gif" /></div>');
			}
		});


		// Run Isotope when all images are fully loaded
		$(window).on('load', function() {
			$container.isotope({
				itemSelector : '.item'
			});
		});

		// Filter projects
		$itemsFilter.on('click', 'a', function(e) {
			var $this         = $(this),
				currentOption = $this.attr('data-categories');

			$itemsFilter.find('a').removeClass('active');
			$this.addClass('active');

			if( currentOption ) {
				if( currentOption !== '*' ) currentOption = currentOption.replace(currentOption, '.' + currentOption)
				$container.isotope({ filter : currentOption });
			}

			e.preventDefault();
		});

		$itemsFilter.find('a').first().addClass('active');
	}

}); 

/* ---------------------------------------------------------------------- */
/*	FANCY BOX
/* ---------------------------------------------------------------------- */
(function($){
			var $fancyboxItems = $('.single-image, .image-gallery, .iframe');

 			// Images
 			$('.single-image, .image-gallery').fancybox({
 				type        : 'image',
 				openEffect  : 'fade',
 				closeEffect	: 'fade',
 				nextEffect  : 'fade',
 				prevEffect  : 'fade',
 				helpers     : {
 					title   : {
 						type : 'inside'
 					},
 					buttons  : {},
 					media    : {},
 					overlay : { locked : false }
 				},
 				afterLoad   : function() {
 					this.title = this.group.length > 1 ? 'Image ' + ( this.index + 1 ) + ' of ' + this.group.length + ( this.title ? ' - ' + this.title : '' ) : this.title;
 				}
 			});

 			// Iframe
 			$('.iframe').fancybox({
 				type        : 'iframe',
 				openEffect  : 'fade',
 				closeEffect	: 'fade',
 				nextEffect  : 'fade',
 				prevEffect  : 'fade',
 				helpers     : {
 					title   : {
 						type : 'inside'
 					},
 					buttons  : {},
 					media    : {},
 					overlay : { locked : false }
 				},
 				width       : '70%',
				height      : '70%',
				maxWidth    : 800,
				maxHeight   : 600,
				fitToView   : false,
				autoSize    : false,
				closeClick  : false
			});

 			// Ajax
 			$('.ajax').fancybox({
 				type        : 'ajax',
 				openEffect  : 'fade',
 				closeEffect	: 'fade',
 				nextEffect  : 'fade',
 				prevEffect  : 'fade',
 				helpers     : {
 					title   : {
 						type : 'inside'
 					},
 					buttons  : {},
 					media    : {},
 					overlay : { locked : false }
 				},
 				 width       : '100%',
				// height      : '70%',
				maxWidth    : 800,
				// maxHeight   : 600,
				fitToView   : true,
				autoSize    : true,
				closeClick  : false
			});	

})(jQuery);
/* end Fancy Box */

/* ---------------------------------------------------------------------- */
/*	Tabs
/* ---------------------------------------------------------------------- */
(function($) { 

	// Tabs (part of Skeleton)
	var tabs = $('ul.tabs');
	tabs.each(function(i) {
		//Get all tabs
		var tab = $(this).find('> li > a');
		tab.mousedown(function(e) {
			//Get Location of tab's content
			var contentLocation = $(this).attr('href');
			//Let go if not a hashed one
			if(contentLocation.charAt(0)=="#") {
				e.preventDefault();
				//Make Tab Active
				tab.removeClass('active');
				$(this).addClass('active');
				//Show Tab Content & add active class
				$(contentLocation).show().addClass('active').siblings().hide().removeClass('active');
			}
		}).click(function(e){
			e.preventDefault();
		});
	});

})(jQuery);

/* ---------------------------------------------------------------------- */
/*	Google Maps
/* ---------------------------------------------------------------------- */
(function($) {

	var $map = $('#map');
	var $address = $map.find('#address').text();

	if( $map.length ) {

		$map.gMap({
			address: $address,
			scrollwheel: false,
			zoom: 17,
			markers: [
				{ 'address' : $address }
			]
		});

	}
})(jQuery);


/* ---------------------------------------------------------------------- */
/*	AJAX Contact Form
/* ---------------------------------------------------------------------- */
(function($){

		$("form.send-with-ajax").submit(function(e) {
		/* Add the class "send-with-ajax" to any form you want to have it handled here 
		  (don't forget the div with class="ajax-response" inside the <form> tag!) */
			e.preventDefault();
			var form = $(this),
				validationErrors = false;
			
			// Reset all messages
			$('.form-error-msg').remove();

			// Client-side validation for old browsers
			form.find("input[type='email'], input[required]").each(function(index){
				var inputValue = $(this).val(),
					inputRequired = $(this).attr('required'),
					inputType = $(this).attr('type');

					$(this).removeClass('form-error');
				
				if(inputRequired && inputValue == '') {
					$(this).after('<div class="form-error-msg">Please fill out this field.</div>');
					$(this).addClass('form-error');
					validationErrors = true;
				} else if(inputType == 'email' && !isValidEmail(inputValue)) {
					$(this).after('<div class="form-error-msg">Please enter an email address.</div>');
					$(this).addClass('form-error');
					validationErrors = true;
				}
			});

			if (!validationErrors) {
				form.find('button:submit, input:submit').html('Sending...');
				form.find('.ajax-response').empty();
				$.post(form.attr('action'), form.serialize(),
					function(data) {
						if (data.bFormSent) {
							form.find('.ajax-response').empty().wrapInner('<div class="notice success"></div>');
							form.find('.ajax-response div').html(data.aResults[0]);
							form.find('button:submit, input:submit').html('Submit Form');
							form.find('#form-email, #form-name, #form-message').val('');
						} else {
							form.find('.ajax-response').empty().wrapInner('<div class="notice error"></div>');
							form.find('.ajax-response div').html(data.aErrors[0]);
							form.find('button:submit, input:submit').html('Try Again');
						}
					}, 'json');
			}
		});	

		function isValidEmail(email) {
		    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
		    return pattern.test(email);
		};

})(jQuery);

/* ---------------------------------------------------------------------- */
/*	MOBILE SLIDE DOWN & WINDOW Resize detection
/* ---------------------------------------------------------------------- */
(function($){

	var isSmallScreen;
	var navContainer = $(".nav-container");

	var waitForFinalEvent = (function () {			
		var timers = {};			

		/** Check Window Resize event **/
		checkWindowSize();

		return function (callback, ms, uniqueId) {
		if (!uniqueId) {
		  uniqueId = "Don't call this twice without a uniqueId";
		}
		if (timers[uniqueId]) {
		  clearTimeout (timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
		};
	})();

	$(window).resize(function () {
	    waitForFinalEvent(function(){
			checkWindowSize();     
	    }, 500, "resize-id-1");
	});		


	/** Hide and Show Mobile Menu on click **/
	$('#menu .menu-select').click(function(event){
	    event.preventDefault();
		if(navContainer.is(":visible")) {
	      navContainer.slideUp("slow");
	    } else {
	      navContainer.slideDown("slow");
	    }
	});

	$('nav li a').click(function(){
		if (navContainer.is(":visible") && isSmallScreen) {
		      navContainer.slideUp("slow");
		}
	});					


	/* FUNCTIONS */
	function checkWindowSize() {

		if($(window).width() < 768) {
			isSmallScreen = true;
			if(navContainer.is(":visible")) {
					navContainer.slideUp("slow");
			}			
		} else {
			isSmallScreen = false; 
			if(navContainer.is(":hidden")) {
					navContainer.slideDown("fast");
			}	    	
		}
	}

})(jQuery);

//Execute when DOM is Ready and Images has loaded
 $(window).load(function() {

 	/* ---------------------------------------------------------------------- */
	/*	FlexSlider
	/* ---------------------------------------------------------------------- */
   $('#featured').flexslider({
     animation: "fade"
   });

 });