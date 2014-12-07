// ==UserScript==
// @name        DA++
// @namespace   sollace
// @icon        https://raw.githubusercontent.com/Sollace/UserScripts/master/DA++/logo.png
// @include     http://*.deviantart.*
// @include     https://*.deviantart.*
// @version     1.3.1
// @grant       none
// @run-at      document-start
// ==/UserScript==

var ready = false;
document.onmousemove = document.onready = run;
setWhen(function() {
    move('#oh-menu-shop', '#oh-loginbutton').move('#oh-menu-join').move('#oh-menu-split').move('.oh-mc-split').move('#oh-menu-deviant');
    var el = document.getElementById('gmi-MessageCenterDockAd');
    if (el != null) {
        el.parentNode.parentNode.removeChild(el.parentNode);
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
.dp-ad-chrome,\
.blt-ad-container,\
.sleekadbubble,\
.ad-blocking-makes-fella-confused,\
.partial-ad,\
.da-custom-ad-box,\
.dac-ad-frontpage-banner,\
.tower-ad-header,\
.sleekadfooter,\
#gmi-MessageCenterDockAd,\
#fake-col-left {\
    display: none;}');


function run() {
    deAd();
    ready = true;
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
.da-custom-ad-box,\
.dac-ad-frontpage-banner,\
.tower-ad-header,\
.mczone-you-know-what,\
.sleekadfooter').remove();
    if ($('#fake-col-left + #gruze-columns > .gruze-sidebar:first-child iframe').length) {
        $('#fake-col-left + #gruze-columns > .gruze-sidebar:first-child + .pad-left').removeClass('pad-left');
        $('#fake-col-left + #gruze-columns > .gruze-sidebar:first-child, #fake-col-left').remove();
    }
}

function move(ref, id) {
    function el(select) {
        if (select.indexOf('#') == 0) {
            return [document.getElementById(select.replace('#', ''))];
        } else if (select.indexOf('.') == 0) {
            return document.getElementsByClassName(select.replace('.',''));
        }
        return document.getElementsByTagName(select);
    }
    var element;
    if (typeof ref === 'string') {
        element = el(ref);
        ref = element[0];
    } else {
        element = [ref];
    }
    return {
        length: function() {
            return element.length;
        },
        move: function(button) {
            console.log(ref);
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