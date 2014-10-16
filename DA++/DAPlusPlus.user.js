// ==UserScript==
// @name        DA++
// @namespace   sollace
// @icon        https://raw.githubusercontent.com/Sollace/UserScripts/master/DA++/logo.png
// @include     http://*.deviantart.*
// @include     https://*.deviantart.*
// @version     1
// @grant       none
// @run-at      document-start
// ==/UserScript==

var ready = false;
document.onmousemove = document.onready = run;
setWhen(function() {
    move('oh-menu-shop', 'oh-loginbutton').move('oh-menu-join').move('oh-menu-split').move('oh-mc-split').move('oh-menu-deviant');
    var el = document.getElementById('gmi-MessageCenterDockAd');
    if (el != null) {
        el.parentNode.parentNode.removeChild(el.parentNode);
    }
}, function() {
    return document.getElementById('oh-menu-shop') || ready;
});

move().style('.navbar-menu-inner * {\
  font-size: 10px !important;}\
.navbar-menu-inner, #navbar-menu {\
  height: 25px !important;}\
#navbar-menu {\
  box-shadow: 0 0 5px 5px #526054;}\
#navbar-menu *:not(.sticky) {\
  height: 15px !important;}\
#friendslink, #collectlink {\
    transition: color 0.5s ease;}\
#friendslink:hover, #friendslink.active {\
    color: lightblue;}\
#collectlink:hover, #collectlink.active {\
    color: yellow !important;}\
div[gmi-typeid="50"], div[gmi-name="ad_zone"],\
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
    #fake-col-left,\
#fake-col-left + #gruze-columns > .gruze-sidebar:first-child {\
display: none;}');


function run() {
    $('.external').each(reref);
    deAd();
    ready = true;
}

function reref() {
    $(this).removeClass('external');
    var locs = $(this).attr('href').split('?');
    locs.splice(0,1);
    locs = locs.join('?').split(':');
    if (locs[0].indexOf('http') == 0) {
        locs.splice(0,1);
    }
    $(this).attr('href', 'http://' + locs.join(':'));
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
    .sleekadfooter,\
    #fake-col-left,\
    #fake-col-left + #gruze-columns > .gruze-sidebar:first-child').remove();
}

function move(ref, id) {
    if (typeof ref === 'string') ref = document.getElementById(ref);
    return {
        move: function(button) {
            if (button !== undefined && ref !== null) {
                button = document.getElementById(button);
                if (button != null) {
                    button.style.background = 'none';
                    ref.parentNode.insertBefore(button, ref.nextSibling);
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