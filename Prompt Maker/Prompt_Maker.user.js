// ==UserScript==
// @name        Prompt Maker
// @description Adds a button to FimFiction to generate random prompts
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.5
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==
var logger = new Logger('Prompt Maker',5)
try {
    run({
        pattern: [
            '{pattern_0}',
            '{pattern_1}!',
            '{pattern_2}.',
            '{pattern_3}.'
        ],
        pattern_0: [
            '{pattern_1}.',
            'Button\s Mom has got it goin\' on.',
            '{creature_plural} everywhere!',
            '{pattern_2} whilst [pattern_2].',
            '{pattern_2} and {pattern_3}.'
        ],
        pattern_1: [
            'a horde of {creature_plural} attack {place_or_name}',
            'a horde of {creature_plural} attack {name_nonequestrian}',
            '{name_equestrian} meets {fandom}',
            '{name_nonequestrian} is a {fandom_singular}',
            '{race_plural} everywhere',
            '{place} is invaded by {enemy}',
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
            '{name} {verbed_3} a {profession}',
            '{name} {verbed_3} a {race}',
            '{name} is taken to {place_or_name}',
            '{name} tries to {done_food} {food}',
            '{name} {change} {name_or_race}',
            '{name} {verbed_2} The Element of {element}',
            '{name} gets a new {bodypart_singular}',
            '{name}\'s {bodypart_singular} is fake',
            '{name}\'s {bodypart_plural} are fake'
        ],
        verbed_2: ['discovers', 'is','breaks','steals','{done_food}','{i_present}'],
        verbed_3: ['becomes','is','gets turned into'],
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
            'Earth', 'New York', 'London', 'California', 'The Moon','Africa','Britain','China','Japan','Australia',
            'London', 'Yorkshire'
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
        enemy: ['{enemy_plural}', '{enemy_odd}'],
        enemy_plural: [
            '{race_plural}','{enemy_odd}'
        ],
        enemy_odd: [
            'Aliens','Humans','Timelords', 'a horde of zombies'
        ],
        creature_plural: [
            '{creature_0}s','{creature_1}es','Pigasi','{race_plural}',
            'Vampire {creature_0}s','Vampire {creature_1}es'
        ],
        creature_singular: [
            '{creature_0}','{creature_1}','Pigasus','{race}',
            'Vampire {creature_0}','Vampire {creature_1}'
        ],
        creature_0: [
            'Chimera','Cockatrice','Hydra','Manticore','Cragadile','Sea serpent','Tatzlwurm','Minotaur',
            'Quarray eel','Sea serpent','Star spider','Siren','Tantabus','Ursa Major','Ursa Minor','Twittermite',
            'Diamond Dog','Robin','Hornet','Bee','Hedghog','Chimera','Centaur','Fruit Bat','Gargoyle','Jackalope'
        ],
        creature_1: [
            'Orthros','Fox','Draconequus','Cyclops','Orthros'
        ],
        power: [
            'The Element of {element}', 'the magic of {element}'
        ],
        element: [
            'Honesty', 'Love', 'Loyalty', 'Generosity', 'Kindness', 'Magic',
            'Deceit','Hate','Dishonor','Selfishness','Pride','Murder',
            '... Lust','Chaos'
        ],
        object_phrase: [
            '{does_with} a {descriptor} {object}',
            '{does_with} {object}',
            '{done_food}s {food}'
        ],
        descriptor: [
            'big','giant','rotten','nasty','tall','poisoned','infected','supercharged','disgusting','beautiful',
            'majestic','short','tiny'
        ],
        is: [
            'dead',
            'kidnapped',
            'bloated',
            'pregnant',
            'evil',
            'undead',
            'gay',
            'a {a_object}',
            'a kitchen sink',
            'drunk',
            'bored',
            'extremely destructive',
            'extremely stupid',
            'stupid',
            'stuffed'
        ],
        object: [
            'The Internet',
            'The 4th Wall',
            'the Tree of Harmony',
            'the Alicorn Amulet',
            'the Kitchen Sink',
            'MMMMM',
            '{food_1} sandwich',
            '{food_2} sandwich',
            'a {a_object}',
            'an {an_object}'
        ],
        a_object: [
          'filly','rock','bottle','cloud','rainbow','diamond','baby','cow', 'pig'
        ],
        an_object: [
            'icecream sundae'
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
            'hay',
            'milk',
            'chocolate milk',
            '{cheese} cheese'
        ],
        cheese: [
            'block of',
            'slice of',
            'wedge of'
        ],
        profession: ['{pfp}', '{pfp} {pfn}', '{pfn} {pfp}', '{pfnn} {pfp}'],
        pfp: [
            'Spy', 'Farmer', 'Doctor', 'Teacher', 'Dentist', 'Detective',
            'Accountant', 'Politicion', 'Lawyer', 'Singer', 'DJ', 'Cook', 'Baker',
            'Mailmare', 'Milkmare', 'Librarian','Medic'
        ],
        pfn: ['Killer', 'Pimp', 'Slaver', 'Prostitute','Pyromaniac'],
        pfnn: ['Serial Killing', 'Pimping', 'Horrible'],
        action: ['merge', 'switch {acted}', 'share {acted}', 'have sex', 'plot','become separated','meet','meet {repeated}','team up'],
        action_object: ['merge','switch','collide','meet','meet {repeated}','become separated','smash together'],
        repeated: ['again','for the {nth} time'],
        nth: ['first','last','(n)'],
        acted: ['places', 'bodies', 'families', 'jobs', 'brains', 'race'],
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
            'defeats','kidnaps','makes sweet, sweet love to','loves','hates',
            'marries','is','kills','is killed by','shrinks','cheats on'
        ],
        name_does: [
            'travels through space','travels through space and time',
            'uses contraceptives','forgets to use contraceptives',
            '{is_done}',
            '{does_2} {drug}','accidentally {does_3} {drug}',
            'reads {fanfic}','discovers {fanfic}','reacts to {fanfic}','reacts to {subject}',
            '{does_with} a {cult}','accidentally {does_with} a {cult}'
        ],
        cult: ['cult','fandom','creepy fan club','superhero league','villains league'],
        drug: ['drugs','cocaine','acid','salt','apples'],
        does_with: ['forms','forgets','eats','has','cooks','{is_done} on'],
        is_done: ['jumps','falls','chokes','dies','lies','skips','backflips','rolls','has sex','gets wasted'],
        does_object: ['fall off', 'break', 'swell up'],
        does_object_singular: ['falls off', 'breaks', 'swells up'],
        does_2: ['gives up', 'cooks', '{does_3}'],
        does_3: ['takes', 'sells', 'buys', 'invents', 'gives {name}'],
        done_food: ['eat','buy','sell','cook'],
        fanfic: [
           'Cupcakes','My Little Dashie','Five Score Divided By Four','The Molestia Trilogy',
           'Batsy Fluffentuft the Magnificent Becomes an Alicorn','Unicorn Horns Are Made of Heroin',
           '{name_pony}\'s extensive clop collection','a fanfic by {author}',
           'a fanfic about themself'
        ],
        author: ['Kaidan','knighty','The Parasprite','RainbowBob','Vegie','Vengful Spirit','TwistedSpectrum','L','Sollace','Admiral Biscuit','{name_equestrian}'],
        subject: ['Politics','an unexpected power outage','an expected power outage','Equestrai Daily','Equestria After Dark','{fandom}','{name_pony_young}\'s new cutiemark'],
        fandom: ['a {fandom_singular}','{fandom_plural}'],
        fandom_singular: ['Brony','Pegasister','Furry','Anti-Brony','Sonic Fan'],
        fandom_plural: ['Bronies','Pegasisters','Furries','Anti-Bronies','Sonic Fans'],
        name: ['{name_nonequestrian}', '{name_equestrian}', '{name_inanimate}'],
        name_equestrian: ['{name_pony}', '{name_pony_young}','Filly {name_pony}', 'Adult {name_pony_young}', '{name_nonpony}','The Flim Flam Brothers'],
        name_pony: [
            '{name_pony_first}', 'Princess {name_pony_first}',
            'Bon Bon','Carrot Top','Sunset Shimmer','Starlight Glimmer','Shining Armour','Vinyl Scratch','Suri Polomare',
            'Sweetie Belle','Rainbow Dash',
            'Twilight Sparkle','Pinkie Pie','Blinkie Pie','Inky Pie','Maud Pie','Marble Pie','Limestone Pie',
            'Igneous Rock',
            'Dr. Hooves','Hayseed Turnip Truck','Aunt Orange','Uncle Orange','Goldie Delicious',
            'Cherry Jubilee','Photo Finish','Button\'s Mom','Prince Blue Blood','Sunny Daze','Peachy Pie',
            'Granny Smith','Big Macintosh','Cheese Sandwich','Berry Punch','Night Light','Twilight Velvet',
            'Hoity Toity','Sapphire Shores','Fancy Pants','Daring Do','Prim Hemline','Mayor Mare','Hondo Flanks','Cookie Crumbles',
            'Jet Set','Upper Crust','Fleur Dis Lee','Filthy Rich','Cloud Chaser','Bulk Biceps','Lightning Dust','Ms. Peachbottom','Ms. Harshwhinny','Flash Sentry',
            'Coco Pommel','Silver Shill','Teddie Safari','Nurse Redheart','Doctor Horse','Dr. Hooves','Nurse Ponies',
            'Chancellor Puddinghead','Smart Cookie','Commander Hurricane','Private Pansy','Princess Platinum','Prince Platinum','Clover the Clever',
            'The Venerable Bowrang Dash','Sassy Saddles','Batsy Fluffentuft'
        ],
        name_pony_young: [
            '{name_pony_first_young}','Diamond Tiara','Silver Spoon','Babs Seed','Cake Twins','Button Mash','Berry Pinch','Pound Cake','Pumpkin Cake','Princess Flurry Heart'
        ],
        name_inanimate: [
            'Bloomberg','Pinkie\'s imaginary friend','Tom','Mr. Smarty Pants',
            'Maud\'s pet rock','Boulder','Diamond Tiara\'s tiara','Trixie\'s hat'
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
            'Bill Gates','Steve Jobs','an Alien','The Doctor','The President','knighty','Sethisto','Autobots','Decepticons',
            'Optimus Prime','Iron Man','Batman','The HULK','Roger Moore','Chuck Norris','Scarlet Johanson',
            'Luke Skywalker','Darth Vader','Yoda','Lance Armstrong','Bruce Willace','Batman','Britney Spears','Robin Williams',
            'John De Lancy','M.A Larson'
        ],
        name_pony_titled: ['Prince {name_pony_first}','Princess {name_pony_first}', '{name_pony_titled_evil}'],
        name_pony_titled_evil: ['King {name_pony_first}', 'Nightmare {name_pony_1}'],
        name_pony_1: ['{name_pony_first}','{name_pony_last}', '{name_pony_first_young}'],
        name_pony_first: [
            'Celestia','Luna','Cadance','Flim','Flam','Cheerilee','Gizmo',
            'Twilight','Applejack','Tatzljack','Rarity','Fluttershy','Sombra','Joe',
            'Trixie','Fluffle Puff','Aloe','Lotus',
            'Big Mac','Spitfire','sauren','Fleetfoot',
            'Lyra', 'Derpy','Octavia','Roseluck','Thunderlane',
            'Maud','Tenderhoof','Junebug','Flitter','Blossomforth',
            'Tumblrina','Diabetty'
        ],
        name_pony_first_young: [
            'Featherweight','Pipsqueak','Snips','Snails','Rumble','Dinky','Twist','Nyx','Scootaloo','Applebloom'
        ],
        name_pony_last: ['Belle','Dash','Tiara','Spoon','Moon','Seed','Bon','Pie','Chrysalis'],
        race: [
            'Vampony','Zompony','Alicorn','Bat Pony','Human','Dragon','Changeling','Clone','Breezie',
            'Centaur','Chimera','Cockatrice','Griffon',
            'Bugbear','Parasprite','Pheonix','Timberwolf','Fruit Bat','Windigos'
        ],
        race_plural: [
            'Vamponies','Zomponies','Alicorns','Bat Ponies','Humans','Dragons','Changelings','clones','Breezies',
            'Centaurs','Chimeras','Cockatrices','Griffons',
            'Bugbears','Parasprites','Pheonixes','Timberwolves','Fruit Bats','Windigo'
        ]
    });
} catch (e) {logger.SeverException('UnhandledException: {0}', e);}

