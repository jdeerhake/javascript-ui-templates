/*global NS, jQuery*/

var NS = NS || {};
NS.ui = NS.ui || {};

NS.ui.timer = (function() {


  var tmpl = {
    digitGroup : "<span class='{{type}}'></span>",
    digit : "<span>{{number}}</span>"
  };

  // Takes a member of tmpl (string), an object to fill it, and (optionally) a
  // jQuery object to append the result to.
  function jqTemplate(template, obj, append) {
    var el = jQuery(Mustache.to_html(tmpl[template], obj));
    if(append) {
      return el.appendTo(append);
    } else {
      return el;
    }
  }

  // Simplistic zero fill function that fills to 2 digits
  function zeroFill(str) {
    str = str.toString();
    if(str.length >= 2) return str;
    if(str.length === 1) return "0" + str;
    else return "00";
  }

  // Takes seconds and converts them to an object representing hours, mins, and secs
  function secondsToTime(s) {
    return {
      s : zeroFill(s % 60),
      m : zeroFill(Math.floor(s / 60) % 60),
      h : zeroFill(Math.floor(s / 3600))
    };
  }

  // Wraps individual digits in a 2 digit string in spans and appends them to container
  function wrapDigits(digits, container) {
    container.html("");
    jqTemplate("digit", { number : digits[0]}, container);
    jqTemplate("digit", { number : digits[1]}, container);
  }

  // Get current time from system and convert it to seconds
  function systemTimeInSeconds() {
    return Math.round((new Date()).getTime() / 1000);
  }

  return function(conf) {
    var settings = jQuery.extend({
      direction : "down",
      startAt : 0,
      endAt : 0,
      autoStart : true,
      onStart : function() {},
      onEnd : function() {},
      onTick : function() {},
      container : document.getElementsByTagName("body")[0]
    }, conf),
    currentSeconds = settings.startAt,
    currentTime = secondsToTime(currentSeconds),
    startingSystemTime = systemTimeInSeconds(),
    timer = {
      h : jqTemplate("digitGroup", { type : "h" }, settings.container),
      m : jqTemplate("digitGroup", { type : "m" }, settings.container),
      s : jqTemplate("digitGroup", { type : "s" }, settings.container)
    },
    multiplier = settings.direction === "up" ? 1 : -1,
    interval;

    // Updates UI to reflect given time object (h,m,s).
    // Will only update values that have changed
    function updateTimer(time, force) {
      for(type in time) {
        if(time.hasOwnProperty(type) && (time[type] !== currentTime[type] || force)) {
          wrapDigits(time[type], timer[type]);
        }
      }
      currentTime = time;
    }

    // Determines if timer should stop based on config parameters
    function isEnded() {
      var s = currentSeconds,
        dir = settings.direction;
      if((dir === "up" && s >= settings.endAt) ||
         (dir === "down" && s <= settings.endAt)) {
        return true;
      } else {
        return false;
      }
    }

    // Determine how much time has passed and update UI accordingly.
    // Stop timer if necessary.
    function tick() {
      var newTime;

      currentSeconds = settings.startAt + delta();
      newTime = secondsToTime(currentSeconds);

      settings.onTick(currentSeconds);

      updateTimer(newTime);

      if(isEnded()) {
        clearInterval(interval);
        settings.onEnd();
      }
    }

    // Returns the number of seconds that have passed since the timer was started
    function delta() {
      currentSystemTime = systemTimeInSeconds();

      return (currentSystemTime - startingSystemTime) * multiplier;
    }

    var pub = {
      start : function() {
        if(!interval) {
          startingSystemTime = systemTimeInSeconds();
          interval = setInterval(tick, 1000);
          tick();
          settings.onStart();
        }
      },
      stop : function() {
        if(interval) {
          clearInterval(interval);
          settings.startAt += delta();
          interval = null;
        }
      },
      getTime : function() {
        return currentSeconds;
      },
      timeLeft : function() {
        if(settings.direction === "up") {
          return settings.endAt - currentSeconds;
        } else {
          return currentSeconds - settings.endAt;
        }
      }
    };

    (function() {

      if(settings.autoStart) {
        interval = setInterval(tick, 1000);
        settings.onStart();
      }

      updateTimer(currentTime, true);

    }());

    return pub;
  };
}());


/**********************
 * Usage
 **********************/

var timer = NS.ui.timer({
  startAt: 20,
  container: jQuery("#timer"),
  onTick : function(s) { console.log("Time left: " + s); },
  onEnd : function() { console.log("All over"); },
  onStart : function() { console.log("Started"); }
});


/**********************
 * Basic CSS
 **********************/

/*
#timer .h, #timer .m, #timer .s {
  margin: 0 2px;
}

#timer .h:after, #timer .m:after {
  content: ":";
  position: relative;
  left: 2px;
}
*/

