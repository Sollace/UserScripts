// ==UserScript==
// @name        Interactive Ponies
// @description Adds more Interactive Ponies to FimFiction.net
// @author      Sollace
// @namespace   fimfiction-sollace
// @icon        http://fc01.deviantart.net/fs71/f/2014/077/f/2/seabreeze_floating_2_by_botchan_mlp-d7are6y.gif
// @include     http://justsitback.deviantart*
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/jquery-1.8.3.min.wrap.js
// @version     1.9.1
// @grant       none
// ==/UserScript==

/*---Fix for window_focused not being reset. Knighty pls.---*/
if (!window.__window_focused_fix) {
    window.__window_focused_fix = true;
    $(window).on('focus', function() {
        window.window_focused = true;
    });
}

/*\--------------------------------------------------------------------------------------------------
|*|  Syntaxes:
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path], domain)
|*|  * docCookies.hasItem(name)
\*/ var docCookies={
getItem: function(sKey){return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(sKey).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1")) || null;},
setItem: function(sKey,sValue,vEnd,sPath,sDomain,bSecure){if(!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey))return false;var sExpires = "";if(vEnd){switch(vEnd.constructor){case Number: sExpires=vEnd === Infinity ?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+vEnd;break;case String: sExpires="; expires="+vEnd;break;case Date: sExpires="; expires="+vEnd.toUTCString();break;}}document.cookie=encodeURIComponent(sKey)+"="+encodeURIComponent(sValue)+sExpires+(sDomain ?"; domain="+sDomain:"")+(sPath ?"; path="+sPath:"")+(bSecure ?"; secure":"");return true;},
removeItem: function(sKey,sPath,sDomain){if(!sKey || !this.hasItem(sKey))return false;document.cookie=encodeURIComponent(sKey)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(sDomain ?"; domain="+sDomain:"")+(sPath ?"; path="+sPath:"");return true;},
hasItem: function(sKey){return(new RegExp("(?:^|;\\s*)"+encodeURIComponent(sKey).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=")).test(document.cookie);}};
//----------------------------------------------------------------------------------------------------
function pickOne(arr, rare){
    if(rare != null && rare != undefined && Math.random() == 0.5)return rare[Math.floor(Math.random()*rare.length)];
    return arr[Math.floor(Math.random()*arr.length)];}
function makeStyle(input, id) {
    while (input.indexOf('  ') != -1) input = input.replace(/  /g, ' ');
    var style = document.createElement('style');
    $(style).attr('type', 'text/css');
    $(style).append(input);
    if (id != undefined && id != null) style.id = id;
    $('head').append(style);
}
function setDocCookie(name, val) {
    docCookies.removeItem(name, "/", "/", "fimfiction.net");
    docCookies.setItem(name, val, Infinity, "/", "fimfiction.net");
}

if (window.top != window) {
    var embeds = document.getElementsByTagName('EMBED');
    if (embeds && embeds.length) {
        document.body.innerHTML = document.body.innerHTML.replace(/\<embed /g, '<embed wmode="opaque" menu="false" ');
    }
}
if (document.location.href.indexOf("http://www.fimfiction.net/") == 0 || document.location.href.indexOf("https://www.fimfiction.net/") == 0)
    //--------------------------------------------------------------------------------------------------
    //--------------------------------------SCRIPT START------------------------------------------------
    //--------------------------------------------------------------------------------------------------
    var stateMap = {
        'cloud_sleep_right.gif': 'sleep','cloud_sleep_left.gif': 'sleep',
        'dashing_right.gif': 'dash','dashing_left.gif': 'dash',
        'stand_rainbow_right.gif': 'stand','stand_rainbow_left.gif': 'stand',
        'fly_rainbow_right.gif': 'fly','fly_rainbow_left.gif': 'fly',
        'trotcycle_rainbow_right.gif': 'trot','trotcycle_rainbow_left.gif': 'trot'
    };
    var pinkiePie = new SpecialPony('Pinkie Pie', 'pp', 4,"Are you loco in the coco?;Boring;Forevaah!;*ghasp*;*giggle*;Hey, that's what I said!;Hey, that's what she said!;Hi, I'm Pinkie Pie!;...and that, is how Equestria was made;I never felt joy like this before;Oatmeal, are you crazy?;Is there any good storie about me here?;I heard there was cupcakes here but I don't see any;How do you read cupcakes anyway?;Oki doki loki;Pinkie Pie style;This may look like it's fun but it's not;You really need to get out more", function(img, pon) {
        switch (img) {
            case 'sleep4': 
            case 'sleep': return buildRef(pon, 'sleep');
            case 'dash4': return buildRef(pon, 'bounce_n_n');
            case 'dash': return buildRef(pon, 'bounce');
            case 'trot4': return buildRef(pon, 'trot_n_n');
            case 'trot': return buildRef(pon, img);
            case 'stand4':
            case 'stand': return buildRef(pon, 'stand');
            case 'fly4':
            case 'fly': return buildRef(pon, 'fly');
            case 'fly1': return buildRef(pon, 'choppa');
            case 'trot2': return buildRef(pon, 'crown');
            case 'sleep3': return /*chicken*/'//fc03.deviantart.net/fs71/f/2011/246/5/a/pinkie_pie_with_scootaloo_by_deathpwny-d48495a.gif';
            case 'fly3':
            case 'trot3':
            case 'dash3':
            case 'stand3': return /*dance*/'//fc01.deviantart.net/fs70/f/2011/261/a/f/pinkie_pie_dancing_by_deathpwny-d4a46i0.gif';
        }
    }, { 3: "Oppan Pinkie Style;Pinkie Style;Eh~ Sexy Pony;Pinkie Pie Time;What does the Pony say? Chipi-chi-pow-chippy-cheep-chip-chip" });
    var Ponies = [
        Spacer('Mane Six', new DummyPony('Rainbow Dash')),
        offset(new SpecialPony('Twilight Sparkle', 'twi', 6,"Reading is something everypony can enjoy, if they just give it a try.;*books horse noises*;Ah, hello;All the ponies in this town are crazy;Are you crazy?!;Dear Princess Celestia...;I don't get it;It's the perfect plan;Look out here comes Tom!;No really;Please don't hate me;This is my book and I'm gonna read it!;Tough love, baby;Yesyesyes;Your faithful student...;Books!;Spiiike!!;I've got to write a letter to the princes;For SCIENCE!!", function(img,pon) {
            switch (img) {
                case 'sleep': return buildRef(pon, 'read');
                case 'dash': return buildRef(pon, img);
                case 'trot3':
                case 'trot': return buildRef(pon, 'trot');
                case 'trot5': return '//orig03.deviantart.net/97df/f/2016/103/e/8/twilight_sparkle__equestria_girls__trotting_by_botchan_mlp-d9ysgbi.gif';
                case 'stand': return buildRef(pon, img);
                case 'trot2': return buildRef(pon, 'owl');
                case 'stand4': return buildRef(pon, 'snap');
                case 'stand5': return /*eqg*/'//orig11.deviantart.net/5ef2/f/2016/103/8/a/twilight_sparkle__equestria_girls__idle_by_botchan_mlp-d9ysg33.gif';
            }
        }), function(el, state) {
            if (state == 'trot' && this.getState() == 1 || (state == 'stand' && this.getState() == 3)) {
                el.css('margin-top', '-25px');
            }
            if ((state == 'trot'  || state == 'stand') && this.getState() > 3) {
                el.css('margin-top', '-25px');
            }
        }),
        new SpecialPony('Princess Twilight', 'ptwi', 4, "Reading is something everypony can enjoy, if they just give it a try.;Wait a minute, I think I get it.;Huh? I'm pancake...I mean awake!;Just put the hay in the apple and then eat the candle, hm?;*books horse noises*;This is the game I am meant to play as a princess of Equestria!;Ah, hello;All the ponies in this town are crazy;Are you crazy?!;Dear Princess Celestia...;I don't get it;It's the perfect plan;Look out here comes Tom!;No really;Please don't hate me;This is my book and I'm gonna read it!;Tough love, baby;Yesyesyes;Your faithful student...;Books!;Spiiike!!;I've got to write a letter to the princes;For SCIENCE!!", function(img, pon) {
            switch (img) {
                case 'sleep': return buildRef('twi', 'read');
                case 'dash': return buildRef(pon, 'trot');
                case 'fly':
                case 'trot':
                case 'stand': return buildRef(pon, img);
                case 'trot2': return buildRef(pon, 'trot_w');
                case 'fly3': return buildRef(pon, 'fly_d');
                case 'dash3': return buildRef(pon, 'zoom');
                case 'trot3': return buildRef(pon, 'trot_d');
                case 'stand3': return buildRef(pon, 'dress');
                case 'trot4': return buildRef(pon, 'trot_d_w');
            }
        }),
        new Pony('Applejack', 'aj', "All yours partner;Be ready for a ride;Can you ever forgive me?;Can't hear you, I'm asleep;Cock-a-doodle-doo;Don't you use your fancy mathematics to muddle the issue;Helping the ponyfolks;Hmmmm, nah;Hoho there lover boy.;I'm Applejack;That's what all the fuss is about?;We don't normally wear clothes;What in tarnation!?;What in the hay is that supposed to mean?;You're welcome;Yeehaw!!;Ama buck, ama buck, ama buck some apples all day;Ah got mah hat in an apple eatin' competition;Ah can't tell a lie... so no", function(img, pon) {
            switch (img) {
                case 'sleep': return /*sleep*/'//fc01.deviantart.net/fs71/f/2012/215/a/1/applejack_sleeping_by_starsteppony-d59ovro.gif';
                case 'dash': return /*dash*/'//fc01.deviantart.net/fs71/f/2013/111/d/a/applejack___galloping_by_rj_p-d62js4h.gif';
                case 'trot':
                case 'stand': return buildRef(pon, img);
            }
        }),
        new SpecialPony('Rarity', 'rar', 1, "Darling, would you bend over please?;Afraid to get dirty;But I thought you wanted whining!;Crime against fabulosity;Doesn't even make sense;Gently please;How can you be so insensitive?;I'm so pathetic;It. Is. On.;Ooooooooooooooooooooooooooo;Pruney Hooves!!;Take that, you ruffian;You look smashing;This, is whining;EMERALDS?! What was I thinking? Let me get you some rubies!;Look upon me Equestria, for I am Rarity!;Why do I have to pull it?;Isn't friendship magic?!;Mules are ugly. Are you saying that I too am ugly? *cries*", function(img, pon) {
            switch (img) {
                case 'sleep':
                case 'trot':
                case 'stand': return buildRef(pon, img);
                case 'dash': return buildRef(pon, 'trot');
                case 'fly2': return buildRef(pon, 'fly');
            }
        }),
        new Pony('Rari-hic', 'fpr', "I love mud!!!;I luv bein' covered in mud!!!!! *splat*;Come on, ram thing!!;Why, hello, yaal!;I do declare-;Grumble grumble;I don't know what youra gettin' aht.;I have a hootinani of a festival ta put ta gether.;Moar is moar is like I say.;Gewd fer you.;I coudn't care less how I look, long as I get there chores done.;Yes in deedi doodle.;Mah mane is fulla dust an split ends.;Mah hoofs is cracked an dry from dem fields.;I wear droopy drawers!;*donkey sounds*", function(img) {
            switch(img) {
                case 'stand': return /*stand*/'//fc04.deviantart.net/fs71/f/2014/100/3/3/farmpony_rarity_idle_by_botchan_mlp-d7dx8mn.gif';
                case 'sleep': return /*sleep*/'//fc01.deviantart.net/fs71/f/2014/106/5/7/farmpony_rarity_scratching_her_head_by_botchan_mlp-d7ep6yl.gif';
                case 'trot':
                case 'dash': return /*trot*/'//fc06.deviantart.net/fs71/f/2014/099/5/8/farmpony_rarity_trotting_by_botchan_mlp-d7dskt9.gif';
            }
        }),
        isOnDay(31, 10) ?
        attachEvents(alias('Pinkamena', sleepless(new SpecialPony('Pinkie Pie', 'pm', 1, "I'm so happy to meet you! Rainbow Dash has been oh, so lonely. Hehe;Can we be friendss?;I only make cupcakes with my...    Very.   Besst   friendss...;Hehehe...;Happy Nightmare Night.;*sneer*;I don't need my friends... *twitch*;My friends don't like my parties and they don't wanna be my friends anymore...;Oui! Zhat is correct, madame.;I know how it goes, all right!;I'm just glad none ah them ponies showed up!", function(img) {
            switch (img) {
                case 'sleep':
                case 'stand': return /*stand*/'//fc07.deviantart.net/fs71/f/2011/120/e/b/pinkamina_for_desktop_ponies_by_supersaiyanmikito-d3fagbu.gif';
                case 'dash':
                case 'trot': return /*trot*/'//fc04.deviantart.net/fs70/f/2012/176/8/b/pinkamina_trotting_sprite_by_supersaiyanmikito-d54vpvw.gif';
            }
        }))), {
            'mouseenter': function () {
                if (Math.random() * 40 <= 5) {
                    this.Speak("You're my besst friend;Hehehe;Hehehe slicey slicey;Pinkie Pie doesn't live here any more. He. He. He.");
                }
            },
            'tick': function (e) {
                if (Math.random() * 40 <= 1) {
                    var old = this.ponyType;
                    var slave = attachEvents(pinkiePie, {
                        'mouseenter': function () {
                            this.Speak("Help. Me.");
                        },
                        'tick': function () {
                            if (this.ponyType().timeout-- <= 0) this.ponyType = old;
                        }
                    });
                    slave.timeout = Math.random() * 10;
                    this.ponyType = function () {
                        return slave;
                    }
                }
            }
        }) : pinkiePie,
        isOnDay(31, 10) ? attachEvents(alias('Flutterbat', sleepless(new Pony('Fluttershy', 'flutb', "Hiss~", function(img) {
            switch (img) {
                case 'sleep': return /*hang*/'http://orig11.deviantart.net/d520/f/2014/170/3/4/flutterbat_hanging_by_botchan_mlp-d7n1da6.gif';
                case 'dash':
                case 'trot': return /*trot*/'//fc09.deviantart.net/fs71/f/2014/170/2/f/flutterbat_trotting_by_botchan_mlp-d7n10eg.gif';
                case 'stand': return /*stand*/'//fc01.deviantart.net/fs70/f/2014/170/3/1/flutterbat_idle_by_botchan_mlp-d7n1d8m.gif';
                case 'fly': return /*fly*/'//fc04.deviantart.net/fs70/f/2014/170/d/8/flutterbat_flying_by_botchan_mlp-d7n10fa.gif';
            }
        }))), {
            'mouseenter': function() {
                if (Math.random() * 40 <= 5) this.Speak("...apples...;*bites*");
            }
        }) : attachEvents(new Pony('Fluttershy', 'flut', "That...big...dumb...meanie!;There is nothing fun about Dragons. Scary: yes. Fun: NO!;...who's Applejohn?;Baby steps, everypony. Baby steps;*cries*;....;I'd like to be a tree;I am so frustrated;Sometimes I wish I was a tree;I don't wanna talk about it;I'm Fluttershy;I'm so sorry to have scared you;I'm the world champion you know;Oh, my;Oopsie;yay;You rock, woohoo;You rock, Tom;You're the cutest thing ever;Pretty please?;You're going to love me;You're such a loudmouth;*squee*",
                                   function(img, pon) {
            switch (img) {
                case 'sleep':
                case 'dash':
                case 'trot':
                case 'stand':
                case 'fly': return buildRef(pon, img);
            }
        }), {
            'mouseenter': function() {
                if (Math.random() * 40 <= 5) this.Speak("*blushes*;Um, uh, oh my;...ow");
            }
        }),
        Spacer('Secondary/Background Ponies', new Pony('Sunset Shimmer', 'sss', "Sorry it had to be this way... princess;This looks terrible!;There should be more streamers and fewer balloons;You country folk really aren't that bright;Where is this Twilight Sparkle?;Spoiler alert-;I'm sorry. I'm so sorry. I didn't know there was another way;A demon. I turned into a raging she-demon;It wasn't a fit of jealous rage!;I also play guitar;Dear Princess Twilight...;Hmpf. I have better things to do than socialize;I deserve to stand beside you and be your equal... if not your better. Make me a princess;Well, well, this is an interesting development;Believe me... I've got everything I need to know about you;I'm going to rule this school once I get that crown!", function(img, pon) {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'trot':
                case 'dash': return buildRef(pon, img);
            }
        })),
        new Pony('Starlight Glimmer', 'sg', "That seems a bit extreme;QUIET! :starlightrage:;New friends!?;Maybe I'll just force friendships by magically enslaving the entire population of Ponyville! ... That was a joke;Ugh, I am never gonna find my way around this place!;How many other ponies can boast being Twilight's apprentice?;Stop stressing... Stop stressing!;Goddammit Trixie;All adventures are equal to all other adventures;Please enjoy our little corner of Equestria. We're all quite fond of it;In sameness, there is peace;Exceptionalism is a lie;Difference is frustration;Choose equality as your special talent", function(img) {
            switch (img) {
                case 'sleep': return 'http://orig12.deviantart.net/9894/f/2016/129/0/5/starlight_glimmer_munching_popcorn_by_botchan_mlp-da1yivf.gif';
                case 'stand': return 'http://orig00.deviantart.net/09be/f/2016/087/4/2/starlight_glimmer_idle_by_botchan_mlp-d9wrkr4.gif';
                case 'trot':
                case 'dash': return 'http://orig11.deviantart.net/b121/f/2016/087/5/d/starlight_glimmer_trotting_by_botchan_mlp-d9wrkqw.gif';
            }
        }),
        new SpecialPony('Vinyl Scratch', 'vs', 1, "Catch the beat!;Let's party!;*UNTS UNTS UNTS UNTS*;Feel the beat!;Wait till you see my bass cannon!", function(img, pon) {
            switch (img) {
                case 'sleep':
                case 'dash':
                case 'trot':
                case 'stand': return buildRef(pon, img);
                case 'sleep_ac1':
                case 'stand_ac1': return buildRef(pon, 'deck');
            }
        }, {
            1: "Oh this, it's just my BASS CANNON!;Rock on!;Let's have some WUBS!;*WUB WUB WUB WUB*;Crank it up!;I do my dishes with WUBS!;Toothpaste? I don't need that, I have WUBS!;*BOOMWOOM-BOOMWOOM*",
            'effect': {
                'target': '.speech_container',
                'label': 'animation',
                'value': 'wub 1.5s infinite alternate'}}),
        new Pony('Octavia', 'oc', "...;......;........;I am Octavia;Hmph;Practice, practice, practice;*yawn* Oh, my. I'm so terribly sorry. Vinyl has kept me up all night long with her incessant wubs",
                 function(img) {
            switch (img) {
                case 'sleep': return /*play*/'//fc09.deviantart.net/fs71/f/2013/111/c/c/octavia___cello_by_rj_p-d62jtu9.gif';
                case 'dash':
                case 'trot': return /*trot*/'//fc07.deviantart.net/fs71/f/2013/111/1/a/octavia___trotting_by_rj_p-d62jtcw.gif';
                case 'stand': return /*stand*/'//fc03.deviantart.net/fs71/f/2013/111/0/7/octavia___standing_by_rj_p-d62jsvr.gif';
            }
        }),
        sleepless(new Pony('Zephyr Breeze', 'zb', "Stupid sticks...;Name's Zephyr Breeze. It's an honour to meet me;Ponies see me. They hating;You know you love me;My big sis is so gullab- Adorable;What a chump;Guess who's home!;Ponies say I must shave. But I don't listen;You don't have to come up with some excuse to hang out with me", function(img) {
            switch (img) {
                case 'sleep':
                case 'stand': return /*stand*/ '//orig07.deviantart.net/29ff/f/2016/174/d/b/zephyr_breeze_idle_by_botchan_mlp-da7cajg.gif';
                case 'dash':
                case 'trot': return /*trot*/ '//orig04.deviantart.net/a010/f/2016/174/c/6/zephyr_breeze_trotting_by_botchan_mlp-da7calp.gif';
                case 'fly': return /*fly*/ '//orig15.deviantart.net/22ee/f/2016/174/a/a/zephyr_breeze_flying_by_botchan_mlp-da7f3fw.gif';
            }
        })),
        sleepless(new Pony('Saffron Masala', 'sm', "I'm Saffron Masala, the chef at The Tasty Treat, the most exotic cuisine in Canterlot;Would you like to hear about the specials?", function(img) {
            switch (img) {
                case 'sleep':
                case 'stand': return /*stand*/'//orig00.deviantart.net/e908/f/2016/166/f/8/saffron_masala_idle_by_botchan_mlp-da6dlwo.gif';
                case 'trot':
                case 'dash': return /*trot*/'//orig11.deviantart.net/179e/f/2016/166/6/d/saffron_masala_trotting_by_botchan_mlp-da6dlyr.gif';
            }
        })),
        sleepless(new Pony('Coriander Cumin', 'cuc', 'Ishktabible;[unenthusiastic] Welcome to The Tasty Treat. You can eat here if you want. Or not. Who cares? ', function(img) {
            switch (img) {
                case 'stand': return /*stand*/ '//orig02.deviantart.net/17f2/f/2016/173/3/d/coriander_cumin_idle_by_botchan_mlp-da7ak7v.gif';
                case 'trot':
                case 'sleep':
                case 'dash': return /*trot*/ '//orig01.deviantart.net/22f0/f/2016/173/3/e/coriander_cumin_trotting_by_botchan_mlp-da7ak8k.gif';
            }
        })),
        attachEvents(new SpecialPony('Lyra Heartstrings', 'lh', 2, "Where's Bon-Bon?;Bon-Bon~;Ponies say I'm strange, but that's just because they don't understand;I just know humans exist;This would be so much easier if only I had hands;Ugh, this hair is so itchy...;*humming* My Little Human, My Little Human...", function(img, pon) {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, img);
                case 'dash':
                case 'trot': return buildRef(pon, 'trot');
                case 'stand1': return buildRef(pon, 'sit');
                case 'stand2': return buildRef(pon, 'leap');
            }
        }, {
            'effect': {
                'target': 'self',
                'label': 'cursor',
                'value': 'pointer'
            }
        }), {
            'mouseover': function() {
                if (Math.random() * 40 <= 5) {
                    this.Speak("H-ha-ha-HANDS!;Is that a.... hand!;Ohmigosh it's a hand");
                }
            }
        }),
        new Pony('Bon-Bon', 'bb', "Name's Drops, Agent, Sweetie Drops, but everypony around here just calls me Bon-Bon;I'm Bon-Bon. I make, uh, bon bons;Please tell me there's no bug bears here;Oh, Lyra~;Lyra!;I didn't put those in my bag;Is Fluttershy still here? We heard Fluttershy was here!;Go ahead, try one of your jokes out on me! I laugh at everything", function(img, pon) {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, img);
                case 'dash':
                case 'trot': return buildRef(pon, 'trot');
            }
        }),
        attachMemory(attachEvents(new SpecialPony('Derpy Hooves', 'duh', 3, "I messed up big time in those invitions Doc;Muffins!;I messed up everything for Cranky's wedding...;Hi;Muffins...;*waves*;Muffins?;I just don't know what went wrong;Muffin!;Hi, I'm Ditzy;I'm Derpy;Derp;Ooh bubbles;What you talkin' about;Heehee;Oh, you;Ponies feel bad cause of my eyes;*squee*;I'm on the weather team you know;Ima Derp, Derp, Derp...;I'm confused;Doctor?", function(img) {
            switch (img) {
                case 'sleep3':
                case 'sleep': return /*sleep*/'//fc06.deviantart.net/fs71/f/2013/111/7/0/derpy_hooves___sleeping_by_rj_p-d62jl7t.gif';
                case 'stand': return /*stand*/'//fc03.deviantart.net/fs71/f/2013/111/2/9/derpy_hooves___standing_by_rj_p-d62jahk.gif';
                case 'dash3':
                case 'dash': return /*dash*/'//fc08.deviantart.net/fs71/f/2013/111/c/4/derpy_hooves___walking_wing_by_rj_p-d62jg89.gif';
                case 'trot3':
                case 'trot': return /*trot*/'//fc04.deviantart.net/fs70/f/2013/111/e/1/derpy_hooves___trotting_by_rj_p-d62jfcp.gif';
                case 'dash1': 
                case 'fly3':
                case 'fly': return /*fly*/'//fc02.deviantart.net/fs70/f/2013/111/2/f/derpy_hooves___flying_by_rj_p-d62jha8.gif';
                case 'stand1': return /*hover*/'//fc08.deviantart.net/fs71/f/2013/111/8/3/derpy_hooves___hovering_by_rj_p-d62jiai.gif';
                case 'stand2': return /*hover_inv*/'//fc08.deviantart.net/fs71/f/2013/111/9/7/derpy_hooves___hovering_upside_down_by_rj_p-d62jk4w.gif';
                case 'dash2': 
                case 'fly2': return /*sleep_inv*/'//fc01.deviantart.net/fs71/f/2013/111/b/f/derpy_hooves___flying_upside_down_by_rj_p-d62jj01.gif';
                case 'sleep2': return /*sleep*/'//fc06.deviantart.net/fs71/f/2013/111/7/0/derpy_hooves___sleeping_by_rj_p-d62jl7t.gif';
                case 'stand3': return /*muffin*/'//orig11.deviantart.net/c2cf/f/2013/111/9/9/derpy_hooves___muffin_by_rj_p-d62jprf.gif';
            }
        }, {
            1: "Rainbow Dash says I must be careful around clouds;Dark clouds make Derpy go ouchie;I'm on the weather team you know;Ahoy!;Nyan nyan nyan nyan Ni hao nyan;One... Two... Muffin! Four...;Squee!",
            2: "Call me Dr. Derp;I have a PHD you know;My bubble theory saved Equestria 30,000 bits!;I derp, therefore I am;If a tree falls and nopony is there to hear it. Derp?;The meaning of life is.... ooh a MUFFIN!",
            'effect': {'level': 2,
                       'target': '.speech',
                       'label': 'transform',
                       'value': 'scale(-1,-1)'}}),{
            'mouseover': function() {
                if (Math.random() * 80 <= 5) {
                    this.ponyType().setMemory('explode', true);
                    this.Speak('Press M for a surprise!');
                }
            },
            'tick': function() {
                if ($('.muffin').length) {
                    if (!this.container.hasClass('muffin')) {
                        this.pastState = {
                            'container': this.container,
                            'target_x': this.target_x
                        }
                        var c = $('.muffin').first();
                        var offset = c.offset();
                        this.UpdateMouse(offset.left + c.width()/2, offset.top + c.height()/2, c);
                    }
                    var difX = this.target_x - this.x;
                    var difY = (this.container.offset().top + this.container.height()/2) - this.y;
                    if (Math.sqrt(difX*difX + difY*difY) < this.dom_element.height()/3 + 10) {
                        this.container.remove();
                        this.container = this.pastState.container;
                        this.target_x = this.pastState.target_x;
                        this.pastState = null;
                    }
                }
                return true;
            },
            'keydown': function(e) {
                var pony = this.ponyType();
                if (e.keyCode == 77 && pony.getMemory('explode')) {
                    if (!$('input:focus, textarea:focus').length) {
                        pony.setMemory('explode', false);
                        for (var i = 0; i < 20; i++) {
                            new Particle('<div class="muffin" />', this.x, this.y, (Math.random() * 50) - 25, (Math.random() * 50) - 25);
                        }
                        this.x = this.y = 0;
                        this.dom_element.find('div.speech').fadeOut();
                        this.Say('');
                    }
                }
            }
        }), {'explode': false}),
        new SpecialPony('Doctor Hooves', 'dr', 10, "Great Wickering Stallions!;Did you know there was a spell for time travel? I wish I'd known that...;I'll try my hardest not to die, honest;Not impossible. Just... a bit unlikely;I'm always alright;Timey wimey, spacey wacey;Briliant! You are briliant!;Fantastic!;Allons-y!;Don't mind me, off to save time and space;Trust me. I'm the Doctor;Eh, no thanks;Would you please leave me alone!", function(img, pon) {
            switch (img) {
                case 'sleep':
                case 'tand': return buildRef(pon, img);
                case 'dash':
                case 'trot': return buildRef(pon, 'trot');
                case 'stand8': return buildRef(pon, 'fez');
                case 'dash8':
                case 'trot8': return /*trot_fez*/'//fc00.deviantart.net/fs70/f/2014/058/5/4/dr_hooves__fez_walk_by_comeha-d786hmv.gif';
            }
        }),
        new Pony('Spitfire', 'wbsf', "Lets go, Wonderbolts!;Wanna come hang out with us?;Hey, I know you!;Looks like your skill saved us again;Rainbow Dash has heart and determination. I have no doubt she'll get in some day;*SWAG*;Please, no autographs;Dash thinks she's fast, we'll have to see about that;I'll give it to ya straight kid...;Why yes, I am a WonderBolt;I'm Spitfire™;Only the best-of-the-best make it out alive;I like ya kid;Lose? Pfft, this me you're talkin' to;Leave it to the professionals", function(img, pon) {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'dash':
                case 'trot':
                case 'fly': return buildRef(pon, img);
            }
        }),
        //Soarin
        //Thunderlane
        //Fleetfoot
        (function(pony) {
            var Mode = Math.floor((Math.random() * 100) % 4);
            pony.__getSprite = pony.getSprite;
            pony.getSprite = function(elem, face, base, url) {
                var other = this.getMemory('disguise');
                if (other && this.cache.ready) return other.getSprite(elem, face, base, url);
                return this.__getSprite(elem, face, base, url);
            };
            pony.__cssImages = pony.cssImages;
            pony.cssImages = function(elem, face) {
                var other = this.getMemory('disguise');
                if (other) return other.cssImages(elem, face);
                return this.__cssImages(elem, face);
            }
            pony.__bakeGif = pony.bakeGif;
            pony.bakeGif = function(url, suffex, cache) {
                return this.__bakeGif(url, suffex == '' ? Mode : suffex, cache);
            };
            pony.cacheSprites = function(other) {
                if (other == this) return null;
                this.cache.cache(other.bakeSprite('sleep'));
                this.cache.cache(other.bakeSprite('dash'));
                this.cache.cache(other.bakeSprite('stand'));
                this.cache.cache(other.bakeSprite('trot'));
                this.cache.cache(other.bakeSprite('fly'));
                return other;
            };
            return pony;
        })(attachCache(attachMemory(attachEvents(new Pony('Changeling', 'chng', "Hisssss...!;...Hhhhungry...;[laughing];Hi! I'm <insert generic pony name here>!", function(img, pon) {
            switch (img) {
                case 'sleep0':  
                case 'stand0': return 'http://orig07.deviantart.net/f1f0/f/2017/045/a/4/changeling__1_idle_by_botchan_mlp-daz1acl.gif';
                case 'dash0':
                case 'trot0': return 'http://orig15.deviantart.net/a5f3/f/2017/045/2/b/changeling__1_trotting_by_botchan_mlp-daz1ad2.gif';
                case 'fly0': return 'http://orig01.deviantart.net/753d/f/2017/045/6/9/changeling__1_flying_by_botchan_mlp-daz1ade.gif';
                case 'sleep1':  
                case 'stand1': return 'http://orig08.deviantart.net/9f1a/f/2017/045/6/7/changeling__3_idle_by_botchan_mlp-daz1bqo.gif';
                case 'dash1':
                case 'trot1': return 'http://orig06.deviantart.net/f9e6/f/2017/045/c/7/changeling__3_trotting_by_botchan_mlp-daz1br4.gif';
                case 'fly1': return 'http://orig10.deviantart.net/3a37/f/2017/045/d/6/changeling__3_flying_by_botchan_mlp-daz1brj.gif';
                case 'sleep2':  
                case 'stand2': return 'http://orig05.deviantart.net/b056/f/2017/045/e/9/changeling__4_idle_by_botchan_mlp-daz1c2t.gif';
                case 'dash2':
                case 'trot2': return 'http://orig00.deviantart.net/3487/f/2017/045/d/4/changeling__4_trotting_by_botchan_mlp-daz1c3c.gif';
                case 'fly2': return 'http://orig13.deviantart.net/bb70/f/2017/045/c/f/changeling__4_flying_by_botchan_mlp-daz1c3p.gif';
                case 'sleep3':  
                case 'stand3': return 'http://orig07.deviantart.net/ff8a/f/2017/045/3/b/changeling__6_idle_by_botchan_mlp-daz1csz.gif';
                case 'dash3':
                case 'trot3': return 'http://orig13.deviantart.net/3fd0/f/2017/045/8/5/changeling__6_trotting_by_botchan_mlp-daz1ctt.gif';
                case 'fly3': return 'http://orig10.deviantart.net/996b/f/2017/045/2/3/changeling__6_flying_by_botchan_mlp-daz1cuh.gif';
            }
        }), {
            'mouseover': function() {
                if (!this.ponyType().cache.ready) return;
                this.ponyType().setMemory('disguise', this.ponyType().cacheSprites(pickOne(Ponies)));
            },
            'tick': function() {
                if (!this.ponyType().cache.ready) return;
                var disguise = this.ponyType().getMemory('disguise');
                var ticks_disguised = this.ponyType().getMemory('ticks_to_change');
                if (ticks_disguised-- <= 0) {
                    if (disguise) {
                        this.ponyType().setMemory('disguise', null);
                        ticks_disguised = 900;
                    } else {
                        if (Math.random() * 1000 <= 5) {
                            this.ponyType().setMemory('disguise', this.ponyType().cacheSprites(pickOne(Ponies)));
                            console.log('Changed!');
                        }
                        ticks_disguised = 400;
                    }
                }
                this.ponyType().setMemory('ticks_to_change', ticks_disguised);
            },
            'say': function() {
                if (Math.random() * 30 < 10) {
                    var other = this.ponyType().getMemory('disguise');
                    if (other) {
                        if (Math.random() * 2 < 1) {
                            var says = "Do you like /{n}/?;Hi, I'm... /{n}/!;You do like /{n}/, don't you?".split(';');
                            return pickOne(says).replace('{n}', other.Name);
                        }
                        return '~' + other.getSay(a) + '~';
                    }
                }
                return null;
            }
        }), {
            disguise: null,
            ticks_to_change: 900
        }))),
        new Pony('Sea Breeze', 'sb', ".. ...;.. .. .. ..;.... .. .;... . ... .  .... . . . ...;.... . .... . ... .. .;.;...;.... ..... ..", function(img) {
            switch (img) {
                case 'stand':
                case 'trot':
                case 'dash': return /*stand*/'//fc07.deviantart.net/fs70/f/2014/064/3/7/seabreeze_floating_by_botchan_mlp-d7939jq.gif';
                case 'sleep': return /*sleep*/'//fc01.deviantart.net/fs71/f/2014/077/f/2/seabreeze_floating_2_by_botchan_mlp-d7are6y.gif';
            }
        }),
        Spacer('Fillies', new SpecialPony('Filly Rarity', 'frar', 4, "A ROCK!?;I. Don't Even...;I'm adorable and you can't stop me;Gently please;How can you be so insensitive?;Ooooooooooooooooooooooooooo;Pruney Hooves!!;This, is whining", function(img) {
            switch (img) {
                case 'sleep': return /*sleep*/'//orig02.deviantart.net/9ee0/f/2013/111/2/d/filly_rarity___sleeping_by_rj_p-d62kics.gif';
                case 'stand': return /*stand*/'//orig13.deviantart.net/a968/f/2013/111/6/5/filly_rarity___standing_by_rj_p-d62keik.gif';
                case 'stand2':
                case 'dash': return /*pull*/'//orig09.deviantart.net/14ca/f/2013/111/5/0/filly_rarity___magical_pull_by_rj_p-d62khjl.gif';
                case 'dash3': return /*drag*/'//orig03.deviantart.net/ab3e/f/2013/111/a/f/filly_rarity___magical_drag_by_rj_p-d62khtp.gif';
                case 'trot': return /*trot*/'//orig03.deviantart.net/449b/f/2013/111/b/f/filly_rarity___trotting_by_rj_p-d62kfh7.gif';
            }
        })),
        extendOriginalSays(new Pony('Filly Dash', 'fdash', "Awesome!;See you boys at the finish line!Hey!", function(img, pon) {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'trot':
                case 'dash':
                case 'fly': return buildRef(pon, img);
            }
        }), 0.3),
        new SpecialPony('Apple Bloom', 'cmc1', 4, "Howdy, I'm Apple Bloom;CUTIE MARK CRUSADERS INTERNET EXPLORERS YAY!!;Somepony needs to put this thing out of its misery.;Not the cupcakes!;Likely story.;I'm not a baby, I can take care of myself!;I am a big pony!;But ah want it now!;Apple Bloom, Apple Bloom!", function(img, pon) {
            switch (img) {
                case 'stand': return buildRef(pon, img);
                case 'trot2':
                case 'trot': return buildRef(pon, 'trot');
                case 'dash': return '//fc05.deviantart.net/fs70/f/2014/115/d/0/apple_bloom_galloping_by_botchan_mlp-d7fzyr9.gif';
                case 'sleep': return buildRef(pon, img);
                case 'trot1': return buildRef(pon, 'skip');
                case 'stand2': return buildRef(pon, 'spin');
                case 'stand4': return buildRef(pon, 'push_ups');
            }
        }),
        new SpecialPony('Sweetie Belle', 'cmc2', 3, "I'm Sweeetiee Belle!;I wonder how that happened...;Stupid Horn!;Aww. That was such a sweet story;Are you sure I can't help?;Hush now, quiet now.;I can help, big sis!;Oh, oh, oh! Maybe I could....just...stand....over here....and watch.;That's a great safe idea.", function(img, pon) {
            switch (img) {
                case 'trot':
                case 'stand': return buildRef(pon, img);
                case 'dash': return '//fc03.deviantart.net/fs71/f/2014/115/6/6/sweetie_belle_galloping_by_botchan_mlp-d7fzz94.gif';
                case 'sleep': return buildRef(pon, img);
                case 'trot2': return buildRef(pon, 'skip');
                case 'stand1': return buildRef(pon, 'sit');
                case 'stand2': return buildRef(pon, 'sit_2');
                case 'stand3': return buildRef(pon, 'jump');
            }
        }, {
            1: "Ughh! I'm so BORED!;Dumb fabric!",
            2: "I know this one!;Hammer!;You cannot run from me!;We could form our own secret society!;♪ We are the Cutie Mark Crusaders! ♫"}),
        attachMemory(isOnDay(1, 4) ? new Pony('Scootaloo', 'chicken', "I'm a..." + speechPause(10) + "chicken?;Scoot- Scoot- SCOOTALOO!!!;What am I? A chicken?;Bukka bukka;Bukka bukka;Bukka bukka;Bukka bukka, scoot- SCOOTALOO!!!;Bukka...", function(img, pon) {
                switch (img) {
                    case 'sleep':
                    case 'stand': return buildRef(pon, 'stand');
                    case 'dash':
                    case 'trot': return buildRef(pon, 'trot');
                    case 'fly': return buildRef(pon, img);
                }
            })
            : attachEvents(new Pony('Scootaloo', 'cmc3', "I swear, they make one more chicken joke I'm gonna- Pequawk! *blushes*;I'm Scootaloo! The most awesome one!;I'm a... chicken?;Scoot- Scoot- SCOOTALOO!!!;What am I? A chicken?;Wha...huh?;TLC as in Tender Loving Care or Totally Lost Cause?;That's so funny I forgot to laugh;Bukka bukka;That is not how you call a chicken;You've got a problem with blank flanks?;Never, never, never!;These namby-pamby stories aren't going to take us any closer to our cutie marks;I'm liking this idea.;I'll do whatever you want, Rainbow Dash!;Ewwww!;The possibilities are, like, endless!;We were making a table?;I'm going to get my mark first!;Do you know where we can find a cannon at this hour?;Sup.;Dash! Dash! Over here, Dash!", function(img, pon) {
                switch (img) {
                    case 'sleep':
                    case 'stand': return buildRef(pon, 'stand');
                    case 'trot': return buildRef(pon, 'trot');
                    case 'dash': return '//fc07.deviantart.net/fs71/f/2014/115/4/8/scootaloo_galloping_by_botchan_mlp-d7fzz3l.gif';
                    case 'fly': return buildRef(pon, 'fly');
                }
            }), {
                'mouseenter': function () {
                    if (Math.random() * 20 <= 5) {
                        this.Speak("What?;Watch it! That thing's sharp!;Ow!;Quit it!;BAD TOUCH! BAD TOUCH!");
                    }
                },
                'say': (function(angrySays) {
                    return function() {
                        if (this.ponyType().getMemory('special')) {
                            return pickOne(angrySays);
                        }
                        return null;
                    }
                })('Hey!;Leave him alone!;What are you doing to Pip!?'.split(';'))
            }), {'special': false}),
        new SpecialPony('Babs Seed', 'cmc4', 1, "Hey! That's not how you talk to my friends!;See ya later, Cutie Mark Crybabies!;Looks like somepony's pumpkin just got squashed!;*pooft*;Sup;Welcome to the Babs side 'a town;~bad seed, bad seed~ What? It's a catchy tune;Eh, I've seen better", function(img) {
            switch (img) {
                case 'sleep':
                case 'stand': return /*stand*/'//fc01.deviantart.net/fs71/f/2014/081/f/8/babs_seed_idle_by_botchan_mlp-d7ba68n.gif';
                case 'trot':
                case 'dash': return /*trot*/'//fc06.deviantart.net/fs71/f/2014/081/b/e/babs_seed_trotting_by_botchan_mlp-d7ba5zz.gif';
                case 'sleep1':
                case 'stand1': return /*smug*/'//fc02.deviantart.net/fs70/f/2014/081/a/c/babs_seed_idle__smug__by_botchan_mlp-d7ba6iw.gif';
                case 'trot1':
                case 'dash1': return /*trot_smug*/'//fc06.deviantart.net/fs71/f/2014/081/d/0/babs_seed_trotting__smug__by_botchan_mlp-d7ba6ch.gif';
            }
        }),
        attachEvents(attachMemory(sleepless(new SpecialPony('Pipqueak', 'pip', 2, "Onward to adventure!;Cheerio;Me first!;I want to learn how to become a Cutie Mark Crusader!;When I grow up I wanne be jus' like ma cap'n;*sneezes*" + speechPause(10) + "Sorry...;*whispers* When 'm 'lone I like to preten' t' be a pirate", function(img) {
            switch (img) {
                case 'sleep':
                case 'stand': return /*stand*/'//orig09.deviantart.net/bb27/f/2015/158/d/4/pipsqueak_idle_by_botchan_mlp-d8wftlv.gif';
                case 'dash':
                case 'trot': return /*trot*/'//orig03.deviantart.net/ec72/f/2015/158/0/7/pipsqueak_trotting_by_botchan_mlp-d8wfto8.gif';
                case 'sleep2':
                case 'stand2': return /*stand_pirate*/'//orig14.deviantart.net/c0dd/f/2015/158/f/2/pipsqueak_idle__pirate_costume__by_botchan_mlp-d8wftpl.gif';
                case 'dash2':
                case 'trot2': return /*trot_pirate*/'//orig09.deviantart.net/7399/f/2015/158/d/3/pipsqueak_trotting__pirate_costume__by_botchan_mlp-d8wftro.gif';
            }
        }, {
            1: 'Ever since I lost my eye, I\'ve been craving nothing but candy!;Pipsqueak the pirate, at your service;Pipsqueak the pirate, at your service. Arrg;Arrrg matey;Scary, but fun;I be pirate Pip at yer service'})), {
            'anger': 0
        }), {
            'mouseenter': function() {
                if (Math.random() * 20 <= 5) {
                    var pony = this.ponyType();
                    if (pony.getState() > 0) {
                        this.Speak("Ouch!;Ah, ya be ichin' for a fight are we?;An guard!;I'm gonna make ya walk da plank fer dat");
                    } else {
                        var anger = pony.getMemory('anger') + 1;
                        if (anger == 0) {
                            this.Speak("*sobs*");
                        } else {
                            this.Speak(anger < 3 ? "Ouch! Stop that!;*sobs*" : anger < 6 ? "Leave me alone!" : "I'm telling cheerilee!");
                            if (anger > 6) {
                                anger = -1;
                                var a = new InteractivePony();
                                a.dom_element.find('div.speech').fadeOut();
                                a.ponyType = function () {
                                    return PoniesRegister['Scootaloo'];
                                };
                                PoniesRegister['Scootaloo'].setMemory('special', true);
                                a.InitEvents();
                                a.Say('');
                                setInterval(function () {
                                    window_focused && (a.Update(0.016), a.Render())
                                }, 16);
                            }
                            pony.setMemory('anger', anger);
                        }
                    }
                }
            },
            'say': function() {
                if (this.ponyType().getMemory('anger') < 0) return '*sobs*';
                return null;
            }
        }),
        offset(sleepless(new Pony('Princess Flurry Heart', 'flur', 'Pftftft;Gugug...;*baby noises*;Gah! :D^', function(img) {
            switch (img) {
                case 'sleep':
                case 'stand': return /*stand*/ '//orig01.deviantart.net/e24e/f/2016/091/7/7/flurry_heart_idle_by_botchan_mlp-d9x9ptq.gif';
                case 'dash':
                case 'trot': return /*trot*/ '//orig12.deviantart.net/4a86/f/2016/091/e/9/flurry_heart_flying_by_botchan_mlp-d9x9puh.gif';
            }
        })), function(el, state) {
            if (state == 'stand' || state == 'sleep') el.css('margin-top', '-20px');
        }),
        Spacer('Other', new SpecialPony('Fluffle Puff', 'flf', 2, "Pfftt.;Pffft pfftt;Pfffffffffffffffffftttttt;:P", function(img) {
            switch (img) {
                case 'sleep':
                case 'stand': return /*stand*/'//fc08.deviantart.net/fs71/f/2014/157/1/0/fluffle_puff_phbbt_by_botchan_mlp-d7lcggr.gif';
                case 'sleep2':
                case 'stand2': return /*gasp*/'//fc06.deviantart.net/fs71/f/2014/157/b/e/fluffle_puff_gasping_by_botchan_mlp-d7lcgh9.gif';
                case 'trot':
                case 'dash': return /*trot*/'//fc07.deviantart.net/fs71/f/2014/157/7/d/fluffle_puff_trotting_by_botchan_mlp-d7lcfve.gif';
            }
        }))
    ];

    var CustomPony = {
        "name": "Rainbow Dash",
        "sayings": dash_sayings,
        "sprites": {
            "sleep": "https://static.fimfiction.net/images/interactive_pony/dash/cloud_sleep_right.gif",
            "stand": "https://static.fimfiction.net/images/interactive_pony/dash/stand_rainbow_right.gif",
            "trot": "https://static.fimfiction.net/images/interactive_pony/dash/trotcycle_rainbow_right.gif",
            "dash": "https://static.fimfiction.net/images/interactive_pony/dash/dashing_right.gif",
            "fly": "https://static.fimfiction.net/images/interactive_pony/dash/fly_rainbow_right.gif"
        }
    };
    try {
        if (localStorage['custom_pony']) {
            CustomPony = JSON.parse(localStorage['custom_pony']);
        }
    } catch (e) {}
    
    Ponies.push((function(pony) {
        pony.getSay = function() {
            return CustomPony.sayings[Math.floor(Math.random() * (CustomPony.sayings.length - 1))] || "...";
        };
        pony.bakeGif = function(url, suffex, cache) {
            return this.bakeSprite(stateMap[url] + suffex);
        };
        pony.bakeSprite = function(img) {
            return CustomPony.sprites[img];
        }
        pony.args = function() {
            return CustomPony;
        }
        pony.Name = CustomPony.name;
        return pony;
    })(new Pony('Custom', 'custom', '', function(img) {
        return CustomPony.sprites[img];
    })));
    
    var PoniesRegister = {};
    for (var i = 0; i < Ponies.length; i++) {
        PoniesRegister[Ponies[i].Id] = Ponies[i];
    }
    var GlobalInteractivePony = null, GlobalPonyType = getPonyType();

    addOptionsSelect();
    setupMorePonies();
