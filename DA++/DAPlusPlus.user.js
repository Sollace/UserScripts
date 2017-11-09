// ==UserScript==
// @name        DA++
// @namespace   sollace
// @icon        https://raw.githubusercontent.com/Sollace/UserScripts/master/DA++/logo.png
// @include     http://*.deviantart.*
// @include     https://*.deviantart.*
// @version     1.5.3
// @grant       none
// @run-at      document-start
// ==/UserScript==

const adSelector = '\
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
#block-notice,\
.mczone-you-know-what,\
.sidebar-you-know-what, #sidebar-you-know-what,\
.discoverytag_right_ad,\
.discovery-top-ad,\
.ad-container';

const css = '\
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
#navbar-menu .navbar-menu-inner {\
    background: #E4EAE3 !important;}\
#navbar-menu .navbar-menu-inner .navbar-menu-item {\
    color: #000 !important;}\
#navbar-menu .navbar-menu-inner .navbar-menu-item:hover {\
    border-bottom: 4px solid #fff;}\
#navbar-menu .navbar-menu-inner .navbar-menu-separator {\
    display: none;}\
#navbar-menu .navbar-menu-inner.sticky {\
    position: relative !important;\
    z-index: initial !important;\
    width: initial !important;\
    min-width: 0px !important;}\
/*Fork DeviantART*/\
.plus-new-tab.not-subbed, .plus-new-tab.not-subbed > b {\
    opacity: 1 !important;}\
\
#oh-menu-deviant {\
    border-left: none !important;}\
#oh-menu-friends {\
    border-left: 1px solid #38463B;}\
#friendslink, #collectlink, #oh-menu-split .icon {\
    transition: color 0.5s ease;}\
#friendslink:hover, #friendslink.active,\
#oh-menu-split.mmhover .icon {\
    color: lightblue;}\
#collectlink:hover, #collectlink.active {\
    color: yellow !important;}\
\
' + adSelector + ' {\
    display: none;}';

let ready = false;
document.addEventListener('DOMContentLoaded', run);
document.addEventListener('mousemove', run);

style(css);

function run() {
    try {
        if (!ready) moveItems();
        deAd();
        doExtra();
        ready = true;
    } catch (e) {
        console.error(e);
    }
}

function moveItems() {
    let ref = document.querySelector('#oh-menu-shop');
    if (!ref) return;
    ref = ref.nextSibling;
    all('#oh-loginbutton, #oh-menu-join, #oh-menu-split, .oh-mc-split, #oh-menu-deviant', a => {
        a.style.background = 'none';
        ref.parentNode.insertBefore(a, ref);
    });
}

function deAd() {
    const ad = document.querySelector('#gmi-MessageCenterDockAd');
    if (ad) ad.parentNode.parentNode.removeChild(ad.parentNode);
    all(adSelector, a => a.parentNode.removeChild(a));
    if (document.querySelector('#gruze-columns > .gruze-sidebar:first-child iframe')) {
        all('#gruze-columns > .gruze-sidebar:first-child + .pad-left', a => a.classList.remove('pad-left'));
        all('#gruze-columns > .gruze-sidebar:first-child, #fake-col-left', a => a.parentNode.removeChild(a));
    }
    all('.gruze-sidebar iframe, .gruze-sidebar .ad-wrapper', a => {
        a = a.closest('.gruze-sidebar');
        if (a.parentNode) a.parentNode.removeChild(a);
    });
    all('.withad', a => a.classList.remove('withad'));
}

function doExtra() {
    window.deviantART.deviant.subbed = true;
    window.deviantART.deviant.ads = false;
    window.deviantART.adblock = false;
    if (!ready) {
        var butt = document.querySelector('li.submit-tab.active .submit-tab-close');
        if (butt) {
            PubSub.publish('SubmitTabbar.add_new_tab');
            butt.click();
        }
    }
}

function all(selector, func) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), func);
}

function style(css) {
    if (!document.head) return requestAnimationFrame(() => style(css));
    document.head.insertAdjacentHTML('beforeend', '<style type="text/css">' + css + '</style>');
}
