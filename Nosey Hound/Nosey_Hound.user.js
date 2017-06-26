// ==UserScript==
// @name        Nosey Hound
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @version     2.2.2
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/Events.user.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// ==/UserScript==

var settingsMan = {
    get: function getValue(key) {
        return GM_getValue(key);
    },
    set: function setValue(key, value) {
        GM_setValue(key, value);
    },
    delete: function deleteValue(key) {
        GM_deleteValue(key);
    },
    list: function() {
        return GM_listValues();
    }
};

var jSlim = {
    html: (function() {
        var DIV = document.createElement('DIV');
        return function(s, w) {
            w = w || DIV;
            w.innerHTML = s;
            var result = [];
            result.push.apply(result, w.childNodes);
            w.innerHTML = '';
            return result;
        };
    })(),
    on: function addScopedEventListener(node, selector, event, func, capture) {
        var k = function (ev) {
            try {
            for (var target = ev.target; null != target && target != document; ) {
                if (win().matchesSelector(target, selector)) {
                    if (('mouseout' == event || 'mouseover' == event) && target.contains(ev.relatedTarget)) break;
                    func.call(target, ev);
                }
                if (node == k) break;
                target = target.parentNode
            }
            } catch (e) {console.error(e);}
        };
        node.addEventListener(event, k, !!capture);
        return k;
    },
    off: function removeScopedEventListener(node, event, func, capture) {
        node.removeEventListener(event, func, !!capture)
    },
    ajax: function ajaxRequest(params) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            try {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status >= 200 && request.status < 300) {
                        var answer = request.responseXML;
                        if (!answer) {
                            try {
                                answer = JSON.parse(request.responseText);
                            } catch (e) {
                                answer = request.responseText;
                            }
                        }
                        params.success(answer);
                    } else {
                        params.fail(request.responseText, request.status);
                    }
                }
            } catch (e) { console.error(e); }
        };
        request.open(params.method, params.url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send();
    },
    newEl: function createElement(tag, attr, inner) {
        tag = document.createElement(tag);
        if (attr) this.objEach(attr, function(key) {
            tag.setAttribute(key, this); 
        });
        if (inner) tag.innerHTML = inner;
        return tag;
    },
    objEach: function objectEach(obj, f, this_arg) {
        this.each(Object.keys(obj), function(i, keys) {
            return f.apply(this_arg || obj[this], [keys[i], obj]);
        }, this_arg);
        return obj;
    },
    each: function each(arr, f, this_arg) {
        for (var j = arr.length, i = 0; j--; i++) if (f.apply(this_arg || arr[i], [i, arr]) == false) break;
        return arr;
    },
    nearest: function parents(el, clazz) {
        while (el && !el.classList.contains(clazz)) el = el.parentNode;
        return el;
    },
    before: function insertBefore(el, newEl) {
        el.parentNode.insertBefore(newEl, el);
    },
    after: function insertAfter(el, newEl) {
        el.parentNode.insertBefore(newEl, el.nextSibling);
    }
};