//--------------------------------------------------------------------------------------------------
//----------------------------------------FUNCTIONS-------------------------------------------------
//--------------------------------------------------------------------------------------------------

function isOnDay(day, month) {
    if (!isOnDay.date) {
        var t = new Date();
        isOnDay.date = {'day': t.getDate(),'month': t.getMonth() + 1}
    }
    return isOnDay.date.day == day && isOnDay.date.month == month;
}

function getPonyType() {
    var result = docCookies.getItem("interactive_pony_type");
    if (PoniesRegister[result] != null) {
        return result;
    }
    return Ponies[0].Id;
}

function setPonyType(val) {
    GlobalPonyType = val;
    setDocCookie("interactive_pony_type", val);
    if (GlobalInteractivePony) {
        GlobalInteractivePony.ponySwitched();
    }
}

function alias(name, pony) {
    pony.Name = name;
    return pony;
}

function sleepless(pony) {
    pony.Sleepless = true;
    return pony;
}

function offset(pony, func) {
    pony.offset = func;
    return pony;
}

function speechPause(length) {
    var result = '';
    while (result.length < length) result+= ' ';
    return result;
}

function extendOriginalSays(pony, ratio) {
    var s = pony.getSay;
    pony.getSay = function(a) {
        if (Math.random() < ratio) return s.call(this, a);
        return a;
    };
    return pony;
}

