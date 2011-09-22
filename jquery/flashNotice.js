/*global NS, jQuery*/

var NS = NS || {};
NS.ui = NS.ui || {};

NS.ui.flashNotice = (function() {
  var notices = [],
    container,
    TIMEOUT = 5000,
    ANIMATION_TIME = 300;


  var tmpl = {
    container : template("<div id='flash_notices'></div>"),
    notice : template("<div class='flash_notice {{type}}'><span class='icon'></span>{{content}}</div>"),
    close : template("<span class='close'>Close</span>")
  };

  function createContainer() {
    container = tmpl.container().appendTo("body");
  }

  function template(string) {
    return function(obj) {
      return jQuery(Mustache.to_html(string, obj));
    }
  }



  return function(conf) {
    var settings = jQuery.extend({
      type : "success"
    }, conf),
    noticeEl,
    index;

    function create() {
      noticeEl = tmpl.notice({ type : settings.type, content : settings.message });

      tmpl.close().bind("click", pub.hide).appendTo(noticeEl);

      noticeEl
        .prependTo(container)
        .css("margin-top", -1 * noticeEl.outerHeight());
    }

    var pub = {
      show : function() {
        noticeEl.animate({ "margin-top" : 0 }, ANIMATION_TIME, function() {
          if(typeof settings.onShow === "function") settings.onShow();
        });
        if(settings.timeout) setTimeout(pub.hide, settings.timeout);
      },
      hide : function() {
        noticeEl.slideUp(ANIMATION_TIME, function() {
          noticeEl.remove();
          if(typeof settings.onHide === "function") settings.onHide();
        });
      }
    };


    return (function() {
      if(settings.timeout === undefined) {
        settings.timeout = settings.type === "error" ? 0 : TIMEOUT;
      }

      if(!container) createContainer();

      create();
      pub.show();

      return pub;
    }());
  };
}());

/**********************
 * Usage
 **********************/

NS.ui.flashNotice({
  message : "This is an error message!",
  type : "error",
  timeout : 5000, //MS, zero to disable auto-dismiss
  onShow : function() {},
  onHide : function() {}
});



/**********************
 * Basic CSS
 **********************/

/*
.flash_notices {
  width: 960px;
  margin: 0 auto;
  position: fixed;
  top: 0;
  left: 50%;
  margin-left: -480px;
}

.flash_notice.error {
  color: red;
}

.flash_notice.error .icon {
  width: 10px;
  height: 10px;
  background: url("error.png");
}

.flash_notice.info {}

.flash_notice.success {}

*/

