// ==UserScript==
// @name        Special User Titles API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     0.0
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==

(function () {
    function STs(load) {
        var _version = version;
        var _registeredTitles = load.registeredTitles();
        
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
    STs.prototype.version = function () {
        return 0.0;
    };
    STs.prototype.setUpSpecialTitles = function () {
        for (var i in this.registeredTitles()) {
            this.setSpecialTitle(this.registeredTitles[i], i);
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

    if (typeof (unsafeWindow) !== 'undefined') {
        if (typeof (unsafeWindow.SpecialTitles) !== 'undefined') {
            if (unsafeWindow.SpecialTitles.version() < version) {
                unsafeWindow.SpecialTitles = new STs(unsafeWindow.SpecialTitles);
            } else {
                unsafeWindow.SpecialTitles = new STs();
            }

            SpecialTitles = {
                setSpecialTitle: function (userIds, title) {
                    unsafeWindow.SpecialTitles.setSpecialTitle(userIds, title);
                },
                setUpSpecialTitles: function () {
                    unsafeWindow.SpecialTitles.setUpSpecialTitles();
                },
                registerUserTitle: function (user, title) {
                    unsafeWindow.SpecialTitles.registerUserTitle(user, title);
                }
            };
        }
    } else {
        if (typeof (SpecialTitles) !== 'undefined' || SpecialTitles.version() < version) {
            SpecialTitles = new STs(SpecialTitles);
        } else {
            SpecialTitles = new STs();
        }
    }
})();