function attachCache(pony) {
    var record = {};
    var loading = 0;
    pony.cache = {
        ready: true,
        cache: function(img) {
            if (record[img] == undefined) {
                record[img] = false;
                this.ready = false;
                loading++;
                var image = $('<img src="' + img + '" style="display:none;" />');
                image.on('load', function() {
                    image.remove();
                    record[img] = true;
                    loading--;
                    pony.cache.ready = loading <= 0;
                });
                image.on('error', function() {
                   image.remove();
                    loading--;
                    pony.cache.ready = loading <= 0;
                });
            }
            return img;
        }
    }
    return pony;
}

function attachMemory(pony, memory) {
    pony.getMemory = function(key) {
        return memory[key];
    };
    pony.setMemory = function(key, val) {
        memory[key] = val;
    };
    return pony;
}

function attachEvents(pony, eventObject) {
    eventObject.Trigger = function (interactivePony, e) {
        if (typeof e === 'string') e = {'type': e};
        return this[e.type] ? this[e.type].apply(interactivePony, [e]) : null;
    };
    pony.Events = eventObject;
    return pony;
}

function Spacer(name, pony) {
    pony.section = name;
    return pony;
}

function DummyPony(name) {
    this.Id = name;
    this.Name = name;
    this.getSay = function(a) {return a;};
    this.getSprite = function(elem, face, base, url) {return base + url;};
    this.getAccess = function() { return ''; };
    this.cssImages = function(elem, face) { elem.find('img.interactive_pony').css('transform', '');}; 
}

