// ==UserScript==
// @name        Controls Freak
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net*
// @include     https://www.fimfiction.net*
// @version     1.1
// @require     http://code.jquery.com/jquery-1.8.3.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

function ToolBar(buttons) {
    this.container = null;
    this.children = [];

    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].tagName == 'DIV' || buttons[i].tagName == 'A' || buttons[i].tagName == 'LABEL') {
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
            if (!addedClass && ($(nod).prop('tagName') == 'DIV' || $(nod).prop('tagName') == 'A')) {
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
        this.container = $('<div class="editor" />');
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

function Deck() {
    this.container = null;
    this.children = [];

    this.deckStart = $('#home_link + .link_container');

    this.children.push(new Button(this, 0, $('.nav_bar .light .mail_link').parent(), false, 'pin'));
    this.children.push(new Button(this, 1, $('.nav_bar .light .feed_link').parent(), false, 'pin'));
    this.children.push(new Button(this, 2, $('.nav_bar .light .notifications_link').parent(), true, 'pin'));

    this.gen = function () {
        for (var i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i].type = 'pin') {
                this.deckStart.after(this.children[i].genNode(i));
            }
        }
    }
}
Deck.prototype = ToolBar.prototype;

if (getIsLoggedIn()) {

    makeStyle('\
.nav_bar .menu_list .user_drop_down_menu {\
    display: block !important;}\
.nav_bar .menu_list i {\
    float: left !important;\
    width: 23px;}\
.user_toolbar .menu_list i {\
    float: right !important;\
    width: initial !important;}\
.nav_bar .container .link_container {\
    background-color: rgba(255, 255, 255, 0.1);\
    padding-left: 6px;\
    padding-right: 12px;\
    transition-property: none;\
    transition-duration: 0s;\
    text-shadow: 1px 1px rgba(255, 255, 255, 0.4);\
    box-shadow: none;\
    border: none;\
    border-bottom: solid 1px #DDD;}\
.nav_bar .container .link_container:hover {\
    background-color: #FFF;\
    margin-left: 0px;}\
.nav_bar .container .link_container div[class*="_link"] {\
    text-shadow: inherit !important;}\
.user_toolbar .inner .user_drop_down_menu .menu_list .user_drop_down_menu div[class*="_link"]:not(.new):before,\
.nav_bar .container .link_container div[class*="_link"]:before {\
    color: #AAA;\
    text-shadow: inherit !important;}\
.user_toolbar .inner .user_drop_down_menu .menu_list .user_drop_down_menu:hover div[class*="_link"]:not(.new):before,\
.nav_bar .container .link_container:hover div[class*="_link"]:before {\
    color: #2773E6 !important;}\
.user_toolbar .user_drop_down_menu .menu_list div[class*="_link"] div,\
.nav_bar .container .link_container div[class*="_link"] div {\
    font-weight: normal !important;\
    color: #333;\
    text-decoration: none;\
    font-family: Arial;\
    font-size: 13px;\
    display: inline-block;\
    margin-left: 3px;\
    background: none;\
    border: none;\
    box-shadow: none;\
    position: static;}\
div.nav_bar .light div.drop_down_container div.container div.panel {\
    overflow: visible;}\
div.nav_bar .user_drop_down_menu:not(.hover) > .menu_list {\
    display: none !important;}\
div.nav_bar .light div.drop_down_container.user_drop_down_menu .menu_list {\
    background-color: #CCC;\
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.35);\
    border-right: 1px solid #454545;\
    border-width: medium 1px 1px;\
    border-style: none solid solid;\
    border-color: -moz-use-text-color #454545 #454545;\
    -moz-border-top-colors: none;\
    -moz-border-right-colors: none;\
    -moz-border-bottom-colors: none;\
    -moz-border-left-colors: none;\
    white-space: nowrap;\
    font-family: Calibri;}\
.user_toolbar .notifications_link:before {\
    content: "";}\
.menu_list .notifications_link div:after,\
.container .link_container .notifications_link div:after {\
    content: " Notices";}\
.user_toolbar .mail_link:before {\
    content: "";}\
.menu_list .mail_link div:after,\
.container .link_container .mail_link div:after {\
    content: " Mail";}\
.user_toolbar .feed_link:before {\
    content: "";}\
.menu_list .feed_link div:after,\
.container .link_container .feed_link div:after {\
    content: " Feeds";}\
.user_toolbar div[class*="_link"]:before {\
    font-family: "FontAwesome";}\
.user_toolbar div[class*="_link"].new div {\
    display: inline-block;}\
.user_toolbar div[class*="_link"] div {\
    padding: 4px;\
    line-height: 1em;\
    display: none;}\
.user_toolbar .link_container .link {\
    position: absolute;\
    left: 0px;\
    right: 0px;\
    top: 0px;\
    bottom: 0px;\
    display: block;\
    z-index: 2;}\
.user_toolbar .inner > .user_drop_down_menu > div[class*="_link"].new {\
    margin: -2px 0px -1px;\
    text-shadow: -1px -1px #A0472E;}\
.user_toolbar .inner > .user_drop_down_menu > div[class*="_link"] div {\
    font-size: 13px;}\
.user_toolbar div[class*="_link"]:not(.new) {\
    color: rgba(0, 0, 0, 0.85);\
    background-color: rgba(255, 255, 255, 0.1);}\
.user_toolbar .inner > .user_drop_down_menu:hover > div[class*="_link"].new {\
    background-color: #A0472E;\
        color: #FFF;\
    text-shadow: -1px -1px #803824;\
    border-bottom: 1px solid #703120;\
    margin-bottom: -1px;\
    border-left: 1px solid #803824;}\
.user_toolbar .menu_list .user_drop_down_menu:hover > .new,\
.user_toolbar .menu_list .new:hover {\
    background-color: #DB6209;\
    color: #FFF;\
    text-shadow: -1px -1px #803824;\
    border-bottom: 1px #FFF !important;\
    margin-bottom: 1px !important;}\
.user_toolbar .menu_list .user_drop_down_menu:hover > .new:before,\
.user_toolbar .menu_list .new:before {\
    color: #AAA;}\
.user_toolbar .menu_list .new:not([class*="_link"]) {\
    border-left: 1px solid #803824 !important;}\
.user_toolbar .menu_list .user_drop_down_menu:hover > div[class*="_link"].new:before,\
.user_toolbar .menu_list div[class*="_link"].new:hover:before {\
    color: #2773E6;}\
.user_toolbar > .inner > .user_drop_down_menu > div[class*="_link"] {\
    display: inline-block;\
    vertical-align: middle;\
    border-top: 1px solid rgba(0, 0, 0, 0.2);\
    font-family: Arial;\
    font-weight: bold;\
    text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.15);\
    padding-left: 12px;\
    padding-right: 12px;\
    line-height: 38px;\
    transition-property: background-color, box-shadow;\
    transition-duration: 0.1s;\
    border-right: 1px solid rgba(0, 0, 0, 0.2);\
    margin: -1px 0px 0px;\
    box-shadow: 0px 0px 8px transparent inset;}\
.user_toolbar .inner .user_drop_down_menu .menu_list div[class*="_link"] {\
    text-decoration: none;\
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);\
    background-position: right top;\
    min-width: 24px;\
    text-align: left;\
    text-shadow: 1px 1px rgba(255, 255, 255, 0.4);\
    font-weight: normal;\
    padding-left: 12px;\
    padding-right: 12px;\
    line-height: 38px;}\
.user_toolbar .inner .user_drop_down_menu .menu_list .user_drop_down_menu:hover div[class*="_link"]:not(.new) {\
    background: white;}\
.user_toolbar .inner .user_drop_down_menu .menu_list div[class*="_link"].new:before {\
    text-shadow: none;}\
.user_toolbar .inner .user_drop_down_menu .menu_list div[class*="_link"] div {\
    margin-left: 5px;}\
.user_toolbar .inner .user_drop_down_menu .menu_list .new,\
.user_toolbar .inner .user_drop_down_menu .menu_list div[class*="_link"].new div {\
    color: #FFF;\
    text-shadow: -1px -1px #A0472E;}\
.user_toolbar .link_container:hover {\
    background-color: rgba(0, 0, 0, 0.2);}\
div.user_toolbar .inner > div[class*="_link"]:not(.new):hover,\
div.user_toolbar .inner > div.user_drop_down_menu:hover > div[class*="_link"]:not(.new) {\
    border-left: 1px solid rgba(0, 0, 0, 0.2);\
    margin-left: -1px;}\
div.user_toolbar .drop_down_container.hover > .container > div.menu_list,\
.drop_down_container.hover div.container {\
    display: block;\
    visibility: visible;\
    opacity: 1;\
    transition-delay: 0s;}\
\
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
body.editing .user_toolbar > .inner:not(.editor),\
body.editing .nav_bar > .light:not(.editor),\
body:not(.editing) .user_toolbar .editor,\
body:not(.editing) .nav_bar .editor,\
.user_toolbar .bin .items {\
    display: none;}\
.user_toolbar > .inner > .button > i {\
        float: none !important;}\
.inner.label {\
    z-index: 2;\
    position: absolute;\
    background-color: inherit;\
    transition: background-color 0.5s ease 0s;\
    border-radius: 0 4px 20px 0;\
    border: 1px solid rgba(0, 0, 0, 0.2);\
    border-top: none;\
    text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.15);\
    left: 0px;\
    padding: 6px;\
    padding-right: 20px;\
    bottom: -30px;}\
.user_toolbar .bin {\
    border-top: 1px solid rgba(0, 0, 0, 0.5);\
    margin-top: 5px;\
    background-color: rgba(250, 240, 230, 0.6);}\
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
    line-height: 20px;}');

    var buttonRegistry = new register();
    var usedButtons = new register();
    var unusedButtons = new register();

    var customButtonData = [];

    var toolbar = $($('.user_toolbar > .inner')[0]);
    var navbar = $('.nav_bar > .light');

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
    }

    loadUnusedButtons(disabled);

    nav.getContainer(navbar, ['light'], function () {
        return this.isPinnable();
    });

    $(toolbar).after('<div class="inner editor label"><i class="fa fa-trash-o" /> Disabled Items</div>');
    disabled.getContainer(toolbar, ['inner', 'bin'], function () {
        return this.type != 'pin' && this.children.length == 0;
    });

    def.getContainer(toolbar, ['inner'], function () {
        return true;
    });

    $(document).mousemove(function (e) {
        if ($('#button_moving').length > 0) {
            $('#button_moving').css('top', (e.clientY - $('#button_moving').attr('data_offset_Y')) + 'px');
            $('#button_moving').css('left', (e.clientX - $('#button_moving').attr('data_offset_X')) + 'px');
        }
    });
    $(document).keypress(function (e) {
        if (e.keyCode == 27) {
            if (held != null) {
                held.drop();
            }
        }
    });

    var control = $('<a href="javascript:void();" >Arrange Buttons</a>');
    $('.banner-buttons').append(control);
    control.click(function () {
        if ($('body').hasClass('editing')) {
            $('body').removeClass('editing')
        } else {
            $('body').addClass('editing')
        }
    });

    control = $('<a href="javascript:void();" style="margin-left: 5px;">Reset Toolbar</a>');
    $('.banner-buttons').append(control);
    control.click(function () {
        setConfig(norm);
        clearUnusedButtons();
        usedButtons.flush(false);
        unusedButtons.flush(false, true);
        nav.fromConfig(norm[0]);
        def.fromConfig(norm[1]);
        loadUnusedButtons(disabled);
        def.gen(toolbar);
        nav.gen();
        def.getEdit();
        nav.getEdit();
        disabled.getEdit();
    });
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
            b._parent = disabled;
            b.children = [];
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

