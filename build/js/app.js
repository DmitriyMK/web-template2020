"use strict";

// PRE-initialization
var APP = window.APP || {};
APP.Dev = APP.Dev || {};
APP.Browser = APP.Browser || {};
APP.Plugins = APP.Plugins || {};
APP.Components = APP.Components || {}; // force scroll to top on initial load

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}; // shorthand operators


var _window = $(window);

var _document = $(document);

var easingSwing = [0.02, 0.01, 0.47, 1]; // default jQuery easing

(function ($, APP) {
  APP.Initilizer = function () {
    var app = {};

    app.init = function () {
      app.initGlobalPlugins();
      app.initPlugins();
      app.initComponents();
    };

    app.onLoadTrigger = function () {// APP.Plugins.Preloader.loaded();
    };

    app.refresh = function () {
      APP.Plugins.Sharer.refresh();
      APP.Plugins.Sliders.reinit();
      app.initPlugins(true);
      app.initComponents(true);
    };

    app.destroy = function () {}; // pjax triggers


    app.newPageReady = function () {
      app.refresh();
    }; // app.transitionCompleted = function() {
    //   APP.Plugins.AOS.refresh();
    //   app.onLoadTrigger();
    // };
    // Global plugins which must be initialized once


    app.initGlobalPlugins = function () {
      APP.Dev.Credentials.logCredentials();
      APP.Dev.Breakpoint.listenResize();
      APP.Browser().methods.setBodyTags();
      APP.Plugins.LegacySupport.init(); // APP.Plugins.ScrollBlock.listenScroll();

      APP.Plugins.Clicks.init(); // APP.Plugins.AOS.init();
    }; // Plugins which depends on DOM and page content
    // app.initPlugins = function(fromPjax) {
    //   APP.Plugins.Teleport.init();
    //   APP.Plugins.Sliders.init(fromPjax);
    //   APP.Plugins.Modals.init();
    //   APP.Plugins.Masks.init();
    //   APP.Plugins.Selectric.init();
    //   APP.Plugins.LazyLoadImages.init();
    //   APP.Plugins.TextareaAutoExpand.init();
    //   APP.Plugins.Validations.init();
    //   APP.Plugins.LegacySupport.fixImages();
    //   // APP.Plugins.ScrollReveal.init();
    //   // APP.Plugins.Ymaps.init();
    //   // APP.Plugins.Countdown.init();
    //   // APP.Plugins.FooterReveal.init();
    //   // APP.Plugins.ScalerDesktop.init(fromPjax);
    //   // plugins
    //   // APP.Plugins.Sticky.init(fromPjax);
    //   // APP.Plugins.Photoswipe.init(fromPjax);
    //   // APP.Plugins.DatePicker.init(fromPjax);
    //   // ui
    //   // APP.Plugins.Clipboard.init();
    //   // APP.Plugins.InputFocuses.init();
    // };
    // All components from `src/componenets`
    // app.initComponents = function(fromPjax) {
    //   APP.Components.Header.init(fromPjax);
    //   APP.Components.Test.init();
    // };


    return app;
  }; // a.k.a. ready


  $(function () {
    APP.Initilizer().init();
  });
  $(window).on('load', function () {
    $.ready.then(function () {
      APP.Initilizer().onLoadTrigger();
    });
  });
})(jQuery, window.APP); //////////
// DETECTORS
//////////