function SpecialPony(name, key, level, sayings, giffactory, args) {
    if (!args) {
        args = {};
    } else {
        for (var i in args) {
            if (typeof args[i] == 'string') {
                args[i] = args[i].split(';');
            }
        }
    }
    
    var parent = new Pony(name, key, sayings, giffactory, args);
    var Active = -1;
    var next_active_timer = 10;
    var Specials = {};
    var SpecialAccess = {};
    
    this.Id = name;
    this.Name = name;
    this.getSay = function(a) {
        if (Active > -1 && args[Active + 1] != null) {
            return pickOne(args[Active + 1]);
        }
        return parent.getSay(a);
    };
    this.getState = function() {
        return Active;
    };
    this.setState = function(a) {
        Active = a < 0 ? 0 : a;
    };
    this.getSprite = function(elem, face, base, url) {
        url = parent.resolveUrl(face, url);
        var result = null;
        for (var looked = Active; looked > 0; looked--) {
            if (!Specials[looked]) Specials[looked] = {};
            result = parent.bakeGif(url, looked, Specials[looked]);
            if (result) return result;
            result = parent.bakeGif(url.replace('fly', 'trotcycle'), looked, Specials[looked]);
            if (result) return result;
        }
        return parent.getSprite(elem, face, base, url);
    };
    this.bakeSprite = function(img) {
        return parent.bakeSprite(img);
    }
    this.getAccess = function(elem, face, base, url) {
        next_active_timer = (next_active_timer + 1) % 11;
        if (next_active_timer == 0) Active = Math.floor(Math.random() * (level + 1));
        url = parent.resolveUrl(face, url);
        var result = null;
        for (var looked = Active; looked > 0; looked--) {
            if (!SpecialAccess[looked]) SpecialAccess[looked] = {};
            result = parent.bakeGif(url, '_ac' + looked, SpecialAccess[looked]);
            if (result) return result;
            result = parent.bakeGif(url.replace('fly', 'trotcycle'), '_ac' + looked, SpecialAccess[looked]);
            if (result) return result;
        }
        return parent.getAccess(elem, face, base, url);
    };
    this.cssImages = function(elem, face) {
        parent.internal__cssImages(elem, face);
        args = parent.args();
        if (args.effect && (args.effect.level == undefined || args.effect.level == Active)) {
            if (args.effect.css) {
                (args.effect.target === 'self' ? elem : elem.find(args.effect.target)).css(args.effect.css);
                elem.attr('data-target', args.effect.target);
                elem.attr('data-label', Object.keys(args.effect.css).join(';'));
            } else {
                (args.effect.target === 'self' ? elem : elem.find(args.effect.target)).css(args.effect.label, args.effect.value);
                elem.attr('data-target', args.effect.target);
                elem.attr('data-label', args.effect.label);
            }
        }
    };
}

