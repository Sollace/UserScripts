// ==UserScript==
// @name        RunScript Sandbox Breakout Utility
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.1
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
RunScript.build = function(functionText) {
  return {
    run: function(mustCall) {
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
};