(function ($, APP) {
  APP.Browser = function () {
    var methods = {};

    methods.isRetinaDisplay = function () {
      if (window.matchMedia) {
        var mq = window.matchMedia('only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)');
        return mq && mq.matches || window.devicePixelRatio > 1;
      }
    };

    methods.isMobile = function () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
      } else {
        return false;
      }
    };

    methods.isIosDevice = function () {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        return true;
      } else {
        return false;
      }
    };

    methods.msieversion = function () {
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf('MSIE ');

      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)) {
        return true;
      } else {
        return false;
      }
    };

    methods.setBodyTags = function () {
      $('body').addClass('is-ready');

      if (methods.msieversion()) {
        $('body').addClass('is-ie');
      }

      if (methods.isMobile()) {
        $('body').addClass('is-mobile');
      }

      if (methods.isIosDevice()) {
        $('html').addClass('is-ios');
      }
    };

    var data = {
      isIe: methods.msieversion(),
      isMobile: methods.isMobile(),
      isIosDevice: methods.isIosDevice(),
      isRetinaDisplay: methods.isRetinaDisplay()
    };
    return {
      data: data,
      methods: methods
    };
  };
})(jQuery, window.APP); //////////
// CICKS
//////////


(function ($, APP) {
  APP.Plugins.Clicks = {
    init: function init() {
      $(document).on('click', '[href="#"]', function (e) {
        e.preventDefault();
      }).on('click', '[js-link]', function (e) {
        var dataHref = $(this).data('href');

        if (dataHref && dataHref !== '#') {
          e.preventDefault();
          e.stopPropagation();
          Barba.Pjax.goTo(dataHref);
        }
      }) // prevent going the same link (if barba is connected)
      .on('click', 'a, [js-link]', function (e) {
        var href = $(this).data('href') || $(this).attr('href');
        var path = window.location.pathname;

        if (href === path.slice(1, path.length)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }) // scroll to section
      .on('click', 'a[href^="#section"]', function () {
        // section scroll
        var el = $(this).attr('href');
        var topTarget = $(el).offset().top; // $('body, html').animate({scrollTop: topTarget}, 1000);

        TweenLite.to(window, 1, {
          scrollTo: {
            y: topTarget,
            autoKill: false
          },
          ease: easingSwing
        });
        return false;
      }) // grid toggler
      .on('click', '[js-show-grid]', function () {
        $(this).toggleClass('is-active');
        $('.demo-grid').fadeToggle();
      });
    },
    destroy: function destroy() {// ... code ...
    }
  };
})(jQuery, window.APP); //////////////////////////////////
// HELPERS and PROTOTYPE FUNCTIONS
//////////////////////////////////
// LINEAR NORMALIZATION


function normalize(value, fromMin, fromMax, toMin, toMax) {
  var pct = (value - fromMin) / (fromMax - fromMin);
  var normalized = pct * (toMax - toMin) + toMin; //Cap output to min/max

  if (normalized > toMax) return toMax;
  if (normalized < toMin) return toMin;
  return normalized;
} // get window width (not to forget about ie, win, scrollbars, etc)


function getWindowWidth() {
  return window.innerWidth;
} // manually trigger events to start certain plugins


function triggerBody() {
  $(window).scroll();
  $(window).resize();
} // Format with spaces


function formatNumberWithSpaces(num) {
  return num.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
} // Add padding to numbers (a.k.a format by mask 00)
// use (9).pad(2) // output - 09


Number.prototype.pad = function (size) {
  var s = String(this);

  while (s.length < (size || 2)) {
    s = '0' + s;
  }

  return s;
}; // check if certain breakpoint was went through


function hasCrossedBreakpoint(prevResize, curWidth, targetBp) {
  if (curWidth >= targetBp && prevResize <= targetBp || curWidth <= targetBp && prevResize >= targetBp) {
    return true;
  }

  return false;
} // Plurize (russian)
// использование Plurize(number, 'пешеход', 'пешехода', 'пешеходов')
// автоматическая генерация как в английском не работает из-за склонений
// например "1 пешеход", "2 пешехода", "5 пешеходов"
// или "1 человек", "2 человека", "5 человек"  {1 и 5} - одиникавые


function Plurize(number, one, two, five) {
  var n = Math.abs(number);
  n %= 100;

  if (n >= 5 && n <= 20) {
    return five;
  }

  n %= 10;

  if (n === 1) {
    return one;
  }

  if (n >= 2 && n <= 4) {
    return two;
  }

  return five;
} // convert hex to rgba


function rgba(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
} // MEDIA Condition helper function


function mediaCondition(cond) {
  var disabledBp;
  var conditionMedia = cond.substring(1);
  var conditionPosition = cond.substring(0, 1);

  if (conditionPosition === '<') {
    disabledBp = getWindowWidth() < conditionMedia;
  } else if (conditionPosition === '>') {
    disabledBp = getWindowWidth() > conditionMedia;
  }

  return disabledBp;
} //////////
// LEGACY
//////////


(function ($, APP) {
  APP.Plugins.LegacySupport = {
    init: function init() {
      // svg support for laggy browsers
      svg4everybody();

      if (!APP.Browser().data.isIe) {
        // Viewport units buggyfill
        window.viewportUnitsBuggyfill.init({
          force: false,
          refreshDebounceWait: 150,
          appendToBody: true
        });
      }
    },
    fixImages: function fixImages() {
      if (APP.Browser().data.isIe) {
        // if LAZY LOAD is used, move initialization to afterFinishAll
        picturefill();
        objectFitImages();
      }
    }
  };
})(jQuery, window.APP); //////////
// BARBA PJAX
//////////


(function ($, APP) {
  APP.Plugins.Barba = {
    getData: function getData() {
      return this.data;
    },
    init: function init() {
      // config
      Barba.Pjax.Dom.containerClass = 'page';
      this.data = this.data || {};
      this.data.transitionInitElement = ''; // initilization path

      this.getTransition();
      Barba.Prefetch.init();
      Barba.Pjax.start();
      this.listenEvents();
    },
    getTransition: function getTransition() {
      // set barba transition
      var _this = this;

      Barba.Pjax.getTransition = function () {
        return _this.transitions.FadeTransition; // return _this.transitions.HideShowTransition;
        // when there are multiple transitions on project
        // if ( transitionInitElement ){
        //   if ( transitionInitElement.attr('data-transition') ){
        //     var transition = transitionInitElement.data('transition');
        //     // console.log(transition)
        //     // if ( transition === "project" ){
        //     //   return ProjectTransition
        //     // }
        //   }
        //   return FadeTransition;
        // } else {
        //   // first visit + back button (history is blank)
        //   window.location.href = Barba.HistoryManager.history[1].url
        // }
      };
    },
    transitions: {
      HideShowTransition: Barba.BaseTransition.extend({
        start: function start() {
          this.newContainerLoading.then(this.finish.bind(this));
        },
        finish: function finish() {
          document.body.scrollTop = 0;
          this.done();
        }
      }),
      FadeTransition: Barba.BaseTransition.extend({
        start: function start() {
          Promise.all([this.newContainerLoading, this.fadeOut()]).then(this.fadeIn.bind(this));
        },
        fadeOut: function fadeOut() {
          var _this = this;

          var $oldPage = $(this.oldContainer);
          var $newPage = $(this.newContainer);
          var deferred = Barba.Utils.deferred();
          TweenLite.to($oldPage, 0.5, {
            opacity: 0,
            ease: Power1.easeIn,
            onComplete: function onComplete() {
              deferred.resolve();
            }
          });
          return deferred.promise;
        },
        fadeIn: function fadeIn() {
          var _this = this;

          var $oldPage = $(this.oldContainer);
          var $newPage = $(this.newContainer);
          $(this.oldContainer).hide();
          $newPage.css({
            visibility: 'visible',
            opacity: 0
          });
          TweenLite.to(window, 0.15, {
            scrollTo: {
              y: 0,
              autoKill: false
            },
            ease: easingSwing
          });
          TweenLite.to($newPage, 0.5, {
            opacity: 1,
            ease: Power1.easeOut,
            onComplete: function onComplete() {
              _this.done();
            }
          });
        }
      })
    },
    listenEvents: function listenEvents() {
      // initialized transition
      var _this = this;

      Barba.Dispatcher.on('linkClicked', function (el) {
        _this.data.transitionInitElement = el instanceof jQuery ? el : $(el);
      }); // The new container has been loaded and injected in the wrapper.

      Barba.Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container, newPageRawHTML) {
        APP.Initilizer().newPageReady();
      }); // The transition has just finished and the old Container has been removed from the DOM.

      Barba.Dispatcher.on('transitionCompleted', function (currentStatus, oldStatus) {
        APP.Initilizer().transitionCompleted();
      });
    }
  };
})(jQuery, window.APP); //////////
// ScrollBlock
//////////
// disable / enable scroll by setting negative margin to page-content eq. to prev. scroll
// this methods helps to prevent page-jumping on setting body height to 100%


