// ==UserScript==
// @name        Prompt Maker
// @description Adds a button to FimFiction to generate random prompts
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.4
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==

run({
    pattern: [
        '{pattern_1}!',
        '{pattern_2}.',
        '{pattern_3}.',
        '{pattern_2} whilst [pattern_2].',
        '{pattern_3} when it turns out that {pattern_2}.',
        '{pattern_3} every time {pattern_2}.',
        '{pattern_3} and {pattern_2}.'
    ],
    pattern_1: [
        'Nanananananananaanananananananananananaanananananananananananananan BATMARE',
        'Button\s Mom has got it goin\' on',
        '{name} everywhere',
        '{name_equestrian} meets {fandom}',
        '{name_nonequestrian} is a {fandom_singular}',
        '{race_plural} everywhere',
        '{place} is invaded by {enemy}',
        '{pattern_2} and {pattern_3}',
        '{name} {i_present} a {weapon_singular}',
        '{name} {i_past} {weapon_plural}',
        '{place} is {name}\'s new home'
    ],
    pattern_2: [
        '{place} {is_or_was} {verbed} by {enemy}',
        '{name_nonequestrian} {place_phrase_non_eq}',
        '{name_equestrian} {place_phrase_eq}',
        '{place} and [place] merge',
        '{place} is {verbed} by {name}',
        'The {enemy_plural} use {power} to {verb_enemy}',
        '{name} and [name] {action}',
        '{name} {does_to} [name]',
        '{name_pony_titled_evil} comes to {place_non_eq}'
    ],
    pattern_3: [
        '{name_equestrian}\'s cute-ceneara is {adv_phrase}',
        '{name_equestrian}\'s {bodypart_phrase}',
        '{name} is {done_by} by [name]',
        '{name} {change} [name]',
        '{name} {object_phrase}',
        '{name} is {is}',
        '{name} is a {profession}',
        '{name} is a {race}',
        '{name} is taken to {place_or_name}',
        '{name} tries to {done_food} {food}',
        '{name} {change} {name_or_race}',
        '{name} {verbed_2} {power}',
        '{name} gets a new {bodypart_singular}',
        '{name}\'s {bodypart_singular} is fake',
        '{name}\'s {bodypart_plural} are fake'
    ],
    verbed_2: ['discovers', 'is','breaks','{done_food}', '{i_present}'],
    verbed: ['taken over','destroyed'],
    is_or_was: ['is','was','gets'],
    place_or_name: ['{name_equestrian}','{place}'],
    name_or_race: ['{name_pony_titled_evil}', 'a {race}'],
    enemy_or_race: ['{enemy}', '{race_plural}'],
    verb_enemy: [
        'invade {place}',
        'defeat {name}'
    ],
    weapon_phrase: [
        '{weapon_plural} are', 'a {weapon_singular} is', 'a {weapon_singular} was',
        '{weapon_plural} aren\'t', '{weapon_plural} weren\'t', '{weapon_singular} wasn\'t',
        '{weapon_plural} must be', '{weapon_plural} must not be'
    ],
    weapon: [
        '{weapon_plural}',
        'a {weapon_singular}'
    ],
    weapon_plural: [
        'guns', 'cars', 'politics', 'banks', 'space Travel', 'contraceptives'
    ],
    weapon_singular: [
        'gun', 'car', 'bank', 'contraceptive'
    ],
    bodypart_phrase: [
        '{bodypart_singular} {does_object_singular}',
        '{bodypart} {does_object}'
    ],
    bodypart: ['{bodypart_plural}', '{bodypart_singular}'],
    bodypart_plural: [
        'cutiemark', 'hooves', 'horns', 'wings', 'legs', 'teeth', 'tongue', 'wings'
    ],
    bodypart_singular: [
        'cutiemark', 'hoof', 'horn', 'wing', 'tail', 'mane', 'legs', 'teeth', 'tongue', 'package'
    ],
    place: ['{place_eq}', 'Equestria', 'The Moon', 'Earth', 'Tartarus'],
    place_phrase_eq: [
        '{conj_place} {place_eq}',
        '{conj_place_to_0} Tartarus',
        '{conj_place_to} {place_non_eq}'],
    place_phrase_non_eq: [
        '{conj_place_to} {place_eq}',
        '{conj_place_to_0} Tartarus'],
    place_eq: [
        'Canterlot',
        'Trottingham',
        'Sweet Apple Acres',
        'Manehatten',
        'Cloudsdale',
        'Prance'
    ],
    place_non_eq: [
        'Earth', 'New York', 'London', 'California', 'The Moon'
    ],
    conj_place: [
        '{conj_place_away}','{conj_place_to}'
    ],
    conj_place_to: [
        'comes to',
        '{conj_place_to_1}'
    ],
    conj_place_to_0: [
        'comes from',
        '{conj_place_to_1}'
    ],
    conj_place_to_1: [
        'visits',
        'goes to'
    ],
    conj_place_away: [
        'leaves'
    ],
    enemy: ['{enemy_plural}', '{enemy_odd}', 'a horde of zombies'],
    enemy_plural: [
        'Changelings',
        '{enemy_odd}'
    ],
    enemy_odd: [
        'Aliens',
        'Humans',
        'Timelords'
    ],
    name: ['Filly {name_pony}', '{name_nonequestrian}', '{name_equestrian}'],
    name_equestrian: ['{name_pony}', '{name_nonpony}'],
    name_pony: [
        '{name_pony_first}', 'Princess {name_pony_first}',
        'Bon Bon','Carrot Top','Sunset Shimmer','Shining Armour','Vinyl Scratch',
        'Sweetie Belle','Rainbow Dash','Diamond Tiara','Silver Spoon','Babs Seed',
        'Twilight Sparkle','Pinkie Pie','Blinkie Pie','Inky Pie','Maud Pie','The Cake Twins',
        'Dr. Hooves','MMMMM','Queen Chrysalis','Button Mash',
        'Cherry Jubilee','Photo Finish','Button\'s Mom',
        'Granny Smith','Big Macintosh','Cheese Sandwich'
    ],
    name_nonpony: ['Sea Breeze','Angel Bunny','Tirek','Discord'],
    name_nonequestrian: [
        'Bill Gates','an Alien','The Doctor','The Master','The President','The Servant',
        'Optimus Prime','Starscream','Iron Man','Batman','The HULK','The HUNK','Roger Moore','Chuck Norris'
    ],
    name_pony_titled: ['Princess {name_pony_first}', '{name_pony_titled_evil}'],
    name_pony_titled_evil: ['King {name_pony_first}', 'Nightmare {name_pony_1}'],
    name_pony_1: ['{name_pony_first}','{name_pony_last}'],
    name_pony_first: [
        'Celestia','Luna','Cadance',
        'Nightlight','Cheerilee',
        'Twilight','Applejack','Rarity','Fluttershy',
        'Scootaloo','Applebloom',
        'Trixie','Nyx','Fluffle Puff',
        'Big Mac','Spitfire','sauren','Spike',
        'Lyra', 'Derpy','Octavia','Roseluck',
        'Maud'
    ],
    name_pony_last: ['Belle','Dash','Tiara','Spoon','Moon','Seed','Bon','Pie','Chrysalis'],
    race: ['Vampony','Zompony','Alicorn','Bat Pony','Human','Dragon','Changeling','Clone','Pinkie Pie'],
    race_plural: ['Vamponies','Zomponies','Alicorns','Bat Ponies','Humans','Dragons','Changelings','clones','Pinkie Pies'],
    fandom: ['a {fandom_singular}','{fandom_plural}'],
    fandom_singular: ['Brony','Furry','Anti-Brony'],
    fandom_plural: ['Bronies','Furries','Anti-Bronies'],
    power: [
        'The Element of {element}', 'the magic of {element}'
    ],
    element: [
        'Honesty', 'Love', 'Loyalty', 'Generosity', 'Kindness', 'Magic',
        'Deceit', 'Hate', 'Dishonor', 'Selfishness', 'Pride','Murder'
    ],
    object_phrase: [
        '{does_with} a {descriptor} {object}',
        '{does_with} a {object}',
        '{done_food}s {food}'
    ],
    descriptor: [
        'big','giant','rotten','nasty','tall','poisoned','infected','supercharged'
    ],
    object: [
        'bottle',
        'cloud',
        'rainbow',
        'baby',
        'cow',
        'the Alicorn Amulet',
        'Kitchen Sink',
        'MMMMM',
        '{food_1} sandwich',
        '{food_2} sandwich'
    ],
    food: ['a {food_2}','{food_1}'],
    food_1: [
        'chocolate',
        'pie',
        'apple pie',
        'melon',
        'water melon'
    ],
    food_2: [
        'carrot',
        'berry',
        'cake',
        'apple',
        '{cheese} cheese'
    ],
    cheese: [
        'block of',
        'slice of'
    ],
    profession: ['{pfp}', '{pfp} {pfn}', '{pfn} {pfp}', '{pfnn} {pfp}'],
    pfp: [
        'Spy', 'Farmer', 'Doctor', 'Teacher', 'Dentist', 'Detective',
        'Accountant', 'Politition', 'Lawyer', 'Singer', 'DJ', 'Cook', 'Baker',
        'Mailmare', 'Milkmare', 'Librarian','Medic'
    ],
    pfn: ['Killer', 'Pimp', 'Slaver', 'Prostitute','Pyromaniac'],
    pfnn: ['Serial Killing', 'Pimping', 'Horrible'],
    action: ['merge', 'switch {acted}', 'share {acted}', 'have sex', 'plot', '{name_does}'],
    acted: ['places', 'bodies', 'families', 'jobs', 'brains', 'race'],
    is: [
        'dead',
        'kidnapped',
        'bloated',
        'pregnant',
        'evil',
        'undead',
        'gay',
        'a filly'
    ],
    i_present: [
        'invents', 'discovers', 'uses'
    ],
    i_past: [
        'invented', 'discovered', 'used'
    ],
    adv_phrase: [
        'a {adv}', 'a complete {adv}', '{adv_2}'
    ],
    adv: [
        'disaster', 'success'
    ],
    adv_2: [
        'ruined'
    ],
    done_by: ['eaten','taken','killed','murdered'],
    change: ['takes', 'meets', '{does_to}', 'turns into'],
    does_to: [
        'defeats',
        'kidnaps',
        'makes sweet, sweet love to',
        'loves',
        'hates',
        'marries',
        'is',
        'kills',
        'is killed by',
        'shrinks',
        'cheats on'
    ],
    name_does: [
        'travels through space',
        'travels through space and time',
        'uses contraceptives',
        'forgets to use contraceptives',
        '{is_done}',
        '{does_2} drugs',
        'accidentally {does_2} drugs'
    ],
    does_with: ['forgets','eats','has','cooks','{is_done} on'],
    is_done: ['jumps','falls','chokes','dies','lies','skips','backflips','rolls','has sex','gets wasted'],
    does_object: ['fall off', 'break', 'swell up'],
    does_object_singular: ['falls off', 'breaks', 'swells up'],
    does_2: ['takes', 'sells', 'trips', 'buys', 'eats','gives up'],
    done_food: ['eat','buy','sell','cook']
});

