// ==UserScript==
// @name        Fimfiction Events API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.6.2
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
  var ver = 1.6;
  var startup =
      (typeof (FimFicEvents) === 'undefined') && (typeof (win.FimFicEvents) === 'undefined') &&
      (win == window || (typeof (window.FimFicEvents) === 'undefined'));
  if (typeof (win.FimFicEvents) === 'undefined' || win.FimFicEvents.version() < ver) {
    var scriptBody = function(ver) {
      var eventRegister = null;
			var eventMap = {
				'/ajax/comments/preview': 'previewcomment',
				'/ajax/users/infocard': function(url) {
					 return {
						'eventName': 'infocard',
						'user': /^\/user\/([^\/]*)$/.exec($('a:hover').attr('href'))[1].replace(/ /,'%20')
					};
				},
				'/ajax/notifications/mark-all-read': 'note_markread',
				'/ajax/private-messages/mark-all-read': 'pm_markread',
				'/ajax/notifications/list/drop-down': 'listnotes',
				'/ajax/private-messages/list/drop-down': 'listpms',
				'/ajax/feed': 'loadfeed',
				'/ajax/emoticons/list': 'listemoticons'
			};
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
              return evFunc(url) || old(url);
            };
          } else {
            eventRegister = evFunc;
          }
        },
        'setLogging': function() {
          this.logging = 1;
        },
        'PROXY': function(sender, func, args, m) {
          var a = args[0];
          if (typeof a === 'string') {
            a = args[0] = {url: a};
          }
          var l = this.logging;
          if (l) console.log('request: ' + a.url);
          var event = this.getEventName(a.url);
          if (event != null) {
            if (l) console.log('event: ' + event.eventName);
            event.url = a.url;
            event.data = a.data;
            var __success = a['success'] ? a.success : null;
            a.success = function() {
              try {
                var result = undefined;
                if (l) console.log('success (before): ' + arguments[0]);
                event.result = arguments[0];
                window.FimFicEvents.trigger('before' + event.eventName, event);
                if (event.result) arguments[0] = event.result;
                if (l) console.log('success (after): ' + arguments[0]);
                if (__success) {
                  result = __success.apply(this,arguments);
                  if (l) console.log('success (result): ' + result);
                }
                event.result = arguments[0];
                if (!m) window.FimFicEvents.trigger('after' + event.eventName, event);
                return result;
              } catch (e) {
                console.log('success (error): version=' + this.version());
                console.log('success (error): url=' + a.url);
                console.log('success (error): event=' + (event ? event.eventName : 'undefined'));
                console.log('success (error): ' + e);
              }
            };
            if (m) {
              var __complete = a['complete'] ? a.complete : null;
              a.complete = function() {
                var result = undefined;
                try {
                  if (l) console.log('complete (before): ' + arguments[0]);
                  if (__complete) {
                    result = __complete.apply(this,arguments);
                    if (l) console.log('complete (result): ' + result);
                  }
                  event.result = arguments[0];
                  window.FimFicEvents.trigger('after' + event.eventName, event);
                  if (l) console.log('complete (after): ' + arguments[0]);
                } catch (e) {
                  console.log('complete (error): version=' + this.version());
                  console.log('complete (error): url=' + a.url);
                  console.log('complete (error): event=' + (event ? event.eventName : 'undefined'));
                  console.log('complete (error): ' + e);
                }
                return result;
              };
            }
          }
          return func.apply(sender, args);
        },
        'getEventName': function(url) {
          if (typeof(url) == 'string') {
						if (eventMap[url]) {
							if (typeof(eventMap[url]) == 'string') {
								return {'eventName': eventMap[url]};
							}
							return eventMap[url](url);
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
              if (split[0] == 'comments') return {'eventName': 'addcomment'};
            }
            if (url.indexOf('/ajax/users/modules/') == 0) {
              var split = url.split('/').reverse();
              if (split[0] == 'edit') {
                return {'eventName': 'editmodule', 'box':split[1]};
              }
            }
            if (eventRegister) return eventRegister(url);
          }
          return null;
        },
        'toString': function() {
          return '[object API] {\n  version() -> number\n  setLogging()\n  on(name, func($event, eventObject))\n  off(name, func($event, eventObject))\n  trigger(name, eventObject)\n  getEventName(url) -> string\n  setLogging()\n  subscribe(func(url) -> eventObject)\n}';
        },
        'toSource': function() {
          return 'FimFicEvents';
        }
      };
      var toStringFunc = function toString() {
        return 'function ' + this.name + '() {\n  [native code]\n}';
      };
      var toSourceFunc = function toSource() {
        return '(' + this.toString() + ')';
      }
      toSourceFunc.toString = toStringFunc.toString = toStringFunc;
      toSourceFunc.toSource = toStringFunc.toSource = toSourceFunc;
      for (var i in window.FimFicEvents) {
        window.FimFicEvents[i].toString = toStringFunc;
        window.FimFicEvents[i].toSource = toSourceFunc;
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
      'toString': win.FimFicEvents.toString,
      'toSource': win.FimFicEvents.toSource
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
      (function(original, __ajax) {
        window.AjaxRequest = function(a) {
          return window.FimFicEvents.PROXY(this, __ajax, arguments, false);
        }
        for (var i in original) {
          window.AjaxRequest[i] = original[i];
        }
      })(window.AjaxRequest, window.AjaxRequest.prototype.constructor);
      window.$.ajax = (function(__ajax) {
        return function(param, n) {
          return window.FimFicEvents.PROXY(this, __ajax, arguments, true);
        };
      })(window.$.ajax);
    }
    RunScript(injected,true);
  }
})(typeof (unsafeWindow) !== 'undefined' && unsafeWindow != window ? unsafeWindow : window);