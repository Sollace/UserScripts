// ==UserScript==
// @name        Controls Freak
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net*
// @include     https://www.fimfiction.net*
// @version     1.3.6
// @require     http://code.jquery.com/jquery-1.8.3.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

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
        config = JSON.parse(config);
        
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
        this.children.push(new Button(this, 3, $('#form_search_sidebar'), false, 'pin'));

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
.iconize, .mail-link:before, .notifications-link:before, .feed-link:before {\
    line-height: 45px;\
    text-align: center;\
    display: inline-block;\
    font-family: FontAwesome;\
    font-weight: normal;}\
.user_toolbar > ul > li > .iconize, .user_toolbar > ul > li > .notifications-link:before, .user_toolbar > ul > li > .mail-link:before, .user_toolbar > ul > li > .feed-link:before {\
    margin-right: 5px;\
    font-size: 16px;\
    line-height: inherit;}\
.user_toolbar > ul > li > ul li .iconize, .user_toolbar > ul > li > ul li .notifications-link:before, .user_toolbar > ul > li > ul li .mail-link:before, .user_toolbar > ul > li > ul li .feed-link:before {\
    margin-right: 8px;\
    text-align: center;\
    color: #666;\
    font-size: 14px;\
    position: absolute;\
    left: 0px;\
    top: 0px;\
    bottom: 0px;\
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
  .user_toolbar .drop-down.drop-down-notifications,\
  .user_toolbar .drop-down.drop-down-private-messages {\
    left: 0px !important;}\
  .user_toolbar > ul ul li div.drop-down.drop-down-notifications,\
  .user_toolbar > ul ul li div.drop-down.drop-down-private-messages {\
    position: initial;\
    width: 100%;\
    border-radius: 5px;}\
  .user_toolbar .drop-down.drop-down-notifications ul,\
  .user_toolbar .drop-down.drop-down-private-messages ul {\
    background: #fff !important;\
    box-shadow: none !important;\
    padding: 0px !important;\
    margin: 0px !important;\
    border: 1px solid rgba(0, 0, 0, 0.3) !important;\
    border-radius: 0px !important;}\
  .user_toolbar .drop-down.drop-down-notifications li,\
  .user_toolbar .drop-down.drop-down-private-messages li {\
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
.user_toolbar .drop-down.drop-down-private-messages,\
.user_toolbar .drop-down.drop-down-notifications {\
  overflow: hidden;}\
.user_toolbar ul.drop-down-private-messages,\
.user_toolbar .drop-down.drop-down-private-messages,\
.user_toolbar ul.drop-down-notifications,\
.user_toolbar .drop-down.drop-down-notifications {\
    width: 550px;\
    left: -52px;}\
.user_toolbar li ul.drop-down-private-messages ul,\
.user_toolbar li ul.drop-down-notifications ul,\
.user_toolbar li .drop-down ul {\
    min-height: 50px;\
    max-height: 420px;\
    overflow: auto;\
    position: relative;\
    border: none;}\
.user_toolbar li .drop-down.drop-down-notifications li * {\
  line-height: 0px;}\
.user_toolbar li > ul.drop-down-notifications li,\
.user_toolbar li .drop-down.drop-down-notifications li {\
    display: block;\
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);\
    padding: 8px 80px 8px 10px;\
    line-height: 1.2em;\
    overflow: hidden;\
    position: relative;\
    font-weight: initial;}\
.user_toolbar li > ul.drop-down-private-messages li,\
.user_toolbar li .drop-down.drop-down-private-messages li {\
    display: block;\
    border-bottom: 1px solid #DDD;\
    padding: 6px 80px 6px 8px;\
    line-height: 1.4em;\
    overflow: hidden;\
    position: relative;\
    font-weight: initial;}\
.user_toolbar li > ul.drop-down-notifications li,\
.user_toolbar li .drop-down.drop-down-notifications li {\
    line-height: 1.2em;\
    font-size: 12px;}\
.user_toolbar li > ul.drop-down-notifications li i,\
.user_toolbar li .drop-down.drop-down-notifications li i {\
    margin-right: 4px;}\
.user_toolbar li .drop-down.drop-down-notifications li p {\
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
.user_toolbar li .drop-down.drop-down-notifications li a {\
    font-weight: bold;\
    padding: 0px;\
    color: #507E2C;\
    text-decoration: none;\
    cursor: pointer;\
    display: inline;}\
.user_toolbar li ul.drop-down-private-messages li a,\
.user_toolbar li .drop-down.drop-down-private-messages li a {\
    background: none !important;\
    color: #333;\
    font-size: 1.1em;\
    display: inline;\
    padding: 0px;}\
.user_toolbar li ul.drop-down-private-messages li .avatar,\
.user_toolbar li .drop-down.drop-down-private-messages li .avatar {\
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
.user_toolbar li .drop-down.drop-down-notifications li i {\
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
.user_toolbar li .drop-down.drop-down-private-messages li .message-content {\
    color: #AAA;}\
.user_toolbar li > ul.drop-down-private-messages li .message-content:after,\
.user_toolbar li .drop-down.drop-down-private-messages li .message-content:after {\
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
.user_toolbar > ul > #form_search_sidebar {\
  background-color: rgba(255, 255, 255, 0.1);}\
.user_toolbar > ul > #form_search_sidebar .nav-bar-search {\
  background-color: rgba(0,0,0,0.3);\
  border: 1px solid rgba(0, 0, 0, 0.2);\
  background-clip: padding-box;\
  padding: 6px;\
  margin-top: -4px;\
  margin-bottom: -1px;\
  outline: medium none;\
  color: #C8CCE0;\
  vertical-align: middle;\
  line-height: 26px;\
  width: 200px;}\
.user_toolbar > ul > li ul .search_submit,\
.user_toolbar > ul > #form_search_sidebar .search_submit {\
  background: none;\
  border: none;\
  padding: 5px;\
  outline: medium none;\
  vertical-align: middle;\
  font-family: "FontAwesome";\
  line-height: 26px;\
  margin-top: -4px;\
  margin-bottom: -1px;}\
.user_toolbar > ul > li ul #form_search_sidebar {\
  position: relative;\
  height: 40px;\
  margin: 0px;\
  padding: 0px;}\
.user_toolbar > ul > #form_search_sidebar .search_submit:hover {\
  background-color: rgba(0,0,0, 0.1);}\
.user_toolbar > ul > li ul .search_submit,\
.user_toolbar > ul > li ul #form_search_sidebar .nav-bar-search {\
  position: absolute;\
  border: 1px solid #CCC;}\
.user_toolbar > ul > li ul #form_search_sidebar .nav-bar-search {\
  line-height: 38px;\
  top: 0px;\
  bottom: 0px;\
  left: 0px;\
  padding-right: 18px;}\
