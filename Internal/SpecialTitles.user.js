// ==UserScript==
// @name        Special User Titles API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.0
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==

(function (win) {
    var ver = 1.0;
    var startup =
        (typeof (SpecialTitles) === 'undefined') && (typeof (win.SpecialTitles) === 'undefined') &&
        (win == window || (typeof (window.SpecialTitles) === 'undefined'));
    function STs(load) {
        var _version = ver;
        var _registeredTitles = load != null ? load.registeredTitles() : {};
        
        loadIn({
            "FimFiction Modder": [138711, 10539, 27165],
            "Emote Contributor": [129122]
        });

        function loadIn(b) {
            for (var i in b) {
                if (_registeredTitles[i] == null) {
                    _registeredTitles[i] = b[i];
                } else {
                    for (var j = 0; j < b[i].length; j++) {
                        if ((function () {
                            for (var k = 0; k < _registeredTitles[i].length; k++) {
                                if (b[i][j] == _registeredTitles[i][k]) return true;
                        }
                            return false;
                        })()) {
                            _registeredTitles[i].push(b[i][j]);
                        }
                    }
                }
            }
        }

        this.version = function () {
            return _version;
        };
        this.registeredTitles = function (v) {
            if (v != null) {
                _registeredTitles = v;
            }
            return _registeredTitles;
        }
    }
    STs.prototype.setUpSpecialTitles = function () {
        for (var i in this.registeredTitles()) {
            this.setSpecialTitle(this.registeredTitles()[i], i);
        }
    };
    STs.prototype.setSpecialTitle = function (userIds, title) {
        for (var i = 0; i < userIds.length; i++) {
            $(".author > .avatar > img[src^='//www.fimfiction-static.net/images/avatars/" + userIds[i] + "']").each(function (item) {
                var prev = this.parentNode.previousSibling;
                if (prev != null && prev != undefined && prev.innerHTML != title) {
                    $(this.parentNode).before("<div class=\"author-badge\" >" + title + "</div>");
                }
            });
        }
    };
    STs.prototype.registerUserTitle = function (user, title) {
        if (typeof user != 'number') return;
        if (this.registeredTitles()[title] == null) {
            this.registeredTitles()[title] = [];
        }
        for (var i = 0; i < this.registeredTitles()[title].length; i++) {
            if (this.registeredTitles()[title][i] == user) return;
        }
        this.registeredTitles()[title].push(user);
    };

    if (typeof (win.SpecialTitles) !== 'undefined') {
        if (win.SpecialTitles.version() < ver) {
            win.SpecialTitles = new STs(win.SpecialTitles);
        }
    } else {
        win.SpecialTitles = new STs();
    }

    if (win != window) {
        window.SpecialTitles = {
            version: function () {
                return win.SpecialTitles.version();
            },
            registeredTitles: function (v) {
                return win.SpecialTitles.registeredTitles(v);
            },
            setSpecialTitle: function (userIds, title) {
                win.SpecialTitles.setSpecialTitle(userIds, title);
            },
            setUpSpecialTitles: function () {
                win.SpecialTitles.setUpSpecialTitles();
            },
            registerUserTitle: function (user, title) {
                win.SpecialTitles.registerUserTitle(user, title);
            }
        };
    }

    if (startup) {
        win.SpecialTitles.setUpSpecialTitles();
        setTimeout(function () {
            try {win.SpecialTitles.setUpSpecialTitles();
            } catch (e) {
                alert('Error in ticking win.SpecialTitles.setUpSpecialTitles()\n' + e);
            }
        }, 500);
    }
})(typeof (unsafeWindow) !== 'undefined' && unsafeWindow != window ? unsafeWindow : window);