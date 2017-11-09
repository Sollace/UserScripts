// ==UserScript==
// @name        Nosey Hound
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @version     2.2.6
// @require     https://github.com/Sollace/UserScripts/raw/Dev/Internal/Events.user.js
// @require     https://github.com/Sollace/UserScripts/raw/Dev/Internal/FimQuery.core.js
// @grant       GM_getValue
// @grant       GM_deleteValue
// ==/UserScript==

const settingsMan = {
    __gm: (key, parse, def) => {
      let val = parse(GM_getValue(key) || String(def));
      GM_deleteValue(key);
      return localStorage[key] = val;
    },
    __get: (key, parse, def) => settingsMan.has(key) ? parse(localStorage[key]) : this.__gm(key, def),
    has: key => localStorage[key] !== undefined,
    remove: key => localStorage.removeItem(key),
    get: (key, def) => settingsMan.__get(key, a => a, def),
    set: (key, val, def) => {
        if (def === undefined) def = '';
        if (val === def) return settingsMan.remove(key);
        localStorage[key] = val;}
};

const ajax = (method, url, complete, error) => {
    complete = complete || (a => a);
    error = error || (a => a);
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState !== XMLHttpRequest.DONE) return;
        if (request.status < 200 && request.status >= 300) return error(e);
        try {
            return complete(JSON.parse(request.responseText));
        } catch (e) { error(e); }
    };
    request.open(method, url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send();
};

const jSlim = {
    on: function addDelegatedEvent(node, selector, event, func, capture) {
        const k = ev => {
            const target = ev.target.closest(selector);
            if (!target) return;
            if (('mouseout' == event || 'mouseover' == event) && target.contains(ev.relatedTarget)) return;
            func.call(target, ev, target);
        };
        node.addEventListener(event, k, capture);
        return k;
    },
    each: function(arr, func, this_arg) {
        return Array.prototype.forEach.call(arr, func, this_arg);
    },
    all: function(holder, selector, func) {
        return jSlim.each(holder.querySelectorAll(selector), func);
    },
    map: function(holder, selector, func) {
        return Array.prototype.map.call(holder.querySelectorAll(selector), func);
    }
};