(function ($, APP) {
  APP.Plugins.ScrollBlock = {
    data: {
      y: _window.scrollTop(),
      blocked: false,
      direction: undefined,
      lastForScrollDir: 0,
      lastForBodyLock: 0,
      fillGapMethod: 'padding',
      scrolllDisabled: false
    },
    getData: function getData() {
      return this.data;
    },
    fillScrollbarGap: function fillScrollbarGap() {
      this.fillGapTarget($('.header').get(0));
      this.fillGapTarget(document.body);
    },
    unfillScrollbarGap: function unfillScrollbarGap() {
      this.unfillGapTarget($('.header').get(0));
      this.unfillGapTarget(document.body);
    },
    disableScroll: function disableScroll() {
      // prevent double lock
      if ($('body').is('.body-lock') || $('body').is('.body-m-lock')) return;
      if (this.data.scrolllDisabled) return;

      if (APP.Browser().data.isMobile) {
        // which elements are scrollable when scroll is locked?
        var $blockers = $('.blocker, .mobile-menu__scroller');

        if ($blockers.length > 0) {
          $blockers.each(function (i, el) {
            // disableBodyScroll(el);
            // lock(el);
            disablePageScroll(el);
          });
          this.data.scrolllDisabled = true;
          this.data.blocked = true; // APP.Dev.LogOnScreen.showLog('disablePageScroll (scoped)');

          $('body').addClass('body-m-lock');
        }
      } else {
        this.data.lastForBodyLock = _window.scrollTop();
        this.data.blocked = true;
        $('.page__content').css({
          'margin-top': '-' + this.data.lastForBodyLock + 'px'
        });
        this.fillScrollbarGap();
        $('body').addClass('body-lock');
      }
    },
    enableScroll: function enableScroll(target) {
      // console.log('enable', this.data.lastForBodyLock);
      if ($('.blocker').length) return;

      var _this = this;

      if (APP.Browser().data.isMobile) {
        // APP.Dev.LogOnScreen.showLog('enablePageScroll');
        clearQueueScrollLocks();
        enablePageScroll();
        this.data.scrolllDisabled = false;
        this.data.blocked = false;
        this.data.direction = 'up';
        $('body').removeClass('body-m-lock');
      } else {
        this.data.blocked = false;
        this.data.direction = 'up'; // keeps header

        $('.page__content').css({
          'margin-top': '-' + 0 + 'px'
        });
        this.unfillScrollbarGap();
        $('body').removeClass('body-lock');

        _window.scrollTop(this.data.lastForBodyLock);
      }
    },
    getWindowScroll: function getWindowScroll() {
      if (this.data.blocked) return;

      var wScroll = _window.scrollTop();

      this.data.y = wScroll;
      this.data.direction = wScroll > this.data.lastForScrollDir ? 'down' : 'up';
      this.data.lastForScrollDir = wScroll <= 0 ? 0 : wScroll;
      this.data.lastForBodyLock = wScroll;
    },
    listenScroll: function listenScroll() {
      _window.on('scroll', this.getWindowScroll.bind(this));
    },
    fillGapTarget: function fillGapTarget($target) {
      if ($target instanceof Node) {
        var scrollBarWidth;
        scrollBarWidth = this.getScrollBarWidth($target, true);
        var computedStyle = window.getComputedStyle($target);
        var fillGapMethod = this.data.fillGapMethod;

        if (fillGapMethod === 'margin') {
          var currentMargin = parseFloat(computedStyle.marginRight);
          $target.style.marginRight = "".concat(currentMargin + scrollBarWidth, "px");
        } else if (fillGapMethod === 'width') {
          $target.style.width = "calc(100% - ".concat(scrollBarWidth, "px)");
        } else if (fillGapMethod === 'max-width') {
          $target.style.maxWidth = "calc(100% - ".concat(scrollBarWidth, "px)");
        } else if (fillGapMethod === 'padding') {
          var currentPadding = parseFloat(computedStyle.paddingRight);
          $target.style.paddingRight = "".concat(currentPadding + scrollBarWidth, "px");
        }
      }
    },
    unfillGapTarget: function unfillGapTarget($target) {
      if ($target instanceof Node) {
        var fillGapMethod = this.data.fillGapMethod;

        if (fillGapMethod === 'margin') {
          $target.style.marginRight = '';
        } else if (fillGapMethod === 'width') {
          $target.style.width = '';
        } else if (fillGapMethod === 'max-width') {
          $target.style.maxWidth = '';
        } else if (fillGapMethod === 'padding') {
          $target.style.paddingRight = '';
        }
      }
    },
    getScrollBarWidth: function getScrollBarWidth($target) {
      if ($target instanceof Node) {
        var documentWidth = document.documentElement.clientWidth;
        var windowWidth = window.innerWidth;
        var currentWidth = windowWidth - documentWidth;
        return currentWidth;
      } else {
        return 0;
      }
    }
  };
})(jQuery, window.APP); //////////
// TELEPORT
//////////