var followerMapping = (function() {
    var internalMapping = [];
    var idToChildMapping = {};
    var nameToChildMapping = {};
    var openedMapping = [];
    var structured = {};
    var dirty = false;
    function structuredChilds(x, y) {
        var result = {
            content: internalMapping[x][y],
            children: [],
            opened: function() {
                return openedMapping[x + '|' + y];
            },
            html: function(filter) {
                var t = '<li data-item="' + x + '|' + y + '"><a ';
                if (result.opened() || result.children.length == 0) {
                    t += 'class="';
                    if (result.opened()) t+= 'opened ';
                    if (result.children.length == 0) t += 'unloaded';
                    t += '" ';
                }
                t += 'target="_blank" href="/user/' + result.content.replace(/ /g,'+') + '" data-user="' + result.content + '">' + result.content.replace(/\+/g, ' ') + '</a>';
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
                } else if (nameToChildMapping[result.content]) {
                    t += '<span class="open-pin async" data-user="' + result.content + '" /><div class="dog"><div class="list content"><ol></ol></div></div>';
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
    function followee(id) {
        x = parseInt(id.split('|')[0]);
        y = parseInt(id.split('|')[1]);
        return internalMapping[x][y];
    }
    return {
        registerList: function(name, arr) {
            internalMapping.push(arr);
            nameToChildMapping[name] = arr;
            dirty = true;
            return internalMapping.length - 1;
        },
        registerChild: function(id, arr) {
            var ch = this.registerList(followee(id), arr);
            idToChildMapping[id] = ch;
            dirty = true;
            return ch;
        },
        setOpened: function(id, val) {
            openedMapping[id] = val;
            var cached = nameToChildMapping[followee(id)];
            if (val) {
                if (cached && !idToChildMapping[id]) {
                    this.registerChild(id, cached);
                }
            }
        },
        childs: function(id, filter) {
            var result = '';
            var child = idToChildMapping[id];
            if (child) {
                for (var i = 0; i < internalMapping[child].length; i++) {
                    result += structuredChilds(child,i).html(filter);
                }
            }
            return result;
        },
        structured: function(id) {
            if (structured == null || structured.user != id || dirty) {
                var result = {
                    dirty: false,
                    user: id,
                    children: [],
                    html: function(filter) {
                        var nod = '<ol>';
                        for (var i = 0; i < result.children.length; i++) {
                            nod += result.children[i].html(filter);
                        }
                        return nod + '</ol>';
                    }
                };
                for (var i = 0; i < internalMapping[id].length; i++) {
                    result.children.push(structuredChilds(id, i));
                }
                dirty = false;
                structured = result;
            }
            return structured;
        }
    };
})();
try {
    if (getIsLoggedIn()) (function() {
        var name = getUserName();
        Dog = function(c) {
            this.container = c;
            if (this.container.classList.contains('user-page-header')) {
                this.userName = this.container.querySelector('.info-container > h1 > a').innerText;
                this.userId = this.container.querySelector('ul.tabs li a').href.split('/user/')[1].split('/')[0];
                this.tabs = this.container.querySelector('ul.tabs');
            } else {
                this.userName = this.container.querySelector('.card-content > h2 a').innerText;
                this.userId = this.container.querySelector('.drop-down > ul > li > a > i.fa-warning').parentNode.href.split('/').reverse()[0];
                this.tabs = this.container.parentNode.querySelector('.user-links');
            }
            this.myPage = this.userName == name;
            this.followers = getFollowers(this.userId);
            this.followersRaw = [];
        };
        Dog.prototype = {
            sniffFollowers: function() {
                var pop = makeGlobalPopup(this.myPage ? 'Results' : 'Results for ' + this.userName, 'fa fa-table');
                pop.content.style.minWidth = '400px';
                pop.content.style.minHeight = '400px';
                pop.content.style.width = '400px';
                pop.content.style.height = '400px';
                pop.content.parentNode.style.width = 'auto';
                document.body.appendChild(document.getElementById('info-cards'));
                this.Sniff(true, pop);
                jSlim.after(pop.content, jSlim.newEl('DIV', { 'class': 'resize-handle' }));
                pop.show();
            },
            snubFollowers: function(link) {
                var pop = document.createElement('DIV');
                jSlim.after(link, pop);
                jSlim.after(link, jSlim.newEl('SPAN', { 'class': 'open-pin' }));
                link.classList.add('opened');
                link.classList.remove('unloaded');
                followerMapping.setOpened(link.parentNode.dataset('item'), true);
                this.Sniff(false, pop);
            },
            Sniff: function(type, pop) {
                var closed = false;
                if (pop.onclose) {
                    pop.onclose(function() {closed = true;});
                    pop = pop.content;
                }
                pop.classList.add('dog');
                pop.innerHTML = '<div style="width:100%;height:100%;text-align:center;line-height:300px;" ><i style="font-size:50px;" class="fa fa-spinner fa-spin" /></div>';
                var me = this;
                requestFollowers(this.userId, function(xml) {
                    if (!closed) {
                        try {
                            me['do' + (type ? 'sniff' : 'snuff')](pop,jSlim.newEl('UL', {}, xml.content));
                        } catch (e) {
                            me.printError(pop, e);
                        }
                    }
                }, function(e) {
                    if (!closed) me.printError(pop, '<b>' + e.statusText + '</b><br />' + e.responseText);
                });
            },
            dosniff: function(pop,xml) {
                var followers = [];
                this.followersRaw = [];
                this.oldFollowers = this.followers;
                var me = this;
                jSlim.each(xml.querySelectorAll('.user-avatar'), function() {
                    var name = this.parentNode.querySelector('.name').childNodes[0].nodeValue;
                    var bgimg = window.getComputedStyle(this).backgroundImage;
                    followers.push({
                        id: bgimg.indexOf('images/') != -1 ? bgimg.split('images/').reverse()[0].split('_')[0] : bgimg.split('user/').reverse()[0].split('-')[2],
                        name: name
                    });
                    me.followersRaw.push(name);
                });
                var gained = [];
                var lost = [];
                var named = [];
                for (var i = followers.length; i--;) {
                    var old = isPresent(this.followers, followers[i]);
                    if (!old) {
                        gained.unshift(followers[i]);
                    } else if (old.id != 'none' && old.name != followers[i].name) {
                        named.unshift({name: followers[i].name, oldName: old.name, id: followers[i].id});
                    }
                }
                for (var i = this.followers.length; i--;) {
                    if (this.followers[i].id.indexOf('/') == -1) {
                        if (isPresent(followers, this.followers[i]) == null) {
                            lost.unshift(this.followers[i]);
                        }
                    }
                }
                pop.innerHTML = '';
                this.printFollowers(!setFollowers(this.userId, this.followers = followers), pop, gained, lost, named);
            },
            dosnuff: function(pop,xml) {
                var followers = [];
                jSlim.each(xml.querySelectorAll('.user-avatar'), function() {
                    followers.push(this.parentNode.href.split('/').reverse()[0]);
                });
                pop.innerHTML = '';
                followerMapping.registerChild(pop.parent().attr('data-item'), followers);
                this.container.listing.search.dispatchEvent(new Event('input'));
            },
            printError: function(pop, e) {
                pop.innerHTML = '';
                var tabs = '';
                var result = '';
                tabs += '<div data-tab="0" class="button selected">Error</div>';
                result += '<div class="main">' + e + '</div>';
                result += '<div class="main">The data for this user may have been damaged. You can clear the follower or history data below and try again.</div>';
                result += clearButton(this.userId) + emptyHistoryButton(this.userId) + '</div>';
                
                pop.appendChild(jSlim.newEl('DIV', {
                    'data-id': 0, 'class': 'tab shown selected'
                }), result);
                if (e.stack) {
                    tabs += '<div data-tab="1" class="button">Stacktrace</div>';
                    pop.appendChild(jSlim.newEl('DIV', {
                        'data-id': 1, class: 'tab shown'
                    }, e.stack));
                }
                this.initTabs(tabs, pop);
            },
            initTabs: function(tabs, pop) {
                tabs = jSlim.newEl('DIV', { 'class': 'tabs' }, tabs);
                pop.insertBefore(tabs, pop.children[0]);
                jSlim.on(tabs, '.button', 'click', function() {
                    var id = this.dataset.tab;
                    jSlim.each(pop.children, function() {
                        this.classList[this.dataset.id == id ? 'add' : 'remove']('selected');
                    });
                    jSlim.each(tabs.children, function() {
                        this.classList.remove('selected');
                    });
                    this.classList.add('selected');
                });
            },
            printFollowers: function(firstTime, pop, gained, lost, named) {
                var infoCard = document.getElementById('info-cards');
                if (infoCard) {
                    infoCard.parentNode.appendChild(infoCard);
                    infoCard.style.zIndex = '9999999999';
                }
                
                if (firstTime) gained = lost = named = [];

                var localeG = gained.length.toLocaleString('en');
                var localeL = lost.length.toLocaleString('en');
                var localeN = named.length.toLocaleString('en');
                
                var tabs = '';
                tabs += '<div data-tab="0" class="button selected">Overview</div>';
                pop.appendChild(jSlim.newEl('DIV', { 'data-id': 0, 'class': 'tab shown selected' }, firstTime ? this.loaded() : this.overview(gained, lost, named, localeG, localeL, localeN)));
                tabs += '<div data-tab="1" class="button">Stats</div>';
                pop.appendChild(jSlim.newEl('DIV', { 'data-id': 1, 'class': 'tab shown' }, this.stats(gained, lost, localeG, localeL, localeN) + forgetButton(this.userId) + emptyHistoryButton(this.userId)));
                if (gained.length > 0) {
                    tabs += '<div data-tab="2" class="button">Gained</div>';
                    pop.appendChild(jSlim.newEl('DIV', { 'data-id': 2, 'class': 'tab shown' }, '<b>Total Gained:</b> ' + localeG + '<div class="main">' + linkList(gained) + '</div>'));
                }
                if (lost.length > 0) {
                    tabs += '<div data-tab="3" class="button">Lost</div>';
                    pop.appendChild(jSlim.newEl('DIV', { 'data-id': 3, 'class': 'tab shown' }, '<b>Total Lost:</b> ' + localeL + '<div class="main">' + linkList(lost) + '</div>'));
                }
                tabs += '<div data-tab="4" class="button hidden">List</div>';
                this.container.listing = listing(this.userName, this.followersRaw, jSlim.newEl('DIV', {'data-id': 4, 'class': 'tab hidden'}));
                pop.appendChild(this.container.listing);
                tabs += '<div data-tab="5" class="button hidden">History</div>';
                pop.appendChild(this.history(gained, lost, named));
                this.initTabs(tabs, pop);
            },
            loaded: function() {
                return '<div class="score fresh">' + this.followers.length + '</div><div class="main">' + (this.myPage ? 'Welcome! Your' : this.userName + '\'s') + ' followers have been successfully saved.</div>';
            },
            stats: function(g, l, G, L, N) {
                var result = '';
                var all = this.oldFollowers.length + g.length;
                var percentG = (all > 0 ? (g.length * 100 / all) : 0);
                var percentL = (all > 0 ? (l.length * 100 / all) : 0);
                var percentN = ((this.followers.length - l.length) > 0 ? (N * 100 / (this.followers.length - l.length)) : 0);
                result += '<div class="score bar neutral"><div class="glass" ></div>';
                result += '<div class="percentage g" style="width:' + percentG + '%;" >' + (percentG > 0 ? percentG.toFixed(2) + '%' : '') + '</div>';
                result += '<div class="percentage l" style="width: ' + percentL + '%" >' + (percentL > 0 ? percentL.toFixed(2) + '%' : '') + '</div>';
                result += '<div class="percentage n" style="width: ' + percentN + '%;margin-left:' + percentG + '%" >' + (percentN > 0 ? percentN.toFixed(2) + '%' : '') + '</div>';
                result += '</div>';
                result += '<div class="main"><b>Total: </b>' + this.followers.length.toLocaleString('en') + ' was ' + this.oldFollowers.length.toLocaleString('en') + '<br /><br />';
                result += '<b>Arrived:</b> ' + G + ' ( ' + percentG.toFixed(2) + '% )<br />';
                result += '<b>Left:</b> ' + L + ' ( ' + percentL.toFixed(2) + '% )<br />';
                result += '<b>Name Changes:</b> ' + N + ' ( ' + percentN + '% )<br />';
                result += '<b>Stayed:</b> ' + (this.followers.length - g.length).toLocaleString('en') + ' (' + (100 - percentG - percentL).toFixed(2) + '%)';
                result += '<br /><b>Score: </b>' + this.popularity(g.length, l.length, this.followers.length);
                return result + '</div>';
            },
            overview: function(g, l, n, G, L, N) {
                var result = '';
                var diff = g.length - l.length;
                result += '<div class="score ' + (diff >= 0 ? (diff == 0 ? 'neutral">' : 'good">') : 'bad">') + named(diff) + '</div><div class="main">';
                if (diff) {
                    result += (this.myPage ? 'You have' : this.userName + ' has') + ' <b>' + this.followers.length + '</b> followers';
                    result += (g.length ? ' of which' : '');
                    result += (diff > 0 ? ' only' : '') + (g.length > 0 ? ' <b>' + G + '</b>' : '<b>none</b>') + ' are new additions whilst ';
                    result += (l.length ? 'only <b>' + L : '<b>none') + '</b> of ' + (this.myPage ? 'your' : this.userName + '\'s') + ' old followers have left.';
                } else if (!g.length) {
                    result += '<b>No changes detected!</b><br />' + (this.myPage ? 'You have ' : this.userName + ' has ') + 'not lost any followers, but ' + (this.myPage ? 'you have ' : 'he has ') + 'not gained any either.';
                } else {
                    result += (this.myPage ? 'You' : this.userName) + ' simultaneously gained and lost <b>' + G + '</b> followers.';
                }
                result += '</div>';
                if (n.length) {
                    result += '<b>Name changes (' + N + '):</b>';
                    result += '<div class="main"><ol>';
                    for (var i = n.length; i--;) {
                        result += '<li>' + n[i].oldName.replace(/\+/g, ' ') + ' is now known as <a target="_blank" href="/user/' + n[i].name + '">' + n[i].name.replace(/\+/g, ' ') + '</a></li>';
                    }
                    result += '</ol></div>';
                }
                return result;
            },
            popularity: function(g, l, t) {
                var _count = this.tabs.children[0];
                var story_count = parseInt(_count.querySelector('.number').innerText);
                var blog_count = parseInt(_count.nextElementSibling.querySelector('.number').innerText);
                return parseImperial(this.computeScore(story_count, blog_count, t + g - l));
            },
            computeScore: function(story_count, blog_count, fol_count) {
                var fol_per_story = story_count > 0 ? fol_count/story_count : 0;
                var fol_per_blog = blog_count > 0 ? fol_count/blog_count : 0;
                return ((fol_per_story + fol_per_blog)/4)*(story_count*9 + blog_count) / 55;
            },
            processChanges: function(gained, lost, named) {
                var history = getHistory(this.userId);
                for (var i = 0; i < gained.length || i < lost.length || i < named.length; i++) {
                    if (i < gained.length) {
                        for (var j = history.length; --j;) {
                            if (history[j].type == 'l' && history[j].id == gained[i].id) {
                                named.push({name: gained[i].name, oldName: history[j].name, id: gained[i].id});
                                break;
                            }
                        }
                        history.push({type:'j', display: gained[i].name, name: gained[i].name, id: gained[i].id});
                    }
                    if (i < lost.length) {
                        history.push({type:'l', display: lost[i].name, name: lost[i].name, id: lost[i].id});
                    }
                    if (i < named.length) {
                        history.push({type:'n', display: named[i].name, name: named[i].name, old: named[i].oldName, id: named[i].id});
                    }
                }
                return this.migrate(history, named);
            },
            migrate: function(history, named) {
                for (var i = 0; i < history.length; i++) {
                    if (typeof(history[i].id) === 'undefined') {
                        history[i].id = idFor(history[i], history) || idFor(history[i], this.followers) || idFor(history[i], this.oldFollowers);
                        if (history[i].id) {
                            for (var k = 0; k < history.length; k++) {
                                if (k != i && (history[k].name == history[i].name || history[k].display == history[i].display)) {
                                    history[k].id = history[i].id;
                                }
                            }
                        }
                    }
                }
                return history;
            },
            history: function(gained, lost, named) {
                var history = this.processChanges(gained, lost, named);
                var finalHistory = [];
                for (var i = 0; i < history.length; i++) {
                    if (i < history.length - 1) {
                        if (history[i].type != 'n' && history[i + 1].type != 'n') {
                            if (history[i].name == history[i + 1].name) {
                                i++;
                                continue;
                            }
                        }
                    }
                    finalHistory.push(history[i]);
                }
                setHistory(this.userId, finalHistory);
                return jSlim.newEl('DIV', {
                    'data-id': 5, 'class': 'tab hidden'
                }, finalHistory.length ? historyList(finalHistory) : 'No items to display');
            }
        };
        var userPageHeader = document.getElementsByClassName('user-page-header')[0];
        if (userPageHeader) {
            var sniffer = jSlim.newEl('A', {
                'class': 'sniffer'
            }, 'Sniff');
            var h3 = document.querySelector('.bio_followers > h3');
            if (h3.innerText.indexOf(name + ' follows') == 0) {
                jSlim.before(h3.children[0], jSlim.newEl('H3', {
                    style: 'border-bottom:none'
                }, '<b>' + document.querySelector('.user_sub_info .fa-eye').nextSibling.innerText + '</b> members follow ' + name));
            }
            sniffer.scopingElement = userPageHeader;
            h3.innerHTML += ' - ';
            h3.appendChild(sniffer);
            
            var sniffer = jSlim.newEl('LI', {
                'class': 'tab nosey'
            }, '<a class="sniffer"><span class="number"><i class="fa fa-fw fa-paw" ></i></span>Sniff Followers</a>');
            jSlim.after(userPageHeader.querySelector('.tab-followers'), sniffer);
            sniffer.children[0].scopingElement = userPageHeader;
        }
        jSlim.each(document.querySelectorAll('.user-card'), function() {
            var sniffer = jSlim.newEl('A', {
                'class': 'sniffer'
            }, '<a><i class="fa fa-fw fa-paw" /> Sniff Followers</a>');
            sniffer.scopingElement = this;
            jSlim.before(this.querySelector('.drop-down > ul > .divider'), sniffer);
        });
        jSlim.on(document.body, '.sniffer', 'click', function(e) {
            (new Dog(this.scopingElement)).sniffFollowers();
            e.preventDefault();
        });
        jSlim.on(document.body, 'a.snuffer', 'click', function(e) {
            if (document.querySelectorAll('.dog .list a.unloaded.hover').length) {
                (new Dog(this.scopingElement)).snubFollowers(document.querySelector('.dog a.hover'));
            } else {
                (new Dog(this.scopingElement)).sniffFollowers();
            }
            e.preventDefault();
        });
        jSlim.on(document.body, 'button.eforget', 'click', function(e) {
            if (confirm(this, 'Done')) {
                clearFollowers(this.dataset.id);
            }
        });
        jSlim.on(document.body, 'button.forget', 'click', function(e) {
            if (confirm(this, 'Forgot this User')) {
                clearFollowers(this.dataset.id);
                clearChanges(this.dataset.id);
            }
        });
        jSlim.on(document.body, 'button.hforget', 'click', function(e) {
            if (confirm(this, 'Alrighty then...')) {
                var id = this.dataset.id;
                var limit = this.dataset.limit;
                if (limit && (limit = parseInt(limit)) > 0) {
                    var history = getHistory(id);
                    if (history.length > limit) {
                        history.splice(0, history.length - limit);
                        document.querySelector('.dog .list.history').parentNode.innerHTML = history.length ? historyList(history) : 'No items to display';
                        setHistory(id, history);
                    }
                } else {
                    var t = document.querySelector('.dog .button[data_tab="5"],.dog .tab[data_id="5"]');
                    t.parentNode.removeChild(t);
                    setHistory(id, []);
                }
            }
        });
        jSlim.on(document.body, 'button.forget, button.hforget, button.eforget', 'mouseleave', function(e) {
            alert('leave');
            if (this.dataset.check != '2') {
                this.dataset.check = '0';
                this.innerText = this.dataset.text;
            }
        });
        jSlim.on(document.body, '.resize-handle', 'mousedown', function(e) {
            e.preventDefault();
            var holder = this.parentNode.querySelector('.drop-down-pop-up-content');
            document.body.addEventListener('mousemove', resize);
            document.body.addEventListener('mouseup', stopResize);
            function resize(e) {
                var width = e.pageX - holder.offset().left;
                var height = e.pageY - holder.offset().top;
                holder.css('width', width + 'px');
                holder.css('height', height + 'px');
            }
            function stopResize() {
                bod.removeEventListener('mouseup', stopResize);
                bod.removeEventListener('mousemove', resize);
            }
        });
        jSlim.on(document.body, '.dog .open-pin', 'click', function(e) {
            e.preventDefault();
            var a = this.parentNode.querySelector('a');
            followerMapping.setOpened(this.parentNode.dataset.item, !a.classList.contains('opened'));
            if (a.classList.contains('opened')) {
                a.classList.remove('opened');
            } else {
                a.classList.add('opened');
                if (this.classList.contains('async')) {
                    this.classList.remove('async');
                    this.parentNode.classList.remove('unloaded');
                    this.parentNode.querySelector('ol').innerHTML = followerMapping.childs(this.parentNode.dataset.item, document.getElementById('nosey_follower_searcher').value.toUpperCase());
                }
            }
        });
        jSlim.on(document.body, '.dog .list a', 'mouseenter', function(e) {
            if (this.classList.contains('hover')) return;
            jSlim.each(document.querySelectorAll('.dog .list a.hover'), function() {
                this.classList.remove('hover'); 
            });
            var name = this.dataset.user;
            this.classList.add('hover');
        });
        FimFicEvents.on('afterinfocard', function(e) {
            jSlim.each(document.querySelectorAll('.info-card-container .top-info .button-group > .button-group'), function() {
                if (!this.querySelector('.snuffer').length) {
                    var butt = jSlim.newEl('A', {
                        'class': 'snuffer button button-icon-only'
                    }, '<span title="Sniff Followers"><i class="fa fa-paw" /></span>');
                    butt.scopingElement = jSlim.nearest(this, 'user-card');
                    butt.dataset.user = e.user;
                    this.insertBefore(butt, this.children[0]);
                }
            });
        });
        
        function confirm(button, finalMessage) {
            if (button.dataset.check != '2') {
                if (button.dataset.check != '1') {
                    button.dataset.check = '1';
                    button.innerText = 'Are you sure?';
                } else {
                    button.style.opacity = '0.3';
                    button.style.pointerEvents = 'none';
                    button.dataset.check = '2';
                    button.innerText = finalMessage ? finalMessage : button.dataset.text;
                    return true;
                }
            }
            return false;
        }

        function clearButton(id) {
            return '<div class="main"><button data-id="' + id + '" data-text="Clear follower data" class="eforget styled_button">Clear follower data</button></div>';
        }

        function forgetButton(id) {
            return '<div class="main"><button data-id="' + id + '" data-text="Forget this User" class="forget styled_button">Forget this User</button></div>';
        }

        function emptyHistoryButton(id) {
            return '<div class="main"><button data-id="' + id + '" data-limit="30" data-text="Trim History" title="Deletes all but the last 30 items" class="hforget styled_button">Trim History</button><button data-id="' + id + '" data-text="Clear History" title="Deletes all history for this user" class="hforget styled_button">Clear History</button></div>';
        }

        function requestFollowers(id, success, failure) {
            jSlim.ajax({
                url: '/ajax/users/' + id + '/followers',
                method: 'GET',
                signed: false,
                success: success,
                fail: failure
            });
        }

        function setFollowers(id, val) {
            var result = settingsMan.get('followers_' + id) != null;
            settingsMan.set('followers_' + id, JSON.stringify(val));
            return result;
        }

        function getFollowers(id) {
            var result = settingsMan.get('followers_' + id);
            return result == null ? [] : JSON.parse(result);
        }

        function clearFollowers(id) {
            settingsMan.delete('followers_' + id);
        }

        function clearChanges(id) {
            settingsMan.delete('changes_' + id);
        }

        function setHistory(id, items) {
            settingsMan.set('changes_' + id, JSON.stringify(items));
        }

        function getHistory(id) {
            var result = settingsMan.get('changes_' + id);
            
            return result == null ? [] : JSON.parse(result);
        }

        function listing(name, followers, node) {
            var id = followerMapping.registerList(name, followers);
            var list = jSlim.newEl('DIV', {
                'class': 'list content'
            });
            var search = jSlim.newEl('INPUT', {
                id: 'nosey_follower_searcher',
                type: 'text',
                placeholder: 'search followers'
            });
            node.search = search;
            search.addEventListener('input', updateContent);
            node.appendChild(search);
            node.appendChild(list);
            function updateContent() {
                try {
                    list.innerHTML = followerMapping.structured(id).html(search.value.toUpperCase());
                } catch (e) { alert(e); }
            }
            updateContent();
            return node;
        }

        function list(arr) {
            var result = '<div class="list"><ul>';
            for (var i = 0; i < arr.length; i++) {
                result += '<li>' + arr[i].replace(/\+/g, ' ') + '</li>';
            }
            return result + '</ul></div>';
        }

        function historyList(arr) {
            var result = '<div class="history list"><ul>';
            for (var i = arr.length - 1; i >= 0; i--) {
                result += '<li data-index="' + i + '" class="history ' + arr[i].type;
                if (arr[i].type == 'j' || arr[i].type == 'l') {
                    result += '"><a target="_blank" href="/user/' + arr[i].name.replace(/ /g,'+') + '">' + arr[i].display.replace(/\+/g, ' ') + '</a> ';
                } else {
                    result += '">' + arr[i].old.replace(/\+/g, ' ') + ' ';
                }
                if (arr[i].type == 'j') {
                    result += '<i>joined</i>';
                } else if (arr[i].type == 'l') {
                    result += '<i>left</i>';
                } else if (arr[i].type == 'n') {
                    result += '<i>changed names to</i> <a target="_blank" href="/user/' + arr[i].name.replace(/ /g,'+') + '">' + arr[i].display.replace(/\+/g, ' ') + '</a>';
                }
                result += '</li>';
            }
            return result + '</ul></div>';
        }

        function linkList(arr) {
            var result = '<div class="list"><ol>';
            for (var i = 0; i < arr.length; i++) {
                result += '<li><a target="_blank" data-id="' + arr[i].id + '" href="/user/' + arr[i].name.replace(/ /g,'+') + '">' + arr[i].name.replace(/\+/g, ' ') + '</a></li>';
            }
            return result + '</ol></div>';
        }

        function idFor(hist, followers) {
            for (var i = 0; i < followers.length; i++) {
                if (followers[i].id != 'none' && typeof(followers[i].id) !== 'undefined' && followers[i].id == hist.id) {
                    return hist.id;
                }
                if ((hist.name == followers[i].name || hist.old == followers[i].name) && followers[i].id) {
                    return followers[i].id;
                }
            }
        }

        function isPresent(arr, follower) {
            if (follower.id == 'none') {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].name == follower.name) {
                        if (arr[i].id != 'none') follower.id = arr[i].id;
                        return arr[i];
                    }
                }
            } else {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].id == follower.id) {
                        if (arr[i].id == 'none') arr[i].id = follower.id;
                        return arr[i];
                    }
                }
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].id == 'none' && arr[i].name == follower.name) {
                        arr[i].id = follower.id;
                        return arr[i];
                    }
                }
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
.drop-down-pop-up-content.dog {\
    position: relative;}\
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
    height: 100%;\
    position: relative;\
    border-bottom: solid 1px rgba(0,0,0,0.6);}\
