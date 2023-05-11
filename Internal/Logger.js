// ==UserScript==
// @name Fimfiction Logger
// @namespace sollace_fimfiction
// @match       *://www.fimfiction.net/*
// @grant none
// @run-at      document-start
// ==/UserScript==

function Logger(name, l) {
  let test = document.querySelector('#debug-console');
  let minLevel = typeof (l) == 'number' ? l : 0;
  let paused = false;
  let line = 0;
	
	function linkify(txt) {
		return txt.replace(/((http[s]?|file):\/\/[^\s]+)/gi, '<a href="$1">$1</a>');
	}
	
  function SOut(txt, level) {
    level = level || 0;
    if (level >= minLevel) {
			if (!test) {
				document.body.insertAdjacentHTML('beforeend', '<div id="debug-console" style="z-index:9999;overflow-y:auto;max-height:50%;max-width:100%;min-width:50%;background:rgba(255,255,255,0.8);position:fixed;bottom:0px;left:0px;"></div>');
				test = document.body.lastChild;
				test.addEventListener('mouseup', (e) => {
					if (!e.target.closest('a')) test.innerHTML = '';
				});
				SOut('===Logging Started===', minLevel + 1);
			}
			test.insertAdjacentHTML('beforeend', `<p style="background: rgba(${line % 2 ? '0,155' : '155,0'},255,0.3);">${line++}):${name}) ${txt}</p>`);
			test.scrollTop = test.scrollHeight;
    }
  }
	
	function fillPars(txt, args) {
		args.forEach((a, i) => txt = txt.replace('{' + i + '}', a));
		return txt;
	}
	
	return {
		Start: level => {
			if (level) minLevel = level;
			paused = false;
		},
		Stop: _ => {
			if (test) test.innerHTML = '';
			SOut('===Logging Stopped===', minLevel + 1);
			paused = true;
		},
		Pause: _ => {
			SOut('===Logging Paused===', minLevel + 1);
			paused = true;
		},
		Continue: _ => {
			if (paused) SOut('===Logging Continued===', minLevel + 1);
			paused = false;
		},
		Log: (txt, level, ...params) => {
			if (paused) return;
			txt = fillPars(txt, params);
			level = 0;
			SOut(txt, level);
		},
		Error: function(txt, ...params) {
			this.Log.call(null, 1000, params);
		},
		SevereException: (txt, ...params) => {
			if (params[0] === 'handled') return;
			SOut(fillPars(txt, params), 2000);
			if (params[0].stack) SOut(`<br><b>${linkify(params[0].stack).replace(/\n/g, '<br><b>').replace(/@/g, '</b> @<br> ')}`, 2000);
		},
		Severe: txt => SOut(txt, 2)
	};
}