(function ($, APP) {
  APP.Plugins.Teleport = {
    data: {
      teleports: []
    },
    init: function init() {
      this.getElements();
      this.teleport();
      this.listenResize();
    },
    getElements: function getElements() {
      var _this = this;

      var $teleports = $('.page').last().find('.js-teleport');
      _this.data.teleports = [];

      if ($teleports.length === 0) {
        return;
      }

      $teleports.each(function (i, tp) {
        var $el = $(tp);
        var $target = $('[data-teleport-target=' + $el.data('teleport-to') + ']');
        var conditionMedia = $el.data('teleport-condition').substring(1);
        var conditionPosition = $el.data('teleport-condition').substring(0, 1);

        _this.data.teleports.push({
          el: $el,
          html: $el.html(),
          target: $target,
          conditionMedia: conditionMedia,
          conditionPosition: conditionPosition
        });
      });
    },
    listenResize: function listenResize() {
      _window.on('resize', debounce(this.teleport.bind(this), 100));
    },
    teleport: function teleport() {
      if (this.data.teleports.length === 0) {
        return;
      }

      $.each(this.data.teleports, function (i, obj) {
        if (obj.target && obj.html && obj.conditionPosition) {
          var condition;

          if (obj.conditionPosition === '<') {
            condition = window.innerWidth <= obj.conditionMedia;
          } else if (obj.conditionPosition === '>') {
            condition = window.innerWidth >= obj.conditionMedia;
          }

          if (condition) {
            obj.target.html(obj.html);
            obj.el.html('');
          } else {
            obj.el.html(obj.html);
            obj.target.html('');
          }
        }
      }); // re-init sliders and other components
      // APP.Plugins.Sliders.reinit();
    }
  };
})(jQuery, window.APP);

