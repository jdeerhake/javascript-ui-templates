/*global GS, jQuery*/

var NS = NS || {};

NS.ui.modal = (function() {

  var tmpl = {
    overlay : GS.template("<div class='modal_overlay'></div>"),
    box : GS.template("<div class='modal_box'>{{content}}</div>")
  };

  return function(conf) {
    var settings = jQuery.extend({
      fadeTime : 300,
      onShow : function() {},
      onHide : function() {},
      showOnCreate : true,
      timeout : false
    }, conf),
    content = settings.content,
    body = jQuery("body"),
    isOpen = false,
    box, overlay;


    var center = function(el) {
      // This won't work if the element is hidden
      el.css({
        position : "absolute",
        top : "50%",
        left : "50%",
        marginTop : el.outerHeight() / -2,
        marginLeft : el.outerWidth() / -2
      });
    },
    create = function() {
      overlay = jQuery(tmpl.overlay()).hide().appendTo(body);
      box = jQuery(tmpl.box({ content : content })).appendTo(overlay);
    };

    var pub = {
      destroy : function() {
        overlay.remove();
      },
      show : function() {
        isOpen = true;
        overlay.fadeIn(settings.fadeTime, settings.onShow);
        center(box);
      },
      hide : function() {
        isOpen = false;
        overlay.fadeOut(settings.fadeTime, settings.onHide);
      },
      isOpen : function() {
        return isOpen;
      }
    };


    (function() {
      create();

      overlay.bind("click", pub.hide);

      if(settings.showOnCreate) {
        pub.show();
      }

      if(settings.timeout) {
        setTimeout(pub.hide, settings.timeout);
      }

    }());

    return pub;
  };
}());

/**********************
 * Usage
 **********************/

var myModal = NS.ui.modal({
  fadeTime : 100,
  timeout : 5000,
  showOnCreate : false,
  onHide : function() {
    console.log("Modal hidden");
  }
});

myModal.show();

jQuery("#close_button").bind("click", myModal.hide);


/**********************
 * Suggested CSS
 **********************

.modal_overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9001;
  background: rgba(0,0,0,0.8);
}

.modal_box {
  background: #fff;
  padding: 20px;
  position: absolute;
}

*/

