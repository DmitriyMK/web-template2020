
sayHello();

alert('a');
function asd(){}
if(1==2) {

}



// PRE-initialization
var APP = window.APP || {};
APP.Plugins = APP.Plugins || {};


// shorthand operators
var _window = $(window);
var _document = $(document);
var easingSwing = [0.02, 0.01, 0.47, 1]; // default jQuery easing

(function ($, APP) {
  APP.Initilizer = function () {
    var app = {};

    app.init = function () {
      app.initPlugins();
    };



    // Plugins which depends on DOM and page content
    app.initPlugins = function (fromPjax) {
      // APP.Plugins.Modals.init();
      // APP.Plugins.Masks.init();
      // APP.Plugins.Selectric.init();
      // APP.Plugins.LazyLoadImages.init();
      // APP.Plugins.TextareaAutoExpand.init();
      // APP.Plugins.Validations.init();
      // APP.Plugins.LegacySupport.fixImages();
    };


    return app;
  };


  // a.k.a. ready
  $(function () {
    APP.Initilizer().init();
  });

  // $(window).on('load', function () {
  //   $.ready.then(function () {
  //     APP.Initilizer().onLoadTrigger();
  //   });
  // });
})(jQuery, window.APP);

