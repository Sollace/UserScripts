// ==UserScript==
// @name        Nosey Hound
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net/user/*
// @include     https://www.fimfiction.net/user/*
// @version     1.3
// @require     http://code.jquery.com/jquery-1.8.3.min.js
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

var TESTING = false;

function urlSafe(me){return me.toLowerCase().replace(/[^a-z0-9_-]/gi,'-').replace(/--/,'-');}

try {
    if (getIsLoggedIn() && $('.module_container.module_locked .user-links a').length > 0) (function() {
        var myPage = isMyPage();
        var userName = $('.module_container.module_locked .user-card .card-content > h2 a').text();
        var userId = $('.module_container.module_locked .user-links a').first().attr('href').split('user=').reverse()[0].split('&')[0];
        var oldFollowers = TESTING ? [{id:'dsfoj',name:'testee0'},{id:'sk',name:'testee1'},{id:'110493',name:'testee2'}] : getFollowers();

        var sniffer = $('<a href="javascript:void();">Sniff</a>');
        if ($('.bio_followers > h3').first().text().indexOf(userName + ' follows') == 0) {
            $('.bio_followers').prepend('<h3 style="border-bottom:none;"><b>' + $('.user_sub_info .fa-eye').next().text() + '</b> members follow ' + userName + '</h3>');
        }
        $('.bio_followers > h3').first().append(' - ');
        $('.bio_followers > h3').first().append(sniffer);

        sniffer.click(function() {
            var pop = $(makeGlobalPopup(myPage ? 'Results' : 'Results for ' + userName, 'fa fa-table'));
            pop.css({ width: '300px', height: '300px'});
            position(pop.parent().parent(), 'center', 'center');
            pop.addClass('dog');
            pop.append('<div style="width:100%;text-align:center;line-height:300px;" ><i style="font-size:50px;" class="fa fa-spinner fa-spin" /></div>');

            $.get('/ajax/fetch_watchers.php', { 
                watching: userId
            }, function(xml) {
                xml = $('<ul>' + xml + '</ul>');
                var followers = [];
                $('.user-avatar', xml).each(function() {
                    followers.push({
                        id: $(this).css('background-image').split('avatars/').reverse()[0].split('_')[0],
                        name: $(this).parent().attr('href').split('/').reverse()[0] });
                });
                var gained = [];
                var lost = [];
                var named = [];
                for (var i = 0; i < followers.length; i++) {
                    var old = isPresent(oldFollowers, followers[i]);
                    if (old == null) {
                        gained.push(followers[i].name);
                    } else {
                        if (old.id != 'none' && old.name != followers[i].name) {
                            named.push({name: followers[i].name, oldName: old.name});
                        }
                    }
                }
                for (var i = 0; i < oldFollowers.length; i++) {
                    if (isPresent(followers, oldFollowers[i]) == null) {
                        lost.push(oldFollowers[i].name);
                    }
                }

                pop.empty();
                printFollowers(!setFollowers(followers), pop, gained, lost, named);
            });
        });

        function printFollowers(firstTime, pop, gained, lost, named) {
            $('#infocard').parent().append($('#infocard'));
            var tabs = $('<div class="tabs" />');
            pop.append(tabs);

            if (firstTime) {
                gained = lost = named = [];
            }

            var localeG = gained.length.toLocaleString('en');
            var localeL = lost.length.toLocaleString('en');
            var localeN = named.length.toLocaleString('en');

            tabs.append('<div data_tab="0" class="button selected">Overview</div>');
            pop.append('<div data_id="0" class="tab shown selected" >' + (firstTime ? loaded() : overview(gained, lost, named, localeG, localeL, localeN)) + '</div>');
            tabs.append('<div data_tab="3" class="button">Stats</div>');
            pop.append('<div data_id="3" class="tab shown">' + stats(gained, lost, localeG, localeL) + '</div>');
            if (gained.length > 0) {
                tabs.append('<div data_tab="1" class="button">Gained</div>');
                pop.append('<div data_id="1" class="tab shown" ><b>Total Gained:</b> ' + localeG + '<div class="main">' + list(gained) + '</div></div>');
            }
            if (lost.length > 0) {
                tabs.append('<div data_tab="2" class="button">Lost</div>');
                pop.append('<div data_id="2" class="tab shown" ><b>Total Lost:</b> ' + localeL + '<div class="main">' + list(lost) + '</div></div>');
            }
            tabs.append('<div data_tab="4" class="button hidden">List</div>');
            pop.append(listing(oldFollowers, '<div data_id="4" class="tab hidden" />'));

            $('.button', tabs).click(function() {
                var id = $(this).attr('data_tab');
                $('.tab', pop).each(function() {
                    if ($(this).attr('data_id') == id) {
                        $(this).addClass('selected');
                    } else {
                        $(this).removeClass('selected');
                    }
                });
                $('.button', tabs).each(function() {
                    $(this).removeClass('selected');
                });
                $(this).addClass('selected');
            });

            pop.on('mouseenter', 'a', function() {
                $('#infocard').css('z-index', '9999999999');
                unsafeWindow.infocard_hover_over.apply(this);
            });
            pop.on('mouseleave', 'a', function() {
                unsafeWindow.infocard_hover_off.apply(this);
                $('#infocard').css('z-index', '');
            });
        }

        function listing(followers, node) {
            node = $(node);
            var list = $('<div class="list">');
            var search = $('<input type="text" placeholder="search followers" />');
            $(search).on('input', function () {
                var content = '<ol>';
                for (var i = 0; i < followers.length; i++) {
                    if (followers[i].name.replace(/\+/g, ' ').toUpperCase().indexOf($(this).val().toUpperCase()) != -1) {
                        content += '<li><a target="_blank" href="/user/' + followers[i].name + '">' + followers[i].name.replace(/\+/g, ' ') + '</a></li>';
                    }
                }
                list.html(content + '</ol>');
            });
            node.append(search);
            node.append(list);

            var content = '<ol>';
            for (var i = 0; i < followers.length; i++) {
                content += '<li><a target="_blank" href="/user/' + followers[i].name + '">' + followers[i].name.replace(/\+/g, ' ') + '</a></li>';
            }
            list.html(content + '</ol>');
            return node;
        }

        function list(arr) {
            var result = '<div class="list"><ol>';
            for (var i = 0; i < arr.length; i++) {
                result += '<li><a target="_blank" href="/user/' + arr[i] + '">' + arr[i].replace(/\+/g, ' ') + '</a></li>';
            }
            return result + '</ol></div>';
        }

        function loaded() {
            return '<div class="score fresh">' + oldFollowers.length + '</div>' + (myPage ? 'Welcome! Your' : userName + '\'s') + ' followers have been successfully saved.';
        }

        function stats(g, l, G, L) {
            var result = '';
            var all = oldFollowers.length + l.length;
            var percentG = (all > 0 ? g.length * 100 / all : 0);
            var percentL = (all > 0 ? l.length * 100 / all : 0);
            result += '<div class="score bar neutral"><div class="glass" /><div class="percentage g" style="width:' + percentG + '%;" >' + (percentG > 0 ? percentG.toFixed(0) + '%' : '') + '</div><div class="percentage l" style="width: ' + percentL + '%" >' + (percentL > 0 ? percentL.toFixed(0) + '%' : '') + '</div></div>';
            result += '<div class="main"><b>Total: </b>' + oldFollowers.length.toLocaleString('en') + ' was ' + (all - g.length).toLocaleString('en') + '<br /><br />';
            result += '<b>Arrived:</b> ' + G + ' (' + percentG.toFixed(0) + '%)<br />';
            result += '<b>Left:</b> ' + L + ' (' + percentL.toFixed(0) + '%)<br />';
            result += '<b>Stayed:</b> ' + (oldFollowers.length - g.length).toLocaleString('en') + ' (' + (100 - percentG - percentL).toFixed(0) + '%)';
            result += '<br /><b>Score: </b>' + popularity(g.length, l.length, oldFollowers.length) + '<br />';
            return result;
        }

        function overview(g, l, n, G, L, N) {
            var result = '';
            var diff = g.length - l.length;        
            result += '<div class="score ' + (diff >= 0 ? (diff == 0 ? 'neutral">' : 'good">') : 'bad">') + named(diff) + '</div><div class="main">';
            if (diff != 0) {
                result += diff > 0 ? 'Good job! ' : 'I\'m sorry. ';
                result += (myPage ? 'You have' : userName + ' has') + ' <b>' + oldFollowers.length + '</b> followers' + (g.length > 0 ? ' of which' : '');
                result += diff > 0 ? (g.length > 0 ? ' <b>' + G + '</b>' : 'none of which') + ' are new additions whilst ' + (l.length > 0 ? 'only ' : '') :  (g.length > 0 ? ' only <b>' + G + '</b>' : '<b>none</b> of which') + ' are new additions whilst ';
                result += '<b>' + (l.length > 0  ? L : 'none') + '</b> of ' + (myPage ? 'your' : userName + '\'s') + ' old followers have left.';
            } else if (g.length == 0) {
                result += (myPage ? 'Be happy. You have ' : userName + ' has ') + 'not lost any followers, but ' + (myPage ? 'you have ' : 'he has ') + 'not gained any either.' + (myPage ? ' Is there something else you can do to improve this?' : '');
            } else {
                result += (myPage ? 'You' : userName) + ' simultaneously gained and lost <b>' + G + '</b> followers.';
            }
            result += '</div>';
            if (n.length > 0) {
                result += '<b>Name changes (' + N + '):</b>';
                result += '<div class="main"><ol>';
                for (var i = 0; i < n.length; i++) {
                    result += '<li>' + n[i].oldName.replace(/\+/g, ' ') + ' is now known as <a target="_blank" href="/user/' + n[i].name + '">' + n[i].name.replace(/\+/g, ' ') + '</a></li>';
                }
                result += '</ol></div>';
            }
            return result;
        }

        function popularity(g, l, t) {
            var alpha = 'abcdefghijklmnopqrstuvwxyz';
            var story_views = 0;
            for (var i = 0; i < userName.length; i++) {
                var j = parseInt(userName[i]);
                if (j + '' === 'NaN') {
                    j = alpha.indexOf(userName[i].toLowerCase());
                    if (j < 0) j = 0;
                }
                story_views += j;
            }
            story_views / userName.length;
            var _count = $('.module_container.module_locked .user-links').children().first();
            var story_count = parseInt(_count.find('.number').html());
            var blog_count = parseInt(_count.next().find('.number').html());
            var fol_count = parseInt(_count.next().next().find('.number').html());
            
            var result = ((t > 0 ? (g - l * 100) / t : 100) + t + (blog_count * ((story_views * story_count > 0 ? story_count : 0) * fol_count / 12))) / 10;
            var unit = 'inches';
            if (result >= 12) {
                unit = 'feet';
                result /= 12;
                if (result >= 3) {
                    unit = 'yards';
                    result /= 3;
                    if (result >= 1760) {
                        unit = 'miles';
                        result /= 1760;
                    }
                }
            }

            return parseFloat(result.toFixed(3).toString()).toLocaleString('en') + ' ' + unit;
        }

        function isPresent(arr, follower) {
            if (follower.id == 'none') {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].name == follower.name) return arr[i];
                }
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].id == follower.id) return arr[i];
            }
            return null;
        }

        function getFollowers() {
            var result = GM_getValue('followers_' + userId);
            return JSON.parse(result == null ? '[]' : result);
        }

        function setFollowers(val) {
            var result = GM_getValue('followers_' + userId) != null;
            oldFollowers = val;
            GM_setValue('followers_' + userId, JSON.stringify(val));
            return result;
        }

        function named(numb) {
            var sign = numb < 0 ? '-' : numb == 0 ? '' : '+';
            numb = numb < 0 ? -numb : numb;
            if (numb / 1000 >= 1) {
                if (numb / 1000000 >= 1) {
                    if (numb / 1000000000 >= 1) {
                        return sign + parseFloat((numb/1000000000).toFixed(3).toString()) + ' billion';
                    }
                    return sign + parseFloat((numb/1000000).toFixed(3).toString()) + ' million';
                }
                return sign + parseFloat((numb/1000).toFixed(3).toString()) + ' thousand';
            }
            return sign + numb.toString();
        }

        makeStyle('\
.dog .button {\
    display: inline-block;\
    background: linear-gradient(to bottom, #eee 0%, #ddd 100%);\
    line-height: 20px;\
    margin-top: 4px;\
    padding: 5px 5px 0 5px;\
    border-radius: 5px 5px 0 0;\
    border: solid 1px rgba(0, 0, 0, 0.6);\
    border-bottom: none;\
    cursor: pointer;}\
.dog .button:not(.selected) {\
    background: linear-gradient(to bottom, #ddd 0%, #ccc 100%);}\
.dog .tabs {\
    width: 100%;\
    height: 30px;\
    position: relative;\
    border-bottom: solid 1px rgba(0,0,0,0.6);}\
.dog .tab {\
    display: none;\
    background: #ddd;\
    height: 270px;\
    overflow-y: auto;\
    padding: 10px;}\
.dog .list {\
    padding: 5px;}\
.dog .tab .main .li {\
    height: 20px;}\
.dog .tab .main {\
    background: rgb(220, 250, 200);\
    border-radius: 20px;\
    padding: 15px;\
    border: dashed 1px rgba(0,0,0,0.2);\
    box-shadow: 0 0 3px 1px rgba(0,0,30,0.3);\
    color: #555;\
    margin: 5px 0px;}\
.dog .tab.selected {\
    display: block !important;}\
.dog .score {\
    text-align: center;\
    font-weight: bold;\
    font-size: 40px;\
    border-radius: 300px;\
    border: solid 5px;\
    margin-bottom: 5px;\
    height: 58px;\
    text-shadow: 0 0 2px rgba(0,0,100,0.6);}\
.dog .score:not(.bar) {\
    box-shadow: inset 0 0 10px 5px rgba(255,255,255,0.4),0 0 3px 1px rgba(0,0,30,0.3);}\
.dog .score.good {\
    background: rgba(0, 240, 0, 0.3);\
    color: #A5C75B;}\
.dog .score.bad {\
    background: rgba(240, 0, 0, 0.3);\
    color: #B15B5B;}\
.dog .score.neutral {\
    background: rgba(120, 120, 120, 0.3);\
    color: rgb(240, 240, 240);}\
.dog .score.fresh {\
    background: rgba(0, 0, 240, 0.3);\
    color: blue;}\
.dog .score.bar {\
    position: relative;\
    overflow: hidden;\
    box-shadow: 0 0 3px 1px rgba(0,0,30,0.3);\
    background: rgba(0, 0, 240, 0.3);\
    line-height: 50px;\
    font-size: 15px;}\
.dog .score.bar div {\
    position: absolute;}\
.dog .glass {\
    top: 0px;\
    bottom: 0px;\
    left: 0px;\
    right: 0px;\
    z-index: 1;\
    border-radius: 500px;\
    box-shadow: inset 0 0 10px 5px rgba(255,255,255,0.4);}\
.dog .percentage.g {\
    top: 0px;\
    bottom: 0px;\
    left: 0px;\
    background: #A5C75B;}\
.dog .percentage.l {\
    top: 0px;\
    right: 0px;\
    bottom: 0px;\
    background: #B15B5B;}');
    })();
} catch (e) {alert('Nosey Hound: ' + e);}

//==API FUNCTION==//
function makeGlobalPopup(title, fafaText, darken, img) {
    var holder = document.createElement("div");
    $("body").append(holder);
    $(holder).addClass("drop-down-pop-up-container");
    $(holder).attr("style", "position: fixed;z-index:2147483647;left:10px;top:10px");
    $(holder).addClass('global_popup');

    var dark = $("<div style=\"position: fixed;left:0px;right:0px;top:0px;bottom:0px;background-color:rgba(0,0,0,0.4); z-index:100000;\" />");
    if (typeof(darken) == 'number') {
        dark.css('background-color', 'rgba(0,0,0,' + (darken/100) + ')');
        $("body").append(dark);
    } else if (darken == null || darken) {
        $("body").append(dark);
    }

    var pop = $("<div class=\"drop-down-pop-up\" style=\"width: auto\" />");
    $(holder).append(pop);

    var head = document.createElement("h1");
    $(head).css("cursor","move");
    $(pop).append(head);
    if (fafaText != null) {
        $(head).append("<i class=\"" + fafaText + "\" /i>");
    } else if (img != null) {
        $(head).append("<img src=\"" + img + "\" style=\"width:18px;height:18px;margin-right:5px;\" /img>");
    }
    $(head).append(title);

    head.onmousedown = function(event) {
        var x = event.clientX - parseInt(holder.style.left.split('px')[0]);
        var y = event.clientY - parseInt(holder.style.top.split('px')[0]);
        document.onmousemove = function(event) {
            position(holder, event.clientX - x, event.clientY - y, 30);
        };
        event.preventDefault();
    };
    head.onmouseup = function(e) {
        document.onmousemove = function(e) {};
    };

    var close = document.createElement("a");
    $(close).addClass("close_button");
    $(close).attr("id", "message_close_button");
    $(close).click(function(e) {
        $(dark).remove();
        $(holder).remove();
    });
    $(head).append(close);

    var content = document.createElement("div");
    $(content).addClass("drop-down-pop-up-content");
    $(pop).append(content);
    return content;
}

//==API FUNCTION==//
function position(obj, x, y, buff) {
    if (typeof x == "string" && x.toLowerCase() == "center") {
        x = ($(window).width() - $(obj).width()) / 2;
    }
    if (typeof y == "string" && y.toLowerCase() == "center") {
        y = ($(window).height() - $(obj).height()) / 2;
    }
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
function isMyPage() {
    if (document.location.href.split('/user/').reverse()[0] == getUserNameEncoded()) {
        return true;
    }
    return document.location.href.split('/user/').reverse()[0] == getUserName().replace(/ /g, '+');
}

//==API FUNCTION==//
function getUserNameEncoded() { return encodeURIComponent(getUserName()); }

//==API FUNCTION==//
function getUserName() {
    return getIsLoggedIn() ? getUserButton().getAttribute("href").split("/").reverse()[0] : 'Anon';
}

//==API FUNCTION==//
function getUserButton() {
    return $('.user_toolbar a.button[href^="/user/"]')[0];
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
        input = input.replace(/  /g, ' ');
    }
    var style = document.createElement('style');
    $(style).attr('type', 'text/css');
    $(style).append(input);
    if (id != undefined && id != null) {
        style.id = id;
    }
    $('head').append(style);
}

