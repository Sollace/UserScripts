// ==UserScript==
// @name        LoosefulTools
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net*
// @include     https://www.fimfiction.net*
// @version     1.0
// @require     http://code.jquery.com/jquery-1.8.3.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

if (getIsLoggedIn()) {

    makeStyle('\
body.editing .user_toolbar > .inner:not(.editor),\
body:not(.editing) .user_toolbar .editor,\
.user_toolbar .bin .items {\
    display: none;}\
.inner.label {\
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
    min-height: 40px;\
    background-color: rgba(250, 240, 230, 0.6);}\
.user_toolbar .editor a {\
    pointer-events: none;}\
.editing_button {\
    cursor: move;}\
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


    var buttonRegistry = [];
    var usedButtons = [];
    var unusedButtons = [];

    var toolbar = $($('.user_toolbar > .inner')[0]);

    var held = null;

    var def = new ToolBar(toolbar.children());

    var disabled = loadUnusedButtons(new ToolBar([]));

    var norm = def.getConfig();
    var conf = getConfig();

    if (conf != norm) {
        def.fromConfig(conf);
        def.gen(toolbar);
    }

    var editPane = $('<div class="inner editor" />');
    toolbar.after(editPane);
    def.getEdit(editPane);

    var unusedBin = $('<div class="inner editor bin" />');
    $(unusedBin).click(function () {
        if ($(this).children().length == 0) {
            if (held != null) {
                if (held.children.length == 0) {
                    held._index = 0;
                    held._parent = disabled;
                    held.drop();
                }
            }
        }
    });
    $(editPane).after(unusedBin);
    disabled.getEdit(unusedBin);

    $(unusedBin).after('<div class="inner editor label"><i class="fa fa-trash-o" /> Disabled Items</div>');

    $(document).mousemove(function (e) {
        if ($('#button_moving').length > 0) {
            $('#button_moving').css('top', (e.clientY - $('#button_moving').attr('data_offset_Y')) + 'px');
            $('#button_moving').css('left', (e.clientX - $('#button_moving').attr('data_offset_X')) + 'px');
        }
    });
    $(document).keypress(function (e) {
        if (e.keyCode == 27) {
            if (held != null && $('#button_moving').length != 0) {
                held.drop();
            }
        }
    });

    var control = $('<a href="javascript:void();" >Edit Toolbar</a>');
    control.click(function () {
        if ($('body').hasClass('editing')) {
            $('body').removeClass('editing')
        } else {
            $('body').addClass('editing')
        }
    });
    $('.banner-buttons').append(control);
    control = $('<a href="javascript:void();" style="margin-left: 5px;">Reset Toolbar</a>');
    control.click(function () {
        if (conf != norm || disabled.children.length != 0) {
            setConfig(norm);
            clearUnusedButtons();
            def.fromConfig(norm);
            def.gen(toolbar);
            def.getEdit(editPane);
            disabled.getEdit(unusedBin);
        }
    });
    $('.banner-buttons').append(control);

    $("#view_mature_topbar").off();
    $("#view_mature_topbar").change(function (e) {
        if ($(this).attr('checked')) {
            if (!confirm('Please confirm that you are of legal age to read sexual or other adult content in your country by clicking OK. Click Cancel if this is not true.')) {
                $(this).attr('checked', false);
            }
        }
        unsafeWindow.setCookie('view_mature', $(this).is(':checked'), 10000);
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
    var ids = GM_getValue('unused', '').split(';');
    for (var i = 0; i < ids.length; i++) {
        var index = parseInt(ids[i]);
        if (index > -1 && index < buttonRegistry.length) {
            result.push(buttonRegistry[index]);
            buttonRegistry[index]._parent = p;
            unusedButtons[index] = true;

        }
    }
    p.children = result;
    return p;
}

function saveUnusedButtons() {
    var value = [];
    for (var i = 0; i < unusedButtons.length; i++) {
        if (unusedButtons[i]) value.push(i);
    }
    GM_setValue('unused', value.join(';'));
}

function clearUnusedButtons() {
    for (var i = 0; i < unusedButtons.length; i++) {
        unusedButtons[i] = false;
    }
    disabled.children = [];
    GM_setValue('unused', '');
}

function ToolBar(buttons) {
    this.children = [];

    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].tagName == 'DIV' || buttons[i].tagName == 'A' || buttons[i].tagName == 'LABEL') {
            this.children.push(new Button(this, i, buttons[i], true));
        } else {
            this.children.push(new Baggage(buttons[i]));
        }
    }

    this.gen = function (bar) {
        $(bar).empty();
        for (var i = 0; i < this.children.length; i++) {
            var nod = this.children[i].genNode();
            if (i == 0) {
                $(nod).addClass('button-first');
                $(nod).css('border-left', '1px solid rgba(0, 0, 0, 0.2)');
            } else {
                $(nod).css('border-left', '');
            }
            $(bar).append(nod);
        }
    }
    this.getEdit = function (bar) {
        $(bar).empty();
        for (var i = 0; i < this.children.length; i++) {
            $(bar).append(this.children[i].getEditNode());
        }
    }
    this.getConfig = function () {
        var result = [];
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].type == 'button') {
                result.push(this.children[i].getconfigEntry());
            }
        }
        return JSON.stringify(result);
    }
    this.fromConfig = function (config) {
        config = JSON.parse(config);
        var childs = [];
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].type != 'button') {
                childs.push(this.children[i]);
            }
        }

        for (var i = 0; i < config.length; i++) {
            var b = getButton(config[i]);
            if (b != null) {
                b._parent = this;
                childs.push(b);
            }
        }
        this.children = childs;

        for (var i = 0; i < buttonRegistry.length; i++) {
            if (!usedButtons[i] && !unusedButtons[i]) {
                searchButton(this, norm);
            }
        }
    }
}

