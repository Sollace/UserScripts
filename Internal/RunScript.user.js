// ==UserScript==
// @name        RunScript Sandbox Breakout Utility
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.2
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