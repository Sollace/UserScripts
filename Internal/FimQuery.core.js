// ==UserScript==
// @name        FimQuery.Core (ref FimfictionAdvanced, Nosey Hound, EE)
// @description A collection of useful functions for interacting with fimfiction.net
// @author      Sollace
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @namespace   fimfiction-sollace
// @run-at      document-start
// @version     1.3.3
// @grant       none
// ==/UserScript==

const win = () => this['unsafeWindow'] || window['unsafeWindow'] || window;
const isJQuery = () => !!win()['$'];
const getUserId = () => {const w = win()['logged_in_user'];return w ? w.id : -1;};
const getSafe = (name, defaultValue) => {let w = win();return w[name] || (w[name] = defaultValue);}
const brightness = (r,g,b) => Math.sqrt((0.241 * r * r) + (0.691 * g * g) + (0.068 * b * b));
const getIsLoggedIn = () => !!win()['logged_in_user'];
const staticFimFicDomain = () => win()['static_url'] || '//static.fimfiction.net';
const getFavicon = url => `//www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}`;
const getDomain = url => /:|^\/\//.test(url) ? url.match(/([^:\/]*)([:\/]*)([^\/]*)/).reverse()[0] : url.split('/')[0];
const getSiteName = url => /:|^\/\//.test(url) ? url.match(/([^:\/]*)([:\/]*)(www.|)([^\/]*)/).reverse()[0] : url.split('/')[0];
const getUserNameUrlSafe = () => getIsLoggedIn() ? getUserButton().href.split(`/${getUserId()}/`).reverse()[0].split("/")[0] : 'Anon';
const getUserNameEncoded = () => encodeURIComponent(getUserNameUrlSafe());
const getUserName = () => getUserNameUrlSafe().replace(/\+/g,' ');
const getUserButton = () => document.querySelector('.user_toolbar a.button[href^="/user/"]');
const getDefaultAvatar = size => `${staticFimFicDomain()}/images/none_${size > 64 ? 64 : size}.png`;
const urlSafe = me => me.toLowerCase().replace(/[^a-z0-9_-]/gi,'-').replace(/--/,'-');
const all = (selector, holder, func) => {return Array.prototype.forEach.call((func ? holder : document).querySelectorAll(selector), func || holder);};
const currentTheme = () => document.querySelector('#stylesheetMain').href.split('/').reverse()[0].split('.')[0];
const tryRun = func => function() {
  try {return func.apply(this, arguments);
      } catch (e) {console.error(e);}
};

function addDelegatedEvent(node, selector, event, func, capture) {
  const k = ev => {
    const target = ev.target.closest(selector);
    if (!target) return;
    if (('mouseout' == event || 'mouseover' == event) && target.contains(ev.relatedTarget)) return;
    func.call(target, ev, target);
  };
  node.addEventListener(event, k, capture);
  return k;
}

function newEl(html) {
  const div = document.createElement('DIV');
  div.innerHTML = html;
  return div.firstChild;
}

if (getIsLoggedIn()) document.addEventListener('DOMContentLoaded', () => {
  const id = getUserId();
  const possibleAvatar = document.querySelector(`img[src*="cdn-img.fimfiction.net/user/"][src*="-${id}-"]`);
  if (possibleAvatar) {
    localStorage['user_avatar'] = `${possibleAvatar.getAttribute('src').split(id)[0]}${id}-`;
  }
});

function getUserAvatar(size) {
  const id = getUserId();
  if (id > -1) {
    let stored = localStorage['user_avatar'];
    if (stored && stored.indexOf(`-${id}-`) > -1) return stored + size;
  }
  return getDefaultAvatar(size);
}

function isMyBlogPage() {
  const match = document.location.href.split('?')[0].match(/(?:http:|https:|)\/\/www\.fimfiction\.net\/user\/([0-9]+)\/[^\/]*\/blog.*/);
  return match && match[1] && match[1] == (getUserId() + '');
}

function isMyPage() {
  const match = document.location.href.split('?')[0].match(/(?:http:|https:|)\/\/www\.fimfiction\.net\/user\/([0-9]+)\/.*/);
  return match && match[1] && match[1] == (getUserId() + '');
}

var vendor = vendor || null;
function getVendorPrefix() {
  if (!vendor) {
    let styles = window.getComputedStyle(document.documentElement, '');
    let pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
    let dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    vendor = {dom: dom, lowercase: pre, css: '-' + pre + '-', js: pre[0].toUpperCase() + pre.substring(1)};
  }
  return vendor;
}

function updateStyle(style, id) {
  const el = document.getElementById(id);
  if (el) return el.innerHTML = style.replace(/-\{0\}-/g, getVendorPrefix().css);
  makeStyle(style, id);
}
function makeStyle(input, id) {
  document.head.insertAdjacentHTML('beforeend', styleSheet(input.replace(/-\{0\}-/g, getVendorPrefix().css), id));
}
function styleSheet(css, id) {
  return `<style type="text/css" ${id ? `id="${id}"` : ''}>${css}</style>`;
}

