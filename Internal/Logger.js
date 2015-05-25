// ==UserScript==
// @name        Logger
// @author      Sollace
// @namespace   sollace
// @version     1
// @grant       none
// ==/UserScript==
function Logger(name, l) {
  var test = null;
  var minLevel = 0;
  var paused = false;
  var line = 0;
  if (typeof (l) == 'number') minLevel = l;
  function SOut(txt, level) {
    if (level == null || level == undefined) level = 0;
    if (test != null && level >= minLevel) {
      test[(line = (line + 1) % 150) ? 'append' : 'html']('<p style="background: rgba(' + (line % 2 ? '0,155' : '155,0') + ',255,0.3);">' + line + '):' + name + ') ' + txt + '</p>');
      try {
        test.stop().animate({scrollTop: test[0].scrollHeight},800);
      } catch (e) {}
    }
  }
  this.Start = function (level) {
    if (typeof (level) == 'number') minLevel = level;
    paused = false;
    if (!test) {
      test = $('#debug-console');
      if (!test.length) {
        test = $('<div id="debug-console" style="z-index:9999;overflow-y:auto;max-height:50%;max-width:100%;min-width:50%;background:rgba(255,255,255,0.8);position:fixed;bottom:0px;left:0px;" />');
        $('body').append(test);
        test.on('click', function () {test.empty();});
      }
      SOut('===Logging Started===', minLevel + 1);
    }
  }
  this.Stop = function () {
    if (test) {
      SOut('===Logging Stopped===', minLevel + 1);
      test = null;
    }
  }
  this.Pause = function () {
    SOut('===Logging Paused===', minLevel + 1);
    paused = true;
  }
  this.Continue = function () {
    if (paused) SOut('===Logging Continued===', minLevel + 1);
    paused = false;
  }
  this.Log = function (txt, level, params) {
    if (arguments.length > 1) {
      if (typeof arguments[1] == 'string') {
        [].splice.apply(arguments, [1, 0, 0]);
        level = 0;
      }
      for (var i = 2; i < arguments.length; i++) {
        txt = txt.replace(new RegExp('\\{' + (i-2) + '\\}', 'g'), arguments[i]);
      }
    } else {
      level = 0;
    }
    if (!paused) SOut(txt, level);
  }
  this.Error = function (txt, params) {
    [].splice.apply(arguments, [1,0,1000]);
    this.Log.apply(this,arguments);
  }
  this.SevereException = function (txt, excep) {
    if (excep != 'handled') {
      try {
        var stopped = false;
        if (test == null) {
          stopped = true;
          this.Start();
        }
        if (txt.indexOf('{0}') != -1) {
          SOut(txt.replace('{0}', excep), 2000);
        } else {
          SOut(txt + '<br/>' + except, 2000);
        }
        if (excep.stack) SOut(excep.stack, 2000);
        if (stopped) this.Pause();
      } catch (e) {
        alert('Error in displaying Severe: ' + e + '\n' + 'Message: ' + txt + '\n' + 'Severe: ' + excep);
      }
    }
  }
  this.Severe = function (txt) {
    try {
      var stopped = false;
      if (test == null) {
        stopped = true;
        this.Start();
      }
      SOut(txt, 2);
      if (stopped) this.Pause();
    } catch (e) {
      alert('Error in displaying Severe: ' + e + '\n' + 'Severe: ' + txt);
    }
  }
}