.dog .tab {\
    display: none;\
    position: absolute;\
    bottom: 0px;\
    top: 30px;\
    left: 0px;\
    right: 0px;\
    background: #ddd;\
    min-height: 270px;\
    overflow-y: auto;\
    padding: 10px;}\
.dog .list {\
    padding: 5px;}\
.dog .tab .main .li {\
    height: 20px;}\
.dog .list .history {\
    font-size: 80%;\
    padding-left: 5px;\
    margin-left: -10px;\
    margin-right: -10px;\
    box-shadow: 0 0 2px rgba(0,0,0,0.3) inset;}\
.dog .list .history:first-child {\
    border-top-left-radius: 5px;\
    border-top-right-radius: 5px;}\
.dog .list .history:last-child {\
    border-bottom-left-radius: 5px;\
    border-bottom-right-radius: 5px;}\
.history.j {\
    background: rgba(0, 240, 0, 0.07);}\
.history.l {\
    background: rgba(240, 0, 0, 0.07);}\
.dog .list .history.j:before {\
    content: "+ ";}\
.dog .list .history.l:before {\
    content: "- ";}\
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
.dog .percentage.n {\
    top: 0px;\
    bottom: 0px;\
    background: rgba(255,255,255,0.3);}\
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
    margin: 5px 0px;}\