//--------------------------------------------------------------------------------------------------
//----------------------------------------FUNCTIONS-------------------------------------------------
//--------------------------------------------------------------------------------------------------

function run(terms) {
    var but = $('<li><a href="javascript:void();"><i class="fa fa-lightbulb-o" /><span>Prompt</span></a></li>');
    $('.user_toolbar audio').before(but);
    but.click(function() {
        var pop = makeGlobalPopup('Random Prompt', 'fa fa-lightbulb-o', 0);
        $(pop).append('<span class="prompt">' + makePrompt('{pattern}', terms) + '</span>');
        $(pop).parent().append('<div class="drop-down-pop-up-footer" />');
        var butt = $('<button class="styled_button"><i class="fa fa-lightbulb-o" />Try Again</button>');
        butt.click(function() {
            $('.prompt').html(makePrompt('{pattern}', terms));
        });
        $(pop).parent().find('.drop-down-pop-up-footer').append(butt);
        $(pop).css({
             'width': '600px',
             'height': '300px'
            });
        position(pop.parentNode.parentNode, 'center', 'center');
    });
}

function makePrompt(txt, t) {
    for (var i in t) {
        txt = fillTerm(txt, i, t);
    }
    if (txt.length > 0) {
        txt = txt.split('');
        txt[0] = txt[0].toUpperCase();
        txt = txt.join('');
    }
    return '<textarea style="resize:none;padding:15px;width:100%;height:100%;border:none" >' + txt + '</textarea>';
}

