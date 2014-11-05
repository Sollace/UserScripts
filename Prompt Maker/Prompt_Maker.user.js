// ==UserScript==
// @name        Prompt Maker
// @description Adds a button to FimFiction to generate random prompts
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.4.2
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==
var logger = new Logger('Prompt Maker',5)
try {
    run({
    pattern: [
        '{pattern_1}!',
        '{pattern_2}.',
        '{pattern_3}.',
        '{pattern_2} whilst [pattern_2].',
        '{pattern_3} and {pattern_2}.'
    ],
    pattern_1: [
        'Nanananananananaanananananananananananaanananananananananananananan BATMARE',
        'Button\s Mom has got it goin\' on',
        '{name} everywhere',
        '{creature}s everywhere',
        'a horde of {creature_plural} attack {place_or_name}',
        'a horde of {creature_plural} attack {name_nonequestrian}',
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
        '{place} and [place] {action_object}',
        '{place} is {verbed} by {name}',
        'The {enemy_plural} use {power} to {verb_enemy}',
        '{name} and [name] {action}',
        '{name} {name_does}',
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
        '{name} {verbed_2} The Element of {element}',
        '{name} gets a new {bodypart_singular}',
        '{name}\'s {bodypart_singular} is fake',
        '{name}\'s {bodypart_plural} are fake'
    ],
    verbed_2: ['discovers', 'is','breaks','steals','{done_food}','{i_present}'],
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
        'eyebrow {does_object_singular}',
        '{bodypart} {does_object}'
    ],
    bodypart: ['{bodypart_plural}', '{bodypart_singular}'],
    bodypart_plural: [
        'hooves','horns','wings','legs','teeth','wings','eyebrows'
    ],
    bodypart_singular: [
        'cutiemark','hoof','horn','wing','tail','mane','legs','tooth','tongue','dick'
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
        'Appleloosa',
        'Carousel Boutique',
        'Castle of the Two Sisters',
        'Dodge Junction',
        'Everfree Forest',
        'Golden Oak Library',
        'the School House',
        'Sugarcube Corner',
        'Wonderbolt Academy',
        '{name_pony}\'s house',
        'Canterlot',
        'Trottingham',
        'Sweet Apple Acres',
        'Manehatten',
        'Cloudsdale',
        'Prance',
        'Ponyville',
        'Twilight\'s Castle',
        'The Crystal Empire',
        'Frostdale',
        'Canterlot High'
    ],
    place_non_eq: [
        'Earth', 'New York', 'London', 'California', 'The Moon','Africa','Britain','China','Japan','Australia'
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
    name: ['Filly {name_pony}', 'Adult {name_pony_young}', '{name_nonequestrian}', '{name_equestrian}', '{name_inanimate}'],
    name_equestrian: ['{name_pony}', '{name_pony_young}', '{name_nonpony}','The Flim Flam Brothers'],
    name_pony: [
        '{name_pony_first}', 'Princess {name_pony_first}',
        'Bon Bon','Carrot Top','Sunset Shimmer','Shining Armour','Vinyl Scratch','Suri Polomare',
        'Sweetie Belle','Rainbow Dash',
        'Twilight Sparkle','Pinkie Pie','Blinkie Pie','Inky Pie','Maud Pie',
        'Dr. Hooves','Hayseed Turnip Truck','Aunt Orange','Uncle Orange','Goldie Delicious',
        'Cherry Jubilee','Photo Finish','Button\'s Mom','Prince Blue Blood','Sunny Daze','Peachy Pie',
        'Granny Smith','Big Macintosh','Cheese Sandwich','Berry Punch','Night Light','Twilight Velvet',
        'Hoity Toity','Sapphire Shores','Fancy Pants','Daring Do','Prim Hemline','Mayor Mare','Hondo Flanks','Cookie Crumbles',
        'Jet Set','Upper Crust','Fleur Dis Lee','Filthy Rich','Cloud Chaser','Bulk Biceps','Lightning Dust','Ms. Peachbottom','Ms. Harshwhinny','Flash Sentry',
        'Coco Pommel','Silver Shill','Teddie Safari','Nurse Redheart','Doctor Horse','Dr. Hooves','Nurse Ponies',
        'Chancellor Puddinghead','Smart Cookie','Commander Hurricane','Private Pansy','Princess Platinum','Clover the Clever'
    ],
    name_pony_young: [
        '{name_pony_first_young}','Diamond Tiara','Silver Spoon','Babs Seed','The Cake Twins','Button Mash','Berry Pinch'
    ],
    name_inanimate: [
        'Bloomberg','Pinkie\'s imaginary friends','Tom','Mr. Smarty Pants'
    ],
    name_pet: [
        'Angel Bunny','Winona','Opalescence','Gummy','Philomena','Owlowicious','Tank','Peewee','Tiberius','Cerberus'
    ],
    name_nonpony: [
        'Steven Magnet','Steve Magnum',
        'Zecora','Cranky Doodle Donkey','Cranky Doodle Dandy','Matilda','Mulia Mild','Little Strongheart','Chief Thunderhooves','Iron Will','Gustave le Grand',
        'Spike','Sea Breeze','Tirek','Scorpan','Discord','MMMMM','Queen Chrysalis','Spa Ponies','Star Swirl the Bearded','The Ponytones','The Power Ponies','Hum Drum',
        'Adagio Dazzle','Aria Blaze','Sonata Dusk','The Mane-iac','Gilda','Diamond Dog','Ahuizotl','Garble','unnamed {race}','The Wonderbolts','Royal Guard'
    ],
    name_nonequestrian: [
        'Bill Gates','an Alien','The Doctor','The Master','The President','The Servant','knighty','Sethisto',
        'Optimus Prime','Starscream','Iron Man','Batman','The HULK','The HUNK','Roger Moore','Chuck Norris'
    ],
    name_pony_titled: ['Princess {name_pony_first}', '{name_pony_titled_evil}'],
    name_pony_titled_evil: ['King {name_pony_first}', 'Nightmare {name_pony_1}'],
    name_pony_1: ['{name_pony_first}','{name_pony_last}', '{name_pony_first_young}'],
    name_pony_first: [
        'Celestia','Luna','Cadance','Flim','Flam','Cheerilee','Gizmo',
        'Twilight','Applejack','Rarity','Fluttershy','Sombra','Joe',
        'Trixie','Fluffle Puff','Alo','Lotus',
        'Big Mac','Spitfire','sauren','Fleetfoot',
        'Lyra', 'Derpy','Octavia','Roseluck','Thunderlane',
        'Maud','Tenderhoof','Junebug','Flitter','Blossomforth'
    ],
    name_pony_first_young: [
        'Featherweight','Pipsqueak','Snips','Snails','Runble','Dinky','Twist','Nyx','Scootaloo','Applebloom'
    ],
    name_pony_last: ['Belle','Dash','Tiara','Spoon','Moon','Seed','Bon','Pie','Chrysalis'],
    race: [
        'Vampony','Zompony','Alicorn','Bat Pony','Human','Dragon','Changeling','Clone','Breezie',
        'Parasprite','Pheonix','Timberwolf','Fruit Bat','Windigos'
    ],
    race_plural: [
        'Vamponies','Zomponies','Alicorns','Bat Ponies','Humans','Dragons','Changelings','clones',
        'Parasprites','Pheonixes','Timberwolves','Fruit Bats','Windigo'
    ],
    creature_plural: [
        '{creature_0}s','{creature_0}es'
    ],
    creature_singular: [
        '{creature_0}','{creature_0}'
    ],
    creature_0: [
        'Chimera','Cockatrice','Hydra','Manticore','Cragadile','Sea serpent','Tatzlwurm',
        'Diamond Dog'
    ],
    creature_1: [
        'Orthros'
    ],
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
        'Tree of Harmony',
        'bottle',
        'cloud',
        'rainbow',
        'baby',
        'cow',
        'Alicorn Amulet',
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
    action: ['merge', 'switch {acted}', 'share {acted}', 'have sex', 'plot','become separated','meet','meet {repeated}','team up'],
    action_object: ['merge','switch','collide','meet','meet {repeated}','become separated','smash together'],
    repeated: ['again','for the {nth} time'],
    nth: ['first','last','(n)'],
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
} catch (e) {logger.SeverException('UnhadledException: {0}', e);}

//--------------------------------------------------------------------------------------------------
//----------------------------------------FUNCTIONS-------------------------------------------------
//--------------------------------------------------------------------------------------------------

function run(terms) {
    var but = $('<li><a href="javascript:void();"><i class="fa fa-lightbulb-o" /><span>Prompt</span></a></li>');
    $('.user_toolbar ul').first().children('li').last().after(but);
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
    while (txt.indexOf('(n)') != -1) {
        var r = (2 + Math.floor(Math.random() * 20)) + '';
        txt = txt.replace('(n)', r + (r[r.length-1] == '1' ? 'st' : r[r.length-1] == '2' ? 'nd' : r[r.length-1] == '3' ? 'rd' : 'th'));
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
function makeGlobalPopup(title, fafaText, darken, close) {
    if (typeof (close) == 'undefined') close = true;
    var holder = document.createElement("div");
    $("body").append(holder);
    $(holder).addClass("drop-down-pop-up-container");
    $(holder).attr("style", "position: fixed;z-index:2147483647;left:10px;top:10px");
    $(holder).addClass('global_popup');
    
    if (darken) {
        var dark = $('<div class="dimmer" style="z-index:1001;" />');
        if (typeof (darken) == 'number') {
            dark.css('opacity', (darken / 100));
        }
        $('#dimmers').append(dark);
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
    
    var c = $('<a id="message_close_button" class="close_button" />');
    $(head).append(c);
    $(c).click(function(e) {
        if (close) {
            $(dark).remove();
            $(holder).remove();
        } else {
           $(holder).css('display','none');
        }
    });
    
    var content = document.createElement("div");
    $(content).addClass("drop-down-pop-up-content");
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

//==API FUNCTION==//
function Logger(name, l) {
  var test = null;
  var minLevel = 0;
  var paused = false;
  if (typeof (l) == 'number') minLevel = l;
  this.Start = function (level) {
    if (typeof (level) == 'number') minLevel = level;
    if (test == null) {
      Output('===Logging Started===', minLevel + 1);
    }
    test = $('#debug-console');
    paused = false;
    if (!test.length) {
      test = $('<div id="debug-console" style="overflow-y:auto;max-height:50%;max-width:100%;min-width:50%;background:rgba(255,255,255,0.8);position:fixed;bottom:0px;left:0px;" />');
      $('body').append(test);
      test.click(function () {
        $(this).empty();
      });
    }
  }
  this.Stop = function () {
    if (test != null) {
      test.remove();
      test = null;
      Output('===Logging Stopped===', minLevel + 1);
    }
  }
  this.Pause = function () {
    if (!paused) Output('===Logging Paused===', minLevel + 1);
    paused = true;
  }
  this.Continue = function () {
    if (paused) {
      paused = false;
      Output('===Logging Continued===', minLevel + 1);
    }
  }
  this.Log = function (txt, level, params) {
    if (arguments.length > 1) {
      if (typeof arguments[1] == 'string') {
        [].splice.apply(arguments, [1, 0, 0]);
        level = 0;
      }
      for (var i = 2; i < arguments.length; i++) {
        txt = txt.replace(new RegExp('\\{' + (i-2) + '\\}', 'g'), arguments[i]);
      }
    } else {
      level = 0;
    }
    Output(txt, level);
  }
  this.Error = function (txt, params) {
    arguments.splice(1,0,1000);
    this.Log.apply(this,arguments);
  }
  this.SevereException = function (txt, excep) {
    if (excep != 'handled') {
      try {
        var stopped = false;
        if (test == null) {
          stopped = true;
          this.Start();
        }
        if (txt.indexOf('{0}') != -1) {
          SOut(txt.replace('{0}', excep), 2000);
        } else {
          SOut(txt + '<br/>' + except, 2000);
        }
        if (excep.stack != null) SOut(excep.stack, 2000);
        if (stopped) this.Pause();
      } catch (e) {
        alert('Error in displaying Severe: ' + e + '\n' + 'Severe: ' + excep);
      }
      throw 'handled';
    }
  }
  this.Severe = function (txt) {
    try {
      var stopped = false;
      if (test == null) {
        stopped = true;
        this.Start();
      }
      SOut(txt, 2);
      if (stopped) this.Pause();
    } catch (e) {
      alert('Error in displaying Severe: ' + e + '\n' + 'Severe: ' + excep);
    }
  }
  function Output(txt, level) {
    if (!paused) SOut(txt, level);
  }
  function SOut(txt, level) {
    if (level == null || level == undefined) level = 0;
    if (test != null && level >= minLevel) {
      var line = test.children().length;
      if (line > 150) {
        line = 0;
        test.empty();
      }
      test.append('<p style="background: rgba(' + (line % 2 == 0 ? '155,0' : '0,155') + ',0,0.3);">' + (line + 1) + '):' + name + ') ' + txt + '</p>');
      test.stop().animate({
        scrollTop: test[0].scrollHeight
      },800);
    }
  }
}