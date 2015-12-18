// ==UserScript==
// @name        DA++
// @namespace   sollace
// @icon        https://raw.githubusercontent.com/Sollace/UserScripts/master/DA++/logo.png
// @include     http://*.deviantart.*
// @include     https://*.deviantart.*
// @version     1.4
// @grant       none
// @run-at      document-start
// ==/UserScript==

function move(ref, id) {
    var element;
    if (typeof ref === 'string') {
        element = el(ref);
        ref = element[0];
    } else if (move.isArray(ref)) {
        element = ref;
    } else {
        element = [ref];
    }
    return {
        length: function() {
            return element.length;
        },
        move: function(button) {
            if (button !== undefined && ref !== null) {
                button = el(button);
                for (var i = 0; i < button.length; i++) {
                    console.log(button[i]);
                    if (button[i] != null) {
                        button[i].style.background = 'none';
                        ref.parentNode.insertBefore(button[i], ref.nextSibling);
                    }
                }
            }
            return this;
        },
        vendor: function() {
            if (!move.vendor) {
                var styles = window.getComputedStyle(document.documentElement, '');
                var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
                var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
                move.vendor = {dom: dom, lowercase: pre, css: '-' + pre + '-', js: pre[0].toUpperCase() + pre.substring(1)};
            }
            return move.vendor;
        },
        style: function(css) {
            var tag = document.createElement('STYLE');
            tag.type = 'text/css';
            tag.innerHTML = css.replace(/-\{0\}-/g, this.vendor().css);
            document.head.appendChild(tag);
            return this;
        }
    }.move(id);
}
move.typeOf = function(obj) {
    return Object.prototype.toString.call(obj).replace('[object ','').replace(']','');
}
move.isArray = function(arr) {
    return this.typeOf(arr) == 'Array';
}
move.isJQuery = function() {
    return !!window['$'];
}

var ready = false;
document.onmousemove = document.onready = run;
setWhen(function() {
    move('#oh-menu-shop', '#oh-loginbutton').move('#oh-menu-join').move('#oh-menu-split').move('.oh-mc-split').move('#oh-menu-deviant');
    var el = document.getElementById('gmi-MessageCenterDockAd');
    if (el != null) {
        el.parentNode.parentNode.removeChild(el.parentNode);
    }
    if (!ready) {
        run();
    }
}, function() {
    return document.getElementById('oh-menu-shop') != null && (document.getElementById('oh-menu-split') != null || document.getElementById('oh-menu-loginButton')) || ready;
});

var style = '\
.navbar-menu-inner * {\
    font-size: 10px !important;}\
#navbar-menu {\
    border-bottom: 1px solid #BAC7BB;}\
#navbar-menu .jump-to-top-icon {\
    text-indent: 0px;\
    text-align: center;\
    display: inline;\
    border: none;}\
#navbar-menu .navbar-menu-inner-scroll {\
    text-align: center;}\
#navbar-menu .navbar-menu-item, #navbar-menu .navbar-menu-inner, #navbar-menu {\
    height: 30px !important;}\
#navbar-menu .navbar-menu-inner{sticky} {\
    background: #E4EAE3 !important;}\
#navbar-menu .navbar-menu-inner{sticky} .navbar-menu-item {\
    color: #000 !important;}\
#navbar-menu .navbar-menu-inner{sticky} .navbar-menu-item:hover {\
    border-bottom: 4px solid #fff;}\
#navbar-menu .navbar-menu-inner .navbar-menu-separator {\
    display: none;}';

if (document.location.href.indexOf('/notifications/') != -1) {
    style = style.replace(/{sticky}/g, '');
    style += '\
#navbar-menu .navbar-menu-inner.sticky {\
    position: relative !important;\
    z-index: initial !important;\
    width: initial !important;\
    min-width: 0px !important;}';
} else {
    style = style.replace(/{sticky}/g, ':not(.sticky)');
}

style += '\
#friendslink, #collectlink, #oh-menu-split .icon {\
    transition: color 0.5s ease;}\
#friendslink:hover, #friendslink.active,\
#oh-menu-split.mmhover .icon {\
    color: lightblue;}\
#collectlink:hover, #collectlink.active {\
    color: yellow !important;}';

var adSelector = '\
div[gmi-typeid="50"], div[gmi-name="ad_zone"],\
*[class*=-ad-chrome],\
*[class*=-ad-container],\
*[class*=-ad-frontpage-banner],\
.sleekadbubble,\
.ad-blocking-makes-fella-confused,\
.partial-ad,\
.browse-inline-ad,\
.da-custom-ad-box,\
.tower-ad-header,\
.sleekadfooter,\
#gmi-MessageCenterDockAd,\
.mczone-you-know-what,\
.sidebar-you-know-what, #sidebar-you-know-what,\
.discoverytag_right_ad,\
.discovery-top-ad';

style+= adSelector + ' {\
    display: none;}';

move().style(style);

function run() {
    try {
        if (move.isJQuery()) {
            deAd();
            ready = true;
        }
    } catch (e) {}
}

function deAd() {
    $('#gmi-MessageCenterDockAd').parent().remove();
    $(adSelector).remove();
    if ($('#gruze-columns > .gruze-sidebar:first-child iframe').length) {
        $('#gruze-columns > .gruze-sidebar:first-child + .pad-left').removeClass('pad-left');
        $('#gruze-columns > .gruze-sidebar:first-child, #fake-col-left').remove();
    }
    $('.gruze-sidebar iframe').each(function() {
        $(this).parents('.gruz-sidebar').remove();
    });
}

function el(select) {
    if (document['querySelectorAll']) {
        return document.querySelectorAll(select);
    }
    if (select.indexOf('#') == 0) {
        return [document.getElementById(select.replace('#', ''))];
    } else if (select.indexOf('.') == 0) {
        return document.getElementsByClassName(select.replace('.',''));
    }
    return document.getElementsByTagName(select);
}

function setWhen(func, check) {
    var id = null;
    if (typeof (check) !== 'undefined') {
        if (typeof(check) == 'function') {
            if (check()) {
                func();
                return;
            }
        } else if (check) {
            func();
            return;
        }
        id = setInterval(function() {
            if (typeof(check) == 'function') {
                if (check()) {
                    func();
                    clearInterval(id);
                }
            } else if (check) {
                func();
                clearInterval(id);
            }
        }, 30);
    }
    return id;
}