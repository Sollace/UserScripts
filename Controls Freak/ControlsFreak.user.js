// ==UserScript==
// @name        Controls Freak
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net*
// @include     https://www.fimfiction.net*
// @version     1.0
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
    this.getEdit = function () {
        this.container.empty();
        for (var i = 0; i < this.children.length; i++) {
            this.container.append(this.children[i].getEditNode());
        }
    }
}
ToolBar.prototype.getContainer = function (holder, classes, allow) {
    if (this.container == null) {
        this.container = $('<div class="editor" />');
        $(holder).after(this.container);
        $(this.container).click(function () {
            if (held != null) {
                if (allow.apply(held)) {
                    held._index = nav.children.length;
                    held._parent = disabled;
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

function Deck(buttons) {
    this.container = null;
    this.children = [];

    for (var i = 0; i < buttons.length; i++) {
        this.children.push(Pin(this, i, buttons[i]));
    }

    this.getEdit = function () {
        this.container.empty();
        for (var i = 0; i < this.children.length; i++) {
            this.container.append(this.children[i].getPinNode());
        }
    }
    this.home = function () {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].type = 'pin') {
                this.children[i].gohome();
            }
        }
    }
}
Deck.prototype = ToolBar.prototype;

if (getIsLoggedIn()) {

    makeStyle('\
.custom_button {\
    cursor: pointer;\
    -webkit-user-select: none;\
    -moz-user-select: none;}\
.user_toolbar .button:not(.editing) .editBox {\
    display: none;}\
.button.editing + div.menu_list {\
    display: block;\
    visibility: visible;\
    opacity: 1;}\
body.editing .nav_bar,\
body.editing .editor {\
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

    var nav = new Deck(navbar.find('.button').toArray());
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
        def.gen(toolbar);
    }

    loadUnusedButtons(disabled);

    nav.getContainer(navbar, ['light'], function () {
        return this.type == 'pin' && this.children.length == 0;
    });

    $(toolbar).after('<div class="inner editor label"><i class="fa fa-trash-o" /> Disabled Items</div>');
    disabled.getContainer(toolbar, ['inner', 'bin'], function () {
        return this.children.length == 0;
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
        nav.home();
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
            b._parent = p;
            b._index = result.length;
            result.push(b);
            unusedButtons.set(index, true);
        }
    }
    for (var i = unusedButtons.neglength() ; i < 0; i++) {
        var b = buttonRegistry.get(i);
        if (unusedButtons.get(i) && !usedButtons.get(i) && !arrContains(result, b)) {
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

function Pin(p, index, el) {
    var result = new Button(p, index, el, false);
    result.type = 'pin';
    return result;
}

//function Button(custom, el, handleChilds) {
function Button(p, index, el, handleChilds) {
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

    this.type = 'button';
    this.originalElement = $(el);
    this._parent = p;
    this._index = index;
    var _removed = false;
    this.timeout = 0;
    this.listNode = null;
    this.children = [];

    this.originalParent = $($(el).parent());
    this.originalIndex = this.originalElement.index();

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
                nesiblings.push(this.originalElement);
                added = true;
            }
            nesiblings.push(siblings[i]);
            $(siblings[i]).detach();
        }
        if (!added) {
            nesiblings.push(this.originalElement);
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
            $(this.listNode).children().each(function () {
                $(this).detach();
            });
            for (var i = 0; i < this.children.length; i++) {
                $(this.listNode).append(this.children[i].genNode());
            }
        }
        return this.originalElement;
    }
    this.getPinNode = function () {
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

        $(result).click(function (e) {
            e.stopPropagation();
            if (held == null) {
                me.pickup(this, e);
            } else if (held.timeout <= 0) {
                if (held.type == 'pin') {
                    held._index = me._index;
                    held._parent = me._parent;
                    if (me._parent == nav) {
                        held.return();
                    } else {
                        held.drop();
                    }
                } else if (me._parent != nav) {
                    held._index = me._index;
                    held._parent = me._parent;
                    held.drop();
                }
            }
        });

        return result;
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

        $(subs).click(function (e) {
            e.stopPropagation();
            if (me._parent != disabled && me.listNode != null && me.children.length == 0) {
                held._index = 0;
                held._parent = me;
                held.drop();
            }
        });

        $(result).click(function (e) {
            e.stopPropagation();
            if (held == null) {
                me.pickup(this, e);
            } else if (held.timeout <= 0) {
                if (me._parent != disabled) {
                    held._index = me._index;
                    held._parent = me._parent;
                    held.drop();
                } else if (held.listNode == null || held.children.length == 0) {
                    held._index = me._index;
                    held._parent = me._parent;
                    held.drop();
                }
            }
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
        def.getEdit();
        nav.getEdit();
        disabled.getEdit();

        setConfig([nav.getConfig(), def.getConfig()]);
        saveUnusedButtons();
    }
    this.return = function () {
        held = null;

        this.add();
        this.gohome();

        def.gen(toolbar);
        def.getEdit();
        nav.getEdit();
        disabled.getEdit();

        setConfig([nav.getConfig(), def.getConfig()]);
        saveUnusedButtons();
    }
}

function makeCustomButtons(total) {
    loadCustomButtons();
    for (var i = 0; i < total; i++) {
        if (i > customButtonData.length) {
            customButtonData.push({
                'icon': 'user',
                'name': 'Custom'
            });
        }
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
    var data = GM_getValue('custom_d', null);

    if (data != null) {
        data = JSON.parse(data);
        for (var i = 0; i < data.length; i++) {
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