const followerMapping = (_ => {
    const internalMapping = [];
    const idToChildMapping = {};
    const nameToChildMapping = {};
    const openedMapping = [];
    let structured = null;
    let dirty = false;
    function structuredChilds(x, y) {
        const child = idToChildMapping[`${x}|${y}`];
        return {
            content: internalMapping[x][y],
            children: internalMapping[child] ? internalMapping[child].map((a, i) => structuredChilds(child, i)) : [],
            opened: _ => openedMapping[`${x}|${y}`],
            matches: function(filter) {
                return this.content.replace(/\+/g, ' ').toUpperCase().indexOf(filter.toUpperCase()) > -1 || this.children.some(a => a.matches(filter));
            },
            html: function(filter) {
                if (!this.matches(filter)) return '';
                let t = `<li data-item="${x}|${y}"><a `;
                if (this.opened() || !this.children.length) {
                    t += `class="${this.opened() ? 'opened ' : ''}${!this.children.length ? 'unloaded' : ''}" `;
                }
                t += `target="_blank" href="/user/${this.content.replace(/ /g,'+')}" data-user="${this.content}">${this.content.replace(/\+/g, ' ')}</a>`;
                if (this.children.length) {
                    t += '<span class="open-pin"></span><div class="dog"><div class="list content"><ol>';
                    t += this.children.map(a => a.html(filter)).join('');
                    t += '</ol></div></div>';
                } else if (nameToChildMapping[this.content]) {
                    t += `<span class="open-pin async" data-user="${this.content}"></span><div class="dog"><div class="list content"><ol></ol></div></div>`;
                }
                return t;
            }
        };
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
            const ch = this.registerList(followee(id), arr);
            idToChildMapping[id] = ch;
            dirty = true;
            return ch;
        },
        setOpened: function(id, val) {
            openedMapping[id] = val;
            const cached = nameToChildMapping[followee(id)];
            if (val) {
                if (cached && !idToChildMapping[id]) {
                    this.registerChild(id, cached);
                }
            }
        },
        childs: function(id, filter) {
            const child = idToChildMapping[id];
            if (child) return internalMapping[child].map((a, i) => structuredChilds(child,i).html(filter)).join('');
            return '';
        },
        structured: function(id) {
            if (!structured || structured.user != id || dirty) {
                dirty = false;
                structured = {
                    user: id,
                    children: internalMapping[id].map((a,i) => structuredChilds(id, i)),
                    html: function(filter) {
                        return `<ol>${this.children.map(a => a.html(filter)).join('')}</ol>`;
                    }
                };
            }
            return structured;
        }
    };
})();
try {
    if (getIsLoggedIn()) (_ => {
        const name = getUserName();
        Dog = function(c) {
            this.container = c.closest('.user-card, .user-page-header') || document.querySelector('.user-page-header');
            this.userName = this.container.querySelector('.info-container > h1 > a, .card-content > h2 a').innerText;
            this.tabs = this.container.parentNode.querySelector('ul.tabs, .user-links');
            if (this.container.classList.contains('user-page-header')) {
                this.userId = this.container.querySelector('ul.tabs li a').href.split('/user/')[1].split('/')[0];
            } else {
                this.userId = this.container.querySelector('.drop-down > ul > li > a > i.fa-warning').parentNode.href.split('/').reverse()[0];
            }
            this.myPage = this.userName == name;
            this.followers = getFollowers(this.userId);
            this.followersRaw = [];
            Dog.instance = this;
        };
        Dog.prototype = {
            restart: function() {
              this.Sniff(true, this.pop.content);
            },
            sniffFollowers: function() {
                const pop = this.pop = makeGlobalPopup(`Results${this.myPage ? '' : ` for ${this.userName}`}`, 'fa fa-table');
                pop.content.style.minWidth = pop.content.style.width = '400px';
                pop.content.style.minHeight = pop.content.style.height = '400px';
                pop.content.parentNode.style.width = 'auto';
                pop.content.insertAdjacentHTML('afterend', '<div class="resize-handle"></div>');
                document.body.appendChild(document.getElementById('info-cards'));
                this.Sniff(true, pop.content);
                pop.Show();
            },
            snubFollowers: function(link) {
                link.insertAdjacentHTML('afterend', '<div></div><span class="open-pin"></span>');
                link.classList.add('opened');
                link.classList.remove('unloaded');
                followerMapping.setOpened(link.parentNode.dataset.item, true);
                this.Sniff(false, link.nextSibling);
            },
            Sniff: function(type, pop) {
                let closed = false;
                pop.addEventListener('close', () => closed = true);
                pop.classList.add('dog');
                pop.innerHTML = '<div style="width:100%;height:100%;text-align:center;line-height:300px;" ><i style="font-size:50px;" class="fa fa-spinner fa-spin" /></div>';

                requestFollowers(this.userId, json => {
                    if (closed) return;
                    document.body.insertAdjacentHTML('beforeend', `<ul style="display:none">${json.content}</ul>`);
                    const xml = document.body.lastChild;
                    this[`do${type ? 'sniff' : 'snuff'}`](pop, xml);
                    xml.parentNode.removeChild(xml);
                }, e => {
                    if (closed) return;
                    console.error(e);
                    this.printError(pop, e.responseText ? `<b>${e.statusText}</b><br />${e.responseText}` : e);
                });
            },
            dosniff: function(pop, xml) {
                this.followersRaw = [];
                this.oldFollowers = this.followers;

                const followers = jSlim.map(xml, '.user-avatar', me => {
                    const name = me.parentNode.querySelector('.name').childNodes[0].nodeValue;
                    const bgimg = window.getComputedStyle(me).backgroundImage;
                    this.followersRaw.push(name);
                    return {
                        id: bgimg.indexOf('images/') > -1 ? 'none' : (bgimg.split('user/').reverse()[0].split('-')[2] || 'none'),
                        name: name
                    };
                });

                const gained = [];
                const named = [];
                followers.forEach(a => {
                    const old = isPresent(this.followers, a);
                    if (!old) return gained.unshift(a);
                    if (old.id != 'none' && old.name != a.name) {
                        named.unshift({name: a.name, oldName: old.name, id: a.id});
                    }
                });
                const lost = this.followers.filter(a => {
                    if (!a.id) a.id = 'none';
                    if (a.id.indexOf('/') == -1) {
                        if (!isPresent(followers, a)) return true;
                    }
                });
                this.printFollowers(!setFollowers(this.userId, this.followers = followers), pop, gained, lost, named);
            },
            dosnuff: function(pop,xml) {
                pop.innerHTML = '';
                followerMapping.registerChild(pop.parentNode.dataset.item, jSlim.map(xml, '.user-avatar', me => me.parentNode.href.split('/').reverse()[0]));
                this.search.dispatchEvent(new Event('input'));
            },
            printError: function(pop, e) {
                pop.innerHTML = `<div class="tab selected" data-tab="0">
                        <div class="main">${e}</div>
                        <div class="main">The data for this user may have been damaged. You can clear the follower or history data below and try again.</div>
                        ${actionButtons(this.userId)}
                </div>
                <div class="tab" data-tab="1">${e.stack || 'No stack available'}</div>`;
                this.initTabs(`<div data-tab="0" class="button selected">Error</div
                               ><div data-tab="1" class="button">Stacktrace</div>`, pop);
            },
            initTabs: function(tabs, pop) {
                pop.insertAdjacentHTML('afterbegin', `<div class="tabs">${tabs}</div>`);
            },
            printFollowers: function(firstTime, pop, gained, lost, named) {
                const infoCard = document.getElementById('info-cards');
                if (infoCard) {
                    infoCard.parentNode.appendChild(infoCard);
                    infoCard.style.zIndex = '9999999999';
                }

                if (firstTime) gained = lost = named = [];

                const localeG = gained.length.toLocaleString('en'),
                      localeL = lost.length.toLocaleString('en'),
                      localeN = named.length.toLocaleString('en');

                const id = followerMapping.registerList(this.userName, this.followersRaw);

                pop.innerHTML = `
                <div class="tab selected" data-tab="0">
                    ${firstTime ? this.loaded() : this.overview(gained, lost, named, localeG, localeL, localeN)}
                </div>
                <div class="tab" data-tab="1">
                    ${this.stats(gained, lost, localeG, localeL, localeN)}
                    ${actionButtons(this.userId)}
                </div>
                <div class="tab" data-tab="2">
                    <b>Total Gained:</b> ${localeG}
                    <div class="main">${linkList(gained)}</div>
                </div>
                <div class="tab" data-tab="3">
                    <b>Total Lost:</b> ${localeL}
                    <div class="main">${linkList(lost)}</div>
                </div>
                <div class="tab tab-listing" data-tab="4">
                    <input id="nosey_follower_searcher" data-id="${id}" type="text" placeholder="search followers"></input>
                    <div class="list content">
                        ${followerMapping.structured(id).html('')}
                    </div>
                </div>
                <div class="tab" data-tab="5">${this.history(gained, lost, named)}</div>`;


                this.search = pop.querySelector('#nosey_follower_searcher');

                this.initTabs(`<div data-tab="0" class="button selected">Overview</div
                            ><div data-tab="1" class="button">Stats</div
                            ><div data-tab="2" class="button${!gained.length ? ' hidden' : ''}">Gained</div
                            ><div data-tab="3" class="button${!lost.length ? ' hidden' : ''}">Lost</div
                            ><div data-tab="4" class="button">List</div
                            ><div data-tab="5" class="button">History</div>`, pop);
            },
            loaded: function() {
                return `<div class="score fresh">${this.followers.length}</div>
                        <div class="main">${this.myPage ? 'Welcome! Your' : `${this.userName}'s`} followers have been successfully saved.</div>`;
            },
            stats: function(g, l, G, L, N) {
                var all = this.oldFollowers.length + g.length;
                const percentG = (all ? (g.length * 100 / all) : 0),
                      percentL = (all ? (l.length * 100 / all) : 0),
                      percentN = ((this.followers.length - l.length) > 0 ? (N * 100 / (this.followers.length - l.length)) : 0);

                const percentage = (a,l,b) => `<div class="percentage ${l}" style="width:${a}%;margin-left:${b || 0}%">${round(a || 0, 2)}%</div>`;
                return `<div class="score bar neutral"><div class="glass" ></div>
                    ${percentage(percentG, 'g')}${percentage(percentL, 'l')}${percentage(percentN, 'n', percentG)}
                </div>
                <div class="main">
                    <b>Total: </b>${this.followers.length.toLocaleString('en')} was ${this.oldFollowers.length.toLocaleString('en')}<br /><br />
                    <b>Arrived:</b> ${G} ( ${round(percentG, 2)}% )<br />
                    <b>Left:</b> ${L} ( ${round(percentL, 2)}% )<br />
                    <b>Name Changes:</b> ${N} ( ${round(percentN, 2)}% )<br />
                    <b>Stayed:</b> ${(this.followers.length - g.length).toLocaleString('en')} (${round(100 - percentG - percentL, 2)}%)<br />
                    <b>Score: </b> ${this.popularity(g.length, l.length, this.followers.length)}
                </div>`;
            },
            overview: function(g, l, n, G, L, N) {
                var result = '';
                var diff = g.length - l.length;
                result += `<div class="score ${diff >= 0 ? (!diff ? 'neutral">' : 'good">') : 'bad">'}${named(diff)}</div><div class="main">`;
                if (diff) {
                    result += `${this.myPage ? 'You have' : this.userName + ' has'} <b>${this.followers.length}</b> followers
                               ${g.length ? ' of which' : ''} <b>${g.length ? G : 'none'}</b> are new additions whilst
                               <b>${l.length ? L : 'none'}</b> of ${this.myPage ? 'your' : `${this.userName}'s`} old followers have left.`;
                } else if (!g.length) {
                    result += `<b>No changes detected!</b><br />${this.myPage ? 'You have' : this.userName + ' has'} not lost any followers, but ${this.myPage ? 'you have' : 'he has'} not gained any either.`;
                } else {
                    result += `${this.myPage ? 'You' : this.userName} simultaneously gained and lost <b>${G}</b> followers.`;
                }
                result += '</div>';
                if (n.length) return `${result}
                    <b>Name changes (${N}):</b>
                    <div class="main">
                        <ol>${n.map(a => `<li>${a.oldName.replace(/\+/g, ' ')} is now known as <a target="_blank" href="/user/${a.name}">${a.name.replace(/\+/g, ' ')}</a></li>`).join('')}</ol>
                    </div>`;
                return result;
            },
            popularity: function(g, l, t) {
                const _count = this.tabs.children[0];
                const storyCount = parseInt(_count.querySelector('.number').innerText);
                const blogCount = parseInt(_count.nextElementSibling.querySelector('.number').innerText);
                const folCount = t + g - l;

                const folPerStory = storyCount ? folCount/storyCount : 0;
                const folPerBlog = blogCount ? folCount/blogCount : 0;

                return parseImperial(((folPerStory + folPerBlog) / 4) * (storyCount * 9 + blogCount) / 55);
            },
            processChanges: function(gained, lost, named) {
                const history = getHistory(this.userId);

                for (let i = 0; i < gained.length || i < lost.length || i < named.length; i++) {
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
                const nameConversions = [];
                return history.reverse().reduce((results, h) => {
                    if (!h) return results;

                    nameConversions.forEach(k => {
                        if (h.name == k.name || h.display == k.display) h.id = k.id;
                    });

                    if (h.id === undefined) {
                        h.id = idFor(h, history) || idFor(h, this.followers) || idFor(h, this.oldFollowers);
                        if (h.id !== undefined) {
                            nameConversions.unshift(h);
                        }
                    }

                    if (h.id) results.unshift(h);
                    return results;
                }, []);
            },
            history: function(gained, lost, named) {
                const history = this.processChanges(gained, lost, named);
                const finalHistory = history.filter((a, i) => {
                    if (i < history.length - 1) {
                        if (a.type != 'n' && history[i + 1].type != 'n') {
                            if (a.name == history[i + 1].name) return false;
                        }
                    }
                    return true;
                });
                setHistory(this.userId, finalHistory);
                return finalHistory.length ? historyList(finalHistory) : 'No items to display';
            }
        };

        const userPageHeader = document.querySelector('.user-page-header');
        if (userPageHeader) {
            const h3 = document.querySelector('.bio_followers > h3');
            if (h3) {
                if (h3.innerText.indexOf(`${name} follows`) == 0) {
                    h3.insertAdjacentHTML('afterbegin', `<h3 style="border-bottom:none"><b>${document.querySelector('.user_sub_info .fa-eye').nextSibling.innerText}</b> members follow ${name}</h3>`);
                }
                h3.insertAdjacentHTML('beforeend', ' - <a class="sniffer">Sniff</a>');
            }
            userPageHeader.querySelector('.tab-followers').insertAdjacentHTML('afterend', '<li class="tab nosey"><a class="sniffer"><span class="number"><i class="fa fa-fw fa-paw" ></i></span>Sniff Followers</a></li>');
        }
        jSlim.all(document, '.user-card', me => {
            me.querySelector('.drop-down > ul > .divider').insertAdjacentHTML('beforebegin', '<li class="sniffer"><a><i class="fa fa-fw fa-paw"></i> Sniff Followers</a></li>');
        });
        jSlim.on(document.body, '.sniffer', 'click', (e, target) => {
            e.preventDefault();
            (new Dog(target)).sniffFollowers();
        });

        jSlim.on(document.body, 'a.snuffer', 'click', (e, target) => {
            e.preventDefault();
            target = new Dog(target);
            if (document.querySelector('.dog .list a.unloaded.hover')) {
                return target.snubFollowers(document.querySelector('.dog a.hover'));
            }
            target.sniffFollowers();
        });
        jSlim.on(document.body, 'button.forget', 'click', (e, target) => {
            if (confirm(target, 'Forgot this User')) {
                clearFollowers(this.dataset.id);
                clearChanges(this.dataset.id);
            }
        });
        jSlim.on(document.body, 'button.hforget', 'click', (e, target) => {
            if (confirm(target, 'Alrighty then...')) {
                var id = target.dataset.id;
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
        jSlim.on(document.body, '.dog button.export', 'click', (e, target) => {
            /*window.open(`data:application/json,${JSON.stringify({
                followers: getFollowers(target.dataset.id),
                history: getHistory(target.dataset.id)
            }, null, '\t')}`, `followers-${target.dataset.id}.json`);*/
            
            const a = document.createElement('A');
            a.download = `followers-${target.dataset.id}.json`;
            a.href = URL.createObjectURL(new Blob([JSON.stringify({
                followers: getFollowers(target.dataset.id),
                history: getHistory(target.dataset.id)
            }, null, ' ')], {type: 'application/json'}));
            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        });
        jSlim.on(document.body, '.dog button.import', 'click', () => {
            document.querySelector('.dog input.import').click();
        });
        jSlim.on(document.body, '.dog input.import', 'change', e => {
            const file = e.target.files[0];
            const id = e.target.dataset.id;
            const reader = new FileReader();

            reader.onload = e => {
                const data = JSON.parse(e.target.result);
                setFollowers(id, data.followers);
                setHistory(id, data.history);
                Dog.instance.restart();
            };

            reader.readAsText(file);
        });
        jSlim.on(document.body, '#nosey_follower_searcher', 'input', (e, target) => {
            target.nextElementSibling.innerHTML = followerMapping.structured(parseInt(target.dataset.id)).html(target.value.toUpperCase());
        });
        jSlim.on(document.body, '.dog .button[data-tab]', 'click', (e, target) => {
            const tab = target.dataset.tab;
            jSlim.all(target.closest('.dog'), '[data-tab]', a => {
                a.classList.toggle('selected', a.dataset.tab == tab);
            });
        });
        jSlim.on(document.body, 'button.forget, button.hforget', 'mouseout', (e, target) => {
            if (target.dataset.check != '2') {
                target.dataset.check = '0';
                target.innerText = target.dataset.text;
            }
        });
        jSlim.on(document.body, '.resize-handle', 'mousedown', (e, target) => {
            e.preventDefault();
            target = target.parentNode.querySelector('.drop-down-pop-up-content');
            const resize = e => {
                const off = offset(holder);
                target.style.width = `${e.pageX - off.left}px`;
                target.style.height = `${e.pageY - off.top}px`;
            };

            const stopResize = () => {
                document.body.removeEventListener('mouseup', stopResize);
                document.body.removeEventListener('mousemove', resize);
            };

            document.body.addEventListener('mousemove', resize);
            document.body.addEventListener('mouseup', stopResize);
        });
        jSlim.on(document.body, '.dog .open-pin', 'click', e => {
            e.preventDefault();
            var a = this.parentNode.querySelector('a');
            followerMapping.setOpened(this.parentNode.dataset.item, !a.classList.contains('opened'));
            a.classList.toggle('opened');
            if (a.classList.contains('opened') && this.classList.contains('async')) {
                this.classList.remove('async');
                this.parentNode.classList.remove('unloaded');
                this.parentNode.querySelector('ol').innerHTML = followerMapping.childs(this.parentNode.dataset.item, document.querySelector('#nosey_follower_searcher').value.toUpperCase());
            }
        });
        jSlim.on(document.body, '.dog .list a', 'mouseenter', (e, target) => {
            if (target.classList.contains('hover')) return;
            jSlim.all('.dog .list a.hover', me => me.classList.remove('hover'));
            target.classList.add('hover');
        });

        FimFicEvents.on('afterinfocard', e => {
            Array.prototype.forEach.call(document.querySelectorAll('.info-card-container .top-info .button-group > .button-group'), me => {
                if (!me.querySelector('.snuffer')) {
                    me.insertAdjacentHTML('afterbegin', `<a class="snuffer button button-icon-only" data=user="${e.user}><span title="Sniff Followers"><i class="fa fa-paw" /></span></a>`);
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

        function actionButtons(id) {
            return `<div class="main">
                        <button data-id="${id}" data-text="Forget this User" class="forget styled_button">Forget this User</button>
                        <button data-id="${id}" class="export styled_button">Export Data</button>
                        <button data-id="${id}" class="import styled_button">Import Data</button>
                        <input data-id="${id}" class="import" type="file" hidden></input>
                    </div>
                    <div class="main">
                      <button data-id="${id}" data-limit="30" data-text="Trim History" title="Deletes all but the last 30 items" class="hforget styled_button">Trim History</button>
                      <button data-id="${id}" data-text="Clear History" title="Deletes all history for this user" class="hforget styled_button">Clear History</button>
                    </div>`;
        }

        function requestFollowers(id, success, failure) {
            ajax('GET', `/ajax/users/${id}/followers`, success, failure);
        }

        function setFollowers(id, val) {
            const result = settingsMan.get(`followers_${id}`) != null;
            settingsMan.set(`followers_${id}`, JSON.stringify(val));
            return result;
        }

        function getFollowers(id) {
            const result = settingsMan.get(`followers_${id}`);
            return result == null ? [] : JSON.parse(result);
        }

        function clearFollowers(id) {
            settingsMan.delete(`followers_${id}`);
        }

        function clearChanges(id) {
            settingsMan.delete(`changes_${id}`);
        }

        function setHistory(id, items) {
            settingsMan.set(`changes_${id}`, JSON.stringify(items));
        }

        function getHistory(id) {
            const result = settingsMan.get('changes_' + id);
            return (result == null ? [] : JSON.parse(result)).filter(h => !!h);
        }

        function list(arr) {
            return `<div class="list"><ul>${arr.map(a => `<li>${a.replace(/\+/g, ' ')}</li>`).join('')}</ul></div>`;
        }

        function historyListItemName(a) {
            if (a.type == 'j' || a.type == 'l') return `<a target="_blank" href="/user/${a.name.replace(/ /g,'+')}">${a.display.replace(/\+/g, ' ')}</a> `;
            return `${a.old.replace(/\+/g, ' ')} `;
        }

        function historyListItemMessage(a) {
            if (a.type == 'j') return '<i>joined</i>';
            if (a.type == 'l') return '<i>left</i>';
            return `changed names to</i> <a target="_blank" href="/user/${a.name.replace(/ /g,'+')}">${a.display.replace(/\+/g, ' ')}</a>`;
        }

        function historyList(arr) {
            return `<div class="history list"><ul>${arr.map((a, i) =>
                `<li data-index="${i}" class="history ${a.type}">
                    ${historyListItemName(a)} ${historyListItemMessage(a)}
                </li>`).reverse().join('')}
            </ul></div>`;
        }

        function linkList(arr) {
            return `<div class="list"><ol>${arr.map(a =>
                `<li><a target="_blank" data-id="${a.id}" href="/user/${a.name.replace(/ /g,'+')}">${a.name.replace(/\+/g, ' ')}</a></li>`)}
            </ol></div>`;
        }

        function idFor(hist, followers) {
            for (var i = 0; i < followers.length; i++) {
                if (followers[i].id != 'none' && followers[i].id !== undefined && followers[i].id == hist.id) {
                    return hist.id;
                }
                if ((hist.name == followers[i].name || hist.old == followers[i].name) && followers[i].id) {
                    return followers[i].id;
                }
            }
        }

        function isPresent(arr, follower) {
            return arr.find(a => {
                if (follower.id == 'none' && a.name == follower.name) {
                    if (a.id != 'none') follower.id = a.id;
                    return true;
                }
                if (a.id == follower.id) return true;
                if (a.id == 'none' && a.name == follower.name) {
                    a.id = follower.id;
                    return true;
                }
            });
        }

        function named(numb) {
            const units = ['', 'thousand','million','billion'];
            const sign = numb < 0 ? '-' : numb == 0 ? '' : '+';
            numb = Math.abs(numb);
            let index = 0;
            while (index < units.length && numb >= 1000) {
                index++;
                numb /= 1000;
            }
            return `${sign}${round(numb, 2)}${units[index]}`;
        }

        makeStyle(`
.drop-down-pop-up-content.dog {position: relative;}
.dog .button {
    display: inline-block;
    background: linear-gradient(to bottom, #eee 0%, #ddd 100%);
    line-height: 20px;
    margin-top: 4px;
    padding: 5px 5px 0 5px;
    border-radius: 5px 5px 0 0;
    border: solid 1px rgba(0, 0, 0, 0.6);
    border-bottom: none;
    cursor: pointer;}
.dog .button:not(.selected) {background: linear-gradient(to bottom, #ddd 0%, #ccc 100%);}
.dog .tabs {
    width: 100%;
    height: 100%;
    position: relative;
    border-bottom: solid 1px rgba(0,0,0,0.6);}
.dog .tab {
    display: none;
    position: absolute;
    bottom: 0px;
    top: 30px;
    left: 0px;
    right: 0px;
    background: #ddd;
    min-height: 270px;
    overflow-y: auto;
    padding: 10px;}
.dog .list {padding: 5px;}
.dog .tab .main .li {height: 20px;}
.dog .tabs .button.hidden {display: none;}
.dog .list .history {
    font-size: 80%;
    padding-left: 5px;
    margin-left: -10px;
    margin-right: -10px;
    box-shadow: 0 0 2px rgba(0,0,0,0.3) inset;}
.dog .list .history:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;}
.dog .list .history:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;}
.history.j {
    background: rgba(0, 240, 0, 0.07);}
.history.l {
    background: rgba(240, 0, 0, 0.07);}
.dog .list .history.j:before {content: "+ ";}
.dog .list .history.l:before {content: "- ";}
.dog .tab .main {
    background: rgb(220, 250, 200);
    border-radius: 20px;
    padding: 15px;
    border: dashed 1px rgba(0,0,0,0.2);
    box-shadow: 0 0 3px 1px rgba(0,0,30,0.3);
    color: #555;
    margin: 5px 0px;}
.dog .tab.selected {display: block !important;}
.dog .score {
    text-align: center;
    font-weight: bold;
    font-size: 40px;
    border-radius: 300px;
    border: solid 5px;
    margin-bottom: 5px;
    height: 58px;
    line-height: 45px;
    text-shadow: 0 0 2px rgba(0,0,100,0.6);}
.dog .score:not(.bar) {box-shadow: inset 0 0 10px 5px rgba(255,255,255,0.4),0 0 3px 1px rgba(0,0,30,0.3);}
.dog .score.good {
    background: rgba(0, 240, 0, 0.3);
    color: #A5C75B;}
.dog .score.bad {
    background: rgba(240, 0, 0, 0.3);
    color: #B15B5B;}
.dog .score.neutral {
    background: rgba(120, 120, 120, 0.3);
    color: rgb(240, 240, 240);}
.dog .score.fresh {
    background: rgba(0, 0, 240, 0.3);
    color: blue;}
.dog .score.bar {
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 3px 1px rgba(0,0,30,0.3);
    background: rgba(0, 0, 240, 0.3);
    line-height: 50px;
    font-size: 15px;}
.dog .score.bar div {position: absolute;}
.dog .glass {
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: 1;
    border-radius: 500px;
    box-shadow: inset 0 0 10px 5px rgba(255,255,255,0.4);}
.dog .percentage.g {
    top: 0px;
    bottom: 0px;
    left: 0px;
    background: #A5C75B;}
.dog .percentage.l {
    top: 0px;
    right: 0px;
    bottom: 0px;
    background: #B15B5B;}
.dog .percentage.n {
    top: 0px;
    bottom: 0px;
    background: rgba(255,255,255,0.3);}
.dog li .dog {display: none;}
.dog li a.opened ~ .dog {display: block;}
.open-pin:after {
    content: "";
    float: right;
    display: inline-block;
    width: 0px;
    height: 0px;
    text-align: center;
    line-height: 15px;
    margin-top: 10px;
    cursor: pointer;
    border: solid;
    border-width: 5px;
    border-color: #507E2C transparent transparent transparent;}
a:hover + .open-pin:after, .open-pin:hover:after {border-color: #609734 transparent transparent transparent;}
.opened:hover + .open-pin:after, .opened + .open-pin:hover:after {border-color: transparent transparent #609734 transparent;}
.opened + .open-pin:after {
    margin-top: 5px;
    border-color: transparent transparent #507E2C transparent;}
#info-cards > * {z-index: 99999999999999999 !important;}
.global_popup input[type="text"], .global_popup input[type="url"] {
    padding: 8px;
    width: 100%;
    border: 1px solid #CCC;
    background: none repeat scroll 0% 0% #F8F8F8;
    outline: medium none;
    color: #333;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1) inset;
    border-radius: 3px;
    margin: 5px 0px;}
.resize-handle {
    height: 10px;
    width: 10px;
    display: inline-block;
    position: absolute;
    bottom: 0;
    right: 0;
    border-bottom: solid 2px;
    border-right: solid 2px;}`);
    })();
} catch (e) {
    try {
        makeGlobalPopup('Nosey Hound', '', false).SetContent(e);
    } catch (ee) {
        alert(`Nosey Hound: ${e}`);
    }
}

function makeGlobalPopup(title, fafaText, darken, close) {
    const p = makePopup(title, fafaText, darken, close);
    p.element.classList.add('global_popup');
    return p;
}

function round(n, decimals) {
    const c = Math.pow(10, decimals);
    return Math.floor(n*c)/c;
}

function parseImperial(amount) {
    const units = [['Inch',1,'Inches'],['Foot',12,'Feet'],['Yard',3,'Yards'],['Mile',1760,'Miles']];
    if (!amount) return '0 ' + units[0][2];
    var result = '';
    if (amount < 0) {
        amount = -amount;
        result += 'negative ';
    }
    if (amount < units[0][1]) return `${round(amount, 2).toLocaleString('en')}${units[0][2]}`;
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
                result += `${this.data} ${units[this.index][this.data > 1 ? 2 : 0]} `;
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