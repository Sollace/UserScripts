// ==UserScript==
// @name        Prompt Maker
// @description Adds a button to FimFiction to generate random prompts
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.3
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==

var terms = {
    "f": [
        "{c} goes to {p}",
        "{p} is {v} by {c}",
        "{p} and {p} merge",
        "{c} and {c} {x}",
        "{c} {v2} a {o}",
        "{c} is taken to {pc}",
        "{p} is invaded by {h}",
        "{c} {v4} {c}",
        "{c} {v2} {cs}",
        "{c} is {v3}",
        "{c} is a {vs}",
        "{w} invented",
        "{c} {i} {wp}",
        "{c} {i} a {ws}",
        "{c} {v5}",
        "{c} is the element of {el}",
        "Try Again :P",
        "Outta luck XD",
        "{c}'s {cp}",
        "{c} gets a new {bp}",
        "{c}'s {bp} is fake",
    ],
    "cp": [
        "{bp}", "cute-ceneara"
    ],
    "bp": [
        "cutiemark", "hoof", "horn", "wing", "wings", "tail", "mane", "legs", "teeth", "tongue", "package"
    ],
    "cs": [
        "{c}", "a {s}"
    ],
    "i": [
        "invented", "invents",
        "discovered", "discovers",
        "used", "uses"
    ],
    "pc": [
        "{c}",
        "{p}"
    ],
    "vs": [
        "{s}",
        "{v3} {s}",
        "{pf}"
    ],
    "pf": [
        "{pfp}", "{pfp} {pfn}", "{pfn} {pfp}", "{pfnn} {pfp}"
    ],
    "pfp": [
        "Spy", "Farmer", "Doctor", "Teacher", "Dentist", "Detective",
        "Accountant", "Politition", "Lawyer", "Singer", "DJ", "Cook", "Baker",
        "Mailmare", "Milkmare", "Librarian","Medic"
    ],
    "pfn": [
        "Killer", "Pimp", "Slaver", "Prostitute","Pyromaniac"
    ],
    "pfnn": [
        "Serial Killing", "Pimping", "Horrible"
    ],
    "x": [
        "merge","switch {x1}", "share {x1}","have sex","plot"
    ],
    "x1": [
        "places", "bodies", "families", "jobs","brains","race"
    ],
    "c": [
        "{c2}","Nightmare {cn}",
        "Princess Celestia","Princess Luna","Princess Cadance",
        "Bon Bon","Carrot Top","Sunset Shimmer","Shining Armour","Vinyl Scratch",
        "Sweetie Belle","Rainbow Dash","Diamond Tiara","Silver Spoon","Babs Seed",
        "Twilight Sparkle","Pinkie Pie","Blinkie Pie","Inky Pie","Maud Pie","The Cake Twins",
        "Dr. Hooves","MMMMM","Queen Crysalis","Button Mash","Sea Breeze","Angel Bunny",
        "Cherry Jubilee","Photo Finish",
        "Granny Smith","Mig Macintosh","Cheese Sandwich",
        "Bill Gates","an Alien","The Doctor","The Master","The President","The Servant",
        "Optimus Prime","Iron Man","The HULK","The HUNK"
    ],
    "cn": [
        "{c2}","{c3}"
    ],
    "c2": [
        "Nightlight","Cheerilee",
        "Twilight","Applejack","Rarity","Fluttershy",
        "Scootaloo","Applebloom",
        "Trixie","Nyx","Fluffle Puff",
        "Big Mac","Spitfire","sauren","Spike",
        "Lyra", "Derpy","Octavia","Roseluck",
        "Tirek","Discord","Maud"
    ],
    "c3": [
        "Belle","Dash","Tiara","Spoon","Moon","Seed","Bon","Pie"
    ],
    "w": [
        "{wp} are", "{ws} is", "{ws} was",
        "{wp} aren't", "{ws} isn't", "{ws} wasn't",
        "{wp} must be", "{wp} must not be"
    ],
    "wp": [
        "guns", "cars", "politics", "banks", "space Travel", "contraceptives"
    ],
    "ws": [
        "gun", "car", "bank", "contraceptive"
    ],
    "p": [
        "Canterlot",
        "Sweet Apple Acres",
        "Manehatten",
        "Earth",
        "The Moon",
        "Equestria",
        "Cloudsdale",
        "Prance",
        "Tartarus"
    ],
    "v": [
        "eaten",
        "taken"
    ],
    "v2": [
        "eats",
        "has",
        "dies"
    ],
    "v3": [
        "dead",
        "kidnapped",
        "bloated",
        "pregnant",
        "evil",
        "undead",
        "gay"
    ],
    "v4": [
        "defeats",
        "kidnaps",
        "is",
        "loves",
        "hates",
        "marries",
        "kills",
        "is killed by",
        "shrinks",
        "cheats on"
    ],
    "v5": [
        "travels through space",
        "uses contraceptives",
        "forgets to use contraceptives",
        "gets wasted",
        "{v6} drugs",
        "accidentally {v6} drugs"
    ],
    "v6": [
        "takes", "sells", "trips", "gives up", "buys","forgets"
    ],
    "o": [
        "peach",
        "water mellon",
        "apple",
        "bottle",
        "cloud",
        "rainbow",
        "baby",
        "cow",
        "the Alicorn Amulet",
        "Kitchen Sink",
        "MMMMM",
        "Cheese Sandwich"
    ],
    "h": [
        "Aliens",
        "a horde of zombies",
        "Humans",
        "Changelings",
        "Timelords"
    ],
    "s": [
        "Vampony",
        "Zompony",
        "Alicorn",
        "Bat Pony",
        "Human",
        "Dragon",
        "Changeling",
        "Clone",
        "Pinkie Pie"
    ],
    "el": [
        "honesty", "love", "loyalty", "generosity", "kindness", "magic",
        "deceit", "hate", "dishonor", "selfishness", "pride","murder"
    ]
}
function makePrompt() {
    var txt = "{f}";
    for (var i in terms) {
        txt = fillTerm(txt, i);
    }
    return txt;
}

function fillTerm(txt, term) {
    while (txt.indexOf("{" + term + "}") != -1) {
        txt = txt.replace("{" + term + "}", pickOne(terms[term]));
    }
    return txt;
}

var but = $('<li><a href="javascript:void();"><i class="fa fa-lightbulb-o" /><span>Prompt</span></a></li>');
$(but).click(function() {
    var pop = makeGlobalPopup('Random Prompt', '');
    $(pop).append('<span>' + makePrompt() + '</span>');
    $(pop).css('padding', '15px');
    position(pop.parentNode.parentNode, 'center', 'center');
});
$('.user_toolbar audio').before(but);

//--------------------------------------------------------------------------------------------------
//--------------------------------------API FUNCTIONS-----------------------------------------------
//--------------------------------------------------------------------------------------------------

//==API FUNCTION==//
function pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

//==API FUNCTION==//
function makeGlobalPopup(title, fafaText, darken, img) {
    var holder = document.createElement("div");
    $("body").append(holder);
    $(holder).addClass("drop-down-pop-up-container");
    $(holder).attr("style", "position: fixed;z-index:2147483647;left:10px;top:10px");
    $(holder).addClass('global_popup');
    
    var dark = $('<div class="dimmer" style="z-index:1001;" />');
    if (typeof (darken) == 'number') {
        dark.css('opacity', (darken / 100));
    }
    $('#dimmers').append(dark);
    
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