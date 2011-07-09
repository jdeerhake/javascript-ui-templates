/* Globals declaration to make JSLint happy */
/*global GS, jQuery*/

/* NS is the namespace used in your app.  I put all gadget functions under the ui property */
NS.ui. = (function() {

  /* Class vars - available to and modifiable by each instance of the gadget */
  var instances = [];

  /* Templates */
  var tmpl = {
    overlay : GS.template("<div class='modal_overlay'></div>"),
    box : GS.template("<div class='modal_box'>{{content}}</div>")
  };

  /* Everything above this line will get executed on every page load, so it should be very very light and should not use jQuery selectors or touch the DOM in any way */
  /* Also you have no access to instance vars up here because of how JS minification/obfuscation works */
  return function(conf) {
    /* Instance vars - unique for each instance */
    var settings = jQuery.extend({
      /* Configuration defaults */
      fadeTime : 300,
      timeout : false
    }, conf),
    box, overlay;


    /* Private methods - callable only internally */
    var doSomething = function(el) {
      var foo = "bar";
      return foo;
    },
    doSomethingElse = function() {
      return "foo";
    };


    /* Public methods and vars - exposed via a returned object */
    var pub = {
      create : function() {
        return "something";
      }
    };

    /* Constructor function - called when you instantiate a gadget */
    (function() {
      overlay.bind("click", pub.hide);

      if(settings.timeout) {
        setTimeout(pub.hide, settings.timeout);
      }

    }());

    /* This has to return pub if you want the public methods to be accesible */
    return pub;
  };
}());