//--------------------------------------------------------------------------------------------------
//----------------------------------------FUNCTIONS-------------------------------------------------
//--------------------------------------------------------------------------------------------------

function run(terms) {
    var but = $('<li><a href="javascript:void();"><i class="fa fa-lightbulb-o" /><span>Prompt</span></a></li>');
    $('.user_toolbar ul').first().children('li').last().after(but);
    but.click(function() {
        var pop = makeGlobalPopup('Random Prompt', 'fa fa-lightbulb-o', 0);
        pop.content.append('<span class="prompt">' + makePrompt('{pattern}', terms) + '</span>');
        pop.content.parent().append('<div class="drop-down-pop-up-footer" />');
        var butt = $('<button class="styled_button"><i class="fa fa-lightbulb-o" />Try Again</button>');
        butt.click(function() {
            $('.prompt').html(makePrompt('{pattern}', terms));
        });
        pop.content.parent().find('.drop-down-pop-up-footer').append(butt);
        pop.content.css({
             'width': '600px',
             'height': '300px'
            });
        pop.position('center', 'center');
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
    if (typeof (darken) == 'undefined') darken = 100;
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
            position(holder, e.clientX - x, e.clientY - y);
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
            $(dark).fadeOut('fast', function () {
                $(this).remove()
            });
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