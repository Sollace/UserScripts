// ==UserScript==
// @name        FimFiction Bookmarks At Bottom
// @description Adds bookmark widgets at the bottom of chapters
// @version     1.0.0
// @icon        http://sollace.github.io/emoticons/default/heart.png
// @author      Sollace
// @namespace   fimfiction-sollace
// @include     /^http?[s]://www.fimfiction.net/.*/
// @grant       none
// @inject-into page
// @run-at      document-start
// ==/UserScript==

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
function makeStyle(input, id) {
  document.head.insertAdjacentHTML('beforeend', styleSheet(input.replace(/-\{0\}-/g, getVendorPrefix().css), id));
}
function styleSheet(css, id) {
  return `<style type="text/css" ${id ? `id="${id}"` : ''}>${css}</style>`;
}
function patchFunc(func, replacer) {
  return Function(`return ${replacer(func.toString())}`)();
}
function ready(func) {
  if (this['App']) {
      return func();
  }
  document.addEventListener('DOMContentLoaded', func);
}

const STYLES = `
.story_container .story-top-toolbar.story-bottom-toolbar {
  margin: 0 5px;
  background:-webkit-gradient(linear, left bottom, left top, color-stop(5px, transparent), color-stop(100%, rgba(0,0,0,0.1)));
  background:-webkit-linear-gradient(bottom, transparent 5px, rgba(0,0,0,0.1) 100%);
  background:linear-gradient(to top, transparent 5px, rgba(0,0,0,0.1) 100%);
  border-top:1px solid #d6d2cb;
  border-bottom: none;
}
.story-top-toolbar.story-bottom-toolbar .bookshelves li:first-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 5px;
}
.story-top-toolbar.story-bottom-toolbar .bookshelves li:last-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 5px;
}
`;

ready(() => {
  if (!document.querySelector('.body_container')) return;

  let widget = document.querySelector('.chapter-container .story-bookshelves-widget');

  if (widget) {
    makeStyle(STYLES, "bookmarks_at_bottom");
    const container = widget.closest('.chapter-container');

    container.insertAdjacentHTML('beforeend', `
      <div class="story-top-toolbar story-bottom-toolbar">
        ${widget.outerHTML}
      </div>`);

    widget = container.querySelector('.story-bottom-toolbar .story-bookshelves-widget');
    widget.dataset.controller = "story-bookshelves";
    delete widget.dataset.controllerId;
    
    const bottomToolbar = container.querySelector('.story-bottom-toolbar');
    App.BindControllers(bottomToolbar);
    App.BindGlobalEventListeners(bottomToolbar);
    
    BookshelfItem.prototype.Update = patchFunc(BookshelfItem.prototype.Update, body => {
      return body.replace('new AjaxRequest', 'this.createRequest');
    });
    BookshelfItem.prototype.updateAll = function() {
      const myNum = this.dom.querySelector('.num_stories');
      document.body.querySelectorAll(`.bookshelf[data-bookshelf="${this.bookshelf}"]`).forEach(el => {
        el.setAttribute('class', this.dom.getAttribute('class'));
        el.dataset.added = this.dom.dataset.added;
        if (myNum) {
          const num = el.querySelector('.num_stories');
          if (num) {
            num.textContent = myNum.textContent;
          }
        }
      });
    };
    BookshelfItem.prototype.createRequest = function(parameters) {
      this.updateAll();
      return new AjaxRequest(parameters).then(() => {
        requestAnimationFrame(() => this.updateAll());
      });
    };
  }
});