.resize-handle {\
    height: 10px;\
    width: 10px;\
    display: inline-block;\
    position: absolute;\
    bottom: 0;\
    right: 0;\
    border-bottom: solid 2px;\
    border-right: solid 2px;}');
    })();
} catch (e) {
    try {
        makeGlobalPopup('Nosey Hound', '', false, true).setContent(e + '');
    } catch (ee) {
        alert('Nosey Hound: ' + e);
    }
}

//==API FUNCTION==//
function Popup(native) {
    this.native = native;
    this.holder = native.element;
    this.dark = native.dimmer;
    this.content = this.unscoped = native.content;
    this.position = function(x, y, buff) {
        
    };
    this.setContent = function(c) {
        this.native.SetContent(c);
        return this;
    };
    this.scope = function(el) {
        if (typeof el == 'string') {
            this.content.appendChild(jslim.html(el)[0]);
        } else {
            this.content.appendChild(el);
        }
        return (this.content = el);
    };
    this.unscope = function(el) {
        this.content = this.unscoped;
        if (typeof el !== 'undefined') this.scope(el);
        return this.content;
    };
    this.find = function(el) {
        return this.content[0].querySelectorAll(el);
    };
    this.onclose = function(func) {
        if (typeof func === 'function') {
            this.holder.addEventListener('close', func);
        } else {
            this.holder.dispatchEvent(new CustomEvent('close'));
        }
    };
    this.close = function() {
        this.native.close();
    };
    this.show = function() {
        this.native.Show();
    };
    this.hide = function() {
        this.holder.style.display = 'none';
    };
}

