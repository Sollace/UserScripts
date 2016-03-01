// ==UserScript==
// @name        Fimfiction Events API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.5.3
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==

function RunScript(func, mustCall, params) {
  if (!document.body) {
    var _ready = document.onready;
    document.onready = function() {
      RunScript(func, mustCall, params);
      if (typeof _ready === 'function') {
        _ready.apply(this, arguments);
      }
    }
  } else {
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
  }
};
RunScript.toString = (function() {
  var result = function toString() {
    return 'function ' + this.name + '() {\n  [native code]\n}';
  }
  result.toString = result;
  return result;
})();
RunScript.build = function(functionText) {
  return {
    run: function(mustCall) {
      if (!document.body) {
        var me = this;
        var _ready = document.onready;
        document.onready = function() {
          me.run(mustCall);
          if (typeof _ready === 'function') {
            _ready.apply(this, arguments);
          }
        }
      } else {
        var scr = document.createElement('SCRIPT');
        if (mustCall) {
          scr.innerHTML = '(' + functionText + ')();';
        } else {
          scr.innerHTML = functionText;
        }
        document.body.appendChild(scr);
        scr.parentNode.removeChild(scr);
      }
    }
  }
};

(function (win) {
  var ver = 1.53;
  var startup =
      (typeof (FimFicEvents) === 'undefined') && (typeof (win.FimFicEvents) === 'undefined') &&
      (win == window || (typeof (window.FimFicEvents) === 'undefined'));
  if (typeof (win.FimFicEvents) === 'undefined' || win.FimFicEvents.version() < ver) {
    var scriptBody = function(ver) {
      var eventRegister = null;
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
        'trigger': function(name, event) {
          $(document).trigger(name, [event]);
        },
        'subscribe': function(evFunc) {
          if (eventRegister) {
            var old = eventRegister;
            eventRegister = function(url) {
              var e = evFunc(url);
              return e || old(url);
            };
          } else {
            eventRegister = evFunc;
          }
        },
        'getEventName': function(url) {
          if (typeof(url) == 'string') {
            switch (url){
              case '/ajax/comments/preview': return {'eventName': 'previewcomment'};
              case '/ajax/users/infocard': return {'eventName': 'infocard', 'user': /^\/user\/([^\/]*)$/.exec($('a:hover').attr('href'))[1].replace(/ /,'%20')}
              case '/ajax/notifications/mark-all-read': return {'eventName':'note_markread'};
              case '/ajax/private-messages/mark-all-read': return {'eventName':'pm_markread'};
            }
            if (url.indexOf('/ajax/private-messages/new?receiver=') == 0) {
              var split = url.split('?').reverse()[0];
              var event = {'eventName': 'composepm', 'recipient': '', 'subject': ''};
              if (split.indexOf('receiver=') != -1) event.recipient = split.split('receiver=').reverse()[0].split('&')[0];
              if (split.indexOf('subject=') != -1) event.subject = split.split('subject=').reverse()[0].split('&')[0];
              return event;
            }
            if (url.indexOf('/ajax/comments/') == 0) {
              var split = url.split('/');
              if (split.length == 5) return {'eventName': 'editcomment'};
              return {'eventName': 'pagechange'};
            }
            if (url.match(/^\/ajax\/(users|blog_posts|stories|group_thread)/g)) {
              var split = url.split('/').reverse();
              if (split[0] == 'comments') return 'addcomment';
            }
            if (url.indexOf('/ajax/users/modules/') == 0) {
              var split = url.split('/').reverse();
              if (split[0] == 'edit') {
                return {'eventName': 'editmodule', 'box':split[1]};
              }
            }
            if (eventRegister) return eventRegister(url);
            return null;
          }
        },
        'toString': function() {
          return '[object API] {\n  version() -> number\n  on(name, func($event, eventObject)) -> undefined\n  off(name, fun($event, eventObject)) -> undefined\n  trigger(name, eventObject)\n  getEventName(url) -> string\n  subscribe(func(url) -> eventObject) -> undefined\n}';
        }
      };
      var toStringFunc = function toString() {
        return 'function ' + this.name + '() {\n  [native code]\n}';
      };
      toStringFunc.toString = toStringFunc;
      for (var i in window.FimFicEvents) {
        window.FimFicEvents[i].toString = toStringFunc;
      }
      window.FimFicEvents.version.toString = function() {
        return this();
      }
    }
    if (window != win) {
      RunScript(scriptBody, true, ver);
    } else {
      scriptBody(ver);
    }
  }
  if (window != win) {
    window.FimFicEvents = {
      'on': function(name, func) {
        RunScript.build('function() {FimFicEvents.on("' + name + '", (' + func.toString() + '));}').run(true);
      },
      'off': function(name, event) {
        RunScript.build('function() {FimFicEvents.off("' + name + '", ' + JSON.stringify(event) + ');}').run(true);
      },
      'trigger': function(name, e) {
        RunScript.build('function() {FimFicEvents.trigger("' + name + '", ' + JSON.stringify(e) + ');}').run(true);
      },
      'subscribe': function(func) {
        RunScript.build('function() {FimFicEvents.subscribe(' + func.toString() + ');}').run(true);
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
    var injected = function() {
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
    }
    RunScript(injected,true);
  }
})(typeof (unsafeWindow) !== 'undefined' && unsafeWindow != window ? unsafeWindow : window);