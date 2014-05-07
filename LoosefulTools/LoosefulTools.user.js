// ==UserScript==
// @name        LoosfulTools
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net*
// @include     https://www.fimfiction.net*
// @version     1.0
// @require     http://code.jquery.com/jquery-1.8.3.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

makeStyle('\
body.editing .user_toolbar > .inner:not(.editor),\
body:not(.editing) .user_toolbar .editor {\
    display: none;}\
.user_toolbar .editor a {\
    pointer-events: none;}\
display: inline-block;\
.editing_button .items {\
    min-height: 50px;\
    min-width: 200px;\
    background: rgba(255,255,255,0.6);}\
.user_toolbar .editor a {\
    pointer-events: none;}\
.editing_button .items {\
    cursor: default;}\
.editing_button {\
    cursor: move;}\
.editing_button .items {\
    min-height: 50px;\
    min-width: 200px;\
    background: rgba(255,255,255,0.3);\
    padding: 5px;}\
#button_moving {\
    position: absolute !important;}\
#button_moving {\
    position: absolute !important;}');


var buttonRegistry = [];
var usedButtons = [];

var toolbar = $($('.user_toolbar > .inner')[0]);

var held = null;

var def = new ToolBar(toolbar.children());

var norm = def.getConfig();
var conf = getConfig();

if (conf != norm) {
    def.fromConfig(conf);
    def.gen(toolbar);
}

var editPane = $('<div class="inner editor" />');
toolbar.after(editPane);

def.getEdit(editPane);

$(document).mousemove(function (e) {
    if ($('#button_moving').length > 0) {
        $('#button_moving').css('top', (e.pageY + 5) + 'px');
        $('#button_moving').css('left', (e.pageX + 5) + 'px');
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
    if (conf != norm) {
        setConfig(norm);
        def.fromConfig(norm);
        def.gen(toolbar);
        def.getEdit(editPane);
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

function getConfig() {
    return GM_getValue('config', norm);
}

function setConfig(v) {
    conf = v;
    GM_setValue('config', v);
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
                childs.push(b);
            }
        }
        this.children = childs;

        for (var i = 0; i < buttonRegistry.length; i++) {
            if (!usedButtons[i]) {
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
    this.listNode = null;
    this.children = [];

    this.id = buttonRegistry.length;
    buttonRegistry.push(this);
    usedButtons.push(false);

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
            this._parent.children = newchilds;
            _removed = true;
        }
    }
    this.add = function () {
        if (_removed) {
            var newchilds = [];
            for (var i = 0; i <= this._parent.children.length; i++) {
                if (i == this._index) {
                    newchilds.push(this);
                }
                if (i < this._parent.children.length) {
                    newchilds.push(this._parent.children[i]);
                }
            }
            this._parent.children = newchilds;
            _removed = false;
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
        copy.find('.menu_list').remove();
        copy.find('input').remove();
        if (this.listNode == null) {
            result.append(copy.html());
        } else {
            copy.find('.menu_list').remove();
            result.html($(copy.find('.button')[0]).html());
        }
        if (this.listNode != null) {
            var subs = $('<div class="items" />');
            for (var i = 0; i < this.children.length; i++) {
                subs.append(this.children[i].getEditNode());
            }
            $(result).append(subs);
            $(subs).mousedown(function (e) {
                if ($('#button_moving').length != 0 && $(this).children().length == 0) {
                    held._index = 0;
                    held._parent = me;
                    held.drop($('#button_moving'), e);
                    e.preventDefault();
                }
            });
        }

        var me = this;
        $(result).mousedown(function (e) {
            if ($('#button_moving').length == 0) {
                me.pickup(this, e);
            } else {
                held._index = me._index;
                held._parent = me._parent;
                held.drop(this, e);
            }
            e.preventDefault();
        });

        return result;
    }

    this.pickup = function (node, e) {
        held = this;
        this.remove();
        $(node).attr('id', 'button_moving');
        $(node).css('position', 'absolute');
        $(node).css('top', (e.pageY + 5) + 'px');
        $(node).css('left', (e.pageX + 5) + 'px');
        def.gen(toolbar);
        setConfig(def.getConfig());
    }
    this.drop = function (node, e) {
        held = null;
        this.add();
        $(node).css('position', '');
        def.gen(toolbar);
        def.getEdit(editPane);
        setConfig(def.getConfig());
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