(function ($, APP) {
  APP.Dev.Breakpoint = {
    setBreakpoint: function setBreakpoint() {
      var wHost = window.location.host.toLowerCase();
      var displayCondition = wHost.indexOf('localhost') >= 0 || wHost.indexOf('surge') >= 0 || wHost.indexOf('netlify') >= 0;

      if (displayCondition) {
        var wWidth = window.innerWidth;

        var wHeight = _window.height();

        var content = "<div class='dev-bp-debug'>" + wWidth + ' x ' + wHeight + '</div>';
        $('.page').append(content);
        setTimeout(function () {
          $('.dev-bp-debug').fadeOut();
        }, 1000);
        setTimeout(function () {
          $('.dev-bp-debug').remove();
        }, 1500);
      }
    },
    listenResize: function listenResize() {
      $(window).on('resize', debounce(this.setBreakpoint, 200));
    }
  };
})(jQuery, window.APP);

(function ($, APP) {
  APP.Dev.Credentials = {
    logCredentials: function logCredentials() {
      // eslint-disable-next-line
      console.log('👨‍💻 MADE WITH LOVE BY <> KHMELEVSKOY & ASSOCIATES </> https://khmelevskoy.co');
    }
  };
})(jQuery, window.APP);

(function ($, APP) {
  APP.Dev.LogOnScreen = {
    showLog: function showLog(message) {
      var wHost = window.location.host.toLowerCase();
      var displayCondition = wHost.indexOf('localhost') >= 0 || wHost.indexOf('surge') >= 0 || wHost.indexOf('netlify') >= 0;

      if (displayCondition) {
        var content = "<div class='dev-bp-debug'>" + message + '</div>';
        $('.page').append(content);
        setTimeout(function () {
          $('.dev-bp-debug').fadeOut();
        }, 1000);
        setTimeout(function () {
          $('.dev-bp-debug').remove();
        }, 1500);
      }
    }
  };
})(jQuery, window.APP);