//==API FUNCTION==//
function makeGlobalPopup(title, fafaText, darken, close) {
    var p = new Popup(makePopup(title, fafaText, darken, close));
    p.holder.classList.add('global_popup');
    return p;
}

//==API FUNCTION==//
function makePopup(title, fafaText, darken, close) {
    if (typeof (close) == 'undefined') close = true;
    if (typeof (darken) == 'undefined') darken = true;
    var pop = new (win().PopUpMenu)('','<i class="fa fa-' + fafaText + '" ></i>' + title);
    pop.SetCloseOnHoverOut(false);
    pop.SetFixed(true);
    pop.SetContent('');
    pop.SetSoftClose(!close);
    if (!darken) pop.SetDimmerEnabled(false);
    if (typeof darken == 'number') {
        var show = pop.Show;
        pop.Show = function() {
            show.apply(this, arguments);
            this.dimmer.style.opacity = darken / 100;
        }
    }
    pop.element.appendChild(styleSheet("\
.drop-down-pop-up-content input[type='text'], .drop-down-pop-up-content input[type='url'] {\
    padding:8px;\
    width:100%;\
    border:1px solid rgb(204, 204, 204);\
    background:none repeat scroll 0% 0% rgb(248,248,248);\
    outline:medium none;\
    color:rgb(51,51,51);\
    box-shadow:0px 2px 4px rgba(0,0,0,0.1) inset;\
    border-radius:3px;\
    margin:5px 0px;}"));
    return pop;
}

