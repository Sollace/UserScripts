// ==UserScript==
// @name        DA++
// @namespace   sollace
// @icon        https://raw.githubusercontent.com/Sollace/UserScripts/master/DA++/logo.png
// @include     http://*.deviantart.*
// @include     https://*.deviantart.*
// @version     1.3.4
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
        style: function(css) {
            var tag = document.createElement('STYLE');
            tag.type = 'text/css';
            tag.innerHTML = css;
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

move().style('.navbar-menu-inner * {\
  font-size: 10px !important;}\
#navbar-menu *:not(.sticky), .navbar-menu-inner, #navbar-menu {\
  height: 30px !important;}\
#navbar-menu {\
  box-shadow: 0 0 5px 5px #526054;}\
#friendslink, #collectlink, #oh-menu-split .icon {\
    transition: color 0.5s ease;}\
#friendslink:hover, #friendslink.active,\
#oh-menu-split.mmhover .icon {\
    color: lightblue;}\
#collectlink:hover, #collectlink.active {\
    color: yellow !important;}\
div[gmi-typeid="50"], div[gmi-name="ad_zone"],\
.mczone-you-know-what,\
.sidebar-you-know-what,\
.dp-ad-chrome,\
.blt-ad-container,\
.sleekadbubble,\
.ad-blocking-makes-fella-confused,\
.partial-ad,\
.browse-inline-ad,\
.da-custom-ad-box,\
.dac-ad-frontpage-banner,\
.tower-ad-header,\
.sleekadfooter,\
.discoverytag_right_ad,\
.discovery-top-ad,\
#gmi-MessageCenterDockAd,\
#fake-col-left {\
    display: none;}');


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
    $('\
div[gmi-typeid="50"], div[gmi-name="ad_zone"],\
.dp-ad-chrome,\
.blt-ad-container,\
.sleekadbubble,\
.ad-blocking-makes-fella-confused,\
.partial-ad,\
.browse-inline-ad,\
.da-custom-ad-box,\
.dac-ad-frontpage-banner,\
.tower-ad-header,\
.mczone-you-know-what,\
.sidebar-you-know-what,\
.sleekadfooter,\
.discoverytag_right_ad,\
.discovery-top-ad').remove();
    if ($('#gruze-columns > .gruze-sidebar:first-child iframe').length) {
        $('#gruze-columns > .gruze-sidebar:first-child + .pad-left').removeClass('pad-left');
        $('#gruze-columns > .gruze-sidebar:first-child, #fake-col-left').remove();
    }
    if ($('.gruze-sidebar.right-sidebar iframe').length) {
        $('.gruze-sidebar.right-sidebar').remove();
    }
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