function makeToolTip(button) {
  button.insertAdjacentHTML('beforeend', `<div style="z-index:50;text-align:left;position:absolute;"><div class="tooltip"></div></div>`);
  const popup = button.lastChild;
  popup.addEventListener('mouseleave', e => popup.parentNode.removeChild(popup));
  return popup.firstChild;
}

function addTooltip(message, field) {
  field.parentNode.style.position = 'relative';
  field.insertAdjacentHTML('beforebegin', `<div class="tooltip_popup hidden">
				<div class="arrow"><div></div></div>
				<div class="tooltip_popup_tooltip">${message}</div>
			</div>`);
  const toggle = e => field.classList.toggle('hidden');
  field.addEventListener('focus', toggle);
  field.addEventListener('blur', toggle);
  field = field.previousSibling;
}

function makePopup(title, fafaText, darken, close) {
  const pop = new (win().PopUpMenu)('', `<i class="fa fa-${fafaText}" ></i>${title}`);
  pop.SetCloseOnHoverOut(false);
  pop.SetFixed(true);
  pop.SetSoftClose(close !== true);
  pop.SetDimmerEnabled(darken !== false);
  return pop;
}

function registerButton(button, controller, priority) {
  button = button.parentNode;
  button.dataset.order = button.parentNode.children.length;
  button.dataset.priority = priority;
  if (controller.toolbarItems) {
    controller.toolbarItems.push({
      node: button,
      order: (button.dataset.order = controller.toolbarItems.length),
      priority: priority,
      width: 35
    });
  }
}

function makeButton(a, text, img) {
  a.insertAdjacentHTML('beforeend', `<li class="button-group" data-priority="1" data-order="200"><button type="button" class="drop-down-expander" title="${text}"><i class="${img}"></i></button></li>`);
  return a.lastChild.querySelector('button');
}
function addOption(list, title) {
  list.insertAdjacentHTML('beforeend', `<li><a>${title}</a></li>`)
  return list.lastChild.firstChild;
}
function addDropList(list, title, func) {
  list.insertAdjacentHTML('beforeend', `<li><div class="drop-down"><ul></ul></div><a>${title}</a></li>`)
  func(list.lastChild.querySelector('.drop-down ul'));
}
function getListItemWidth(list) {return [].map.call(list.children, a => a.offsetWidth).reduce(Math.max, 0);}
function setListItemWidth(list) {
  const w = `${getListItemWidth(list)}px`;
  [].forEach.call(list.children, a => a.style.width = w);
}
function offset(element) {
  if (!element || !element.getClientRects().length) {
    return { top: 0, left: 0 };
  }
  var rect = element.getBoundingClientRect();
  var doc = element.ownerDocument || document;
  var win = doc.defaultView || win;
  doc = doc.documentElement;
  return {
    top: rect.top + win.pageYOffset - doc.clientTop,
    left: rect.left + win.pageXOffset - doc.clientLeft
  };
}

function position(obj, x, y, buff) {
  if (typeof x == 'string' && x.toLowerCase() == 'center') x = (document.body.clientWidth - obj.clientWidth) / 2;
  if (typeof y == 'string' && y.toLowerCase() == 'center') y = (document.body.clientHeight - obj.clientHeight) / 2;
  if (typeof x == 'object') {
    var parameters = x;
    var positioner = x.object != null ? x.object : x;
    buff = x.buffer != null ? x.buffer : y;
    var off = offset(positioner);
    y = off.top - document.body.scrollTop;
    x = off.left - document.body.scrollLeft;
    if (parameters.offX != null) x += parameters.offX;
    if (parameters.offY != null) y += parameters.offY;
  }

  buff = buff || 0;
  if (x < buff) x = buff;
  if (y < buff) y = buff;

  let maxX = document.body.clientWidth - (obj.clientWidth + buff);
  let maxY = document.body.clientHeight - (obj.clientHeight + buff);

  if (x > maxX) x = maxX;
  if (y > maxY) y = maxY;

  obj.style.top = y + 'px';
  obj.style.left = x + 'px';
}

function inbounds(el, buff) {
  if (!buff) buff = 0;

  var scrollX = document.body.scrollLeft;
  var scrollY = document.body.scrollTop;

  const os = offset(el);

  var left = os.left - scrollX;
  var top = os.top - scrollY;

  var st = window.getComputedStyle(el);

  let margL = parseFloat(st.marginLeft) || 0;
  let margT = parseFloat(st.marginTop) || 0;
  let margR = parseFloat(st.marginRight) || 0;
  let margB = parseFloat(st.marginBottom) || 0;

  let width = el.offsetWidth;
  let height = el.offsetHeight;

  let winW = document.body.offsetWidth;
  let winH = document.body.offsetHeight;

  if (top - margT + height + margB > winH + buff) top = winH - height;
  if (left - margL + width + margR > winW + buff) left = winW - width;
  if (top < buff) top = buff;
  if (left < buff) left = buff;
  el.style.top = (top - margT + scrollY) + 'px';
  el.style.left = (left - margL + scrollX) + 'px';
}