function Pony(name, key, sayings, giffactory, args) {
    if (!args) args = {};
    sayings = sayings.split(';');
    var Images = {};
    var Accessories = {};
    this.Id = name;
    this.Name = name;
    this.Grounded = !giffactory('fly', key);
    this.getSay = function(a) {return pickOne(sayings);}
    this.getSprite = function(elem, face, base, url) {
        return this.bakeGif(this.resolveUrl(face, url), '', Images);
    };
    this.getAccess = function(elem, face, base, url) {
        return this.bakeGif(this.resolveUrl(face, url), '_ac', Accessories);
    };
    this.resolveUrl = function(face, url) {
        if (this.Grounded) url = url.replace('fly', 'trotcycle');
        return face == 'left' ? url.replace('left', 'right') : url;
    };
    this.bakeGif = function(url, suffex, cache) {
        if (cache[url] === undefined) cache[url] = this.bakeSprite(stateMap[url] + suffex, key);
        return cache[url];
    };
    this.bakeSprite = function(img) {
        return giffactory(img, key) || null;
    }
    this.args = function() {
      return args;
    };
    this.internal__cssImages = function(elem, face) {
        if (face == 'left') {
            elem.find('img.interactive_pony').css('transform', 'scaleX(-1)');
            elem.find('img.interactive_pony_accessory').css({'transform': 'scaleX(-1)','left': '-30px','right': ''});
        } else {
            elem.find('img.interactive_pony').css('transform', '');
            elem.find('img.interactive_pony_accessory').css({'transform': '','left': '','right': '-30px'});
        }
    };
    this.cssImages = function(elem, face) {
        this.internal__cssImages(elem, face);
        args = this.args();
        var anim_target = elem.attr('data-target');
        if (anim_target != null && anim_target != '') {
            anim_target = (anim_target === 'self' ? elem : elem.find(anim_target));
            var anim_label = elem.attr('data-label').split(';');
            for (var i = anim_label.length; i--;) anim_target.css(anim_label[i], '');
        }
        if (args.effect) {
            if (args.effect.css) {
                (args.effect.target === 'self' ? elem : elem.find(args.effect.target)).css(args.effect.css);
                elem.attr('data-target', args.effect.target);
                elem.attr('data-label', Object.keys(args.effect.css).join(';'));
            } else {
                (args.effect.target === 'self' ? elem : elem.find(args.effect.target)).css(args.effect.label, args.effect.value);
                elem.attr('data-target', args.effect.target);
                elem.attr('data-label', args.effect.label);
            }
        }
    };
}

