// ==UserScript==
// @name        FimQuery.Core
// @description A collection of useful functions for interacting with fimfiction.net
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.0.4
// @grant       none
// ==/UserScript==

//==API FUNCTION==//
function isJQuery() {return !!win()['$'];}

//==API FUNCTION==//
function win() {return this['unsafeWindow'] || window['unsafeWindow'] || window;}

//==API FUNCTION==//
function getSafe(name, defaultValue) {var w = win();return w[name] || (w[name] = defaultValue);}

//==API FUNCTION==//
function brightness(r,g,b) {return Math.sqrt((0.241 * r * r) + (0.691 * g * g) + (0.068 * b * b));}

//==API FUNCTION==//
function getIsLoggedIn() {return !!win()['logged_in_user'];}

//==API FUNCTION==//
function staticFimFicDomain() {return win()['static_url'] || '//static.fimfiction.net';}

//==API FUNCTION==//
function getFavicon(url) {return '//www.google.com/s2/favicons?domain_url=' + encodeURIComponent(url);}

//==API FUNCTION==//
function getDomain(url) {return /:|^\/\//.test(url) ? url.match(/([^:\/]*)([:\/]*)([^\/]*)/).reverse()[0] : url.split('/')[0];}

//==API FUNCTION==//
function getSiteName(url) {return /:|^\/\//.test(url) ? url.match(/([^:\/]*)([:\/]*)(www.|)([^\/]*)/).reverse()[0] : url.split('/')[0];}

//==API FUNCTION==//
function getUserNameUrlSafe() { return getIsLoggedIn() ? getUserButton().attr("href").split("/").reverse()[0] : 'Anon'; }

//==API FUNCTION==//
function getUserNameEncoded() { return encodeURIComponent(getUserNameUrlSafe()); }

//==API FUNCTION==//
function getUserName() { return getUserNameUrlSafe().replace(/\+/g,' '); }

//==API FUNCTION==//
function getUserId() {var w = win()['logged_in_user'];return w ? w.id : -1;}

//==API FUNCTION==//
function getUserButton() {return $('.user_toolbar a.button[href^="/user/"]');}

document.addEventListener('ready', function() {
    if (id != -1) {
        var possibleAvatars = $('img[src*="cdn-img.fimfiction.net/user/"][src*="-' + id + '-"]');
        if (possibleAvatars.length) {
            localStorage['user_avatar'] = possibleAvatars.first().attr('src').split(id)[0] + id + '-';
        }
    }
});

function getUserAvatar(size) {
    var id = getUserId();
    if (id != -1) {
        var stored = localStorage['user_avatar'];
        if (stored && stored.indexOf('-' + id + '-') != -1) {
            return stored + size;
        }
    }
    return getDefaultAvatar(size);
}

function getDefaultAvatar(size) {
    return staticFimFicDomain() + '/images/none_' + size + '.png';
}

//==API FUNCTION==//
function isMyBlogPage() {
    var match = document.location.href.split('?')[0].match(/(?:http:|https:|)\/\/www\.fimfiction\.net\/user\/([^\/]*)\/blog(?:\/|)$/);
    if (!match) return false;
    match = match.reverse()[0];
    var urlSafe = getUserNameUrlSafe();
    return match == urlSafe || match == encodeURIComponent(urlSafe);
}

//==API FUNCTION==//
function isMyPage() {
    var match = document.location.href.split('?')[0].match(/(?:http:|https:|)\/\/www\.fimfiction\.net\/user\/([^\/]*)(?:\/|)$/);
    if (!match) return false;
    match = match.reverse()[0];
    var urlSafe = getUserNameUrlSafe();
    return match == urlSafe || match == encodeURIComponent(urlSafe);
}

var vendor = vendor || null;
//==API FUNCTION==//
function getVendorPrefix() {
    if (!vendor) {
        var styles = window.getComputedStyle(document.documentElement, '');
        var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
        var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
        vendor = {dom: dom, lowercase: pre, css: '-' + pre + '-', js: pre[0].toUpperCase() + pre.substring(1)};
    }
    return vendor;
}

//==API FUNCTION==//
function makeStyle(input, id) {
    while (input.indexOf('  ') != -1) input = input.replace(/  /g,' ');
    input = input.replace(/-\{0\}-/g, getVendorPrefix().css);
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = input;
    if (id) style.id = id;
    document.head.appendChild(style);
}

//==API FUNCTION==//
function makeToolTip(button) {
    var popup = $('<div style="z-index:50;text-align:left;position:absolute;" />');
    popup.append('<div class="tooltip" />');
    $(button).append(popup);
    popup.hover(function(e) { }, function(e) {
        $(this).remove();
    });
    return popup.find('.tooltip');
}

//==API FUNCTION==//
function addTooltip(message, field) {
    field = $(field);
    var box = $('<div class="tooltip_popup" style="display:none;opacity:0;position:relative;transition:opacity 0.5s ease" ><div class="arrow"><div /></div><div style="min-width:40px" class="tooltip_popup_tooltip">' + message + '</div></div>');
    field.before(box);
    field.focus(function (e) {
        box.css("display", "block");
        setTimeout(function() {box.css("opacity", "");},1);
    });
    field.blur(function(e) {
        box.css("opacity", 0);
        setTimeout(function() {box.css("display", "none");},500);
    });
}

//==API FUNCTION==//
function makePopup(title, fafaText, darken, close) {
    if (typeof (close) == 'undefined') close = true;
    if (typeof (darken) == 'undefined') darken = true;
    var pop = new PopUpMenu('','<i class="fa fa-' + fafaText + '" />' + title);
    pop.SetCloseOnHoverOut(false);
    pop.SetFixed(true);
    pop.SetContent('');
    pop.SetSoftClose(!close);
    if (!darken) pop.SetDimmerEnabled(false);
    if (typeof darken == 'number') {
        var show = pop.Show;
        pop.Show = function() {
            show.apply(this, arguments);
            this.dimmer.css('opacity', (darken / 100));
        }
    }
    pop.element.append("<style>\
.drop-down-pop-up-content input[type='text'], .drop-down-pop-up-content input[type='url'] {\
    padding:8px;\
    width:100%;\
    border:1px solid rgb(204, 204, 204);\
    background:none repeat scroll 0% 0% rgb(248,248,248);\
    outline:medium none;\
    color:rgb(51,51,51);\
    box-shadow:0px 2px 4px rgba(0,0,0,0.1) inset;\
    border-radius:3px;\
    margin:5px 0px;}</style>");
    return pop;
}

//==API FUNCTION==//
function makeButton(a, text, img){
    var result = $('<li class="button-group"><button class="drop-down-expander" title="' + text + '"><i class="' + img + '"></i></button></li>');
    $(a).append(result);
    return result.find('button');
}

//==API FUNCTION==//
function addOption(list, title) {
    var a = $('<li><a href="javascript:void()" >' + title + '</a></li>');
    $(list).append(a);
    return a.children().first();
}

//==API FUNCTION==//
function addDropList(list, title, func) {
    var a = $('<li><a>' + title + '</a><div class="drop-down"><ul /></div></li>');
    list.append(a);
    func.apply(a.find('ul'));
}

//==API FUNCTION==//
function getListItemWidth(list) {
    var result = 0;
    for (var i = 0; i < list.children.length;i++) {
        var w = list.children[i].offsetWidth;
        if (w > result) result = w;
    }
    return result;
}

//==API FUNCTION==//
function setListItemWidth(list) {$(list).children().css('width', getListItemWidth(list) + 'px');}

//==API FUNCTION==//
function position(obj, x, y, buff) {
    if (typeof x == "string" && x.toLowerCase() == "center") x = ($(window).width() - $(obj).width()) / 2;
    if (typeof y == "string" && y.toLowerCase() == "center") y = ($(window).height() - $(obj).height()) / 2;
    if (typeof x == 'object') {
        var parameters = x;
        var positioner = x.object != null ? x.object : x;
        buff = x.buffer != null ? x.buffer : y;

        y = $(positioner).offset().top - $(window).scrollTop();
        x = $(positioner).offset().left - $(window).scrollLeft();

        if (parameters.offX != null) x += parameters.offX;
        if (parameters.offY != null) y += parameters.offY;
    }

    if (buff == null) buff = 0;
    if (x < buff) x = buff;
    if (y < buff) y = buff;

    var maxX = $(window).width() - ($(obj).width() + buff);
    if (x > maxX) x = maxX;

    var maxY = $(window).height() - ($(obj).height() + buff);
    if (y > maxY) y = maxY;

    $(obj).css('top', y + "px");
    $(obj).css('left', x + "px");
}

//==API FUNCTION==//
function tryParseInt(s,d) {
  if (!s) return d;
  var result;
  try {
    result = parseFloat(s);
  } catch (e) {
    return d;
  }
  return isNaN(result) ? d : result;
}

//==API FUNCTION==//
function tryParseInt(s,d) {
  if (!s) return d;
  var result;
  try {
    result = parseInt(s);
  } catch (e) {
    return d;
  }
  return isNaN(result) ? d : result;
}

//==API FUNCTION==//
function inbounds(el, buff) {
    if (buff == null) buff = 0;

    var left = $(el).offset().left;
    var top = $(el).offset().top;

    var scrollX = $(window).scrollLeft();
    var scrollY = $(window).scrollTop();

    left -= scrollX;
    top -= scrollY;

    var margL = tryParseFloat($(el).css('margin-left'), 0);
    var margT = tryParseFloat($(el).css('margin-top'), 0);
    var margR = tryParseFloat($(el).css('margin-right'), 0);
    var margB = tryParseFloat($(el).css('margin-bottom'), 0);
    
    var width = $(el).outerWidth(false);
    var height = $(el).outerHeight(false);

    var winW = $(window).outerWidth(false);
    var winH = $(window).outerHeight(false);

    if (top - margT + height + margB > winH + buff) top = winH - height;
    if (left - margL + width + margR > winW + buff) left = winW - width;

    if (top < buff) top = buff;
    if (left < buff) left = buff;

    $(el).css('top', top - margT + scrollY + 'px');
    $(el).css('left', left - margL + scrollX + 'px');
}

//==API FUNCTION==//
function getUserCommentThumb(size) {
    var hold = $('<div class="author" style="line-height:1.1em;" />');
    if (getIsLoggedIn()) {
        hold.append('<a class="name" href="/user/' + getUserNameEncoded() + '">' + getUserName() + '</a><div class="avatar"><img style="margin:0px;" height="' + size + '" width="' + size + '" src="' + getUserAvatar(size) + '" /></div>');
    } else {
        hold.append('<a class="name">Anon</a><div class="avatar"><img style="margin:0px;" height="' + size + '" width="' + size + '" src="' + getDefaultAvatar() + '" /></div>');
    }
    return $('<div class="comment" />').append(hold);
}

//==API FUNCTION==//
function fillBBCode(text) {
    var codes = [
        [/\[(\/|)u\]/g, '<$1u>'],
        [/\[(\/|)i\]/g, '<$1i>'],
        [/\[(\/|)b\]/g, '<$1b>'],
        [/\[s\]/g, '<span style="text-decoration:line-through">'],
        [/\[\/s\]/g, '</span>'],
        [/\[(\/|)center\]/g, '<$1center>'],
        [/\[img\]([^\[]*)\[\/img\]/g, '<img src="$1" />'],
        [/\[icon\]([^\[]*)\[\/icon\]/g, '<i class="fa fa-fw fa-$1" />'],
        [/\[(\/|)quote\]/g, '<$1blockquote>'],
        [/\[spoiler\]/g, '<span class="spoiler">'],
        [/\[\/spoiler\]/g, '</span>'],
        [/\[(left|right)_insert\]/gi, '<blockquote style="box-shadow: 5px 5px 0px rgb(238, 238, 238); margin: 10px 25px 10px 0px; box-sizing: border-box; padding: 15px; background-color: rgb(247, 247, 247); border: 1px solid rgb(170, 170, 170); width: 50%; float: $1;">'],
        [/\[\/(left|right)_insert\]/gi, '</blockquote>'],
        [/\[url\]([^\[]*)\[\/url\]/g,'<a href="$1">$1</a>'],
        [/\[url=([^\]]*)\]/g,'<a href="$1">'],
        [/\[\/url\]/g, '</a>'],
        [/\[size=([0-9]*)(px|em)]/g, '<span style="font-size:$1$2;line-height:1.3em;">'],
        [/\[size=([0-9]*)]/g, '<span style="font-size:$1px;line-height:1.3em;">'],
        [/\[\/size\]/g,'<span>'],
        [/\[color=([^\]]*)\]/g,'<span style="color:$1;">'],
        [/\[\/color\]/g, '</span>'],
        [/\[youtube=[^\]]*youtube\.[^\]]*v=([^\]]*)\]/g, '<div class="youtube_container"><iframe src="//www.youtube.com/embed/$1" /></div>']
    ]
    var i = codes.length;
    while (i--) text = text.replace(codes[i][0], codes[i][1]);
    return text;
}

