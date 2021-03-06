/**
Core script to handle the entire theme and core functions
**/
var App = function() {

	// IE mode
	var isRTL = false;
	var isIE8 = false;
	var isIE9 = false;
	var isIE10 = false;

	var resizeHandlers = [];

	var assetsPath = '../';

	var globalImgPath = 'static/img/';

	var globalPluginsPath = 'static/plugins/';

	var globalCssPath = 'static/css/';

	// initializes main settings
	var handleInit = function() {

		if($('body').css('direction') === 'rtl') {
			isRTL = true;
		}

		isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
		isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
		isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

		if(isIE10) {
			$('html').addClass('ie10'); // detect IE10 version
		}

		if(isIE10 || isIE9 || isIE8) {
			$('html').addClass('ie'); // detect IE10 version
		}
	};

	// runs callback functions set by App.addResponsiveHandler().
	var _runResizeHandlers = function() {
		// reinitialize other subscribed elements
		for(var i = 0; i < resizeHandlers.length; i++) {
			var each = resizeHandlers[i];
			each.call();
		}
	};

	var handleSubpageTab = function() {
		$('.J_pageItem').click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			var me = $(this);
			var linkUrl = '';
			if(me[0].nodeName == 'A') {
				linkUrl = me.attr('href');
			} else {
				linkUrl = me.data('href');
			}
			var title = me.data('title');
			if(linkUrl == '' || title == '') return false;
			window.top.showSubpageTab(linkUrl, title);
		})
	}

	var handleOnResize = function() {
		var windowWidth = $(window).width();
		var resize;
		if(isIE8) {
			var currheight;
			$(window).resize(function() {
				if(currheight == document.documentElement.clientHeight) {
					return; //quite event since only body resized not window.
				}
				if(resize) {
					clearTimeout(resize);
				}
				resize = setTimeout(function() {
					_runResizeHandlers();
				}, 50); // wait 50ms until window resize finishes.                
				currheight = document.documentElement.clientHeight; // store last body client height
			});
		} else {
			$(window).resize(function() {
				if($(window).width() != windowWidth) {
					windowWidth = $(window).width();
					if(resize) {
						clearTimeout(resize);
					}
					resize = setTimeout(function() {
						_runResizeHandlers();
					}, 50); // wait 50ms until window resize finishes.
				}
			});
		}
	};

	// Handles portlet tools & actions
	var handlePortletTools = function() {
		// handle portlet remove
		$('body').on('click', '.portlet > .portlet-title > .tools > a.remove', function(e) {
			e.preventDefault();
			var portlet = $(this).closest(".portlet");

			if($('body').hasClass('page-portlet-fullscreen')) {
				$('body').removeClass('page-portlet-fullscreen');
			}

			portlet.find('.portlet-title .fullscreen').tooltip('destroy');
			portlet.find('.portlet-title > .tools > .reload').tooltip('destroy');
			portlet.find('.portlet-title > .tools > .remove').tooltip('destroy');
			portlet.find('.portlet-title > .tools > .config').tooltip('destroy');
			portlet.find('.portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip('destroy');

			portlet.remove();
		});

		// handle portlet fullscreen
		$('body').on('click', '.portlet > .portlet-title .fullscreen', function(e) {
			e.preventDefault();
			var portlet = $(this).closest(".portlet");
			if(portlet.hasClass('portlet-fullscreen')) {
				$(this).removeClass('on');
				portlet.removeClass('portlet-fullscreen');
				$('body').removeClass('page-portlet-fullscreen');
				portlet.children('.portlet-body').css('height', 'auto');

				//处理scroller
				var $scroller = portlet.children('.portlet-body').find('.scroller');
				if($scroller.length) {
					App.initSlimScroll($scroller);
				}
			} else {
				var height = App.getViewPort().height -
					portlet.children('.portlet-title').outerHeight() -
					parseInt(portlet.children('.portlet-body').css('padding-top')) -
					parseInt(portlet.children('.portlet-body').css('padding-bottom'));

				$(this).addClass('on');
				portlet.addClass('portlet-fullscreen');
				$('body').addClass('page-portlet-fullscreen');
				portlet.children('.portlet-body').css('height', height);
				var $scroller = portlet.children('.portlet-body').find('.scroller');
				if($scroller.length) {
					App.destroySlimScroll($scroller);
				}
			}
		});

		$('body').on('click', '.portlet > .portlet-title > .tools > a.reload', function(e) {
			e.preventDefault();
			var el = $(this).closest(".portlet").children(".portlet-body");
			var url = $(this).attr("data-url");
			var error = $(this).attr("data-error-display");
			if(url) {
				App.blockUI({
					target: el,
					animate: true,
					overlayColor: 'none'
				});
				$.ajax({
					type: "GET",
					cache: false,
					url: url,
					dataType: "html",
					success: function(res) {
						App.unblockUI(el);
						el.html(res);
						App.initAjax() // reinitialize elements & plugins for newly loaded content
					},
					error: function(xhr, ajaxOptions, thrownError) {
						App.unblockUI(el);
						var msg = 'Error on reloading the content. Please check your connection and try again.';
						if(error == "toastr" && toastr) {
							toastr.error(msg);
						} else if(error == "notific8" && $.notific8) {
							$.notific8('zindex', 11500);
							$.notific8(msg, {
								theme: 'ruby',
								life: 3000
							});
						} else {
							alert(msg);
						}
					}
				});
			} else {
				// for demo purpose
				App.blockUI({
					target: el,
					animate: true,
					overlayColor: 'none'
				});
				window.setTimeout(function() {
					App.unblockUI(el);
				}, 1000);
			}
		});

		// load ajax data on page init
		$('.portlet .portlet-title a.reload[data-load="true"]').click();

		$('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function(e) {
			e.preventDefault();
			var el = $(this).closest(".portlet").children(".portlet-body");
			if($(this).hasClass("collapse")) {
				$(this).removeClass("collapse").addClass("expand");
				el.slideUp(200);
			} else {
				$(this).removeClass("expand").addClass("collapse");
				el.slideDown(200);
			}
		});
	};

	// Handles custom checkboxes & radios using jQuery iCheck plugin
	var handleiCheck = function() {
		if(!$().iCheck) {
			return;
		}

		$('.icheck').each(function() {
			var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-grey';
			var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-grey';

			if(checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
				$(this).iCheck({
					checkboxClass: checkboxClass,
					radioClass: radioClass,
					insert: '<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
				});
			} else {
				$(this).iCheck({
					checkboxClass: checkboxClass,
					radioClass: radioClass
				});
			}
		});
	};

	// Handles Bootstrap switches
	var handleBootstrapSwitch = function() {
		if(!$().bootstrapSwitch) {
			return;
		}
		$('.make-switch').bootstrapSwitch();
	};

	// Handles Bootstrap confirmations
	var handleBootstrapConfirmation = function() {
		if(!$().confirmation) {
			return;
		}
		$('[data-toggle=confirmation]').confirmation({
			btnOkClass: 'btn btn-sm btn-success',
			btnCancelClass: 'btn btn-sm btn-danger'
		});
	}

	// Handles Bootstrap Accordions.
	var handleAccordions = function() {
		$('body').on('shown.bs.collapse', '.accordion.scrollable', function(e) {
			App.scrollTo($(e.target));
		});
	};

	// Handles Bootstrap Tabs.
	var handleTabs = function() {
		//activate tab if tab id provided in the URL
		if(encodeURI(location.hash)) {
			var tabid = encodeURI(location.hash.substr(1));
			$('a[href="#' + tabid + '"]').parents('.tab-pane:hidden').each(function() {
				var tabid = $(this).attr("id");
				$('a[href="#' + tabid + '"]').click();
			});
			$('a[href="#' + tabid + '"]').click();
		}

		if($().tabdrop) {
			$('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
				text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
			});
		}
	};

	// Handles Bootstrap Modals.
	var handleModals = function() {
		// fix stackable modal issue: when 2 or more modals opened, closing one of modal will remove .modal-open class. 
		$('body').on('hide.bs.modal', function() {
			if($('.modal:visible').size() > 1 && $('html').hasClass('modal-open') === false) {
				$('html').addClass('modal-open');
			} else if($('.modal:visible').size() <= 1) {
				$('html').removeClass('modal-open');
			}
		});

		// fix page scrollbars issue
		$('body').on('show.bs.modal', '.modal', function() {
			if($(this).hasClass("modal-scroll")) {
				$('body').addClass("modal-open-noscroll");
			}
		});

		// fix page scrollbars issue
		$('body').on('hidden.bs.modal', '.modal', function() {
			$('body').removeClass("modal-open-noscroll");
		});

		// remove ajax content and remove cache on modal closed 
		$('body').on('hidden.bs.modal', '.modal:not(.modal-cached)', function() {
			$(this).removeData('bs.modal');
		});
	};

	// Handles Bootstrap Tooltips.
	var handleTooltips = function() {
		// global tooltips
		$('.tooltips').tooltip();

		// portlet tooltips
		$('.portlet > .portlet-title .fullscreen').tooltip({
			trigger: 'hover',
			container: 'body',
			title: '全屏浏览'
		});
		$('.portlet > .portlet-title > .tools > .reload').tooltip({
			trigger: 'hover',
			container: 'body',
			title: '刷新'
		});
		$('.portlet > .portlet-title > .tools > .remove').tooltip({
			trigger: 'hover',
			container: 'body',
			title: '移除'
		});
		$('.portlet > .portlet-title > .tools > .config').tooltip({
			trigger: 'hover',
			container: 'body',
			title: '设置'
		});
		$('.portlet > .portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip({
			trigger: 'hover',
			container: 'body',
			title: '折叠/展开'
		});
	};

	// Handles Bootstrap Dropdowns
	var handleDropdowns = function() {
		/*
		  Hold dropdown on click  
		*/
		$('body').on('click', '.dropdown-menu.hold-on-click', function(e) {
			e.stopPropagation();
		});
	};

	var handleAlerts = function() {
		$('body').on('click', '[data-close="alert"]', function(e) {
			$(this).parent('.alert').hide();
			$(this).closest('.note').hide();
			e.preventDefault();
		});

		$('body').on('click', '[data-close="note"]', function(e) {
			$(this).closest('.note').hide();
			e.preventDefault();
		});

		$('body').on('click', '[data-remove="note"]', function(e) {
			$(this).closest('.note').remove();
			e.preventDefault();
		});
	};

	// Handle textarea autosize 
	var handleTextareaAutosize = function() {
		if(typeof(autosize) == "function") {
			autosize(document.querySelector('textarea.autosizeme'));
		}
	}

	// Handles Bootstrap Popovers

	// last popep popover
	var lastPopedPopover;

	var handlePopovers = function() {
		$('.popovers').popover();

		// close last displayed popover

		$(document).on('click.bs.popover.data-api', function(e) {
			if(lastPopedPopover) {
				lastPopedPopover.popover('hide');
			}
		});
	};

	// Handles scrollable contents using jQuery SlimScroll plugin.
	var handleScrollers = function() {
		App.initSlimScroll('.scroller');
	};

	// Handles Image Preview using jQuery Fancybox plugin
	var handleFancybox = function() {
		if(!jQuery.fancybox) {
			return;
		}

		if($(".fancybox-button").size() > 0) {
			$(".fancybox-button").fancybox({
				groupAttr: 'data-rel',
				prevEffect: 'none',
				nextEffect: 'none',
				closeBtn: true,
				helpers: {
					title: {
						type: 'inside'
					}
				}
			});
		}
	};

	// Handles counterup plugin wrapper
	var handleCounterup = function() {
		if(!$().counterUp) {
			return;
		}

		$("[data-counter='counterup']").counterUp({
			delay: 10,
			time: 1000
		});
	};

	// Fix input placeholder issue for IE8 and IE9
	var handleFixInputPlaceholderForIE = function() {
		//fix html5 placeholder attribute for ie7 & ie8
		if(isIE8 || isIE9) { // ie8 & ie9
			// this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
			$('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function() {
				var input = $(this);

				if(input.val() === '' && input.attr("placeholder") !== '') {
					input.addClass("placeholder").val(input.attr('placeholder'));
				}

				input.focus(function() {
					if(input.val() == input.attr('placeholder')) {
						input.val('');
					}
				});

				input.blur(function() {
					if(input.val() === '' || input.val() == input.attr('placeholder')) {
						input.val(input.attr('placeholder'));
					}
				});
			});
		}
	};

	// Handle Select2 Dropdowns
	var handleSelect2 = function() {
		if($().select2) {
			$.fn.select2.defaults.set("theme", "bootstrap");
			$('.select2me').select2({
				placeholder: "请选择",
                language:'zh-CN',
				// width: 'auto', 
				allowClear: true
			});
		}
	};

	// Handle datePicker
	var handleDatePicker = function() {
		if($.fn.datepicker) {
			$.fn.datepicker.defaults.format = 'yyyy-mm-dd';
			$.fn.datepicker.defaults.language = 'zh-CN';
			$.fn.datepicker.defaults.autoclose = true;
			$('.date-picker').datepicker({
				format: "yyyy-mm-dd"
			});
		}
	};

	var panelAction = function(el, parentEl, bodyEl, icon1, icon2, times) {
		$(el).click(function() {
			var me = $(this);
			var pnode = me.closest(parentEl);
			var pbody = pnode.nextAll(bodyEl).first();
			var meicon = me.find('.fa');
			if(times != 0) {
				times = times ? times : 200;
			}
			pbody.slideToggle(times);
			meicon.toggleClass(icon1).toggleClass(icon2);
			if(el == '.page-search-more a') {
				var panelSearch = me.closest('.page-search');
				var resetBtn = panelSearch.find('.page-search-action').find('button[type=reset]');
				resetBtn.toggleClass('hidden');
			}
		})
	}

	var handlePagesearch = function() {
		if($('.page-search-more').length) {
			panelAction('.page-search-more a', '.page-search-more', '.page-search-moreBody', 'fa-angle-double-right', 'fa-angle-double-up', 0);
		}
	}

	var handleFileInput = function() {
		$('.form-group-file .input-group').click(function() {
			var pnode = $(this).closest('.form-group-file');
			var fileNode = pnode.find('input[type=file]');
			fileNode.trigger('click');
		});
		$('.form-group-file input[type=file]').change(function() {
			var pnode = $(this).parent('.form-group-file');
			var fileNode = pnode.find('.input-group input[type=text]');
			fileNode.val($(this).val());
		})
	}
	// Handle formFieldset
	var handleFormFieldset = function() {
		if($('.form-fieldset .form-collapse').length) {
			panelAction('.form-fieldset .form-collapse', '.form-fieldset-title', '.form-fieldset-body', 'fa-angle-up', 'fa-angle-down');
		}
	}

	// handle group element heights
	var handleHeight = function() {
		$('[data-auto-height]').each(function() {
			var parent = $(this);
			var items = $('[data-height]', parent);
			var height = 0;
			var mode = parent.attr('data-mode');
			var offset = parseInt(parent.attr('data-offset') ? parent.attr('data-offset') : 0);

			items.each(function() {
				if($(this).attr('data-height') == "height") {
					$(this).css('height', '');
				} else {
					$(this).css('min-height', '');
				}

				var height_ = (mode == 'base-height' ? $(this).outerHeight() : $(this).outerHeight(true));
				if(height_ > height) {
					height = height_;
				}
			});

			height = height + offset;

			items.each(function() {
				if($(this).attr('data-height') == "height") {
					$(this).css('height', height);
				} else {
					$(this).css('min-height', height);
				}
			});

			if(parent.attr('data-related')) {
				$(parent.attr('data-related')).css('height', parent.height());
			}
		});
	}

	//* END:CORE HANDLERS *//

	return {

		//main function to initiate the theme
		init: function() {
			//IMPORTANT!!!: Do not modify the core handlers call order.

			//Core handlers
			handleInit(); // initialize core variables
			handleSubpageTab();
			handleOnResize(); // set and handle responsive    

			//UI Component handlers     
			handleiCheck(); // handles custom icheck radio and checkboxes
			handleBootstrapSwitch(); // handle bootstrap switch plugin
			handleScrollers(); // handles slim scrolling contents 
			handleFancybox(); // handle fancy box
			handleSelect2(); // handle custom Select2 dropdowns
			handleDatePicker();
			handlePagesearch();
			handleFileInput();
			handleFormFieldset();
			handlePortletTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
			handleAlerts(); //handle closabled alerts
			handleDropdowns(); // handle dropdowns
			handleTabs(); // handle tabs
			handleTooltips(); // handle bootstrap tooltips
			handlePopovers(); // handles bootstrap popovers
			handleAccordions(); //handles accordions 
			handleModals(); // handle modals
			handleBootstrapConfirmation(); // handle bootstrap confirmations
			handleTextareaAutosize(); // handle autosize textareas
			handleCounterup(); // handle counterup instances

			//Handle group element heights
			this.addResizeHandler(handleHeight); // handle auto calculating height on window resize

			// Hacks
			handleFixInputPlaceholderForIE(); //IE8 & IE9 input placeholder issue fix
		},

		//main function to initiate core javascript after ajax complete
		initAjax: function() {
			handleiCheck(); // handles custom icheck radio and checkboxes
			handleBootstrapSwitch(); // handle bootstrap switch plugin
			handleScrollers(); // handles slim scrolling contents 
			handleSelect2(); // handle custom Select2 dropdowns
			handleFancybox(); // handle fancy box
			handleDropdowns(); // handle dropdowns
			handleTooltips(); // handle bootstrap tooltips
			handlePopovers(); // handles bootstrap popovers
			handleAccordions(); //handles accordions 
			handleBootstrapConfirmation(); // handle bootstrap confirmations
		},

		//init main components 
		initComponents: function() {
			this.initAjax();
		},

		//public function to remember last opened popover that needs to be closed on click
		setLastPopedPopover: function(el) {
			lastPopedPopover = el;
		},

		//public function to add callback a function which will be called on window resize
		addResizeHandler: function(func) {
			resizeHandlers.push(func);
		},

		//public functon to call _runresizeHandlers
		runResizeHandlers: function() {
			_runResizeHandlers();
		},

		// wrApper function to scroll(focus) to an element
		scrollTo: function(el, offeset) {
			var pos = (el && el.size() > 0) ? el.offset().top : 0;

			if(el) {
				if($('body').hasClass('page-header-fixed')) {
					pos = pos - $('.page-header').height();
				} else if($('body').hasClass('page-header-top-fixed')) {
					pos = pos - $('.page-header-top').height();
				} else if($('body').hasClass('page-header-menu-fixed')) {
					pos = pos - $('.page-header-menu').height();
				}
				pos = pos + (offeset ? offeset : -1 * el.height());
			}

			$('html,body').animate({
				scrollTop: pos
			}, 'slow');
		},

		initSlimScroll: function(el) {
			if(!$().slimScroll) {
				return;
			}

			$(el).each(function() {
				if($(this).attr("data-initialized")) {
					return; // exit
				}

				var height;

				if($(this).attr("data-height")) {
					height = $(this).attr("data-height");
				} else {
					height = $(this).css('height');
				}

				$(this).slimScroll({
					allowPageScroll: true, // allow page scroll when the element scroll is ended
					size: '7px',
					color: ($(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#bbb'),
					wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
					railColor: ($(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea'),
					position: isRTL ? 'left' : 'right',
					height: height,
					alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
					railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
					disableFadeOut: true
				});

				$(this).attr("data-initialized", "1");
			});
		},

		destroySlimScroll: function(el) {
			if(!$().slimScroll) {
				return;
			}

			$(el).each(function() {
				if($(this).attr("data-initialized") === "1") { // destroy existing instance before updating the height
					$(this).removeAttr("data-initialized");
					$(this).removeAttr("style");

					var attrList = {};

					// store the custom attribures so later we will reassign.
					if($(this).attr("data-handle-color")) {
						attrList["data-handle-color"] = $(this).attr("data-handle-color");
					}
					if($(this).attr("data-wrapper-class")) {
						attrList["data-wrapper-class"] = $(this).attr("data-wrapper-class");
					}
					if($(this).attr("data-rail-color")) {
						attrList["data-rail-color"] = $(this).attr("data-rail-color");
					}
					if($(this).attr("data-always-visible")) {
						attrList["data-always-visible"] = $(this).attr("data-always-visible");
					}
					if($(this).attr("data-rail-visible")) {
						attrList["data-rail-visible"] = $(this).attr("data-rail-visible");
					}

					$(this).slimScroll({
						wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
						destroy: true
					});

					var the = $(this);

					// reassign custom attributes
					$.each(attrList, function(key, value) {
						the.attr(key, value);
					});

				}
			});
		},

		// function to scroll to the top
		scrollTop: function() {
			App.scrollTo();
		},

		// wrApper function to  block element(indicate loading)
		blockUI: function(options) {
			options = $.extend(true, {}, options);
			var html = '';
			if(options.animate) {
				html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
			} else if(options.iconOnly) {
				html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
			} else if(options.textOnly) {
				html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
			} else {
				html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
			}

			if(options.target) { // element blocking
				var el = $(options.target);
				if(el.height() <= ($(window).height())) {
					options.cenrerY = true;
				}
				el.block({
					message: html,
					baseZ: options.zIndex ? options.zIndex : 1000,
					centerY: options.cenrerY !== undefined ? options.cenrerY : false,
					css: {
						top: '10%',
						border: '0',
						padding: '0',
						backgroundColor: 'none'
					},
					overlayCSS: {
						backgroundColor: options.overlayColor ? options.overlayColor : '#555',
						opacity: options.boxed ? 0.05 : 0.1,
						cursor: 'wait'
					}
				});
			} else { // page blocking
				$.blockUI({
					message: html,
					baseZ: options.zIndex ? options.zIndex : 1000,
					css: {
						border: '0',
						padding: '0',
						backgroundColor: 'none'
					},
					overlayCSS: {
						backgroundColor: options.overlayColor ? options.overlayColor : '#555',
						opacity: options.boxed ? 0.05 : 0.1,
						cursor: 'wait'
					}
				});
			}
		},

		// wrApper function to  un-block element(finish loading)
		unblockUI: function(target) {
			if(target) {
				$(target).unblock({
					onUnblock: function() {
						$(target).css('position', '');
						$(target).css('zoom', '');
					}
				});
			} else {
				$.unblockUI();
			}
		},

		startPageLoading: function(options) {
			if(options && options.animate) {
				$('.page-spinner-bar').remove();
				$('body').append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
			} else {
				$('.page-loading').remove();
				$('body').append('<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : 'Loading...') + '</span></div>');
			}
		},

		stopPageLoading: function() {
			$('.page-loading, .page-spinner-bar').remove();
		},

		alert: function(options) {

			options = $.extend(true, {
				container: "", // alerts parent container(by default placed after the page breadcrumbs)
				place: "append", // "append" or "prepend" in container 
				type: 'success', // alert's type
				message: "", // alert's message
				close: true, // make alert closable
				reset: true, // close all previouse alerts first
				focus: true, // auto scroll to the alert after shown
				closeInSeconds: 0, // auto close after defined seconds
				icon: "" // put icon before the message
			}, options);

			var id = App.getUniqueID("App_alert");

			var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';

			if(options.reset) {
				$('.custom-alerts').remove();
			}

			if(!options.container) {
				if($('.page-fixed-main-content').size() === 1) {
					$('.page-fixed-main-content').prepend(html);
				} else if(($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').size() === 0) {
					$('.page-title').after(html);
				} else {
					if($('.page-bar').size() > 0) {
						$('.page-bar').after(html);
					} else {
						$('.page-breadcrumb, .breadcrumbs').after(html);
					}
				}
			} else {
				if(options.place == "append") {
					$(options.container).append(html);
				} else {
					$(options.container).prepend(html);
				}
			}

			if(options.focus) {
				App.scrollTo($('#' + id));
			}

			if(options.closeInSeconds > 0) {
				setTimeout(function() {
					$('#' + id).remove();
				}, options.closeInSeconds * 1000);
			}

			return id;
		},

		//public function to initialize the fancybox plugin
		initFancybox: function() {
			handleFancybox();
		},

		//public helper function to get actual input value(used in IE9 and IE8 due to placeholder attribute not supported)
		getActualVal: function(el) {
			el = $(el);
			if(el.val() === el.attr("placeholder")) {
				return "";
			}
			return el.val();
		},

		//public function to get a paremeter by name from URL
		getURLParameter: function(paramName) {
			var searchString = window.location.search.substring(1),
				i, val, params = searchString.split("&");

			for(i = 0; i < params.length; i++) {
				val = params[i].split("=");
				if(val[0] == paramName) {
					return unescape(val[1]);
				}
			}
			return null;
		},

		// check for device touch support
		isTouchDevice: function() {
			try {
				document.createEvent("TouchEvent");
				return true;
			} catch(e) {
				return false;
			}
		},

		// To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
		getViewPort: function() {
			var e = window,
				a = 'inner';
			if(!('innerWidth' in window)) {
				a = 'client';
				e = document.documentElement || document.body;
			}

			return {
				width: e[a + 'Width'],
				height: e[a + 'Height']
			};
		},

		getUniqueID: function(prefix) {
			return 'prefix_' + Math.floor(Math.random() * (new Date()).getTime());
		},

		// check IE8 mode
		isIE8: function() {
			return isIE8;
		},

		// check IE9 mode
		isIE9: function() {
			return isIE9;
		},

		//check RTL mode
		isRTL: function() {
			return isRTL;
		},

		// check IE8 mode
		isAngularJsApp: function() {
			return(typeof angular == 'undefined') ? false : true;
		},

		getAssetsPath: function() {
			return assetsPath;
		},

		setAssetsPath: function(path) {
			assetsPath = path;
		},

		setGlobalImgPath: function(path) {
			globalImgPath = path;
		},

		getGlobalImgPath: function() {
			return assetsPath + globalImgPath;
		},

		setGlobalPluginsPath: function(path) {
			globalPluginsPath = path;
		},

		getGlobalPluginsPath: function() {
			return assetsPath + globalPluginsPath;
		},

		getGlobalCssPath: function() {
			return assetsPath + globalCssPath;
		},

		getResponsiveBreakpoint: function(size) {
			// bootstrap responsive breakpoints
			var sizes = {
				'xs': 480, // extra small
				'sm': 768, // small
				'md': 992, // medium
				'lg': 1200 // large
			};

			return sizes[size] ? sizes[size] : 0;
		},
		initDataTables: function(el, options) {
			if(!$().dataTable) {
				return;
			}
			var initComplete = function() {};
			if(options.initComplete) {
				initComplete = options.initComplete
			};
			options = $.extend(true, {
				"ordering": false,
				"scrollX": true,
				"scrollCollapse": true,
				"sScrollX": "100%",
				"sScrollXInner": "100%",
				"bAutoWidth": true,
				//              "serverSide":true,
				//              "ajax":{
				//                  "type":"POST",
				//                  "contentType":'application/x-www-form-urlencoded; charset=UTF-8',
				//                  "dataType":'json'
				//              },
				"order": [], //默认排序查询,为空则表示取消默认排序否则复选框一列会出现小箭头 
				"oLanguage": {
					"sProcessing": "正在加载数据，请稍候...",
					"sLengthMenu": "&nbsp;&nbsp;&nbsp;&nbsp;每页显示  _MENU_ 条记录",
					"sZeroRecords": "没有匹配结果",
					"sInfo": "当前为第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条记录",
					"sInfoEmpty": "当前为第 0 至 0 条记录，共 0 项",
					"sInfoFiltered": "(由 _MAX_ 条记录结果过滤)",
					"sInfoPostFix": "",
					"sSearch": "",
					"sSearchPlaceholder": "输入关键字筛选表格",
					"sUrl": "",
					"sDecimal": "",
					"sThousands": ",",
					"sEmptyTable": "表中数据为空",
					"sLoadingRecords": "载入中...",
					"sInfoThousands": ",",
					"oPaginate": {
						"sFirst": "首页",
						"sPrevious": "上页",
						"sNext": "下页",
						"sLast": "末页"
					},
					"oAria": {
						"sSortAscending": ": 以升序排列此列",
						"sSortDescending": ": 以降序排列此列"
					},
					"buttons": {
						"copy": "<i title='复制到剪切板' class='fa fa-copy'></i>",
						"excel": "<i title='导出表格' class='fa fa-table'></i>",
						"pdf": "<i title='导出PDF' class='fa fa-file-pdf-o'></i>",
						"colvis": "<i title='选择列' class='glyphicon glyphicon-th'></i>",
						"copyTitle": "复制到剪切板",
						"copySuccess": {
							1: "已经复制当前记录到剪贴板",
							_: "已经复制 %d 条记录到剪切板"
						}
					}
				},
				"dom": '<"clearfix"<"table_toolbars pull-left"><"pull-right"B>>t<"clearfix dt-footer-wrapper" <"pull-left" <"inline-block" i><"inline-block"l>><"pull-right" p>>', //生成样式
				"processing": false,
				//"bProcessing":true,
				"paging": true,
				"lengthMenu": [
					[5, 10, 15, 20, -1],
					[5, 10, 15, 20, 50, 100]
				],
				"pageLength": 10,
				"language": {
					"emptyTable": "没有关联的需求信息!",
					"thousands": ","
				},
				//              "fixedColumns": {
				//                  'leftColumns': 2
				//              },
				"columnDefs": [{ // 所有列默认值
					"targets": "_all",
					"defaultContent": ''
				}],
				"buttons": ['copy', 'excel', 'colvis'], //'pdf',

				"drawCallback": function() {
					// 取消全选  
					$(":checkbox[name='td-checkbox']").prop('checked', false);
				}
			}, options);
			options.initComplete = function() {
				if(options.toolbars) {
					$(el + '_wrapper').find('.table_toolbars').html('').append($(options.toolbars).html());
					$(options.toolbars).remove();
				}
				initComplete();
			}
			var oTable = $(el).dataTable(options);
			return oTable;
		},
		/**
		 * initEditableDatatables 基于initDataTables 实现表格的可编辑
		 * options 新增 addRowBtn String 触发新增按钮的id或calss选择器
		 * options.columns 新增 isEditable Booleans 标识当前列是否可编辑
		 * options 新增fnDeleteEditRow Function 为删除一行之后的回调函数
		 * options 新增fnValidEditRow Function 为保存时校验内容是否符合规范，返回boolean
		 * options 新增fnSaveEditRow Function 为保存一行数据的回调函数
		 * 
		 * */
		initEditableDatatables: function(el, options) {
			var nEditing = null;
			var nNew = false;
			//增加编辑列
			options.columns.push({
				"data": null,
				"title": "编辑",
				"width": '60',
				"align": 'center',
				"render": function(data, type, row, meta) {
					return "<button class='btn primary btn-outline btn-xs dt-edit'>编辑</button>"
				}
			});
			//增加删除列
			options.columns.push({
				"data": null,
				"title": "编辑",
				"width": '60',
				"align": 'center',
				"render": function(data, type, row, meta) {
					return "<button class='btn yellow btn-outline btn-xs dt-delete'>删除</button>"
				}
			})
			//options.initComplete
			var initComplete = function() {};
			if(options.initComplete) {
				initComplete = options.initComplete
			};
			options.initComplete = function() {
				//为新增按钮绑定时间
				$(options.addRowBtn).click(function(event){
					event.preventDefault();
					if(nEditing) {
						layer.confirm('尚有编辑项未保存，您确定要保存吗?', {
							icon: 3, 
							title:'提示'
						}, function(layerObj){
							if(!validRow(oTable, nEditing)) return false;
						  	saveRow(oTable, nEditing); 
							nEditing = null;
							nNew = false;
							addEmptyRow();
							layer.close(layerObj);
						},function(layerObj){
							oTable.fnDeleteRow(nEditing);
							nEditing = null;
							nNew = false;
							addEmptyRow();
							return;
						});
					}else{
						addEmptyRow();
					}
				})
				initComplete();
			}
			
			var oTable = this.initDataTables(el, options);
			var table = $(el);

			/*删除一行*/
			table.on('click', '.dt-delete', function(e) {
				e.preventDefault();
				var _btn = this;
				layer.confirm('您确定要删除此记录吗?', {
					icon: 3,
					title: '提示'
				}, function(layerObj) {
					var nRow = $(_btn).parents('tr')[0];
					var aData = oTable.fnGetData(nRow); //当前行的数据
					oTable.fnDeleteRow(nRow);
					layer.close(layerObj);
					//删除成功，进行ajax数据同步
					if(typeof options.fnDeleteEditRow == 'function') options.fnDeleteEditRow(aData);
				});

			});

			/*删除编辑行*/
			table.on('click', '.dt-cancel', function(e) {
				e.preventDefault();
				if(nNew) {
					oTable.fnDeleteRow(nEditing);
					nEditing = null;
					nNew = false;
				} else {
					restoreRow(oTable, nEditing);
					nEditing = null;
				}
			});

			/*编辑当前行*/
			table.on('click', '.dt-edit', function(e) {
				e.preventDefault();
				nNew = false;

				var nRow = $(this).parents('tr')[0];

				if(nEditing !== null && nEditing != nRow) {
					/* 再次编辑前使之前的编辑项复原 */
					restoreRow(oTable, nEditing);
					editRow(oTable, nRow);
					nEditing = nRow;
				} else if(nEditing == nRow && this.innerHTML == "保存") {
					if(!validRow(oTable, nEditing)) return false;
					saveRow(oTable, nEditing);
					nEditing = null;
					//更新成功，进行ajax数据同步
				} else {
					editRow(oTable, nRow);
					nEditing = nRow;
				}
			});
			
			
			function addEmptyRow(){
				var newRow = {};
				for (var i=0;i<options.columns.length;i++) {
					var c = options.columns[i];
					if(c.data !=null && c.data !=''){
						newRow[c.data] = '';
					}
				}
				console.log('newRow::'+JSON.stringify(newRow));
				var aiNew = oTable.fnAddData(newRow);
				var nRow = oTable.fnGetNodes(aiNew[0]);
				editRow(oTable, nRow);
				nEditing = nRow;
				nNew = true;
			}
			
			/*复原行*/
			function restoreRow(oTable, nRow) {
				var aData = oTable.fnGetData(nRow);
				var jqTds = $('>td', nRow);
				var iLen = jqTds.length;
				for(var i = 0; i < iLen-2; i++) {
					var field = $(jqTds[i]).find('input').attr('name');
					if(field) oTable.fnUpdate(aData[field], nRow, i, false);
				}
				var oTdEdit = $(nRow).find('td:eq('+(iLen-2)+')');
				oTdEdit.html('<button class="btn primary btn-outline btn-xs dt-edit">编辑</button>');
				var oTdCancel = $(nRow).find('td:eq('+(iLen-1)+')');
				oTdCancel.html('<button class="btn yellow btn-outline btn-xs dt-cancel">取消</button>');
				oTable.fnDraw();
			}
			
			/*编辑行*/
			function editRow(oTable, nRow) {
				var aData = oTable.fnGetData(nRow);
				var clength = $('>td', nRow).length;
				for(var i=0;i<clength-2;i++){
					var c = options.columns[i];
					var oTd = $('>td:eq('+i+')', nRow);
					if(c.isEditable){
						oTd.html('<input type="text" class="form-control input-small" name="'+c.data+'" value="' + aData[c.data] + '">');
					}else{
						oTd.html(aData[c.data?c.data:'']);
					}
				}
				var oTdEdit = $(nRow).find('td:eq('+(clength-2)+')');
				oTdEdit.html('<button class="btn primary btn-outline btn-xs dt-edit">保存</button>');
				var oTdCancel = $(nRow).find('td:eq('+(clength-1)+')');
				oTdCancel.html('<button class="btn yellow btn-outline btn-xs dt-cancel">取消</button>');
			}
			function validRow(oTable, nRow){
				var aData = oTable.fnGetData(nRow);
				var preAData = aData;
				$('input', nRow).each(function(index,item){
					var name = $(this).attr('name');
					var value = $(this).val();
					preAData[name] = value;
				})
				var flag = true;
				if(typeof options.fnValidEditRow == 'function'){
					flag = options.fnValidEditRow(preAData);
				} 
				return flag;
			}
			/*保存行*/
			function saveRow(oTable, nRow) {
				var aData = oTable.fnGetData(nRow);
				$('input', nRow).each(function(index,item){
					var tdIndex = $(this).parent('td').index();
					var value = $(this).val();
					oTable.fnUpdate(value, nRow, tdIndex, false);
				})
				var length = $('>td', nRow).length;	
				oTable.fnUpdate('<button class="btn primary btn-outline btn-xs dt-edit">编辑</button>', nRow, length-2, false);
				oTable.fnUpdate('<button class="btn yellow btn-outline btn-xs dt-delete">删除</button>', nRow, length-1, false);
				oTable.fnDraw();
				//保存数据，进行ajax数据同步等操作
				if(typeof options.fnSaveEditRow == 'function'){
					options.fnSaveEditRow(aData);
				} 
			}
		},
		delTableItem: function(el, callback) { //el 为table的id ；itemName为名称的字段名
			var checkedItem = $(el + '_wrapper').find('input[type=checkbox][name=td-checkbox]:checked');
			if(checkedItem.length == 0) {
				layer.alert('请先在表格中勾选您要删除的项目', {
					icon: 0,
					skin: 'layer-ext-moon'
				})
				return false;
			} else {
				var delStr = [];
				$.each(checkedItem, function(index, item) {
					delStr.push(" <span class='text-warning'>" +
						$(item).attr('data-name') + "</span> ");
				})
				layer.confirm('您选择了【' + delStr.join(',') + '】共' + checkedItem.length + '条记录，确定要将其删除吗？', {
					btn: [
						'删除', '取消'
					],
					icon: 0,
					skin: 'layer-ext-moon'
				}, function() {
					callback(checkedItem);
				})
			}
		},
		setChecked: function(name, value) {
			var cks = document.getElementsByName(name);
			var arr = value.split(',');

			for(var i = 0; i < cks.length; i++) {
				if(isInArray(arr, cks[i].value)) {
					cks[i].checked = true;
				}
			}
		},
		setFormValues: function(formId, json) {
			if(json != undefined && json != null) {
				var obj = null,
					sel = null,
					objType = null;
				for(var a in json) {
					sel = ":input[name='" + a + "']";
					obj = $(formId).find(sel);
					objType = obj[0].type;
					if(objType == "text" || objType == "select-one" || objType == "textarea") {
						obj.val(json[a]);
						if(objType == "select-one" && obj.hasClass('select2me')) {
							obj.trigger('change');
						}
					} else if(objType == "radio" || objType == "checkbox") {
						setChecked(a, json[a]);
					}
				}
			}
		},
		/**
		 * setFindValue 为查看页面自动赋值
		 * @param {String} el 表单容器选择器
		 * @param {JSON} formData 表单项的值
		 * @param {Array} valueCallback 需要做重定义的项
		 * */
		setFindValue: function(el, formData, valueCallback) {
			if(formData != undefined && formData != null) {
				var obj = null,
					sel = null;
				//将有name的.form-control-static设置为空
				$(el).find(".form-control-static[name]").text('');
				if(valueCallback != undefined && valueCallback != null) {
					for(var b in valueCallback) {
						var value = formData[b];
						var tvalue = valueCallback[b](value);
						formData[b] = tvalue;
					}
				}
				$(el).find(".form-control-static[name]").each(function(index, item) {
					var key = $(item).attr('name');
					var valueObj = formData[key];
					if(valueObj) {
						if(valueObj.callback) {
							$(item).text(valueObj.callback(valueObj.value));
						} else {
							$(item).text(valueObj);
						}
					} else {
						//如果没有值用空格填充，解决为空导致的高度错乱问题
						$(item).html('&nbsp;');
					}
				})
			}
		}
	};

}();

<!-- END THEME LAYOUT SCRIPTS -->

jQuery(document).ready(function() {
	App.init();
	$(window).resize(function() {
		App.initAjax();
	})
});