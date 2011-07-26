/*global NS, jQuery*/

var NS = NS || {};
NS.ui = NS.ui || {};

NS.ui.modal = (function() {

  var tmpl = {
    overlay : "<div class='modal_overlay'></div>",
    box : "<div class='modal_box'>{{{content}}}</div>"
  };

  //Takes a member of tmpl (string), an object to fill it, and (optionally) a
  //jQuery object to append the result to.
  function jqTemplate(template, obj, append) {
    var el = jQuery(Mustache.to_html(tmpl[template], obj));
    if(append) {
      return el.appendTo(append);
    } else {
      return el;
    }
  }


  // Centers given element within its parent
  // This won't work if the element is hidden
  function center(el) {
    el.css({
      position : "absolute",
      top : "50%",
      left : "50%",
      marginTop : el.outerHeight() / -2,
      marginLeft : el.outerWidth() / -2
    });
  }

  return function(conf) {
    var settings = jQuery.extend({
      fadeTime : 300,
      onShow : function() {},
      onHide : function() {},
      autoShow : true,
      timeout : false
    }, conf),
    content = settings.content,
    body = jQuery("body"),
    isOpen = false,
    box, overlay;

    // Create necessary elements for modal
    function create() {
      overlay = jqTemplate("overlay", {}, body).hide();
      box = jqTemplate("box", { content : content }, overlay);
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

      overlay.bind("click", function(ev) {
        // Prevent bubbling
        if(ev.target.className === "modal_overlay") pub.hide();
      });

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
  autoShow : false,
  onHide : function() {
    console.log("Modal hidden");
  },
  content : "<p>Hi there</p><div class='close_button'></div>"
});

jQuery("button").click(myModal.show);
jQuery(".close_button").live("click", myModal.hide);


/**********************
 * Basic CSS
 **********************/

/*
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