//==API FUNCTION==//
function getStoryNumber() {
    var location = document.location.href;
    if (location.indexOf('story/') != -1) {
        var storySuffex =  location.split('story/')[1].split('/');
        var storyNumber = storySuffex[0];
        var chapter = storySuffex[1];
        return storyNumber + ':' + chapter;
    }
    var story = $('.chapter_content_box').attr('id').split('_')[1];
    return story + '_' + location.split('chapter/')[1].split('/')[0];
}

//==API FUNCTION==//
function getStoryViewMode() {
    if ($('#browse_form .right-menu-inner .button-group .drop-down-expander').length) {
        return $('#browse_form .right-menu-inner .button-group .drop-down-expander').text().split(' ')[0].toLowerCase();
    }
    return '';
}

//==API FUNCTION==//
function getPageStartNumber() {
    var pageNumber = getParameter("page");
    if (pageNumber != null) {
        pageNumber = parseInt(pageNumber);
        var mode = getStoryViewMode();
        return (pageNumber - 1) * (mode == 'list' || mode == 'cards' ? 60 : 10);
    }
    return 0;
}

//==API FUNCTION==//
function getParameter(name) {
    if (document.location.href.indexOf('?') != -1) {
        var params = document.location.href.split("?")[1].split("&");
        for (var i = 0; i < params.length; i++) {
            if (params[i].indexOf(name + "=") == 0) {
                return params[i].split("=")[1];
            }
        }
    }
    return null;
}