function sayHello() {
  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    var args = ['\n %c Made with ❤️ by alchimic %c ----/ %c %c 🐳 \n\n', 'border: 1px solid #000;color: #000; background: #fff001; padding:5px 0;', 'color: #fff; background: #1c1c1c; padding:5px 0;border: 1px solid #000;', 'background: #fff; padding:5px 0;', 'color: #b0976d; background: #fff; padding:5px 0;'];
    window.console.log.apply(console, args);
  } else if (window.console) {
    window.console.log('Made with love ❤️  ❤️');
  }
}

module.exports = sayHello; //////////
// MASKS
//////////

(function ($, APP) {
  APP.Plugins.Masks = {
    init: function init() {
      $('[js-dateMask]').mask('99.99.99', {
        placeholder: 'ДД.ММ.ГГ'
      });
      $("input[type='tel']").mask('+7 (000) 000-0000', {
        placeholder: '+7 (___) ___-____'
      });
    }
  };
})(jQuery, window.APP); ////////////////////
// SELECTRIC PLUGIN
////////////////////


(function ($, APP) {
  APP.Plugins.Selectric = {
    init: function init() {
      var $select = $('[js-select]');
      if ($select.length === 0) return;
      $select.selectric({
        maxHeight: 300,
        disableOnMobile: false,
        nativeOnMobile: true,
        arrowButtonMarkup: '<b class="button"><svg class="ico ico-select-down"><use xlink:href="img/sprite.svg#ico-select-down"></use></svg></b>',
        onInit: function onInit(element, data) {
          var $elm = $(element),
              $wrapper = $elm.closest('.' + data.classes.wrapper);
          $wrapper.find('.label').html($elm.attr('placeholder'));
        },
        onBeforeOpen: function onBeforeOpen(element, data) {
          var $elm = $(element),
              $wrapper = $elm.closest('.' + data.classes.wrapper);
          $wrapper.find('.label').data('value', $wrapper.find('.label').html()).html($elm.attr('placeholder'));
        },
        onBeforeClose: function onBeforeClose(element, data) {
          var $elm = $(element),
              $wrapper = $elm.closest('.' + data.classes.wrapper);
          $wrapper.find('.label').html($wrapper.find('.label').data('value'));
        }
      });
    }
  };
})(jQuery, window.APP);

(function ($, APP) {
  APP.Plugins.TextareaAutoExpand = {
    init: function init() {
      // textarea autoExpand
      _document.one('focus.autoExpand', '.ui-group textarea', function () {
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
      }).on('input.autoExpand', '.ui-group textarea', function () {
        var minRows = this.getAttribute('data-min-rows') | 0,
            rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
      });
    }
  };
})(jQuery, window.APP);