//==API FUNCTION==//
function urlSafe(me){return me.toLowerCase().replace(/[^a-z0-9_-]/gi,'-').replace(/--/,'-');}

//==API FUNCTION==//
function offset(element) {
    if (!element || !element.getClientRects().length) {
        return { top: 0, left: 0 };
    }
    var rect = element.getBoundingClientRect();
    var doc = element.ownerDocument || document;
    var win = doc.defaultView || win;
    doc = doc.documentElement;
    return {
        top: rect.top + win.pageYOffset - doc.clientTop,
        left: rect.left + win.pageXOffset - doc.clientLeft
    };
}

//==API FUNCTION==//
function position(obj, x, y, buff) {
    if (typeof x == 'string' && x.toLowerCase() == 'center') x = (document.body.clientWidth - obj.clientWidth) / 2;
    if (typeof y == 'string' && y.toLowerCase() == 'center') y = (document.body.clientHeight - obj.clientHeight) / 2;
    if (typeof x == 'object') {
        var parameters = x;
        var positioner = x.object != null ? x.object : x;
        buff = x.buffer != null ? x.buffer : y;
        var off = offset(positioner);
        y = off.top - document.body.scrollTop;
        x = off.left - document.body.scrollLeft;
        if (parameters.offX != null) x += parameters.offX;
        if (parameters.offY != null) y += parameters.offY;
    }
    
    if (buff == null) buff = 0;
    if (x < buff) x = buff;
    if (y < buff) y = buff;
    
    var maxX = document.body.clientWidth - (obj.clientWidth + buff);
    if (x > maxX) x = maxX;
    
    var maxY = document.body.clientHeight - (obj.clientHeight + buff);
    if (y > maxY) y = maxY;
    
    obj.style.top = y + 'px';
    obj.style.left = x + 'px';
}

