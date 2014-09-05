// ==UserScript==
// @name        Fimfiction Events API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.0
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==

(function (win) {
  var ver = 1.0;
  var startup =
      (typeof (FimFicEvents) === 'undefined') && (typeof (win.FimFicEvents) === 'undefined') &&
      (win == window || (typeof (window.FimFicEvents) === 'undefined'));
  if (typeof (win.FimFicEvents) === 'undefined' || win.FimFicEvents.version() < ver) {
    win.FimFicEvents = {
      'version': function() {
        return ver;
      },
      'on': function(name, func) {
        $(document).on(name,func);
      },
      'off': function(name, event) {
        $(document).off(name,event);
      },
      'trigger': function(name, e) {
        $(document).trigger(name, [e]);
      },
      'getEventName': function(url) {
        switch (url){
          case '/ajax/fetch_comments.php': return {'eventName': 'pagechange'};
          case '/ajax/edit_comment.php': return {'eventName': 'editcomment'};
          case '/ajax/preview_comment.php': return {'eventName': 'previewcomment'};
        }
        if (url.indexOf('/ajax/get_module_edit.php?box=') == 0) {
          return {'eventName': 'editmodule', 'box':url.split('&')[0].split('?')[1].split('=')[1]};
        }
        return null;
      }
    };
  }
  if (win != window) {
    window.FimFicEvents = {
      'on': function() {
        return win.FimFicEvents.on(name, func);
      },
      'off': function(name, event) {
        win.FimFicEvents.off(name, event);
      },
      'trigger': function(name, e) {
        win.FimFicEvents.trigger(name, e);
      },
      'getEventName': function(url) {
        return win.FimFicEvents.getEventname(url);
      }
    }
  }
  function getSplitData(data) {
    data = data.split('&');
    var result = {};
    for (var i = 0; i < data.length; i++) {
      result[data[i].split('=')[0]] = data[i].split('=')[data[i].split('=').length > 1 ? 1 : 0];
    }
    return result;
  }
  
  if (startup) {
    win.$.ajax = (function() {
      win.$.__ajax = win.$.ajax;
      return function(param) {
        var event = win.FimFicEvents.getEventName(param.url);
        if (event != null) {
          var __success = param.success;
          param.success = function() {
            event.result = arguments[0];
            event.data = getSplitData(param.data);
            win.FimFicEvents.trigger('before' + event.eventName, event);
            arguments[0] = event.result;
            __success.apply(this,argumants);
            win.FimFicEvents.trigger('after' + event.eventName, event);
          };
        }
        win.$.__ajax(param);
      };
    })();
})(typeof (unsafeWindow) !== 'undefined' && unsafeWindow != window ? unsafeWindow : window);