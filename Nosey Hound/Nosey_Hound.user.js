// ==UserScript==
// @name        Nosey Hound
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net/user/*
// @include     https://www.fimfiction.net/user/*
// @version     1.4.4
// @require     http://code.jquery.com/jquery-1.8.3.min.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// ==/UserScript==

var followerMapping = (function() {
    var internalMapping = [];
    var idToChildMapping = {};
    var openedMapping = [];
    var structure;
    var dirty = true;
    
    function structuredChilds(x, y) {
        var result = {
            content: internalMapping[x][y],
            children: [],
            opened: function() {
                return openedMapping[x + '|' + y];
            },
            html: function(filter) {
                var t = '<li data-item="' + x + '|' + y + '"><a ';
                if (result.opened()) t += 'class="opened" ';
                t += 'target="_blank" href="/user/' + result.content + '">' + result.content.replace(/\+/g, ' ') + '</a>';
                if (result.children.length > 0) {
                    t += '<span class="open-pin" /><div class="dog"><div class="list content"><ol>';
                    var s = '';
                    for (var i = 0; i < result.children.length; i++) {
                        s += result.children[i].html(filter);
                    }
                    if (s != '') {
                         t += s;
                    } else if (result.content.replace(/\+/g, ' ').toUpperCase().indexOf(filter) == -1) {
                        return '';
                    }
                     t += '</ol></div></div>';
                } else if (result.content.replace(/\+/g, ' ').toUpperCase().indexOf(filter) == -1) {
                    return '';
                }
                return t;
            }
        };
        var child = idToChildMapping[x + '|' + y];
        if (child != null) {
            for (var i = 0; i < internalMapping[child].length; i++) {
                result.children.push(structuredChilds(child,i));
            }
        }
        return result;
    }
    
    return {
        registerList: function(arr) {
            internalMapping.push(arr);
            dirty = true;
            return internalMapping.length - 1;
        },
        registerChild: function(id, arr) {
            var ch = this.registerList(arr);
            idToChildMapping[id] = ch;
            $('body').append('<div>' + JSON.stringify(idToChildMapping) + '</div>');
            $('body').append('<div>' + JSON.stringify(internalMapping) + '</div>');
            dirty = true;
            return ch;
        },
        setOpened: function(id, val) {
            openedMapping[id] = val;
        },
        structured: function() {
            if (structure == null || dirty) {
                var result = {
                    children: [],
                    html: function(filter) {
                        var nod = '<ol>';
                        for (var i = 0; i < result.children.length; i++) {
                            nod += result.children[i].html(filter);
                        }
                        return nod + '</ol>';
                    }
                };
                for (var i = 0; i < internalMapping[0].length; i++) {
                    result.children.push(structuredChilds(0, i));
                }
                dirty = false;
                structure = result;
            }
            return structure;
        }
    }
})();

function urlSafe(me){return me.toLowerCase().replace(/[^a-z0-9_-]/gi,'-').replace(/--/,'-');}

try {
    if (getIsLoggedIn()) (function() {
        var name = getUserName();
        Dog = function(c) {
            this.container = c;
            if (this.container.hasClass('user-page-header')) {
                this.userName = this.container.find('h1.resize_text > a').first().text();
                this.userId = this.container.find('ul.tabs li a').first().attr('href').split('&user=').reverse()[0].split('&')[0];
                this.tabs = this.container.find('ul.tabs');
            } else {
                this.userName = this.container.find('.card-content > h2 a').text();
                this.userId = this.container.find('.drop-down > ul > li > a > i.fa-warning').first().parent().attr('href').split('/').reverse()[0];
                this.tabs = this.container.container.parent().find('.user-links');
            }
            this.myPage = this.userName == name;
            this.oldFollowers = getFollowers(this.userId);
            this.followersRaw = [];
        }
        Dog.prototype.sniffFollowers = function() {
            var pop = makeGlobalPopup(this.myPage ? 'Results' : 'Results for ' + this.userName, 'fa fa-table');
            pop.content.css({ width: '300px', height: '300px'});
            $('body').append($('#info-cards'));
            this.Sniff(true, pop.content);
            pop.position('center', 'center');
        }
        Dog.prototype.snubFollowers = function(link) {
            var pop = $('<div></div>');
            link.after(pop);
            link.after('<span class="open-pin" />');
            link.addClass('opened');
            followerMapping.setOpened(link.parent().attr('data-item'), true);
            this.Sniff(false, pop);
        }
        Dog.prototype.Sniff = function(type, pop) {
            pop.addClass('dog');
            pop.append('<div style="width:100%;height:100%;text-align:center;line-height:300px;" ><i style="font-size:50px;" class="fa fa-spinner fa-spin" /></div>');
            
            var me = this;
            $.get('/ajax/fetch_watchers.php', { 
                watching: this.userId
            }, function(xml) {
                try {
                    me['do' + (type ? 'sniff' : 'snuff')](pop,$('<ul>' + xml + '</ul>'))
                } catch (e) {
                    pop.html(e + '');
                }
            });
        }
        Dog.prototype.dosniff = function(pop,xml) {
            var followers = [];
            this.followersRaw = [];
            var me = this;
            $('.user-avatar', xml).each(function() {
                var name = $(this).parent().find('.name').clone();
                name.find('*').remove();
                followers.push({
                    id: $(this).css('background-image').split('avatars/').reverse()[0].split('_')[0],
                    name: name.text()
                });
                me.followersRaw.push(name.text());
            });
            var gained = [];
            var lost = [];
            var named = [];
            for (var i = 0; i < followers.length; i++) {
                var old = isPresent(this.oldFollowers, followers[i]);
                if (old == null) {
                    gained.push(followers[i].name);
                } else {
                    if (old.id != 'none' && old.name != followers[i].name) {
                        named.push({name: followers[i].name, oldName: old.name});
                    }
                }
            }
            for (var i = 0; i < this.oldFollowers.length; i++) {
                if (isPresent(followers, this.oldFollowers[i]) == null) {
                    lost.push(this.oldFollowers[i].name);
                }
            }
            
            pop.empty();
            this.printFollowers(!setFollowers(this.userId, this.oldFollowers = followers), pop, gained, lost, named);
        }
        Dog.prototype.dosnuff = function(pop,xml) {
            var followers = [];
            $('.user-avatar', xml).each(function() {
                followers.push($(this).parent().attr('href').split('/').reverse()[0]);
            });
            pop.empty();
            followerMapping.registerChild(pop.parent().attr('data-item'), followers);
            $('#nosey_follower_searcher').trigger('input');
        }
        Dog.prototype.printFollowers = function(firstTime, pop, gained, lost, named) {
            $('#infocard').parent().append($('#infocard'));
            $('#infocard').css('z-index', '9999999999');
            var tabs = $('<div class="tabs" />');
            pop.append(tabs);
            
            if (firstTime) gained = lost = named = [];
            
            var localeG = gained.length.toLocaleString('en');
            var localeL = lost.length.toLocaleString('en');
            var localeN = named.length.toLocaleString('en');
            
            tabs.append('<div data_tab="0" class="button selected">Overview</div>');
            pop.append('<div data_id="0" class="tab shown selected" >' + (firstTime ? this.loaded() : this.overview(gained, lost, named, localeG, localeL, localeN)) + '</div>');
            tabs.append('<div data_tab="3" class="button">Stats</div>');
            pop.append('<div data_id="3" class="tab shown">' + this.stats(gained, lost, localeG, localeL) + forgetButton(this.userId) + '</div>');
            if (gained.length > 0) {
                tabs.append('<div data_tab="1" class="button">Gained</div>');
                pop.append('<div data_id="1" class="tab shown" ><b>Total Gained:</b> ' + localeG + '<div class="main">' + list(gained) + '</div></div>');
            }
            if (lost.length > 0) {
                tabs.append('<div data_tab="2" class="button">Lost</div>');
                pop.append('<div data_id="2" class="tab shown" ><b>Total Lost:</b> ' + localeL + '<div class="main">' + list(lost) + '</div></div>');
            }
            tabs.append('<div data_tab="4" class="button hidden">List</div>');
            pop.append(listing(this.userName, this.followersRaw, '<div data_id="4" class="tab hidden" />'));
            
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
        }
        Dog.prototype.loaded = function() {
            return '<div class="score fresh">' + this.oldFollowers.length + '</div>' + (this.myPage ? 'Welcome! Your' : this.userName + '\'s') + ' followers have been successfully saved.';
        }
        Dog.prototype.stats = function(g, l, G, L) {
            var result = '';
            var all = this.oldFollowers.length + l.length;
            var percentG = (all > 0 ? g.length * 100 / all : 0);
            var percentL = (all > 0 ? l.length * 100 / all : 0);
            result += '<div class="score bar neutral"><div class="glass" /><div class="percentage g" style="width:' + percentG + '%;" >' + (percentG > 0 ? percentG.toFixed(0) + '%' : '') + '</div><div class="percentage l" style="width: ' + percentL + '%" >' + (percentL > 0 ? percentL.toFixed(0) + '%' : '') + '</div></div>';
            result += '<div class="main"><b>Total: </b>' + this.oldFollowers.length.toLocaleString('en') + ' was ' + (all - g.length).toLocaleString('en') + '<br /><br />';
            result += '<b>Arrived:</b> ' + G + ' (' + percentG.toFixed(0) + '%)<br />';
            result += '<b>Left:</b> ' + L + ' (' + percentL.toFixed(0) + '%)<br />';
            result += '<b>Stayed:</b> ' + (this.oldFollowers.length - g.length).toLocaleString('en') + ' (' + (100 - percentG - percentL).toFixed(0) + '%)';
            result += '<br /><b>Score: </b>' + this.popularity(g.length, l.length, this.oldFollowers.length);
            return result + '</div>';
        }
        Dog.prototype.overview = function(g, l, n, G, L, N) {
            var result = '';
            var diff = g.length - l.length;        
            result += '<div class="score ' + (diff >= 0 ? (diff == 0 ? 'neutral">' : 'good">') : 'bad">') + named(diff) + '</div><div class="main">';
            if (diff != 0) {
                result += diff > 0 ? 'Good job! ' : 'I\'m sorry. ';
                result += (this.myPage ? 'You have' : this.userName + ' has') + ' <b>' + this.oldFollowers.length + '</b> followers' + (g.length > 0 ? ' of which' : '');
                result += diff > 0 ? (g.length > 0 ? ' <b>' + G + '</b>' : 'none of which') + ' are new additions whilst ' + (l.length > 0 ? 'only ' : '') :  (g.length > 0 ? ' only <b>' + G + '</b>' : '<b>none</b> of which') + ' are new additions whilst ';
                result += '<b>' + (l.length > 0  ? L : 'none') + '</b> of ' + (this.myPage ? 'your' : this.userName + '\'s') + ' old followers have left.';
            } else if (g.length == 0) {
                result += (this.myPage ? 'Be happy. You have ' : this.userName + ' has ') + 'not lost any followers, but ' + (this.myPage ? 'you have ' : 'he has ') + 'not gained any either.' + (this.myPage ? ' Is there something else you can do to improve this?' : '');
            } else {
                result += (this.myPage ? 'You' : this.userName) + ' simultaneously gained and lost <b>' + G + '</b> followers.';
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
        Dog.prototype.popularity = function(g, l, t) {
            var alpha = 'abcdefghijklmnopqrstuvwxyz';
            var story_views = 0;
            for (var i = 0; i < this.userName.length; i++) {
                var j = parseInt(this.userName[i]);
                if (j + '' === 'NaN') {
                    j = alpha.indexOf(this.userName[i].toLowerCase());
                    if (j < 0) j = 0;
                }
                story_views += j;
            }
            story_views /= this.userName.length;
            var _count = this.tabs.children().first();
            var story_count = parseInt(_count.find('.number').html());
            var blog_count = parseInt(_count.next().find('.number').html());
            var fol_count = t + g - l;
            
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
        
        if ($('.user-page-header').length) {
            var sniffer = $('<a href="javascript:void();">Sniff</a>');
            if ($('.bio_followers > h3').first().text().indexOf(name + ' follows') == 0) {
                $('.bio_followers').prepend('<h3 style="border-bottom:none;"><b>' + $('.user_sub_info .fa-eye').next().text() + '</b> members follow ' + name + '</h3>');
            }
            $('.bio_followers > h3').first().append(' - ');
            $('.bio_followers > h3').first().append(sniffer);

            sniffer.click(function() {
                (new Dog($('.user-page-header'))).sniffFollowers();
            });
        }

        $('.user-card').each(function() {
            $(this).find('.drop-down > ul > .divider').before('<li><a class="sniffer" href="javascript:void();"><i class="fa fa-fw fa-paw" /> Sniff Followers</a></li>');
        });
        $('.user-page-header ul.tabs').append('<li><a class="sniffer" href="javascript:void();"><span class="number"><i class="fa fa-fw fa-paw" /></span>Sniff Followers</a></li>');
        
        $(document).on('click','.sniffer', function() {
            (new Dog($(this).parents('.user-card, .user-page-header'))).sniffFollowers();
        });
        $(document).on('click','button.forget', function() {
            if ($(this).attr('data-check') != '2') {
                if ($(this).attr('data-check') != '1') {
                    $(this).attr('data-check','1');
                    $(this).text('Are you sure?');
                } else {
                    $(this).css({
                        opacity: '0.3',
                        'pointer-events': 'none'
                    });
                    $(this).attr('data-check','2');
                    clearFollowers($(this).attr('data-id'));
                }
            }
        });
        $(document).on('click', '.dog .open-pin', function(e) {
            e.preventDefault();
            var a = $(this).parent().children('a').first();
            followerMapping.setOpened($(this).parent().attr('data-item'), !a.hasClass('opened'));
            if (a.hasClass('opened')) {
                a.removeClass('opened');
            } else {
                a.addClass('opened');
            }
        });
        $(document).on('mouseleave','button.forget', function() {
            $(this).attr('data-check','0').text('Forget this User');
        });
        $(document).on('mouseenter', '.dog .list a', function() {
            $('.dog .list a.hover').removeClass('hover');
            $(this).addClass('hover');
        });
        
        function snuffButton(context) {
            var l = $(context).find('.top-info .button-group').first();
            var snif = $('<a class="snuff styled_button button-icon-only dark styled_button_dark_grey" href="javascript:void()">Sniff</a>');
            l.prepend(snif);
            snif.click(function() {
                (new Dog($(this).parents('.info-card').find('.user-links a').first().attr('href').split('&user=')[1])).snubFollowers($('.dog a.hover').first());
            });
        }
        
        function forgetButton(id) {
            return '<div class="main"><button data-id="' + id + '" class="forget styled_button">Forget this User</button></div>';
        }
        
        function setFollowers(id, val) {
            var result = GM_getValue('followers_' + id) != null;
            GM_setValue('followers_' + id, JSON.stringify(val));
            return result;
        }
        
        function clearFollowers(id) {
            GM_deleteValue('followers_' + id);
        }

        function getFollowers(id) {
            var result = GM_getValue('followers_' + id);
            return result == null ? [] : JSON.parse(result);
        }
                
        function listing(name, followers, node) {
            followerMapping.registerList(followers);
            node = $(node);
            var list = $('<div class="list content">');
            var search = $('<input id="nosey_follower_searcher" type="text" placeholder="search followers" />');
            $(search).on('input', function () {
                list.empty();
                try {
                    list.html(followerMapping.structured().html(search.val().toUpperCase()));
                } catch (e) {alert(e)}
            });
            node.append(search);
            node.append(list);
            list.html(followerMapping.structured().html(search.val().toUpperCase()));
            return node;
        }
        
        function list(arr) {
            var result = '<div class="list"><ol>';
            for (var i = 0; i < arr.length; i++) {
                result += '<li><a target="_blank" href="/user/' + arr[i] + '">' + arr[i].replace(/\+/g, ' ') + '</a></li>';
            }
            return result + '</ol></div>';
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
    line-height: 45px;\
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
    background: #B15B5B;}\
.dog li .dog {\
  display: none;}\
.dog li a.opened ~ .dog {\
  display: block;}\
.open-pin:after {\
  content: "";\
  float: right;\
  display: inline-block;\
  width: 0px;\
  height: 0px;\
  text-align: center;\
  line-height: 15px;\
  margin-top: 10px;\
  cursor: pointer;\
  border: solid;\
  border-width: 5px;\
  border-color: #507E2C transparent transparent transparent;}\
a:hover + .open-pin:after, .open-pin:hover:after {\
  border-color: #609734 transparent transparent transparent;}\
.opened:hover + .open-pin:after, .opened + .open-pin:hover:after {\
  border-color: transparent transparent #609734 transparent;}\
.opened + .open-pin:after {\
  margin-top: 5px;\
  border-color: transparent transparent #507E2C transparent;}\
#info-cards > * {\
  z-index: 99999999999999999 !important;}\
.global_popup input[type="text"], .global_popup input[type="url"] {\
    padding: 8px;\
    width: 100%;\
    border: 1px solid #CCC;\
    background: none repeat scroll 0% 0% #F8F8F8;\
    outline: medium none;\
    color: #333;\
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1) inset;\
    border-radius: 3px;\
    margin: 5px 0px;}');
    })();
} catch (e) {alert('Nosey Hound: ' + e);}

//==API FUNCTION==//
function Popup(holder, dark, cont) {
  this.holder = holder;
  this.dark = dark;
  this.content = this.unscoped = cont;
  this.scoped = null;
  this.position = function(x, y, buff) {
    if (this.holder != null) position(this.holder, x, y, buff);
  }
  this.scope = function(el) {
      if (typeof el == 'string') {
          el = $(el);
          this.content.append(el);
      }
      return this.content = el;
  }
  this.unscope = function(el) {
      this.content = this.unscoped;
      if (typeof el !== 'undefined') this.scope(el);
      return this.content;
  }
  this.find = function(el) {
      return this.content.find(el);
  }
}

//==API FUNCTION==//
function makeGlobalPopup(title, fafaText, darken, close) {
    if (typeof (close) == 'undefined') close = true;
    var holder = $('<div style="position: fixed;z-index:2147483647;left:10px;top:10px" class="global_popup drop-down-pop-up-container" />');
    $("body").append(holder);
    
    var dark = null;
    if (darken) {
        dark = $('<div class="dimmer" style="z-index:1001;" />');
        if (typeof (darken) == 'number') dark.css('opacity', (darken / 100));
        $('#dimmers').append(dark);
    }
    
    var pop = $('<div class="drop-down-pop-up" style="width: auto" />');
    holder.append(pop);
    
    var head = $('<h1 style="cursor:move">' + title + '</h1>');
    pop.append(head);
    if (fafaText) head.prepend("<i class=\"" + fafaText + "\" /i>");
    head.on('mousedown', function(e) {
        var x = e.clientX - parseFloat(holder.css('left'));
        var y = e.clientY - parseFloat(holder.css('top'));
        $(document).on('mousemove.popup.global', function(e) {
            position(holder, e.clientX - x, e.clientY - y, 30);
        });
        $(document).one('mouseup', function(e) {
            $(this).off('mousemove.popup.global');
        });
        e.preventDefault();
    });
    
    var c = $('<a id="message_close_button" class="close_button" />');
    head.append(c);
    $(c).click(function(e) {
        if (close) {
            $(dark).remove();
            $(holder).remove();
        } else {
           $(holder).css('display','none');
        }
    });
    
    var content = $('<div class="drop-down-pop-up-content" />');
    pop.append(content);
    return new Popup(holder, dark, content);
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
    var locationCheck = document.location.href.replace('http:','').replace('https:','').split('?')[0];
    if (locationCheck == '//www.fimfiction.net/user/' + getUserNameEncoded()) return true;
    return locationCheck == '//www.fimfiction.net/user/' + getUserName().replace(/ /g, '+');
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