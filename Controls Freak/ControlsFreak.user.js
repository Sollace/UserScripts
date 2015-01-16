// ==UserScript==
// @name        Controls Freak
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net*
// @include     https://www.fimfiction.net*
// @version     1.4
// @require     http://code.jquery.com/jquery-1.8.3.min.js
// @grant       GM_getValue
// @grant       GM_setValue
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

$(document).ready(function () {
    function ToolBar(buttons) {
        this.container = null;
        this.children = [];

        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].tagName == 'LI') {
                this.children.push(new Button(this, i, buttons[i], true));
            } else {
                this.children.push(new Baggage(buttons[i]));
            }
        }

        this.gen = function (bar) {
            $(bar).children().each(function () {
                $(this).detach();
            });
            var addedClass = false;
            for (var i = 0; i < this.children.length; i++) {
                var nod = this.children[i].genNode();
                if (!addedClass && $(nod).prop('tagName') == 'LI') {
                    $(nod).addClass('button-first');
                    addedClass = true;
                } else if (i > 0) {
                    $(nod).css('border-left', '');
                }
                $(bar).append(nod);
            }
        }
    }
    ToolBar.prototype.getEdit = function () {
        this.container.empty();
        for (var i = 0; i < this.children.length; i++) {
            this.container.append(this.children[i].getEditNode());
        }
    }
    ToolBar.prototype.getContainer = function (holder, classes, allow) {
        if (this.container == null) {
            this.container = $('<ul class="editor" />');
            var me = this;
            $(holder).after(this.container);
            $(this.container).click(function () {
                if (held != null) {
                    if (allow.apply(held)) {
                        held._index = me.children.length;
                        held._parent = me;
                        held.drop();
                    }
                }
            });
            for (var i = 0; i < classes.length; i++) {
                this.container.addClass(classes[i]);
            }
            this.getEdit();
        }
        return this.container;
    }
    ToolBar.prototype.getConfig = function () {
        var result = [];
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].type != 'hidden') {
                result.push(this.children[i].getconfigEntry());
            }
        }
        return JSON.stringify(result);
    }
    ToolBar.prototype.fromConfig = function (config) {
        try {
            config = JSON.parse(config);
        } catch (e) {
            return e;
        }
        
        var childs = [];
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].type == 'hidden') {
                childs.push(this.children[i]);
            }
        }
        
        for (var i = 0; i < config.length; i++) {
            var b = getButton(config[i]);
            if (b != null) {
                b._index = childs.length;
                b._parent = this;
                usedButtons.set(config[i], true);
                unusedButtons.set(config[i], false);
                childs.push(b);
            }
        }
        this.children = childs;

        for (var i = 0; i < buttonRegistry.poslength() ; i++) {
            if (!usedButtons.get(i) && !unusedButtons.get(i)) {
                searchButton(this, norm);
            }
        }
    }
    ToolBar.prototype.flush = function() {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].originalElement.detach();
        }
    }

    function Deck() {
        this.container = null;
        this.children = [];
        this.deckStart = $('#home_link + li')[0];
        this.children.push(new Button(this, 0, $('#private-message-drop-down'), false, 'pin'));
        this.children.push(new Button(this, 1, $('.nav-bar-list .feed-link').parent(), false, 'pin'));
        this.children.push(new Button(this, 2, $('#notifications-drop-down'), false, 'pin'));
        this.children.push(new Button(this, 3, $('#site-search').parent(), false, 'pin', 'Search'));

        this.gen = function () {
            for (var i = this.children.length - 1; i >= 0; i--) {
                if (this.children[i].isPinnable()) {
                    $(this.deckStart).after(this.children[i].genNode(i));
                }
            }
        }
    }
    Deck.prototype = ToolBar.prototype;
    if (getIsLoggedIn()) {
        preInit();
        makeStyle('\
.editing_button > .button {\
    padding: 0px 10px;}\
.mail-link:before, .notifications-link:before, .feed-link:before {\
    line-height: 45px;\
    text-align: center;\
    display: inline-block;\
    font-family: FontAwesome;\
    font-weight: normal;}\
.user_toolbar > ul > li > .notifications-link:before, .user_toolbar > ul > li > .mail-link:before, .user_toolbar > ul > li > .feed-link:before {\
    margin-right: 5px;\
    font-size: 16px;\
    line-height: inherit;}\
.user_toolbar > ul > li > ul li .notifications-link:before, .user_toolbar > ul > li > ul li .mail-link:before, .user_toolbar > ul > li > ul li .feed-link:before {\
    margin-right: 8px;\
    text-align: center;\
    color: #666;\
    font-size: 14px;\
    background: none repeat scroll 0% 0% #F8F8F8;\
    line-height: 38px;\
    width: 34px;\
    border-right: 1px solid rgba(0, 0, 0, 0.15);}\
.user_toolbar > ul > li > ul li:hover .notifications-link:before, .user_toolbar > ul > li > ul li:hover .mail-link:before, .user_toolbar > ul > li > ul li:hover .feed-link:before {\
    background: #474543;\
    color: #fff;}\
.user_toolbar > ul > li > .mail-link, .user_toolbar > ul > li > .notifications-link, .user_toolbar > ul > li > .feed-link  {\
    margin-top: -1px;}\
.drop-down-notifications .drop-down-header .styled_button, .drop-down-private-messages .drop-down-header .styled_button {\
    display: inline-block !important;}\
@media all and (max-width: 700px) {\
  .user_toolbar .notifications-link:before,\
  .user_toolbar .mail-link:before,\
  .user_toolbar .feed-link:before {\
    font-size: 16px;\
    vertical-align: middle;\
    width: 30px;\
    text-align: center;}\
  .user_toolbar > ul li ul .notifications-link:before,\
  .user_toolbar > ul li ul .mail-link:before,\
  .user_toolbar > ul li ul .feed-link:before {\
    background: none !important;\
    color: #9699A8 !important;\
    border: none !important;\
    width: 24px !important;}\
  .user_toolbar .notifications-link:after,\
  .user_toolbar .mail-link:after,\
  .user_toolbar .feed-link:after {\
    margin-left: 5px;}\
  .user_toolbar div.drop-down-notifications,\
  .user_toolbar div.drop-down-private-messages {\
    left: 0px !important;}\
  .user_toolbar > ul ul li div.drop-down-notifications,\
  .user_toolbar > ul ul li div.drop-down-private-messages {\
    position: initial;\
    width: 100%;\
    border-radius: 5px;}\
  .user_toolbar .drop-down-notifications ul,\
  .user_toolbar .drop-down-private-messages ul {\
    background: #fff !important;\
    box-shadow: none !important;\
    padding: 0px !important;\
    margin: 0px !important;\
    border: 1px solid rgba(0, 0, 0, 0.3) !important;\
    border-radius: 0px !important;}\
  .user_toolbar .drop-down-notifications li,\
  .user_toolbar .drop-down-private-messages li {\
    color: rgba(0, 0, 0, 0.85) !important;}\
  .user_toolbar.show > ul {\
    overflow: visible !important;}\
  .user_toolbar > ul > #private-message-drop-down.hover ~ li,\
  .user_toolbar > ul > #notifications-drop-down.hover ~ li {\
    display: none;}}\
.user_toolbar .notifications-link:before {\
    content: "";}\
.user_toolbar .mail-link:before {\
    content: "";}\
.user_toolbar .feed-link:before {\
    content: "";}\
.user_toolbar li > a > div[id^="num"], .user_toolbar li > .mail-link > div {\
    display: none;}\
.user_toolbar li > a.new > div[id^="num"], .user_toolbar li > .mail-link.new > div {\
  display: inline;}\
.user_toolbar .notifications-link:not(.new):after {\
  content: "Notes";}\
.user_toolbar .mail-link:not(.new):after {\
  content: "Mail";}\
.user_toolbar .feed-link:not(.new):after {\
  content: "Feed";}\
.user_toolbar .notifications-link.new,\
.user_toolbar .mail-link.new,\
.user_toolbar .feed-link.new {\
    background-color: #C9593A;\
    color: #FFF;\
    text-shadow: -1px -1px #A0472E;\
    border-bottom: 1px solid #8C3E28;\
    margin-bottom: -1px;\
    border-left: 1px solid #A0472E;\
    margin-left: -1px;}\
.user_toolbar .notifications-link.new:hover,\
.user_toolbar .mail-link.new:hover,\
.user_toolbar .feed-link.new:hover {\
    background-color: #A0472E;\
    color: #FFF;\
    text-shadow: -1px -1px #803824;\
    border-bottom: 1px solid #703120;\
    margin-bottom: -1px;\
    border-left: 1px solid #803824;}\
.user_toolbar > ul > li ul .new, .user_toolbar > ul > li ul .new:hover {\
  margin-top: 0px !important;\
  margin-bottom: 0px !important;\
  border: none !important;}\
.user_toolbar > ul > li ul .new div:after {\
  content: " )";}\
.user_toolbar > ul > li ul .feed-link.new div:before {\
  content: "Feed ( "}\
.user_toolbar > ul > li ul .notifications-link.new div:before {\
  content: "Notes ( "}\
.user_toolbar > ul > li ul .mail-link.new div:before {\
  content: "Mail ( "}\
.user_toolbar > ul > li ul li.hover > .drop-down ul,\
.user_toolbar > ul > li > .drop-down ul,\
.user_toolbar > ul > li.hover > .drop-down {\
    display: block !important;}\
.user_toolbar > ul > li ul li > .drop-down,\
.user_toolbar > ul > li > .drop-down {\
    display: none;\
    position: absolute;\
    top: 39px;\
    left: 0px;\
    z-index: 15;\
    width: 500px;\
    background: none repeat scroll 0% 0% padding-box #FFF;\
    border-right: 1px solid rgba(0, 0, 0, 0.2);\
    border-width: medium 1px 1px;\
    border-style: none solid solid;\
    border-color: -moz-use-text-color rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.2);\
    -moz-border-top-colors: none;\
    -moz-border-right-colors: none;\
    -moz-border-bottom-colors: none;\
    -moz-border-left-colors: none;\
    border-image: none;\
    color: #444;\
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);\
    border-bottom-left-radius: 5px;\
    border-bottom-right-radius: 5px;}\
.user_toolbar > ul > li ul li.hover > .drop-down,\
.user_toolbar > ul > li ul li.hover > ul {\
    left: 100% !important;\
    top: -1px;\
    margin-left: 0px !important;\
    display: block;}\
.user_toolbar > ul > li ul li.hover > .drop-down:before {\
    font-family: "FontAwesome";\
    content: "";\
    color: #474543;\
    position: absolute;\
    left: -20px;\
    top: 0px;}\
.user_toolbar .drop-down-private-messages,\
.user_toolbar .drop-down-notifications {\
  overflow: hidden;}\
.user_toolbar ul.drop-down-private-messages,\
.user_toolbar .drop-down-private-messages,\
.user_toolbar ul.drop-down-notifications,\
.user_toolbar .drop-down-notifications {\
    width: 550px;\
    left: -52px !important;}\
.user_toolbar li ul.drop-down-private-messages ul,\
.user_toolbar li ul.drop-down-notifications ul,\
.user_toolbar li .drop-down ul {\
    min-height: 50px;\
    max-height: 420px;\
    overflow: auto;\
    position: relative;\
    border: none;}\
.user_toolbar li .drop-down-notifications li * {\
  line-height: 0px;}\
.user_toolbar li > ul.drop-down-notifications li,\
.user_toolbar li .drop-down-notifications li {\
    display: block;\
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);\
    padding: 8px 80px 8px 10px;\
    line-height: 1.2em;\
    overflow: hidden;\
    position: relative;\
    font-weight: initial;}\
.user_toolbar li > ul.drop-down-private-messages li,\
.user_toolbar li .drop-down-private-messages li {\
    display: block;\
    border-bottom: 1px solid #DDD;\
    padding: 6px 80px 6px 8px;\
    line-height: 1.4em;\
    overflow: hidden;\
    position: relative;\
    font-weight: initial;}\
.user_toolbar li > ul.drop-down-notifications li,\
.user_toolbar li .drop-down-notifications li {\
    line-height: 1.2em;\
    font-size: 12px;}\
.user_toolbar li > ul.drop-down-notifications li i,\
.user_toolbar li .drop-down-notifications li i {\
    margin-right: 4px;}\
.user_toolbar li .drop-down-notifications li p {\
    display: inline !important;}\
.user_toolbar li > ul.drop-down-private-messages li .date,\
.user_toolbar li > ul.drop-down-notifications li .date,\
.user_toolbar li .drop-down li .date {\
    position: absolute;\
    top: 50%;\
    right: 10px;\
    margin-top: -7px;\
    font-size: 0.9em;}\
.user_toolbar li ul.drop-down-notifications li a,\
.user_toolbar li .drop-down-notifications li a {\
    font-weight: bold;\
    padding: 0px;\
    color: #507E2C;\
    text-decoration: none;\
    cursor: pointer;\
    display: inline;}\
.user_toolbar li ul.drop-down-private-messages li a,\
.user_toolbar li .drop-down-private-messages li a {\
    background: none !important;\
    color: #333;\
    font-size: 1.1em;\
    display: inline;\
    padding: 0px;}\
.user_toolbar li ul.drop-down-private-messages li .avatar,\
.user_toolbar li .drop-down-private-messages li .avatar {\
    border-radius: 4px;\
    width: 38px;\
    height: 38px;\
    margin-right: 8px;\
    padding: 2px;\
    vertical-align: middle;\
    float: left;\
    background: none repeat scroll 0% 0% #FFF;\
    border-width: 1px;\
    border-style: solid;\
    border-right: 1px solid #BEBAB4;\
    border-color: #D6D1CB #BEBAB4 #BEBAB4 #D6D1CB;\
    -moz-border-top-colors: none;\
    -moz-border-right-colors: none;\
    -moz-border-bottom-colors: none;\
    -moz-border-left-colors: none;\
    border-image: none;}\
.user_toolbar li ul.drop-down-notifications li i,\
.user_toolbar li .drop-down-notifications li i {\
    position: relative;\
    padding: 0px;\
    border: none;\
    background: none;\
    display: inline;}\
.user_toolbar .drop-down-header {\
    border-bottom: 1px solid #CCC;\}\
.user_toolbar .drop-down-footer, .user_toolbar .drop-down-header {\
    background: none repeat scroll 0% 0% #EEE;\
    padding: 3px 8px;\
    line-height: 1;\
    text-align: left;}\
.user_toolbar .drop-down-footer .styled_button,\
.user_toolbar .drop-down-header .styled_button {\
    padding: 6px;}\
.user_toolbar .drop-down-footer .styled_button i,\
.user_toolbar .drop-down-header .styled_button i {\
    position: relative;\
    padding: 0px;\
    margin: 0px;\
    color: inherit;\
    background: none;\
    border: none;\
    display: inline-block;\
    width: auto;\
    line-height: inherit;}\
.user_toolbar li > ul.drop-down-private-messages li .message-content,\
.user_toolbar li .drop-down-private-messages li .message-content {\
    color: #AAA;}\
.user_toolbar li > ul.drop-down-private-messages li .message-content:after,\
.user_toolbar li .drop-down-private-messages li .message-content:after {\
    content: "...";}\
.user_toolbar ul.loading:after,\
.user_toolbar .drop-down ul.loading:after {\
  animation: 2s linear 0s normal none infinite running fa-spin;\
  line-height: 28px;\
  position: absolute;\
  content: "";\
  font-family: FontAwesome;\
  left: 50%;\
  top: 50%;\
  margin-left: -14px;\
  margin-top: -14px;\
  font-size: 28px;\
  color: #333;}\
.user_toolbar  ul.loading li {\
    opacity: 0.5;}\
.items .editing_button {\
  position: relative;\
  display: block;\
  padding-left: 46px;\
  text-align: left;\
  background: #FFF;\
  border: 1px solid rgba(0, 0, 0, 0.3);\
  color: #444;\
  text-shadow: none;}\
.items .editing_button:hover {\
  outline: 3px solid rgba(255,255,0,0.4);}\
.items .editing_button i,\
.items .editing_button .feed-link:before, .items .editing_button .notifications-link:before, .items .editing_button .mail-link:before {\
  margin-right: 8px;\
  text-align: center;\
  color: #666;\
  font-size: 14px;\
  position: absolute;\
  left: 0px;\
  top: 0px;\
  bottom: 0px;\
  background: #F8F8F8;\
  line-height: 38px;\
  width: 35px;\
  border-right: 1px solid rgba(0, 0, 0, 0.15);}\
.user_toolbar > ul > li > label {\
  vertical-align: initial;}\
.items .editing_button .feed-link:before, .items .editing_button .notifications-link:before, .items .editing_button .mail-link:before {\
  width: 34px;}\
.user_toolbar > ul > li > label a {\
  float: left;\
  margin: 5px;}\
.nav-bar-list .editing_button[data-type="spacer"]:before {\
  font-size: 30px;\
  line-height: 35px;}\
.nav-bar-list .iconize {\
  display: block;\
  font-size: 14px;}\
.user_toolbar > ul > li ul .iconize > .label {\
  margin-left: -10px;}\
.nav-bar-list .iconize > .label {\
  display: none;}\
.nav-bar-list .editing_button[data-type="spacer"]:before, .nav-bar-list .iconize {\
  color: #C8CCE0;\
  padding: 0px 8px;\
  font-weight: bold;}\
.user_toolbar > ul > .editing_button[data-type="spacer"],\
.user_toolbar > ul > .editing_button[data-type="divider"],\
.user_toolbar > ul > .divider {\
  display: inline-block;\
  width: 2px;\
  height: 39px !important;\
  box-shadow: 0px 0px 8px transparent inset;\
  border-right: 1px solid rgba(0, 0, 0, 0.2);\
  border-top: 1px solid rgba(0, 0, 0, 0.2);\
  margin: -1px 0px 0px;\
  position: relative;\
  z-index: 5;}\
.user_toolbar > ul > li ul li.spacer {\
  height: 1px;\
  width: initial !important;\
  background: #CCC;}\
.nav-bar-list > .spacer:hover {\
  background: none !important;}\
.user_toolbar > ul > .spacer {\
  border: none;}\
.user_toolbar > ul > .spacer + li {\
    border-left: 1px solid rgba(0, 0, 0, 0.2);}\
.user_toolbar > ul > .divider {\
  background-color: rgba(255, 255, 255, 0.1) !important;}\
.nav-bar-list > .divider {\
  background: none !important;\
  width: 5px;}\
\
.user_toolbar > ul > li.no-hover {\
  background: none;}\
.user_toolbar #site-search > div {\
  height: 35px !important;\
  vertical-align: baseline !important;}\
.user_toolbar #site-search .button-group {\
  margin: 0px;\
  padding: 0px;}\
.user_toolbar #site-search .button-group > a.styled_button {\
  margin-top: -40px;\
  margin-bottom: -40px;\
  line-height: 28px;}\
.user_toolbar > ul > li > #site-search .drop-down-show ul {\
  display: block;}\
.user_toolbar > ul > li > #site-search input {\
  background-color: rgba(0,0,0,0.3);\
  border: 1px solid rgba(0, 0, 0, 0.2);\
  background-clip: padding-box;\
  padding: 6px;\
  margin-top: -4px;\
  outline: medium none;\
  color: #C8CCE0;\
  vertical-align: middle;\
  line-height: 26px;\
  width: 200px;}\
.user_toolbar > ul > li ul #site-search .styled_button,\
.user_toolbar > ul > li > #site-search .styled_button {\
  box-shadow: none;\
  border-radius: 0px;\
  border: none;\
  line-height: 26px;\
  padding: 5px;\
  vertical-align: middle;\
  border-right: 1px solid rgba(0, 0, 0, 0.2);\
  border-top: 1px solid rgba(0, 0, 0, 0.2);\
  margin: -4px 0px 0px 0px;\
  background: none repeat scroll 0% 0% rgba(255, 255, 255, 0.1);}\
.user_toolbar > ul > li > #site-search .styled_button,\
.user_toolbar > ul > li > #site-search .styled_button i {\
  text-shadow: none;\
  color: rgba(0, 0, 0, 0.85);\
  font-weight: bold;\
  margin-right: 0px;}\
.user_toolbar > ul > li ul #site-search > div {\
  position: initial !important;\
  display: block !important;}\
.user_toolbar > ul > li ul #site-search > div:first-child + div {\
  margin-bottom: -20px;\
  margin-top: -11px;}\
.user_toolbar > ul > li ul #site-search > div:first-child + div + div {\
  margin-bottom: 0px;\
  border-bottom: solid 1px #CCC;}\
.user_toolbar > ul > li ul #site-search input {\
  position: absolute;\
  border: none;\
  border-top: solid 1px #CCC;\
  padding-right: 5px;\
  line-height: 38px;\
  top: 0px;\
  bottom: 0px;\
  left: 0px;\
  right: 0px;\
  width: 100%;}\
.user_toolbar > ul > li ul #site-search .drop-down ul {\
  left: 0 !important;}\
.user_toolbar > ul > li ul #site-search .styled_button {\
  height: 35px;}\
.user_toolbar > ul > li ul #site-search > div > .styled_button {\
  position: absolute;\
  right: 0px;\
  bottom: -4px;\
  width: 35px;\
  margin-right: 0px;\
  margin-bottom: 5px;}\
.user_toolbar > ul > li ul #site-search .button-group {\
  position: absolute;\
  left: 0px;\
  bottom: -4px;\
  right: 35px;}\
.user_toolbar > ul > li ul #site-search .button-group > a span {\
  margin-left: 40px;\
  color: initial;\
  text-shadow: none;}\
.user_toolbar > ul > li ul #site-search > div > .styled_button i {\
  border-right: none !important;}\
.user_toolbar > ul > li ul #site-search > div > .styled_button i,\
.user_toolbar > ul > li ul #site-search .button-group > a i {\
  margin: 0px;\
  color: initial;}\
.user_toolbar #site-search .drop-down-show > .drop-down {\
  display: block !important;}\
.user_toolbar #site-search .button-group .drop-down ul,\
.user_toolbar #site-search .button-group-vertical .drop-down ul {\
  background: none;}\
.user_toolbar #site-search .drop-down ul li a {\
  display: block !important;\
  padding: 0px !important;\
  margin: 0px !important;\
  color: inherit;}\
.user_toolbar #site-search .drop-down ul li:hover i {\
  color: inherit;\
  width: 35px;}\
.user_toolbar #site-search .button-group .drop-down i,\
.user_toolbar #site-search .button-group-vertical .drop-down i {\
  margin-right: 8px !important;\
  background: none;\
  border: none;\
  position: initial;}\
\
/*Search Dropdown fix*/\
.nav_bar .no-hover .button-group:not(.drop-down-show) > .drop-down {\
  display: none !important;}\
.nav_bar .no-hover .button-group.drop-down-show > .drop-down {\
  display: block !important;}\
.nav_bar .no-hover .button-group > .drop-down {\
  left: auto;}\
\
.editor > li {\
  vertical-align: top !important;}\
.custom_button {\
  cursor: pointer;\
  -webkit-user-select: none;\
  -moz-user-select: none;}\
.button:not(.editing) .editBox {\
  display: none;}\
.button.editing + div.menu_list {\
  display: block;\
  visibility: visible;\
  opacity: 1;}\
body.editing .nav_bar,\
body.editing .editor:not(.label) {\
  min-height: 40px;\
  height: auto !important;}\
body.editing .user_toolbar > ul:not(.editor),\
body.editing .nav_bar ul:not(.editor):not(.non-editor),\
body:not(.editing) .user_toolbar .editor,\
body:not(.editing) .nav_bar .editor,\
.user_toolbar .bin .items {\
  display: none !important;}\
.editor ul {\
  border-radius: 0px !important;\
  box-shadow: none !important;}\
.editor ul:before {\
  display: none;}\
.editing_button li i {\
    border-radius: 0px !important;}\
.editing_button li:hover > a {\
    background: none !important;}\
.editing_button li:hover .button > i {\
    background: none repeat scroll 0% 0% #474543;\
    color: #FFF;\
    border: 1px solid rgba(0, 0, 0, 0.15);\
    left: -1px;\
    top: -1px;\
    width: 36px;}\
.editing_button .editing_button.hover > ul.items {\
  margin-left: -11px !important;}\
.editing_button ul {\
    position: initial !important;\
    display: inline-block !important;}\
.editor > .editing_button[data-type="spacer"]:hover,\
.editor > .editing_button[data-type="divider"]:hover {\
    background-color: rgba(0, 0, 0, 0.1);}\
.editor > .editing_button[data-type="spacer"] {\
  text-align: center;\
  width: 30px !important;}\
.editor > .editing_button[data-type="spacer"]:before {\
  content: ":";}\
.editor > .editing_button[data-type="divider"] {\
  width: 5px !important;}\
.items .editing_button[data-type="spacer"],\
.items .editing_button[data-type="divider"] {\
  height: 5px;\
  background: none repeat scroll 0% 0% #CCC;}\
.editing_button .editing_button a {\
padding-left: 0px !important;}\
.editing_button a {\
  pointer-events: none !important;}\
.editing_button {\
  cursor: move;}\
.editing_button i {\
  float: none !important;}\
.editing_button .items {\
  cursor: default;\
  min-height: 50px;\
  min-width: 200px;\
  background: rgba(255,255,255,0.3);\
  padding: 5px;}\
.editor .items .items {\
  background: rgba(0,0,0,0.02);\
  border-color: rgba(0,0,0,0.1);\
  border-width: 1px;\
  border-top-style: solid;\
  margin-left: -11px;}\
.editor .items .items:hover {\
  background: rgba(0,0,0,0.03);}\
.editor .items .arrow, .user_toolbar > ul > li ul .arrow {\
  display: none;}\
.editing_button:hover {\
  z-index: 0;}\
#button_moving {\
  pointer-events: none;\
  z-index: 100000;\
  position: fixed !important;}\
#button_moving:after {\
  content: "Click to place, ESC to cancel";\
  display: block;\
  position: absolute;\
  white-space: nowrap;\
  top: -20px;\
  background: rgba(255,255,255,0.4);\
  border-radius: 5px;\
  padding: 0 5px 0 5px;\
  line-height: 20px;\
  font-size: 12px;}\
.editor.inner, .editor.label {\
  border-radius: 0px;\
  border-bottom: none;}\
.bin {\
  box-shadow: none !important;\
  padding-top: 1px;\
  border-top: none !important;}\
.editor.label, .editor.bin {\
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.15);}\
.editor.label {\
  position: relative;\
  height: 25px;}\
.editor.label span {\
  position: absolute;\
  left: 0px;\
  right: 0px;\
  border-radius: 0 0 100% 100%;\
  box-shadow: 0px -2px 2px rgba(0,0,0,0.1) inset;\
  background-color: rgba(250, 240, 230, 0.6) !important;}\
\
/*Dropdown radius fix*/\
.user_toolbar > ul > li ul li:last-child a > i {\
    border-bottom-left-radius: 4px;}\
.user_toolbar > ul > li > ul ul {\
    border-bottom-left-radius: 4px;\
    border-bottom-right-radius: 4px;}');
        
        var buttonRegistry = new register();
        var usedButtons = new register();
        var unusedButtons = new register();

        var customButtonData = [];
        
        var toolbar = $('nav.user_toolbar > ul').first();
        var navbar = $('.light > .nav-bar-list');
        
        var held = null;

        var nav = new Deck();
        var def = new ToolBar(toolbar.children());
        var disabled = new ToolBar([]);
        
        makeCustomButtons(3);
        
        var norm = [
            nav.getConfig(),
            def.getConfig()
        ];
        
        var conf = getConfig();
        
        if (conf != norm && conf.length == 2) {
            usedButtons.flush(false);
            unusedButtons.flush(false);
            nav.fromConfig(conf[0]);
            def.fromConfig(conf[1]);
            nav.gen();
            def.gen(toolbar);
            updateSpacers();
        }
        
        loadUnusedButtons(disabled);
        
        nav.getContainer(navbar, ['nav-bar-list'], function () {
            return this.isPinnable();
        });
        
        disabled.getContainer(toolbar, ['bin'], function () {
            return this.type != 'pin' && this.children.length == 0;
        });
        
        $(toolbar).after('<ul class="editor label"><span><i class="fa fa-trash-o" /> Disabled Items</span></ul>');
        
        def.getContainer(toolbar, ['inner'], function () {
            return true;
        });
        
        $(document).mousemove(function (e) {
            if ($('#button_moving').length > 0) {
                $('#button_moving').css('top', (e.clientY - $('#button_moving').attr('data_offset_Y')) + 'px');
                $('#button_moving').css('left', (e.clientX - $('#button_moving').attr('data_offset_X')) + 'px');
            }
        });
        $(document).on('keypress', function (e) {
            if (e.keyCode == 27) {
                if (held != null) held.drop();
            }
        });
        $(document).on('click','.user_toolbar .button-close', function(a) {
            var b = $(this).closest("li");
            b.hasClass("hover") && (a.preventDefault(), b.removeClass("hover"))
        });
        $(document).on('click', '.toggle_edit_toolbar', function () {
            if ($('.user_toolbar > ul:not(.editor)').first().css('background-color') != 'transparent') {
                $('.user_toolbar > ul.editor').css('background', $('.user_toolbar > ul:not(.editor)').first().css('background-color'));
            }
            if ($('body').hasClass('editing')) {
                $('body').removeClass('editing');
            } else {
                $('body').addClass('editing')
            }
            updateSpacers();
        });
        $(document).on('click', '.reset_toolbar', function () {
            setConfig(norm);
            clearUnusedButtons();
            usedButtons.flush(false);
            unusedButtons.flush(false, true);
            nav.flush();
            nav.fromConfig(norm[0]);
            def.fromConfig(norm[1]);
            loadUnusedButtons(disabled);
            nav.gen();
            nav.getEdit();
            def.gen(toolbar);
            def.getEdit();
            disabled.getEdit();
            updateSpacers();
        });
        $(window).on('resize', function() {
            updateSpacers();
        });
        
        if ($('.banner-buttons').length) {
            $('.banner-buttons').append('<a class="toggle_edit_toolbar" href="javascript:void();" >Arrange Buttons</a><a class="reset_toolbar" href="javascript:void();" style="margin-left: 5px;">Reset Toolbar</a>');
        } else {
            $('.nav_bar .right > ul').append('<li><a class="toggle_edit_toolbar" href="javascript:void();" ><i class="fa fa-pencil pin_link" /></a></li><li><a class="reset_toolbar" href="javascript:void();"><i class="fa fa-undo pin_link" /></a></li>');
            $('.nav_bar .right > ul').addClass('non-editor');
        }
    }
    
    function preInit() {
        var but = $('.user_toolbar > ul > li > a[href^="/user/"]').children('span').first();
        but.html(but.html().replace('▼','<span class="arrow">▼</span>'));
    }

    function getConfig() {
        var result = GM_getValue('config', norm);
        if (typeof result === 'string') return JSON.parse(result);
        return norm;
    }

    function setConfig(used) {
        conf = used;
        GM_setValue('config', JSON.stringify(used));
    }

    function loadUnusedButtons(p) {
        var result = [];
        var ids = GM_getValue('unused', null);
        if (ids == null) {
            ids = defaultUnused();
        } else {
            ids = JSON.parse(ids);
        }
        for (var i = 0; i < ids.length; i++) {
            var index = parseInt(ids[i]);
            if (index >= buttonRegistry.neglength() && index < buttonRegistry.poslength()) {
                var b = buttonRegistry.get(index);
                b.children = [];
                b._parent = p;
                b._index = result.length;
                result.push(b);
                unusedButtons.set(index, true);
            }
        }
        for (var i = unusedButtons.neglength() ; i < 0; i++) {
            var b = buttonRegistry.get(i);
            if (unusedButtons.get(i) && !usedButtons.get(i) && !arrContains(result, b)) {
                b.children = [];
                b._parent = p;
                b._index = result.length;
                result.push(b);
                usedButtons.set(i, false);
            }
        }
        p.children = result;
        return p;
    }

    function arrContains(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == item) return true;
        }
        return false;
    }

    function saveUnusedButtons() {
        var value = [];
        for (var i = buttonRegistry.neglength() ; i < buttonRegistry.poslength() ; i++) {
            if (unusedButtons.get(i)) {
                value.push(i);
            }
        }
        GM_setValue('unused', JSON.stringify(value));
    }

    function defaultUnused() {
        var value = [];
        for (var i = buttonRegistry.neglength() ; i < 0; i++) {
            value.push(i);
        }
        return value;
    }

    function clearUnusedButtons() {
        for (var i = unusedButtons.neglength() ; i < unusedButtons.poslength() ; i++) {
            unusedButtons.set(i, i < 0);
            if (i < 0) {
                var b = buttonRegistry.get(i);
                b.children = [];
                b._parent = disabled;
            }
        }
        for (var i = 0; i < disabled.children.length; i++) {
            disabled.children[i]._index = i;
        }
        GM_setValue('unused', JSON.stringify(defaultUnused()));
    }

    function searchButton(holder, i, buttons) {
        for (var j = 0; j < norm.length; j++) {
            if (norm[j]['i'] == i) {
                var b = buttonRegistry.get(i);
                b._index = holder.children.length;
                b._parent = button;
                holder.children.push();
                usedButtons.set(i, true);
                unusedButtons.set(i, false);
                break;
            } else if (norm[j]['c'] != null) {
                searchButton(buttonRegistry.get(i), norm[j]['c']);
            }
        }
    }

    function getButton(entry) {
        var index = parseInt(entry['i']);
        if (index >= buttonRegistry.neglength() && index < buttonRegistry.poslength()) {
            var button = buttonRegistry.get(index);
            usedButtons.set(index, true);
            unusedButtons.set(i, false);
            var childs = [];
            for (var i = 0; i < button.children.length; i++) {
                if (button.children[i].type == 'hidden') {
                    childs.push(button.children[i]);
                }
            }
            if (entry['c'] != null) {
                for (var i = 0; i < entry['c'].length; i++) {
                    var b = getButton(entry['c'][i]);
                    if (b != null) {
                        b._index = childs.length;
                        b._parent = button;
                        childs.push(b);
                    }
                }
            }
            button.children = childs;

            return button;
        }
        return null;
    }

  //function Button(custom, el, handleChilds, typ, name) {
    function Button(p, index, el, handleChilds, typ, name) {
        if (p == true) {
            buttonRegistry.cust(this);
            usedButtons.cust(false);
            unusedButtons.cust(true);
            this.id = buttonRegistry.neglength();
            
            p = disabled;
            name = typ;
            typ = handleChilds;
            handleChilds = el;
            el = index;
            index = disabled.children.length;
            disabled.children.push(this);
        } else {
            this.id = buttonRegistry.poslength();
            buttonRegistry.push(this);
            usedButtons.push(false);
            unusedButtons.push(false);
        }
        
        
        this.originalElement = $(el);
        
        $(this.originalElement).find('.nav-bar-drop-down, .drop-down').addClass('nav-bar-drop-down').addClass('drop-down');
        
        if (this.originalElement.hasClass('divider')) typ = 'divider';
        this.type = typ == null ? 'button' : typ;
        this._parent = p;
        this._index = index;
        var _removed = false;
        this.timeout = true;
        this.listNode = null;
        this.children = [];
        this.name = name;
        
        this.originalParent = $($(el).parent());
        this.originalIndex = this.originalElement.index();
        
        if (handleChilds && !$(this.originalElement).find('.bookshelves').length) {
            this.listNode = $(this.originalElement.find('ul')[0]);
            if (!this.listNode.length) {
                this.listNode = null;
            } else {
                var childs = this.listNode.children();
                for (var i = 0; i < childs.length; i++) {
                    if (childs[i].tagName == 'LI') {
                        this.children.push(new Button(this, i, childs[i], false, this.type));
                    } else {
                        this.children.push(new Baggage(childs[i]));
                    }
                }
            }
        }

        this.getconfigEntry = function () {
            var result = {
                'i': this.id
            };
            if (this.listNode != null) {
                result['c'] = [];
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i].type != 'hidden') {
                        result['c'].push(this.children[i].getconfigEntry());
                    }
                }
            }
            return result;
        }
        this.remove = function () {
            if (!_removed) {
                var newchilds = [];
                for (var i = 0; i < this._parent.children.length; i++) {
                    if (this._parent.children[i] != this) {
                        newchilds.push(this._parent.children[i]);
                    }
                }
                for (var i = 0; i < newchilds.length; i++) {
                    newchilds[i]._index = i;
                }
                this._parent.children = newchilds;
                _removed = true;
            }
        }
        this.gohome = function () {
            unusedButtons.set(this.id, false);
            usedButtons.set(this.id, true);

            var added = false;
            var nesiblings = [];
            var siblings = this.originalParent.children().toArray();
            for (var i = 0; i < siblings.length; i++) {
                if (i == this.originalIndex) {
                    nesiblings.push(this.genNode());
                    added = true;
                }
                nesiblings.push(siblings[i]);
                $(siblings[i]).detach();
            }
            if (!added) {
                nesiblings.push(this.genNode());
            }

            for (var i = 0; i < nesiblings.length; i++) {
                this.originalParent.append(nesiblings[i]);
            }
        }
        this.add = function () {
            if (_removed) {
                unusedButtons.set(this.id, this._parent == disabled);

                var newchilds = [];
                for (var i = 0; i < this._parent.children.length; i++) {
                    if (this._parent.children[i]._index == this._index) {
                        newchilds.push(this);
                        _removed = false;
                    }
                    newchilds.push(this._parent.children[i]);
                }
                if (_removed) {
                    newchilds.push(this);
                    _removed = false;
                }
                for (var i = 0; i < newchilds.length; i++) {
                    newchilds[i]._index = i;
                }
                this._parent.children = newchilds;
            }
        }
        this.genNode = function () {
            $(this.originalElement).removeClass('button-first');
            
            if (this.listNode != null) {
                if (this.children.length > 0) {
                    $(this.listNode).children().detach();
                    for (var i = 0; i < this.children.length; i++) {
                        $(this.listNode).append(this.children[i].genNode());
                    }
                    this.listNode.css('display', '');
                } else {
                    this.listNode.css('display', 'none');
                }
            }
            return this.originalElement;
        }
        this.getEditNode = function () {
            var result = $('<li class="button editing_button" data-type="' + this.type + '" />');
            var copy = this.originalElement.clone();
            var me = this;

            copy.find('.drop-down, .nav-bar-drop-down, ul, input').remove();
            copy.find('.new').removeClass('new');
            var bs = copy.find('.button');
            if (bs.length > 0) {
                result.html('<div class="button">' + bs.first().html() + '</div>');
            } else {
                bs = copy.find('button');
                if (bs.length > 0) {
                    result.html('<div class="button iconize">' + bs.first().html() + (this.name ? '<span class="label">' + this.name + '</span>' : '') + '</div>');
                } else {
                    result.append(copy.html());
                }
            }

            var subs = $('<ul class="items" />');
            if (this.listNode != null) {
                for (var i = 0; i < this.children.length; i++) {
                    subs.append(this.children[i].getEditNode());
                }
                $(result).append(subs);
            }

            $(subs).click(function (e) {
                e.stopPropagation();
                if (me._parent != disabled && me.listNode != null && me.children.length == 0) {
                    held._index = 0;
                    held._parent = me;
                    held.drop();
                }
            });

            if (this.type == 'pin') {
                $(result).click(function (e) {
                    e.stopPropagation();
                    if (held == null) {
                        me.pickup(this, e);
                    } else if (held.timeout) {
                        if (held.isPinnable()) {
                            held._index = me._index;
                            held._parent = me._parent;
                            held.drop();
                        } else if (me._parent != nav) {
                            held._index = me._index;
                            held._parent = me._parent;
                            held.drop();
                        }
                    }
                });
            } else {
                $(result).click(function (e) {
                    e.stopPropagation();
                    if (held == null) {
                        me.pickup(this, e);
                    } else if (held.timeout) {
                        if (me._parent != disabled) {
                            held._index = me._index;
                            held._parent = me._parent;
                            held.drop();
                        } else if ((held.listNode == null || held.children.length == 0) && held.type != 'pin') {
                            held._index = me._index;
                            held._parent = me._parent;
                            held.drop();
                        }
                    }
                });
            }

            return result;
        }

        this.pickup = function (node, e) {
            held = this;
            held.remove();
            held.timeout = false;
            setTimeout(function () {
                held.timeout = true;
            }, 50 * 5);
            
            var offX = e.clientX - ($(node).offset().left - $(window).scrollLeft());
            var offY = e.clientY - ($(node).offset().top - $(window).scrollTop());
            
            var w = $(node).outerWidth();
            var h = $(node).outerHeight();
            var placer = $('<li style="transition:width 0.7s ease,height 0.7s ease;opacity:0;width:' + w + 'px;height:' + h + 'px" />');
            $(node).before(placer);
            setTimeout(function() {
                placer.css('width','0px');
                if (held._parent != def) {
                    placer.css('height','0px');
                }
            },1);
            $(node).css('width', w + 1);
            $(node).css('height', h);
            $(node).attr('data_offset_X', offX);
            $(node).attr('data_offset_Y', offY);
            $(node).css('left', (e.clientX - offX) + 'px');
            $(node).css('top', (e.clientY - offY) + 'px');
            $(node).attr('id', 'button_moving');
            
            def.gen(toolbar);
        }
        this.drop = function () {
            held = null;
            this.add();
            def.gen(toolbar);
            def.getEdit();
            nav.gen();
            nav.getEdit();
            disabled.getEdit();
            setConfig([nav.getConfig(), def.getConfig()]);
            saveUnusedButtons();
        }
        this.isPinnable = function () {
            if (this.type == 'pin') {
                for (var i = 0; i < this.children.length; i++) {
                    if (!this.children[i].isPinnable()) return false;
                }
                return true;
            }
            return this.type == 'divider' || this.type == 'spacer';
        }
    }

    function makeCustomButtons(total) {
        for (var i = 0; i < total; i++) {
            customButtonData.push({
                'icon': 'user',
                'name': 'Custom'
            });
        }
        loadCustomButtons();
        for (var i = 0; i < customButtonData.length; i++) {
            customButton(i);
        }
        for (var i = 0; i < 3; i++) {
            new Spacer();
        }
        saveCustomButtons();
    }

    function resetCustomButtons() {
        for (var i = 0; i < customButtonData.length; i++) {
            customButtonData[i] = {
                'icon': 'user',
                'name': 'Custom'
            };
        }
        saveCustomButtons();
    }

    function loadCustomButtons() {
        var data = JSON.parse(GM_getValue('custom_d', '[]'));
        for (var i = 0; i < data.length; i++) {
            if (i < customButtonData.length) {
                customButtonData[i] = data[i];
            }
        }
    }

    function saveCustomButtons() {
        GM_setValue('custom_d', JSON.stringify(customButtonData));
    }

    function customButton(index) {
        var node = $('<li><ul /></li>');
        var a = $('<a class="button custom_button" href="javascript:void();"><i class="bind_icon fa fa-' + customButtonData[index].icon + '" /><span class="bind_name">' + customButtonData[index].name + '</span></a>');
        node.prepend(a);

        a.dblclick(function () {
            makeEditButtonPopup(a, index);
        });
        new Button(true, node[0], true);
    }

    function Baggage(el) {
        this.genNode = function () {
            return el;
        }
        this.type = 'hidden';
        this.getEditNode = function () {
            return null;
        };
    }
    
    function Spacer() {
        new Button(true, $('<li class="spacer"></li>'), false, 'spacer');
    }
    
    function updateSpacers() {
        spaceOutBar(toolbar.width(), toolbar);
        spaceOutBar($('.nav_bar > .light').width() - $('.nav_bar > .light > .right').width(), navbar);
    }
    
    function spaceOutBar(total, bar) {
        var spacers = bar.find('.spacer');
        if (spacers.length > 0) {
            var taken = 0;
            bar.children('li').each(function() {
                if (!$(this).hasClass('spacer')) {
                    taken += $(this).width();
                }
            });
            spacers.css('width', (total - (taken * 1.2)) / spacers.length);
        }
    }

    function register() {
        this.standard = [];
        this.custom = [];

        this.get = function (i) {
            if (i >= 0) {
                return this.standard[i];
            }
            return this.custom[-(i + 1)];
        }
        this.set = function (i, v) {
            if (i >= 0) {
                this.standard[i] = v;
            } else {
                this.custom[-(i + 1)] = v;
            }
        }
        this.push = function (v) {
            this.standard.push(v);
        }
        this.cust = function (v) {
            this.custom.push(v);
        }
        this.flush = function (p, n) {
            if (typeof (n) == 'undefined') {
                n = p;
            }
            for (var i = 0; i < this.standard.length; i++) {
                this.standard[i] = p;
            }
            for (var i = 0; i < this.custom.length; i++) {
                this.custom[i] = n;
            }
        }

        this.poslength = function () {
            return this.standard.length;
        }

        this.neglength = function () {
            return -(this.custom.length);
        }
    }

    function makeEditButtonPopup(node, index) {
        var pop = makeGlobalPopup('Custom Button', 'fa fa-edit');

        pop.content.parent().css('width', '700px');
        pop.content.append('<table class="properties"><tbody /></table><div class="drop-down-pop-up-footer"><button class="styled_button"><i class="fa fa-save" />Save</button></div>');
        
        pop.scope(pop.find('tbody')).append('<tr><td class="label">Folder Name</td><td><div><input id="custom_folder_name" type="text" placeholder="Custom" /></div></td></tr>');
        
        var icons = ["ambulance", "anchor", "android", "apple", "archive", "asterisk", "ban", "bar-chart-o", "beer", "bell", "bell-o", "bolt", "book", "bookmark", "briefcase", "bug", "building-o", "bullhorn", "calendar", "camera", "certificate", "chain", "chain-broken", "check", "clipboard", "clock-o", "cloud", "cloud-download", "cloud-upload", "coffee", "comment", "comments", "compass", "credit-card", "cutlery", "dashboard", "desktop", "dollar", "download", "eject", "envelope", "envelope-o", "eraser", "euro", "exclamation", "eye", "facebook", "female", "fighter-jet", "file", "file-o", "file-text", "file-text-o", "film", "fire", "fire-extinguisher", "flag", "flag-checkered", "flag-o", "flask", "flickr", "folder", "folder-open", "frown-o", "gamepad", "gbp", "gear", "gears", "gift", "glass", "globe", "google-plus", "hdd-o", "headphones", "heart", "heart-o", "home", "hospital-o", "inbox", "info", "key", "keyboard-o", "laptop", "leaf", "legal", "lemon-o", "lightbulb-o", "linux", "list-ol", "list-ul", "lock", "magic", "magnet", "male", "medkit", "meh-o", "microphone", "minus-circle", "mobile", "money", "moon-o", "music", "pagelines", "paperclip", "pencil", "phone", "picture-o", "plane", "play-circle", "plus-circle", "power-off", "print", "puzzle-piece", "question", "quote-left", "quote-right", "refresh", "repeat", "road", "rocket", "rss", "save", "scissors", "search", "shield", "shopping-cart", "smile-o", "stack-exchange", "star", "star-half", "star-half-empty", "star-o", "stethoscope", "suitcase", "sun-o", "tablet", "tag", "tags", "thumb-tack", "thumbs-down", "thumbs-o-down", "thumbs-o-up", "thumbs-up", "ticket", "times-circle", "tint", "trash-o", "trophy", "truck", "tumblr", "twitter", "umbrella", "unlock", "upload", "user", "users", "video-camera", "warning", "wheelchair", "windows", "wrench", "youtube"];
        pop.content.append('<tr><td class="label">Folder Icon</td><td><div><select id="custom_folder_icon"><option>' + icons.join('</option><option>') + '</option></select></div></td></tr>');
        
        pop.find('button').click(function () {
            var v = pop.find('#custom_folder_name').val();
            customButtonData[index].name = v == '' ? 'Custom' : v;
            node.find('.bind_name').html(customButtonData[index].name);
            v = pop.find('#custom_folder_icon option:selected').text();
            customButtonData[index].icon = v;
            node.find('.bind_icon').attr('class', 'bind_icon fa fa-' + v);
            saveCustomButtons();
            $('#message_close_button').click();
        });
        pop.find('#custom_folder_name').val(customButtonData[index].name);
        pop.find('#custom_folder_icon').val(customButtonData[index].icon);
        
        pop.position('center', 'center');
    }

    //==API FUNCTION==//
    function getIsLoggedIn() {
        try {
            return (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : window).logged_in_user != null;
        } catch (e) {
        }
        return false;
    }

    //==API FUNCTION==//
    function makeStyle(input, id) {
        while (input.indexOf('  ') != -1) input = input.replace(/  /g,' ');
        var style = document.createElement('style');
        $(style).attr('type', 'text/css');
        $(style).append(input);
        if (id) style.id = id;
        $('head').append(style);
    }

    //==API FUNCTION==//
    function Popup(holder, dark, cont) {
        this.holder = holder;
        this.dark = dark;
        this.content = this.unscoped = cont;
        this.scoped = null;
        this.position = function(x, y, buff) {
            if (this.holder != null) position(this.holder, x, y, buff);
        }
        this.scope = function(el) {
            if (typeof el == 'string') {
                el = $(el);
                this.content.append(el);
            }
            return this.content = el;
        }
        this.unscope = function(el) {
            this.content = this.unscoped;
            if (typeof el !== 'undefined') this.scope(el);
            return this.content;
        }
        this.find = function(el) {
            return this.content.find(el);
        }
    }

    //==API FUNCTION==//
    function makeGlobalPopup(title, fafaText, darken, close) {
        if (typeof (close) == 'undefined') close = true;
        if (typeof (darken) == 'undefined') darken = 100;
        var holder = $('<div style="position: fixed;z-index:2147483647;left:10px;top:10px" class="global_popup drop-down-pop-up-container" />');
        $("body").append(holder);

        var dark = null;
        if (darken) {
            dark = $('<div class="dimmer" style="z-index:1001;" />');
            if (typeof (darken) == 'number') dark.css('opacity', (darken / 100));
            $('#dimmers').append(dark);
        }

        var pop = $('<div class="drop-down-pop-up" style="width: auto" />');
        holder.append(pop);

        var head = $('<h1 style="cursor:move">' + title + '</h1>');
        pop.append(head);
        if (fafaText) head.prepend("<i class=\"" + fafaText + "\" /i>");
        head.on('mousedown', function(e) {
            var x = e.clientX - parseFloat(holder.css('left'));
            var y = e.clientY - parseFloat(holder.css('top'));
            $(document).on('mousemove.popup.global', function(e) {
                position(holder, e.clientX - x, e.clientY - y);
            });
            $(document).one('mouseup', function(e) {
                $(this).off('mousemove.popup.global');
            });
            e.preventDefault();
        });

        var c = $('<a id="message_close_button" class="close_button" />');
        head.append(c);
        $(c).click(function(e) {
            if (close) {
                $(dark).fadeOut('fast', function () {
                    $(this).remove()
                });
                $(holder).remove();
            } else {
                $(holder).css('display','none');
            }
        });

        var content = $('<div class="drop-down-pop-up-content" />');
        pop.append(content);
        return new Popup(holder, dark, content);
    }

    //==API FUNCTION==//
    function position(obj, x, y, buff) {
        if (typeof x == "string" && x.toLowerCase() == "center") {
            x = ($(window).width() - $(obj).width()) / 2;
        }
        if (typeof y == "string" && y.toLowerCase() == "center") {
            y = ($(window).height() - $(obj).height()) / 2;
        }
        if (typeof x == 'object') {
            var parameters = x;
            var positioner = x.object != null ? x.object : x;
            buff = x.buffer != null ? x.buffer : y;

            y = $(positioner).offset().top - $(window).scrollTop();
            x = $(positioner).offset().left - $(window).scrollLeft();

            if (parameters.offX != null) x += parameters.offX;
            if (parameters.offY != null) y += parameters.offY;
        }

        if (buff == null) buff = 0;
        if (x < buff) x = buff;
        if (y < buff) y = buff;

        var maxX = $(window).width() - ($(obj).width() + buff);
        if (x > maxX) x = maxX;

        var maxY = $(window).height() - ($(obj).height() + buff);
        if (y > maxY) y = maxY;

        $(obj).css('top', y + "px");
        $(obj).css('left', x + "px");
    }
    
    RunScript(function() {
        window.registerToolbarButton = function(obj, offsetType, index) {
            $(window).trigger('registerToolbarButton', [obj,offsetType,index]);
        }
        window.registerToolbarButton.toString = RunScript.toString;
    }, true);
    
    $(window).on('registerToolbarButton', function(e, obj, offsetType, index) {
        if (offsetType == -1) index = def.children.length - index;
        def.fromConfig(norm[1]);
        def.gen(toolbar);
        for (var i = 0; i < def.children.length; i++) {
            if (i == index) {
                def.children.splice(i, 0, new Button(def, i, obj, true));
            }
            def.children[i]._index = i;
        }
        norm[1] = def.getConfig();
        def.fromConfig(conf[1]);
        def.gen(toolbar);
        def.getEdit();
    });
});