//==API FUNCTION==//
function isMyPage() {
    var match = document.location.href.split('?')[0].match(/(?:http:|https:|)\/\/www\.fimfiction\.net\/user\/([0-9]+)\/.*/);
    return match && match[1] && match[1] == (getUserId() + '');
}

//==API FUNCTION==//
function win() {return this['unsafeWindow'] || window['unsafeWindow'] || window;}

//==API FUNCTION==//
function getUserNameUrlSafe() { return getIsLoggedIn() ? getUserButton().getAttribute("href").split("/" + getUserId() + "/").reverse()[0].split("/")[0] : 'Anon'; }

//==API FUNCTION==//
function getUserNameEncoded() { return encodeURIComponent(getUserNameUrlSafe()); }

//==API FUNCTION==//
function getUserName() {return getUserNameUrlSafe().replace(/\+/g,' ');}

//==API FUNCTION==//
function getUserButton() {return document.querySelector('.user_toolbar a.button[href^="/user/"]');}

//==API FUNCTION==//
function getIsLoggedIn() {return !!win()['logged_in_user'];}

//==API FUNCTION==//
function getUserId() {var w = win()['logged_in_user'];return w ? w.id : -1;}

//==API FUNCTION==//
function styleSheet(input, id) {
    while (input.indexOf('  ') != -1) input = input.replace(/  /g, ' ');
    var style = document.createElement('style');
    style.innerText = input;
    style.type = 'text/css';
    if (id) style.id = id;
    return style;
}

