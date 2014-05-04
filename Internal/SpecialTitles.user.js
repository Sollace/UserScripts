// ==UserScript==
// @name        Special User Titles API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     0.0
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==

var SpecialTitles = {
    registeredTitles: {
        "FimFiction Modder": [138711, 10539, 27165],
        "Emote Contributor": [129122]
    },
    setUpSpecialTitles: function() {
        for (var i in registeredTitles) {
            setSpecialTitle(registeredTitles[i], i);
        }
    },
    setSpecialTitle: function(userIds, title) {
        for (var i = 0; i < userIds.length; i++) {
            $(".author > .avatar > img[src^='//www.fimfiction-static.net/images/avatars/" + userIds[i] + "']").each(function (item) {
                var prev = this.parentNode.previousSibling;
                if (prev != null && prev != undefined && prev.innerHTML != title) {
                    $(this.parentNode).before("<div class=\"author-badge\" >" + title + "</div>");
                }
            });
        }
    },
    registerUserTitle: function (user, title) {
        if (typeof user != 'Number') return;
        if (registeredTitles[title] == null) {
            registeredTitles[title] = [];
        }
        for (var i = 0; i < registeredTitles[title].length; i++) {
            if (registeredTitles[title][i] == user) return;
        }
        registeredTitles[title].push(user);
    }
};
if (!$('body').attr('title_looper_started')) {
    SpecialTitles.setUpSpecialTitles();
    setTimeout(SpecialTitles.setUpSpecialTitles, 500);
}