.user_toolbar > ul > li ul .search_submit {\
  top: 0px;\
  right: 0px;\
  bottom: 0px;\
  width: 35px;\
  margin-top: 0px;\
  margin-bottom: 0px;}\
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
body.editing .user_toolbar ul:not(.editor),\
body.editing .nav_bar ul:not(.editor),\
body:not(.editing) .user_toolbar .editor,\
body:not(.editing) .nav_bar .editor,\
.user_toolbar .bin .items {\
  display: none;}\
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
  background-color: rgba(250, 240, 230, 0.6) !important;}');
        
        var buttonRegistry = new register();
        var usedButtons = new register();
        var unusedButtons = new register();

        var customButtonData = [];
        
        var toolbar = $('nav.user_toolbar > ul').first();
        var navbar = $('.nav-bar-list');

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

        if (conf != norm) {
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
        $(window).on('resize', function() {
            updateSpacers();
        });
        
        var control = $('<a href="javascript:void();" >Arrange Buttons</a>');
        $('.banner-buttons').append(control);
        control.click(function () {
            $('.user_toolbar > ul').css('background-color', $('.user_toolbar > ul').first().css('background-color'));
            if ($('body').hasClass('editing')) {
                $('body').removeClass('editing')
            } else {
                $('body').addClass('editing')
            }
            updateSpacers();
        });

        control = $('<a href="javascript:void();" style="margin-left: 5px;">Reset Toolbar</a>');
        $('.banner-buttons').append(control);
        control.click(function () {
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
    }
    
    function preInit() {
        var but = $('.user_toolbar > ul > li > a[href^="/user/"]').children('span').first();
        but.html(but.html().replace(' ▼',' <span class="arrow">▼</span>'));
    }

    function getConfig() {
        return GM_getValue('config', norm);
    }

    function setConfig(used) {
        conf = used;
        GM_setValue('config', used);
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

  //function Button(custom, el, handleChilds, typ) {
    function Button(p, index, el, handleChilds, typ) {
        if (p == true) {
            buttonRegistry.cust(this);
            usedButtons.cust(false);
            unusedButtons.cust(true);
            this.id = buttonRegistry.neglength();
            
            p = disabled;
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
        if (this.originalElement.hasClass('divider')) typ = 'divider';
        this.type = typ == null ? 'button' : typ;
        this._parent = p;
        this._index = index;
        var _removed = false;
        this.timeout = true;
        this.listNode = null;
        this.children = [];

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

            copy.find('.drop-down, ul, input').remove();
            copy.find('.new').removeClass('new');
            var bs = copy.find('.button');
            if (bs.length > 0) {
                result.html('<div class="button">' + bs.first().html() + '</div>');
            } else {
                bs = copy.find('button');
                if (bs.length > 0) {
                    result.html('<div class="button iconize">' + bs.first().html() + '</div>');
                } else {
                    result.append(copy.html());
                }
            }

            var subs = $('<div class="items" />');
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
    
    function replaceAll(find, replace, me) {
        var escapeRegExp = function (str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
        return me.replace(new RegExp(escapeRegExp(find), 'g'), replace);
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

        $(pop.parentNode).css('width', '700px');

        var tbl = $('<tbody />');
        $(pop).append('<table class="properties" />');
        $('table', pop).append(tbl);

        var footer = $('<div class="drop-down-pop-up-footer" />');
        $(pop).append(footer);

        var done = $('<button class="styled_button"><i class="fa fa-save" />Save</button>');
        footer.append(done);

        var row = $('<tr />');
        $(tbl).append(row);

        $(row).append('<td class="label">Folder Name</td>');
        $(row).append('<td><div><input id="custom_folder_name" type="text" placeholder="Custom" /></div></td>');

        $('#custom_folder_name', row).val(customButtonData[index].name);

        row = $('<tr />');
        $(tbl).append(row);

        $(row).append('<td class="label">Folder Icon</td>');
        var select = '<td><div><select id="custom_folder_icon">';
        var icons = ["ambulance", "anchor", "android", "apple", "archive", "asterisk", "ban", "bar-chart-o", "beer", "bell", "bell-o", "bolt", "book", "bookmark", "briefcase", "bug", "building-o", "bullhorn", "calendar", "camera", "certificate", "chain", "chain-broken", "check", "clipboard", "clock-o", "cloud", "cloud-download", "cloud-upload", "coffee", "comment", "comments", "compass", "credit-card", "cutlery", "dashboard", "desktop", "dollar", "download", "eject", "envelope", "envelope-o", "eraser", "euro", "exclamation", "eye", "facebook", "female", "fighter-jet", "file", "file-o", "file-text", "file-text-o", "film", "fire", "fire-extinguisher", "flag", "flag-checkered", "flag-o", "flask", "flickr", "folder", "folder-open", "frown-o", "gamepad", "gbp", "gear", "gears", "gift", "glass", "globe", "google-plus", "hdd-o", "headphones", "heart", "heart-o", "home", "hospital-o", "inbox", "info", "key", "keyboard-o", "laptop", "leaf", "legal", "lemon-o", "lightbulb-o", "linux", "list-ol", "list-ul", "lock", "magic", "magnet", "male", "medkit", "meh-o", "microphone", "minus-circle", "mobile", "money", "moon-o", "music", "pagelines", "paperclip", "pencil", "phone", "picture-o", "plane", "play-circle", "plus-circle", "power-off", "print", "puzzle-piece", "question", "quote-left", "quote-right", "refresh", "repeat", "road", "rocket", "rss", "save", "scissors", "search", "shield", "shopping-cart", "smile-o", "stack-exchange", "star", "star-half", "star-half-empty", "star-o", "stethoscope", "suitcase", "sun-o", "tablet", "tag", "tags", "thumb-tack", "thumbs-down", "thumbs-o-down", "thumbs-o-up", "thumbs-up", "ticket", "times-circle", "tint", "trash-o", "trophy", "truck", "tumblr", "twitter", "umbrella", "unlock", "upload", "user", "users", "video-camera", "warning", "wheelchair", "windows", "wrench", "youtube"];
        for (var i = 0; i < icons.length; i++) {
            select += '<option>' + icons[i] + '</option></div></div>';
        }
        $(row).append(select + '</select>');
        $('#custom_folder_icon', row).val(customButtonData[index].icon);

        $(done).click(function () {
            var v = $('#custom_folder_name', tbl).val();
            customButtonData[index].name = v == '' ? 'Custom' : v;
            node.find('.bind_name').html(customButtonData[index].name);

            v = $('#custom_folder_icon', tbl).find('option:selected').text();
            customButtonData[index].icon = v;
            node.find('.bind_icon').attr('class', 'bind_icon fa fa-' + v);
            saveCustomButtons();
            $("#message_close_button").click();
        });

        position($(pop).parent().parent(), 'center', 'center');
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
        while (input.indexOf('  ') != -1) {
            input = replaceAll('  ', ' ', input);
        }
        var style = document.createElement('style');
        $(style).attr('type', 'text/css');
        $(style).append(input);
        if (id != undefined && id != null) {
            style.id = id;
        }
        $('head').append(style);
    }

    //==API FUNCTION==//
    function makeGlobalPopup(title, fafaText, darken, close) {
        if (typeof (close) == 'undefined') close = true;
        var holder = document.createElement("div");
        $("body").append(holder);
        $(holder).addClass("drop-down-pop-up-container");
        $(holder).attr("style", "position: fixed;z-index:2147483647;left:10px;top:10px");
        $(holder).addClass('global_popup');

        if (darken) {
            var dark = $('<div class="dimmer" style="z-index:1001;" />');
            if (typeof (darken) == 'number') {
                dark.css('opacity', (darken / 100));
            }
            $('#dimmers').append(dark);
        }

        var pop = $("<div class=\"drop-down-pop-up\" style=\"width: auto\" />");
        $(holder).append(pop);

        var head = document.createElement("h1");
        $(head).css("cursor","move");
        $(pop).append(head);
        if (fafaText != null) {
            $(head).append("<i class=\"" + fafaText + "\" /i>");
        } else if (img != null) {
            $(head).append("<img src=\"" + img + "\" style=\"width:18px;height:18px;margin-right:5px;\" /img>");
        }
        $(head).append(title);

        head.onmousedown = function(event) {
            var x = event.clientX - parseInt(holder.style.left.split('px')[0]);
            var y = event.clientY - parseInt(holder.style.top.split('px')[0]);
            document.onmousemove = function(event) {
                position(holder, event.clientX - x, event.clientY - y, 30);
            };
            event.preventDefault();
        };
        head.onmouseup = function(e) {
            document.onmousemove = function(e) {};
        };

        var c = $('<a id="message_close_button" class="close_button" />');
        $(head).append(c);
        $(c).click(function(e) {
            if (close) {
                $(dark).remove();
                $(holder).remove();
            } else {
                $(holder).css('display','none');
            }
        });

        var content = document.createElement("div");
        $(content).addClass("drop-down-pop-up-content");
        $(pop).append(content);
        return content;
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

    unsafeWindow.registerToolbarButton = function (obj, offsetType, index) {
        if (offsetType == -1) {
            index = def.children.length - index;
        }

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
    }
});