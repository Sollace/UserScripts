// ==UserScript==
// @name        FimQuery.Reflect (ref FimfictionAdvanced)
// @description Functions for the hardcore code junkies. Helps with directly modifying nighty's code.
// @author      Sollace
// @match       *://www.fimfiction.net/*
// @namespace   fimfiction-sollace
// @run-at      document-start
// @version     1.0.1
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/Events.user.js
// @grant       none
// ==/UserScript==

function compose(one, two) {return (e) => { one(e), two(); };}
function arrayOf(length, func) {return Array.apply(null, Array(length)).map(func);}
function range(from, to) {return arrayOf(to - from + 1, (_, i) => from + i);}
function reverse(me) {return me && me.length > 1 ? me.split('').reverse().join('')  : me;}
function endsWith(me, it) {return reverse(me).indexOf(reverse(it)) == 0;}
function pickNext(arr) {return arr[Math.max((new Date()).getSeconds() % arr.length, 0)];}
function replaceAll(find, replace, me) {return me.replace(new RegExp(find.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), replace);}

function normalise(me) {
  if (!me) return me;
  let space = true;
  return me.split('').map(f => {
    f = space ? f.toUpperCase()  : f.toLowerCase();
    space = f == ' ';
    return f;
  }).join('');
}

function patchFunc(func, replacer) {return Function(`return ${replacer(func.toString())}`)();}

function override(obj, member, new_func) {
  new_func.super = obj[member].super || obj[member];
  obj[member] = new_func;
}

function extend(onto, offof) {
  Object.keys(offof).forEach(key => onto[key] = offof[key]);
  return onto;
}

function ready(func) {
  if (this['App']) {
      return func();
  }
  document.addEventListener('DOMContentLoaded', func);
}

// soft-dependency: only do this if requested by the host
function requireRemoveEventListeners() {
  patchEvents();
  //Run it a second time in global scope to ensure greasmonkey doesn't mess with the context
  window.override = override;
  if (RunScript) {
    RunScript(patchEvents, true);
  }

  function patchEvents() {
    function extend(saved, onto, offof) {
      Object.keys(offof).forEach(member => {
        saved[member] = onto[member];
        onto[member] = offof[member];
      });
      return saved;
    }
    if (window.EventTarget.prototype.removeEventListeners) {
      return;
    }

    const ov = extend({}, window.EventTarget.prototype, {
      addEventListener(ev, f, c) {
        if (!this.eventListeners) this.eventListeners = {};
        if (!this.eventListeners[ev]) this.eventListeners[ev] = [];
        this.eventListeners[ev].push(f);
        return ov.addEventListener.apply(this, arguments);
      },
      removeEventListener(ev, f) {
        let l = this.getEventListeners(ev), i = l.indexOf(f);
        if (i > -1) l.splice(i, 1);
        return ov.removeEventListener.apply(this, arguments);
      },
      removeEventListeners(event) {
        this.getEventListeners(event).forEach(f => this.removeEventListener(event, f));
      },
      getEventListeners(event) {
        return (this.eventListeners && this.eventListeners[event]) ? this.eventListeners[event] : [];
      },
      replaceEventListener(event, sender, old, neu) {
        const scroll_events = this.getEventListeners(event);
        for (let i = 0; i < scroll_events.length; i++) {
          if (scroll_events[i].context == sender && scroll_events[i].unbound == old) {
            this.removeEventListener(event, scroll_events[i]);
          }
        }
        this.addEventListener(event, neu);
      }
    });
    const of = extend({}, window.Function.prototype, {
      bind(context) {
        let result = of.bind.apply(this, arguments);
        result.unbound = this;
        result.context = context;
        return result;
      }
    });
  }
}