function searchButton(holder, i, buttons) {
    for (var j = 0; j < norm.length; j++) {
        if (norm[j]['i'] == i) {
            holder.children.push(buttonRegistry[i]);
            usedButtons[i] = true;
            break;
        } else if (norm[j]['c'] != null) {
            searchButton(buttonRegistry[i], norm[j]['c']);
        }
    }
}

function getButton(entry) {
    var index = parseInt(entry['i']);
    if (index < buttonRegistry.length) {
        var button = buttonRegistry[index];
        usedButtons[index] = true;
        var childs = [];
        for (var i = 0; i < button.children.length; i++) {
            if (button.children[i].type != 'button') {
                childs.push(button.children[i]);
            }
        }
        if (entry['c'] != null) {
            for (var i = 0; i < entry['c'].length; i++) {
                var b = getButton(entry['c'][i]);
                if (b != null) {
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

function Button(p, index, el, handleChilds) {
    this.originalElement = $(el);
    this._parent = p;
    this._index = index;
    var _removed = false;
    this.timeout = 0;
    this.listNode = null;
    this.children = [];

    this.id = buttonRegistry.length;
    buttonRegistry.push(this);
    usedButtons.push(false);
    unusedButtons.push(false);

    if (handleChilds && el.tagName == 'DIV' && $($(this.originalElement).children()[0]).attr('href') != '/index.php?view=category&read_it_later') {
        this.listNode = $(this.originalElement.find('.menu_list')[0]);
        var childs = this.listNode.children();
        for (var i = 0; i < childs.length; i++) {
            if (childs[i].tagName == 'A' || childs[i].tagName == 'DIV' || childs[i].tagName == 'LABEL') {
                this.children.push(new Button(this, i, childs[i], false));
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
                if (this.children[i].type == 'button') {
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
    this.add = function () {
        if (_removed) {
            unusedButtons[this.id] = this._parent == disabled;

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
            $(this.listNode).empty();
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

        copy.find('.menu_list').remove();
        copy.find('input').remove();
        if (this.listNode == null) {
            result.append(copy.html());
        } else {
            copy.find('.menu_list').remove();
            result.html($(copy.find('.button')[0]).html());
        }

        var subs = $('<div class="items" />');
        if (this.listNode != null) {
            for (var i = 0; i < this.children.length; i++) {
                subs.append(this.children[i].getEditNode());
            }
            $(result).append(subs);
        }

        $(result).click(function (e) {
            if ($('#button_moving').length == 0) {
                me.pickup(this, e);
            } else if (held != null && held.timeout <= 0) {
                if (held.listNode == null || me._parent != disabled || held.children.length == 0) {
                    if (me.listNode != null && $(subs).children().length == 0) {
                        held._index = 0;
                        held._parent = me;
                        held.drop();
                    } else {
                        held._index = me._index;
                        held._parent = me._parent;
                        held.drop();
                    }
                }
            }
            e.preventDefault();
        });

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
        def.getEdit(editPane);
        disabled.getEdit(unusedBin);

        setConfig(def.getConfig());
        saveUnusedButtons();
    }

    this.type = 'button';
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