function Particle(el, x, y, vx, vy) {
    this.ticks = 0;
    this.dead = false;
    this.x = x;
    this.y = y;
    this.rotation = Math.random() * 360;
    this.velX = vx;
    this.velY = vy;
    this.scrollX = $(window).scrollLeft();
    this.scrollY = $(window).scrollTop();
    this.element = $(el);
    $('body').append(this.element);
    this.particleWidth = this.element.width();
    this.particleHeight = this.element.height()
    this.element.css({
        'position': 'absolute',
        'left': this.x - (this.particleWidth/2),
        'top': this.y - (this.particleHeight/2)
    });
    this.Tick();
}
Particle.prototype = {
    Tick: function() {
        this.Render();
        this.Update();
        if (!this.dead) {
            var me = this;
            setTimeout(function() {
                me.Tick();
            }, 16);
        }
    },
    Update: function() {
        var posY = this.y - this.scrollY;
        if ((posY >= $(window).height() - this.particleHeight/2 && this.velY > 0) || (posY <= this.particleHeight/2 && this.velY < 0)) {
            this.velY = -this.velY * 0.9;
        }
        if (Math.random() * Math.abs(this.velY) < 1) {
            this.velY = -this.velY * 0.9;
            this.rotation = (this.rotation + 90) % 360;
        }
        var posX = this.x - this.scrollX;
        if ((posX >= $(window).width() - this.particleWidth/2 && this.velX > 0) || (posX <= this.particleWidth/2 && this.velX < 0)) {
            this.velX = -this.velX * 0.9;
        }
        this.x += this.velX;
        this.y += this.velY;
        this.velX *= 0.96;
        this.velY *= 0.99;
        
        this.dead = (this.velY < 0.1 && this.velY > -0.1) || (this.velX < 0.1 && this.velX > -0.1) || this.ticks++ > 50000;
    },
    Render: function() {
        this.element.css({
            'left': this.x - (this.element.width()/2),
            'top': this.y - (this.element.height()/2),
            'transform': 'rotate(' + this.rotation + 'deg)'
        });
    }
}