//==API FUNCTION==//
function makeStyle(input, id) {
    document.head.appendChild(styleSheet(input, id));
}

//==API FUNCTION==//
function parseImperial(amount) {
    var units = [['Inch',1,'Inches'],['Foot',12,'Feet'],['Yard',3,'Yards'],['Mile',1760,'Miles']];
    if (!amount) return '0 ' + units[0][2];
    var result = '';
    if (amount < 0) {
        amount = -amount;
        result += 'negative ';
    }
    if (amount < units[0][1]) return amount.toFixed(3).toString().toLocaleString('en') + units[0][2];
    var measure = {
        data: 0,
        index: units.length - 1,
        step: (function() {
            var r = 1;
            for (var i = units.length; i--;) r *= units[i][1];
            return r;
        })(),
        next: function() {
            if (amount < this.step) {
                if (this.index) {
                    this.write();
                    this.step /= units[this.index--][1];
                    return true;
                }
                this.write();
                return false;
            }
            return true;
        },
        write: function() {
            if (this.data) {
                result += this.data + ' ' + units[this.index][this.data > 1 ? 2 : 0] + ' ';
                this.data = 0;
            }
        },
        tick: function() {
            if (amount >= this.step) {
                if (!result[units[this.index][0]]) {
                    result[units[this.index][0]] = 0;
                }
                this.data++;
                amount -= this.step;
            }
        }
    };
    while (measure.next()) measure.tick();
    return result;
}