function fillTerm(txt, term, t) {
    while (txt.indexOf('{' + term + '}') != -1) {
        var item = pickOne(t[term]);
        var others = [];
        for (var i = 0; i < t[term].length;i++) {
            if (t[term][i] != item) {
                others.push(t[term][i]);
            }
        }
        txt = txt.replace('{' + term + '}', item);
        txt = txt.replace('[' + term + ']', pickOne(others));
    }
    return txt;
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------API FUNCTIONS-----------------------------------------------
//--------------------------------------------------------------------------------------------------

//==API FUNCTION==//
function pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

//==API FUNCTION==//
function makeGlobalPopup(title, fafaText, darken) {
    var holder = document.createElement('div');
    $('body').append(holder);
    $(holder).addClass('drop-down-pop-up-container');
    $(holder).attr('style', 'position:fixed;z-index:2147483647;left:10px;top:10px');
    $(holder).addClass('global_popup');
    
    var dark = $('<div class="dimmer" style="z-index:1001;" />');
    if (typeof (darken) == 'number') {
        dark.css('opacity', (darken / 100));
    }
    $('#dimmers').append(dark);
    
    var pop = $('<div class="drop-down-pop-up" style="width: auto" />');
    $(holder).append(pop);
    
    var head = document.createElement('h1');
    $(head).css('cursor','move');
    $(pop).append(head);
    if (fafaText != null) {
        $(head).append('<i class="' + fafaText + '" />');
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
    
    var close = document.createElement('a');
    $(close).addClass('close_button');
    $(close).attr('id', 'message_close_button');
    $(close).click(function(e) {
        $(dark).remove();
        $(holder).remove();
    });
    $(head).append(close);
    
    var content = document.createElement('div');
    $(content).addClass('drop-down-pop-up-content');
    $(pop).append(content);
    return content;
}

//==API FUNCTION==//
function position(obj, x, y, buff) {
    if (typeof x == 'string' && x.toLowerCase() == 'center') {
        x = ($(window).width() - $(obj).width()) / 2;
    }
    if (typeof y == 'string' && y.toLowerCase() == 'center') {
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
    
    $(obj).css('top', y + 'px');
    $(obj).css('left', x + 'px');
}