//function Button(custom, el, handleChilds) {
function Button(p, index, el, handleChilds, typ) {
    if (p == true) {
        buttonRegistry.cust(this);
        usedButtons.cust(false);
        unusedButtons.cust(true);
        this.id = buttonRegistry.neglength();

        p = disabled;
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

    this.type = typ == null ? 'button' : typ;
    this.originalElement = $(el);
    this._parent = p;
    this._index = index;
    var _removed = false;
    this.timeout = 0;
    this.listNode = null;
    this.children = [];

    this.originalParent = $($(el).parent());
    this.originalIndex = this.originalElement.index();

    if (handleChilds && $(el).prop('tagName') == 'DIV' && $($(this.originalElement).children()[0]).attr('href') != '/index.php?view=category&read_it_later') {
        this.listNode = $(this.originalElement.find('.menu_list')[0]);
        if (this.listNode.length == 0) {
            this.listNode = $(this.originalElement.find('.container > .menu_list')[0]);
        }
        var childs = this.listNode.children();
        for (var i = 0; i < childs.length; i++) {
            if (childs[i].tagName == 'A' || childs[i].tagName == 'DIV' || childs[i].tagName == 'LABEL') {
                this.children.push(new Button(this, i, childs[i], false, this.type));
            } else {
                this.children.push(new Baggage(childs[i]));
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

        if (this.children.length > 0 && this.listNode != null) {
            $(this.listNode).children().detach();
            for (var i = 0; i < this.children.length; i++) {
                $(this.listNode).append(this.children[i].genNode());
            }
        }
        return this.originalElement;
    }
    this.getEditNode = function () {
        var result = $('<div class="button editing_button" />');
        var copy = this.originalElement.clone();
        var me = this;

        copy.find('.menu_list').add(copy.find('.container')).remove();
        copy.find('input').remove();
        var bs = copy.find('.button');
        if (bs.length > 0) {
            result.html($(bs[0]).html());
        } else {
            result.append(copy.html());
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
                } else if (held.timeout <= 0) {
                    if (held.type == 'pin') {
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
                } else if (held.timeout <= 0) {
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
        held.timeout = 50;
        var interval = setInterval(function () {
            if (--held.timeout == 0) {
                clearInterval(interval);
            }
        }, 10);

        var offX = e.clientX - ($(node).offset().left - $(window).scrollLeft());
        var offY = e.clientY - ($(node).offset().top - $(window).scrollTop());

        $(node).attr('data_offset_X', offX);
        $(node).attr('data_offset_Y', offY);
        $(node).css('left', (e.clientX) - offX + 'px');
        $(node).css('top', (e.clientY) - offY + 'px');

        $(node).attr('id', 'button_moving');
        $(node).css('position', 'fixed');
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
        return false;
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
    var node = $('<div class="user_drop_down_menu"><div class="menu_list" /></div>');
    var a = $('<div class="button custom_button" href="javascript:void();"><i class="bind_icon fa fa-' + customButtonData[index].icon + '" /><span class="bind_name">' + customButtonData[index].name + '</span></div>');
    node.prepend(a);

    var editBox = $('<div class="editBox" />');
    a.append(editBox);

    var editName = $('<input type="text" />');
    editBox.append(editName);
    editName.val(customButtonData[index].name);
    editName.change(function () {
        var v = $(this).val();
        customButtonData[index].name = v == '' ? 'Custom' : v;
        a.find('.bind_name').html(customButtonData[index].name);
        saveCustomButtons();
    });
    var editIcon = $('<select />');
    editBox.append(editIcon);
    var icons = ["ambulance", "anchor", "android", "apple", "archive", "asterisk", "ban", "bar-chart-o", "beer", "bell", "bell-o", "bolt", "book", "bookmark", "briefcase", "bug", "building-o", "bullhorn", "calendar", "camera", "certificate", "chain", "chain-broken", "check", "clipboard", "clock-o", "cloud", "cloud-download", "cloud-upload", "coffee", "comment", "comments", "compass", "credit-card", "cutlery", "dashboard", "desktop", "dollar", "download", "eject", "envelope", "envelope-o", "eraser", "euro", "exclamation", "eye", "facebook", "female", "fighter-jet", "file", "file-o", "file-text", "file-text-o", "film", "fire", "fire-extinguisher", "flag", "flag-checkered", "flag-o", "flask", "flickr", "folder", "folder-open", "frown-o", "gamepad", "gbp", "gear", "gears", "gift", "glass", "globe", "google-plus", "hdd-o", "headphones", "heart", "heart-o", "home", "hospital-o", "inbox", "info", "key", "keyboard-o", "laptop", "leaf", "legal", "lemon-o", "lightbulb-o", "linux", "list-ol", "list-ul", "lock", "magic", "magnet", "male", "medkit", "meh-o", "microphone", "minus-circle", "mobile", "money", "moon-o", "music", "pagelines", "paperclip", "pencil", "phone", "picture-o", "plane", "play-circle", "plus-circle", "power-off", "print", "puzzle-piece", "question", "quote-left", "quote-right", "refresh", "repeat", "road", "rocket", "rss", "save", "scissors", "search", "shield", "shopping-cart", "smile-o", "stack-exchange", "star", "star-half", "star-half-empty", "star-o", "stethoscope", "suitcase", "sun-o", "tablet", "tag", "tags", "thumb-tack", "thumbs-down", "thumbs-o-down", "thumbs-o-up", "thumbs-up", "ticket", "times-circle", "tint", "trash-o", "trophy", "truck", "tumblr", "twitter", "umbrella", "unlock", "upload", "user", "users", "video-camera", "warning", "wheelchair", "windows", "wrench", "youtube"];
    for (var i = 0; i < icons.length; i++) {
        editIcon.append('<option>' + icons[i] + '</option>');
    }
    editIcon.val(customButtonData[index].icon);
    editIcon.change(function () {
        var val = $(this).find('option:selected').text();
        customButtonData[index].icon = val;
        a.find('.bind_icon').attr('class', 'bind_icon fa fa-' + val);
        saveCustomButtons();
    });

    a.dblclick(function (e) {
        if ($(this).hasClass('editing')) {
            $(this).removeClass('editing');
        } else {
            $(this).addClass('editing');
        }
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

//==API FUNCTION==//
function getIsLoggedIn() {
    try {
        return unsafeWindow.logged_in_user != null;
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