function getUserCommentThumb(size) {
    let hold = getIsLoggedIn() ? `<a href="/user/${getUserNameEncoded()}" class="name">${getUserName()}</a>` : `<a class="name">Anon</a>`;
		hold += `<img class="avatar loaded"
			data-src="${getUserAvatar(size)}" data-srcset="${getUserAvatar(256)} 2x" data-lightbox="" data-fullsize="${getUserAvatar(512)}"
			src="${getUserAvatar(size)}" srcset="${getUserAvatar(256)} 2x"
			width="${size}" height="${size}"></img>`;
  const result = document.createElement('DIV');
  result.innerHTML = `<div class="author" style="line-height:1.1em;">${hold}</div>`;
  result.classList.add('comment');
  return result;
}

function ajax(method, url, complete, error) {
  complete = complete || (a => a);
  error = error || (a => a);
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState !== XMLHttpRequest.DONE) return;
    if (request.status < 200 && request.status >= 300) return error(e);
    try {
      return complete(JSON.parse(request.responseText));
    } catch (e) { error(e); }
  };
  request.open(method, url, true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send();
};

const fillBBCode = (_ => {
  const codes = [
    [/\[(\/|)u\]/g, '<$1u>'],
    [/\[(\/|)i\]/g, '<$1i>'],
    [/\[(\/|)b\]/g, '<$1b>'],
    [/\[s\]/g, '<span style="text-decoration:line-through">'],
    [/\[\/s\]/g, '</span>'],
    [/\[(\/|)center\]/g, '<$1center>'],
    [/\[img\]([^\[]*)\[\/img\]/g, '<img src="$1" />'],
    [/\[icon\]([^\[]*)\[\/icon\]/g, '<i class="fa fa-fw fa-$1" />'],
    [/\[(\/|)quote\]/g, '<$1blockquote>'],
    [/\[spoiler\]/g, '<span class="spoiler">'],
    [/\[\/spoiler\]/g, '</span>'],
    [/\[(left|right)_insert\]/gi, '<blockquote style="box-shadow: 5px 5px 0px rgb(238, 238, 238); margin: 10px 25px 10px 0px; box-sizing: border-box; padding: 15px; background-color: rgb(247, 247, 247); border: 1px solid rgb(170, 170, 170); width: 50%; float: $1;">'],
    [/\[\/(left|right)_insert\]/gi, '</blockquote>'],
    [/\[url\]([^\[]*)\[\/url\]/g,'<a href="$1">$1</a>'],
    [/\[url=([^\]]*)\]/g,'<a href="$1">'],
    [/\[\/url\]/g, '</a>'],
    [/\[size=([0-9]*)(px|em)]/g, '<span style="font-size:$1$2;line-height:1.3em;">'],
    [/\[size=([0-9]*)]/g, '<span style="font-size:$1px;line-height:1.3em;">'],
    [/\[\/size\]/g,'<span>'],
    [/\[color=([^\]]*)\]/g,'<span style="color:$1;">'],
    [/\[\/color\]/g, '</span>'],
    [/\[youtube=[^\]]*youtube\.[^\]]*v=([^\]]*)\]/g, '<div class="youtube_container"><iframe src="//www.youtube.com/embed/$1" /></div>']
  ];
	
	return function fillBBCode(text) {
		codes.forEach(a => text = text.replace(a[0], a[1]))
		return text;
	};
})();

function getStoryId() {
  const story = document.querySelector('ul.chapters[data-story], .story-bookshelves-widget[data-story]');
  return story && parseInt(story.dataset.story) || 0;
}

function getChapterId() {
  const chapter = document.querySelector('[data-chapter]');
  return chapter && parseInt(chapter.dataset.chapter) || 0;
}

function getStoryViewMode() {
  const mm = document.querySelector('#browse_form .right-menu-inner .button-group .drop-down-expander');
  return mm ? mm.innerText.split(' ')[0].toLowerCase() : '';
}

function getPageStartNumber() {
  let pageNumber = getParameter("page");
  if (pageNumber != null) {
    pageNumber = parseInt(pageNumber);
    let mode = getStoryViewMode();
    return (pageNumber - 1) * (mode == 'list' || mode == 'cards' ? 60 : 10);
  }
  return 0;
}

function getParameter(name) {
  if (document.location.href.indexOf('?') > -1) {
    let params = document.location.href.split("?")[1].split("&");
    for (var i = 0; i < params.length; i++) {
      if (params[i].indexOf(name + "=") == 0) {
        return params[i].split("=")[1];
      }
    }
  }
  return null;
}