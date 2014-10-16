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
    var shop = document.getElementById('oh-menu-shop');
    var el = document.getElementById('oh-menu-split');
    el.style.background = 'none';
    shop.parentNode.insertBefore(el, shop.nextSibling);
    el = document.getElementsByClassName('oh-mc-split');
    if (el != null && el.length > 0) {
        for (var i = 0; i < el.length; i++) {
            el[i].style.background = 'none';
            shop.parentNode.insertBefore(el[i], shop.nextSibling);
        }
    }
    el = document.getElementById('oh-menu-deviant');
    el.style.background = 'none';
    shop.parentNode.insertBefore(el, shop.nextSibling);
    el = document.getElementById('gmi-MessageCenterDockAd');
    if (el != null) {
        el.parentNode.parentNode.removeChild(el.parentNode);
    }
}, function() {
    return document.getElementById('oh-menu-shop') || ready;
});

makeStyle('.navbar-menu-inner * {\
  font-size: 10px !important;}\
.navbar-menu-inner, #navbar-menu {\
  height: 25px !important;}\
#navbar-menu {\
  box-shadow: 0 0 5px 5px #526054;}\
#navbar-menu * {\
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

function makeStyle(css) {
    var tag = document.createElement('STYLE');
    tag.type = 'text/css';
    tag.innerHTML = css;
    document.head.appendChild(tag);
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