function setupMorePonies() {
    var register = [];
    
    InteractivePony.prototype.NextId = function() {
        return register.length;
    }
    InteractivePony.prototype.Register = function() {
        this.uniqueId = this.id = this.NextId() + 1;
        register.push(this);
    }
    InteractivePony.prototype.Unregister = function() {
        register.splice(this.id - 1, 1);
        for (var i = 0; i < register.length; i++) {
            register[i].id = i + 1;
        }
    }
    InteractivePony.prototype.ponyType = function () {
        return PoniesRegister[GlobalPonyType];
    };
    InteractivePony.prototype.ponySwitched = function() {
        var sprite = this.sprite;
        this.sprite = 'foobar';
        this.dom_element.find('div.speech').fadeOut();
        this.SetSprite(sprite);
    };
    InteractivePony.prototype.Trigger = function (e) {
        if (!this.forceSleep) {
            var pone = this.ponyType();
            if (pone.Events) {
                return pone.Events.Trigger(this, e);
            }
        }
        return null;
    };
    InteractivePony.prototype.Say = function (a) {
        this.text = this.Trigger('say');
        if (!this.text) {
            var pone = this.ponyType();
            this.text = (pone.Sleepless || !this.forceSleep && this.state != 'sleeping') ? pone.getSay(a) : 'zzz...';
        }
        this.next_text_timer = this.text_counter = 0;
        if (this.text) this.dom_element.find('div.speech').fadeIn();
    };
    InteractivePony.prototype.Speak = function (a) {
        this.text = pickOne(a.split(';'));
        this.next_text_timer = this.text_counter = 0;
        if (this.text) this.dom_element.find('div.speech').fadeIn();
    };
    InteractivePony.prototype.Clicked = function() {
        this.state = this.state == 'sleeping' ? 'default' : 'sleeping';
        this.forceSleep = this.state == 'sleeping';
        if (this.forceSleep) {
            this.SetSprite('cloud_sleep_right.gif');
            this.dom_element.find('div.speech').fadeOut();
        }
        this.Trigger('click');
    };
    InteractivePony.prototype.SetSprite = function (a) {
        if (this.sprite != a) {
            this.sprite = a;
            var pone = this.ponyType();
            pone.cssImages(this.dom_element, this.facing);
            var access = pone.getAccess(this.dom_element, this.facing, this.base_url, a);
            this.dom_element.find('img.interactive_pony_accessory').attr('src', access).css('display', access == '' ? 'none' : '');
            this.dom_element.find('img.interactive_pony').attr('src', pone.getSprite(this.dom_element, this.facing, this.base_url, a));
            this.dom_element.css('margin', '');
            if (pone.offset) {
                pone.offset(this.dom_element, stateMap[a]);
            }
        }
    };
    InteractivePony.prototype.__Render = InteractivePony.prototype.Render;
    InteractivePony.prototype.Render = function() {
        if (!this.accessory_element) {
            this.accessory_element = $('<img class="interactive_pony_accessory" style="position:absolute;bottom:0px;" />');
            this.dom_element.find('img.interactive_pony').after(this.accessory_element);
            this.dom_element.find('img.interactive_pony, img.interactive_pony_accessory').css({
                'user-select': 'none', 'pointer-events': 'none'
            });
            
            var me = this;
            $(this.dom_element).on('mousedown mouseenter mouseleave mousemove mouseover mouseout mouseup dblclick hover', function (e) {
                me.Trigger(e);
            });
            $('body').on('keydown keypress keyup', function (e) {
                me.Trigger(e);
            });
            
            if (this.id == undefined) {
                this.id = this.uniqueId = 0;
                GlobalInteractivePony = this;
                this.ponySwitched();
            }
        }
        if (!this.forceSleep) {
            this.__Render();
        } else {
            this.dom_element.find('div.speech').text(this.text.substr(0, parseInt(this.text_counter)));
        }
    };
    InteractivePony.prototype.FindSecret = function(e) {
        var key = e.originalEvent.interactivePony_secret;
        return key && key.indexOf(this.uniqueId) != -1;
    }
    InteractivePony.prototype.AddSecret = function(e) {
        var key = e.originalEvent.interactivePony_secret;
        if (key) {
            key += ',' + this.uniqueId;
        } else {
            key = '' + this.uniqueId;
        }
        e.originalEvent.interactivePony_secret = key;
    }
    InteractivePony.prototype.InitEvents = function() {
        this.Register();
        var me = this;
        $('.user_toolbar').mousemove(function (b) {
            if (!me.FindSecret(b)) {
                me.AddSecret(b);
                me.UpdateMouse(b.pageX, b.pageY, $(this));
            }
        });
        $('img').mousemove(function (b) {
            if (!me.FindSecret(b)) {
                if (50 < $(this).width() && !$(this).hasClass('interactive_pony')) {
                    me.AddSecret(b);
                    me.UpdateMouse(b.pageX, b.pageY, $(this));
                }
            }
        });
        $('*').mousemove(function (b) {
            if (!me.FindSecret(b)) {
                if (80 < $(this).height()) {
                    me.AddSecret(b);
                    me.UpdateMouse(b.pageX, b.pageY, $(this));
                }
            }
        });
    }
    InteractivePony.prototype.__UpdateMouse = InteractivePony.prototype.UpdateMouse;
    InteractivePony.prototype.UpdateMouse = function(x, y, el) {
        x -= 80 * (this.id ? this.id : 0);
        x += 40 * (this.NextId());
        this.__UpdateMouse(x, y, el);
    }
    InteractivePony.prototype.__Update = InteractivePony.prototype.Update;
    InteractivePony.prototype.Update = function (a) {
        if (this.forceSleep) this.state = 'sleeping';
        if (this.Trigger('tick') == false) return;
        this.__Update(a);
    }
    
    $(document).ready(function () {
        $(window).unbind('konami');
        $(window).bind('konami', function() {
            try {
                var a = new InteractivePony();
                a.InitEvents();
                a.dom_element.find('div.speech').fadeOut();
                var type = Math.floor(Math.random() * (Ponies.length - 1));
                a.ponyType = function () {
                    return Ponies[type];
                };
                markTemp(setInterval(function () {
                    try {
                        if (window_focused) {
                            a.Update(0.016);
                            a.Render();
                        }
                    } catch (e) {alert(e)}
                }, 16), a);
            } catch (e) {alert(e)}
        });
    });
    
    makeStyle('\
        .interactive_pony .speech_container {\
              pointer-events: none;}\
        div.interactive_pony div.speech {\
              font-size: 0.844em !important;}\
        .muffin {\
              z-index: 10;\
              pointer-events: none;\
              width:20px;\
              height:20px;\
              background:url("//raw.githubusercontent.com/Sollace/UserScripts/master/Interactive Ponies/muffin.png") center no-repeat;\
              background-size:fit;\
              border-radius:30px;}\
        @-webkit-keyframes wub {\
            0% {transform: scale(1,1);}\
            10% {transform: scale(1.00125,1.00125);}\
            20% {transform: scale(1.0125,1.0125);}\
            30% {transform: scale(1.00125,1.00125);}\
            40% {transform: scale(1.0125,1.0125);}\
            50% {transform: scale(1.00125,1.00125);}\
            60% {transform: scale(1,1);}\
            70% {transform: scale(0.99985,0.99985);}\
            80% {transform: scale(1,1);}\
            90% {transform: scale(1.0125,1.0125);}\
            100% {transform: scale(1.00125,1.00125);}}\
        @keyframes wub {\
            0% {transform: scale(1,1);}\
            10% {transform: scale(1.00125,1.00125);}\
            20% {transform: scale(1.0125,1.0125);}\
            30% {transform: scale(1.00125,1.00125);}\
            40% {transform: scale(1.0125,1.0125);}\
            50% {transform: scale(1.00125,1.00125);}\
            60% {transform: scale(1,1);}\
            70% {transform: scale(0.99985,0.99985);}\
            80% {transform: scale(1,1);}\
            90% {transform: scale(1.0125,1.0125);}\
            100% {transform: scale(1.00125,1.00125);}}\
    ');
    
    function markTemp(ticker, interactivePony) {
        var timeout = 5000;
        var render = interactivePony.Render;
        interactivePony.Render = function() {
            if (timeout-- <= 0) {
                this.dom_element.css('transition', 'opacity 0.5s linear');
                this.dom_element.css('opacity', '0');
                clearInterval(ticker);
                var me = this;
                setTimeout(function() {
                    me.Unregister();
                    me.dom_element.remove();
                }, 500);
            }
            render.apply(this, arguments);
        }
    }
}

