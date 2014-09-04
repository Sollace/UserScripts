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
  function Events(original) {
    var registered = original === undefined ? {} : original.__getRegistered();
    
    return {
      'version': function() {
        return ver;
      },
      '__getRegistered': function() {
        return registered;
      },
      'on': function(name, func) {
        name = name.split(', ');
        for (var i = 0; i < name.length; i++){
          if (registered[name[i]] === undefined) {
            registered[name[i]] = [];
          }
          registered[name[i]].push(func);
        }
      },
      'off': function(name, event) {
        if (registered[name] != undefined) {
          if (event === undefined) {
            for (var i in registered) {
              registered[i] = undefined;
            }
          } else {
            if (typeof event == 'function') {
              for (var i = 0; i < registered[name].length; i++) {
                if (registered[name][i] == event) {
                  registered[name] = registered[name].splice(i, 1);
                }
              }
            }
          }
        }
      },
      'trigger': function(name, e) {
        for (var i in registered) {
          if (i.split('.')[0] == name) {
            for (var j = 0; j < registered[i].length; j++) {
              registered[i][j](e);
            }
          }
        }
      }
    }
  }
  if (typeof (win.FimFicEvents) !== 'undefined') {
    if (win.FimFicEvents.version() < ver) {
      win.FimFicEvents = Events(win.FimFicEvents);
    }
  } else {
    win.FimFicEvents = Events();
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
    win.$.get = (function() {
      win.$.__get = win.$.get;
      return function(url, data, success, dataType) {
        if (url == '/ajax/fetch_comments.php') {
          win.$.__get(url, data, function(d,e,f) {
            var event = {'result':d,'data':data};
            win.FimFicEvents.trigger('onPageChange', event);
            d = event.result;
            success(d,e,f);
            win.FimFicEvents.trigger('pageChanged', event);
          }, dataType);
        } else {
          win.$.__get(url, data, success, dataType);
        }
      };
    })();
    win.$.post = (function() {
      win.$.__post = win.$.post;
      return function(url, data, success, dataType) {
        if (url == '/ajax/edit_comment.php') {
          win.$.__post(url, data, function(d,e,f) {
            var event = {'result':d,'data':getSplitData(data)};
            win.FimFicEvents.trigger('onEditComment', event);
            d = event.result;
            success(d,e,f);
            win.FimFicEvents.trigger('editComment', event);
          }, dataType);
        } else {
          win.$.__post(url, data, success, dataType);
        }
      };
    })();
  }
})(typeof (unsafeWindow) !== 'undefined' && unsafeWindow != window ? unsafeWindow : window);