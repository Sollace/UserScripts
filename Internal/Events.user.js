// ==UserScript==
// @name        Fimfiction Events API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.3
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==

function RunScript(func, mustCall, params) {
  var scr = document.createElement('SCRIPT');
  if (mustCall) {
    if (params) {
      var pars = [];
      for (var i = 2; i < arguments.length; i++) {
        pars.push(arguments[i]);
      }
      scr.innerHTML = '(' + func.toString() + ').apply(this, ' + JSON.stringify(pars) + ');';
    } else {
      scr.innerHTML = '(' + func.toString() + ')();';
    }
  } else {
    scr.innerHTML = func.toString();
  }
  document.body.appendChild(scr);
  scr.parentNode.removeChild(scr);
};
RunScript.toString = (function() {
  var result = function toString() {
    return 'function ' + this.name + '() {\n  [native code]\n}';
  }
  result.toString = result;
  return result;
})();

(function (win) {
  var ver = 1.4;
  var startup =
      (typeof (FimFicEvents) === 'undefined') && (typeof (win.FimFicEvents) === 'undefined') &&
      (win == window || (typeof (window.FimFicEvents) === 'undefined'));
  if (typeof (win.FimFicEvents) === 'undefined' || win.FimFicEvents.version() < ver) {
    RunScript(function(ver) {
      window.FimFicEvents = {
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
          if (typeof(url) == 'string') {
            switch (url){
              case '/ajax/fetch_comments.php': return {'eventName': 'pagechange'};
              case '/ajax/edit_comment.php': return {'eventName': 'editcomment'};
              case '/ajax/preview_comment.php': return {'eventName': 'previewcomment'};
              case '/ajax/add_comment.php': return {'eventName': 'addcomment'};
              case '/compose_private_message.php': return {'eventName':'composepm'};
            }
            if (url.indexOf('/ajax/get_module_edit.php?box=') == 0) {
              return {'eventName': 'editmodule', 'box':url.split('&')[0].split('?')[1].split('=')[1]};
            }
            if (url.indexOf('/ajax/infocard_user.php') == 0) {
              return {'eventName': 'infocard', 'user':url.split('&')[0].split('?name=')[1]};
            }
            return null;
          }
        },
        'toString': function() {
          return '[object API] {\n  version() -> number\n  on(name, func) -> undefined\n  off(name, event)\n  trigger(name, eventObject)\n  getEventName(url) -> string\n}';
        }
      };
      for (var i in window.FimFicEvents) {
        window.FimFicEvents[i].toString = RunScript.toString;
      }
      window.FimFicEvents.version.toString = function() {
        return this();
      }
    }, true, ver);
  }
  if (window != win) {
    window.FimFicEvents = {
      'on': function(name, func) {
        return $(document).on(name, func);
      },
      'off': function(name, event) {
        $(document).off(name, event);
      },
      'trigger': function(name, e) {
        $(document).trigger(name, e);
      },
      'getEventName': function(url) {
        return win.FimFicEvents.getEventName(url);
      },
      'version': function() {
        return win.FimFicEvents.version();
      },
      'toString': win.FimFicEvents.toString
    }
    for (var i in window.FimFicEvents) {
      window.FimFicEvents[i].toString = RunScript.toString;
    }
    window.FimFicEvents.version.toString = function() {
      return this();
    }
  }

  if (startup) {
    RunScript(function() {
      var original = window.AjaxRequest;
      window.AjaxRequest = function(a) {
        var event = window.FimFicEvents.getEventName(a.url);
        if (event != null) {
          event.url = a.url;
          event.data = a.data;
          var __success = null;
          if (a['success']) {
            __success = a.success;
          }
          a.success = function() {
            event.result = arguments[0];
            window.FimFicEvents.trigger('before' + event.eventName, event);
            arguments[0] = event.result;
            if (__success != null) {
              __success.apply(this,arguments);
            }
            event.result = arguments[0];
            window.FimFicEvents.trigger('after' + event.eventName, event);
          };
        }
        return original.prototype.constructor.apply(this, [a]);
      }
      for (var i in original) {
        window.AjaxRequest[i] = original[i];
      }
      window.$.ajax = (function() {
        var __ajax = window.$.ajax;
        return function(param, n) {
          var event = window.FimFicEvents.getEventName(param.url);
          if (event != null) {
            event.url = param.url;
            event.data = param.data;
            var __success = param.success;
            param.success = function() {
              event.result = arguments[0];
              window.FimFicEvents.trigger('before' + event.eventName, event);
              arguments[0] = event.result;
              if (__success != null) {
                __success.apply(this,arguments);
              }
            };
            var __complete = param.complete;
            param.complete = function() {
              if (__complete != null) {
                __complete.apply(this,arguments);
              }
              event.result = arguments[0];
              window.FimFicEvents.trigger('after' + event.eventName, event);
              arguments[0] = event.result;
            };
          }
          return __ajax(param, n);
        };
      })();
    },true);
  }
})(typeof (unsafeWindow) !== 'undefined' && unsafeWindow != window ? unsafeWindow : window);