function addOptionsSelect() {
    var interactiveP = $('input[name="show_interactive_pony"]');
    if (interactiveP.length) {
        interactiveP.parent().closest('tr').after('<tr><td class="label">Interactive Pony Type</td><td><div id="ponyTypeDiv" /></td></tr><tr id="custom_pony_field" style="' + (GlobalPonyType != 'Custom' ? 'display:none' : '') + '"><td class="label">Custom interactive Pony</td><td><div id="pony_customDiv" /></td></tr>');
        var InteractivePonyType = '<select name="interactive_pony_type">';
        for (var i = 0; i < Ponies.length; i++) {
            if (Ponies[i].section) {
                InteractivePonyType += (i ? '</optgroup>' : '') + '<optgroup label="' + Ponies[i].section + '">';
            }
            if (Ponies[i].Id == 'Custom') {
                InteractivePonyType += '<option id="custom_option" value="Custom">Custom (' + Ponies[i].Name + ')</option>';
            } else {
                InteractivePonyType += '<option value="' + Ponies[i].Name + '">' + Ponies[i].Name + '</option>';
            }
        }
        InteractivePonyType += '</select>';
        InteractivePonyType = $(InteractivePonyType);
        $('#ponyTypeDiv').append(InteractivePonyType);
        InteractivePonyType.val(GlobalPonyType);
        InteractivePonyType.change(function() {
            setPonyType(this.value);
            if (this.value == 'Custom') {
                $('#custom_pony_field').css('display', '');
            } else {
                $('#custom_pony_field').css('display', 'none');
            }
        });
        $('option#custom_option').text('Custom (' + CustomPony.name + ')');
        var pony_custom = $('<textarea style="resize:vertical;min-height:500px;">');
        pony_custom.val(JSON.stringify(CustomPony, null, 4));
        $('#pony_customDiv').append(pony_custom);
        pony_custom.on('change keyup', function() {
            try {
                CustomPony = JSON.parse(localStorage['custom_pony'] = this.value);
                PoniesRegister.Custom.Name = CustomPony.name;
                $('option#custom_option').text('Custom (' + CustomPony.name + ')');
            } catch (e) {}
            if (GlobalInteractivePony) GlobalInteractivePony.ponySwitched();
        });
    }
}

function buildRef(pon, img) {
    return '//raw.githubusercontent.com/Sollace/UserScripts/master/Interactive Ponies/Sprites/' + pon + '/' + img + '.gif';
}