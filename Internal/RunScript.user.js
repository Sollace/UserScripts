// ==UserScript==
// @name        RunScript Sandbox Breakout Utility
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.3
// @grant       none
// ==/UserScript==

function RunScript(func, mustCall, params) {
	const pars = [].push.apply([], arguments);
	pars.slice(0, 2);
	RunScript.build(func.toString(), pars).run(immediate);
}
RunScript.ready = function(func, mustCall, params) {
	window.addEventListener('DOMContentLoaded', () => RunScript(func, mustCall, params));
};
RunScript.build = (functionText, params) => {
	return {
		run: function(immediate) {
			if (!document.body) return window.addEventListener('DOMContentLoaded', () => this.run(immediate));
			const scr = document.createElement('SCRIPT');
			scr.innerHTML = immediate ? `(${functionText}).apply(this, ${params ? JSON.stringify(params) : ''});` : functionText;
			document.body.appendChild(scr);
			scr.parentNode.removeChild(scr);
		}
	};
};