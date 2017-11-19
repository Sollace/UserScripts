// ==UserScript==
// @name        Interactive Ponies
// @description Adds more Interactive Ponies to FimFiction.net
// @author      Sollace
// @namespace   fimfiction-sollace
// @icon        http://fc01.deviantart.net/fs71/f/2014/077/f/2/seabreeze_floating_2_by_botchan_mlp-d7are6y.gif
// @include     http://justsitback.deviantart*
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @version     3.0.2
// @grant       none
// ==/UserScript==

var docCookies={
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
    document.head.insertAdjacentHTML('beforeend', '<style id="' + id + '" type="text/css">' + input + '</style>');
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
if (document.location.href.indexOf("http://www.fimfiction.net/") == 0 || document.location.href.indexOf("https://www.fimfiction.net/") == 0) run();

function run() {
    //--------------------------------------SCRIPT START------------------------------------------------
    const stateMap = {
        'cloud_sleep_right.gif': 'sleep','cloud_sleep_left.gif': 'sleep',
        'dashing_right.gif': 'dash','dashing_left.gif': 'dash',
        'stand_rainbow_right.gif': 'stand','stand_rainbow_left.gif': 'stand',
        'fly_rainbow_right.gif': 'fly','fly_rainbow_left.gif': 'fly',
        'trotcycle_rainbow_right.gif': 'trot','trotcycle_rainbow_left.gif': 'trot'
    };
    const pinkiePie = new SpecialPony('Pinkie Pie', 'pp', 4,"Are you loco in the coco?;Boring;Forevaah!;*ghasp*;*giggle*;Hey, that's what I said!;Hey, that's what she said!;Hi, I'm Pinkie Pie!;...and that, is how Equestria was made;I never felt joy like this before;Oatmeal, are you crazy?;Is there any good storie about me here?;I heard there was cupcakes here but I don't see any;How do you read cupcakes anyway?;Oki doki loki;Pinkie Pie style;This may look like it's fun but it's not;You really need to get out more", (img, pon) => {
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
            case 'sleep3': return buildRef(pon, 'chicken');
            case 'fly3':
            case 'trot3':
            case 'dash3':
            case 'stand3': return buildRef(pon, 'dance');
        }
    }, { 3: "Oppan Pinkie Style;Pinkie Style;Eh~ Sexy Pony;Pinkie Pie Time;What does the Pony say? Chipi-chi-pow-chippy-cheep-chip-chip" });
    const Ponies = [
        Spacer('Mane Six', new DummyPony('Rainbow Dash')),
        offset(new SpecialPony('Twilight Sparkle', 'twi', 6,"Reading is something everypony can enjoy, if they just give it a try.;*books horse noises*;Ah, hello;All the ponies in this town are crazy;Are you crazy?!;Dear Princess Celestia...;I don't get it;It's the perfect plan;Look out here comes Tom!;No really;Please don't hate me;This is my book and I'm gonna read it!;Tough love, baby;Yesyesyes;Your faithful student...;Books!;Spiiike!!;I've got to write a letter to the princes;For SCIENCE!!", (img,pon) => {
            switch (img) {
                case 'sleep': return buildRef(pon, 'read');
                case 'dash': return buildRef(pon, img);
                case 'trot3':
                case 'trot': return buildRef(pon, 'trot');
                case 'trot5': return  buildRef(pon, 'nerd');
                case 'stand': return buildRef(pon, img);
                case 'trot2': return buildRef(pon, 'owl');
                case 'stand4': return buildRef(pon, 'snap');
                case 'stand5': return buildRef(pon, 'nerd_stand');
            }
        }),(el, state) => {
            if (state == 'trot' && this.getState() == 1 || (state == 'stand' && this.getState() == 3)) {
                el.css('margin-top', '-25px');
            }
            if ((state == 'trot'  || state == 'stand') && this.getState() > 3) {
                el.css('margin-top', '-25px');
            }
        }),
        new SpecialPony('Princess Twilight', 'ptwi', 4, "Rainbow Dash, now is not the time for another... *music plays* ... Sing *facehoof*;Reading is something everypony can enjoy, if they just give it a try.;Wait a minute, I think I get it.;Huh? I'm pancake...I mean awake!;Just put the hay in the apple and then eat the candle, hm?;*books horse noises*;This is the game I am meant to play as a princess of Equestria!;Ah, hello;All the ponies in this town are crazy;Are you crazy?!;Dear Princess Celestia...;I don't get it;It's the perfect plan;Look out here comes Tom!;No really;Please don't hate me;This is my book and I'm gonna read it!;Tough love, baby;Yesyesyes;Your faithful student...;Books!;Spiiike!!;I've got to write a letter to the princes;For SCIENCE!!;[BUY OUR TOYS]", (img, pon) => {
            switch (img) {
                case 'sleep': return buildRef('twi', 'read');
                case 'trot':
                case 'dash': return buildRef(pon, 'trot');
                case 'fly':
                case 'stand': return buildRef(pon, img);
                case 'trot2': return buildRef(pon, 'trot_w');
                case 'fly3': return buildRef(pon, 'fly_d');
                case 'dash3': return buildRef(pon, 'zoom');
                case 'trot3': return buildRef(pon, 'trot_d');
                case 'stand3': return buildRef(pon, 'dress');
                case 'trot4': return buildRef(pon, 'trot_d_w');
            }
        }),
        new Pony('Applejack', 'aj', "All yours partner;Be ready for a ride;Can you ever forgive me?;Can't hear you, I'm asleep;Cock-a-doodle-doo;Don't you use your fancy mathematics to muddle the issue;Helping the ponyfolks;Hmmmm, nah;Hoho there lover boy.;I'm Applejack;That's what all the fuss is about?;We don't normally wear clothes;What in tarnation!?;What in the hay is that supposed to mean?;You're welcome;Yeehaw!!;Ama buck, ama buck, ama buck some apples all day;Ah got mah hat in an apple eatin' competition;Ah can't tell a lie... so no", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'dash':
                case 'trot':
                case 'stand': return buildRef(pon, img);
            }
        }),
        new SpecialPony('Rarity', 'rar', 1, "Darling, would you bend over please?;Afraid to get dirty?;But I thought you wanted whining!;Crime against fabulosity;Doesn't even make sense;You ruffians!;Gently please;How can you be so insensitive?;I'm so pathetic;It. Is. On.;Ooooooooooooooooooooooooooo;Pruney Hooves!!;Take that, you ruffian;You look smashing;This, is whining;EMERALDS?! What was I thinking? Let me get you some rubies!;Look upon me Equestria, for I am Rarity!;Why do I have to pull it?;Isn't friendship magic?!;Mules are ugly. Are you saying that I too am ugly? *cries*", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'trot':
                case 'stand': return buildRef(pon, img);
                case 'dash': return buildRef(pon, 'trot');
                case 'fly2': return buildRef(pon, 'fly');
            }
        }),
        new Pony('Rari-hic', 'fpr', "I love mud!!!;I luv bein' covered in mud!!!!! *splat*;Come on, ram thing!!;Why, hello, yaal!;I do declare-;Grumble grumble;I don't know what youra gettin' aht.;I have a hootinani of a festival ta put ta gether.;Moar is moar is like I say.;Gewd fer you.;I coudn't care less how I look, long as I get there chores done.;Yes in deedi doodle.;Mah mane is fulla dust an split ends.;Mah hoofs is cracked an dry from dem fields.;I wear droopy drawers!;*donkey sounds*", (img, pon) => {
            switch(img) {
                case 'stand': return buildRef(pon, img);
                case 'sleep': return buildRef(pon, 'scratch');
                case 'trot':
                case 'dash': return buildRef(pon, 'trot');
            }
        }),
        isOnDay(31, 10) ?
        attachEvents(alias('Pinkamena', sleepless(new SpecialPony('Pinkie Pie', 'pm', 1, "I'm so happy to meet you! Rainbow Dash has been oh, so lonely. Hehe;Can we be friendss?;I only make cupcakes with my...    Very.   Besst   friendss...;Hehehe...;Happy Nightmare Night.;*sneer*;I don't need my friends... *twitch*;My friends don't like my parties and they don't wanna be my friends anymore...;Oui! Zhat is correct, madame.;I know how it goes, all right!;I'm just glad none ah them ponies showed up!", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'dash':
                case 'trot': return buildRef(pon, 'trot');
            }
        }))), {
            'mouseenter': function () {
                if (Math.random() * 40 <= 5) {
                    this.Speak("You're my besst friend;Hehehe;Hehehe slicey slicey;Pinkie Pie doesn't live here any more. He. He. He.");
                }
            },
            'tick': function(e) {
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
        isOnDay(31, 10) ? attachEvents(alias('Flutterbat', sleepless(new Pony('Fluttershy', 'flutb', "Hiss~", (img, pon) => {
            switch (img) {
                case 'sleep': return buildRef(pon, 'hang');
                case 'dash':
                case 'trot':
                case 'stand':
                case 'fly': return buildRef(pon, img);
            }
        }))), {
            'mouseenter': function() {
                if (Math.random() * 40 <= 5) this.Speak("...apples...;*bites*");
            }
        }) : attachEvents(new Pony('Fluttershy', 'flut', "That...big...dumb...meanie!;There is nothing fun about Dragons. Scary: yes. Fun: NO!;...who's Applejohn?;Baby steps, everypony. Baby steps;*cries*;....;I'd like to be a tree;I am so frustrated;Sometimes I wish I was a tree;I don't wanna talk about it;I'm Fluttershy;I'm so sorry to have scared you;I'm the world champion you know;Oh, my;Oopsie;yay;You rock, woohoo;You rock, Tom;You're the cutest thing ever;Pretty please?;You're going to love me;You're such a loudmouth;*squee*", (img, pon) => {
          return buildRef(pon, img);
        }), {
            'mouseenter': function() {
                if (Math.random() * 40 <= 5) this.Speak("*blushes*;Um, uh, oh my;...ow");
            }
        }),
        Spacer('Secondary/Background Ponies', new Pony('Sunset Shimmer', 'sss', "Sorry it had to be this way... princess;This looks terrible!;There should be more streamers and fewer balloons;You country folk really aren't that bright;Where is this Twilight Sparkle?;Spoiler alert-;I'm sorry. I'm so sorry. I didn't know there was another way;A demon. I turned into a raging she-demon;It wasn't a fit of jealous rage!;I also play guitar;Dear Princess Twilight...;Hmpf. I have better things to do than socialize;I deserve to stand beside you and be your equal... if not your better. Make me a princess;Well, well, this is an interesting development;Believe me... I've got everything I need to know about you;I'm going to rule this school once I get that crown!", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'trot':
                case 'dash': return buildRef(pon, img);
            }
        })),
        new Pony('Starlight Glimmer', 'sg', "That seems a bit extreme;QUIET! :starlightrage:;New friends!?;Maybe I'll just force friendships by magically enslaving the entire population of Ponyville! ... That was a joke;Ugh, I am never gonna find my way around this place!;How many other ponies can boast being Twilight's apprentice?;Stop stressing... Stop stressing!;Goddammit Trixie;All adventures are equal to all other adventures;Please enjoy our little corner of Equestria. We're all quite fond of it;In sameness, there is peace;Exceptionalism is a lie;Difference is frustration;Choose equality as your special talent", (img, pon) => {
            switch (img) {
                case 'sleep': return buildRef(pon, 'munch');
                case 'trot':
                case 'stand': return buildRef(pon, img);
                case 'dash': return buildRef(pon, 'trot');
            }
        }),
        attachMemory(attachEvents(new SpecialPony('Vinyl Scratch', 'vs', 1, "Catch the beat!;Let's party!;*UNTS UNTS UNTS UNTS*;Feel the beat!;Wait till you see my bass cannon!", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'dash':
                case 'trot':
                case 'stand': return buildRef(pon, img);
                case 'sleep_ac1':
                case 'stand_ac1': return buildRef(pon, 'deck');
            }
        }, {
            1: "Oh this, it's just my BASS CANNON!;Rock on!;*bow-chika-bowow*;Let's have some WUBS!;*WUB WUB WUB WUB*;Crank it up!;I do my dishes with WUBS!;Toothpaste? I don't need that, I've got WUBS!;*BOOMWOOM-BOOMWOOM*",
            effect: {
                target: '.speech_container',
                css: {
                    animation: 'wub 1.5s infinite alternate'
                }
            }
        }), {
            mouseenter: function () {
                if (Math.random() * 20 <= 5) {
                    let special = (this.ponyType().getMemory('special') + 1) % 15;
                    let timer = this.ponyType().getMemory('timer');
                    let wubbing = this.ponyType().getMemory('wubbing');
                    let player = this.ponyType().getMemory('player');
                    this.ponyType().setMemory('special', special);
                    if (special == 0 || wubbing) {
                        this.Speak(wubbing ? "Oh you want MORE?;I can keep this up ALL DAY:BRING IT" : "Oh, now it is ON!!!");
                        
                        document.body.classList.add('wubadub');
                        if (wubbing > 2) document.body.classList.add('bass');
                        
                        this.ponyType().setMemory('wubbing', wubbing + 1);
                        
                        const songStarted = () => {
                            this.ponyType().setMemory('timer', setTimeout(() => {
                                document.body.classList.remove('wubadub');
                                document.body.classList.remove('bass');
                                this.Speak("Don't say I didn't warn ya.");
                                this.ponyType().setMemory('wubbing', 0);
                                if (player) player.parentNode.removeChild(player);
                                this.ponyType().setMemory('player', null);
                            }, 50000));
                        };
                        
                        if (timer) {
                            clearTimeout(timer);
                            songStarted();
                        } else if (!player) {
                            this.ponyType().setMemory('player', player = playSong('uNHS09davuY', songStarted));
                        }
                    } else {
                        this.Speak("Don't you try anything funny, aight?;What'chu looking at?;WUBADUBDUB, buster.");
                    }
                }
                
                
            }
        }), {special: 0, wubbing: 0}),
        new Pony('Octavia', 'oc', "...;......;........;I am Octavia;Hmph;Practice, practice, practice;*yawn* Oh, my. I'm so terribly sorry. Vinyl has kept me up all night long with her incessant wubs", (img, pon) => {
            switch (img) {
                case 'dash':
                case 'trot': return buildRef(pon, 'trot');
                case 'sleep':
                case 'stand': return buildRef(pon, img);
            }
        }),
        new Pony('Tempest (Fizzlepop) Shadow', 'fizz', "Here's the deal, ladies. I need your magic;Silly little ponies;I think 'bad luck' is superstition;Twilight IS the best snuggler!;Easy as pie;How about we start with your complete and total surrender?;All this power, wasted on parties;I saw the truth;I saw that!;Tempest is not my real name. It's actually..." + speechPause(10) + "Fizzlepop..." + speechPause(10) + "Berrytwist;It's so cold out... I should ask if Twilight wants to snuggle with me!;Let's start with your complete and total surrender, and THEN we can snuggle;*Blushes* Twilight? Can I, um... maybe snuggle with you tonight? I had a nightmare...;I love Twilight, but how can I show her? Hm... snuggles? Snuggles.;What can I do to gain Twilight's affection?;Twilight IS the best pony even though others call me their waifu... whatever that is;Can I have some belly rubs?;I will snuggle for belly rubs;Belly rubs?;Am I... really in love with Twilight?;What is this..." + speechPause(30) + "waifu everypony keeps talking about?", (img, pon) => {
          switch (img) {
            case 'sleep':
            case 'stand': return buildRef(pon, 'stand');
            case 'dash':
            case 'trot': return buildRef(pon, 'trot');
          }
        }),
        sleepless(new Pony('Zephyr Breeze', 'zb', "Stupid sticks...;Name's Zephyr Breeze. It's an honour to meet me;Ponies see me. They hating;You know you love me;My big sis is so gullab- Adorable;What a chump;Guess who's home!;Ponies say I must shave. But I don't listen;You don't have to come up with some excuse to hang out with me", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'dash':
                case 'trot': return buildRef(pon, 'trot');
                case 'fly': return buildRef(pon, img);
            }
        })),
        sleepless(new Pony('Saffron Masala', 'sm', "I'm Saffron Masala, the chef at The Tasty Treat, the most exotic cuisine in Canterlot;Would you like to hear about the specials?;Oh my;Absolutely delectable", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'trot':
                case 'dash': return buildRef(pon, 'trot');
            }
        })),
        sleepless(new Pony('Coriander Cumin', 'cuc', 'Ishktabible;[unenthusiastic] Welcome to The Tasty Treat. You can eat here if you want. Or not. Who cares? ', (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'trot':
                case 'dash': return buildRef(pon, 'trot');
            }
        })),
        attachEvents(new SpecialPony('Lyra Heartstrings', 'lh', 2, "Where's Bon-Bon?;Bon-Bon~;Ponies say I'm strange, but that's just because they don't understand;I just know humans exist;This would be so much easier if only I had hands;Ugh, this hair is so itchy...;*humming* My Little Human, My Little Human...", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, img);
                case 'dash':
                case 'trot': return buildRef(pon, 'trot');
                case 'stand1': return buildRef(pon, 'sit');
                case 'stand2': return buildRef(pon, 'leap');
            }
        }, {
            effect: {
                target: 'self',
                css: { cursor: 'pointer' }
            }
        }), {
            'mouseover': function() {
                if (Math.random() * 40 <= 5) {
                    this.Speak("H-ha-ha-HANDS!;Is that a.... hand!;Ohmigosh it's a hand");
                }
            }
        }),
        new Pony('Bon-Bon', 'bb', "Name's Drops, Agent, Sweetie Drops, but everypony around here just calls me Bon-Bon;I'm Bon-Bon. I make, uh, bon bons;Please tell me there's no bug bears here;Oh, Lyra~;Lyra!;I didn't put those in my bag;Is Fluttershy still here? We heard Fluttershy was here!;Go ahead, try one of your jokes out on me! I laugh at everything", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, img);
                case 'dash':
                case 'trot': return buildRef(pon, 'trot');
            }
        }),
        attachMemory(attachEvents(new SpecialPony('Derpy Hooves', 'duh', 3, "I messed up big time in those invitions Doc;Muffins!;I messed up everything for Cranky's wedding...;Hi;Muffins...;*waves*;Muffins?;I just don't know what went wrong;Muffin!;Hi, I'm Ditzy;I'm Derpy;Derp;Ooh bubbles;What you talkin' about;Heehee;Oh, you;Ponies feel bad cause of my eyes;*squee*;I'm on the weather team you know;Ima Derp, Derp, Derp...;I'm confused;Doctor?", (img, pon) => {
            switch (img) {
                case 'sleep2':
                case 'sleep3':
                case 'sleep': return buildRef(pon, 'sleep');
                case 'stand': return buildRef(pon, img);
                case 'dash3':
                case 'dash': return buildRef(pon, 'dash');
                case 'trot3':
                case 'trot': return buildRef(pon, 'trot');
                case 'dash1': 
                case 'fly3':
                case 'fly': return buildRef(pon, 'fly');
                case 'stand1': return buildRef(pon, 'hover');
                case 'stand2': return buildRef(pon, 'hover_inv');
                case 'dash2': 
                case 'fly2': return buildRef(pon, 'fly_inv');
                case 'stand3': return buildRef(pon, 'muffin');
            }
        }, {
            1: "Rainbow Dash says I must be careful around clouds;Dark clouds make Derpy go ouchie;I'm on the weather team you know;Ahoy!;Nyan nyan nyan nyan Ni hao nyan;One... Two... Muffin! Four...;Squee!",
            2: "Call me Dr. Derp;I have a PHD you know;My bubble theory saved Equestria 30,000 bits!;I derp, therefore I am;If a tree falls and nopony is there to hear it. Derp?;The meaning of life is.... ooh a MUFFIN!;I actually don't like muffins." + speechPause(100) + "Scones are where it's at.",
            effect: {
                level: 2,
                target: '.speech',
                css: {
                    transform: 'scale(-1,-1)'
                }
            }
        }),{
            'mouseover': function() {
                if (Math.random() * 80 <= 5) {
                    this.ponyType().setMemory('explode', true);
                    this.Speak('Press M for a surprise!');
                }
            },
            'tick': function() {
                if (document.querySelector('.muffin')) {
                    if (!this.container.classList.contains('muffin')) {
                        this.pastState = {
                            'container': this.container,
                            'target_x': this.target_x
                        };
                        var c = document.querySelector('.muffin');
                        var offset = c.getBoundingClientRect();
                        this.UpdateMouse(offset.left + c.offsetWidth/2, offset.top + c.offsetHeight/2, c);
                    }
                    var difX = this.target_x - this.x;
                    var difY = (this.container.getBoundingClientRect().top + this.container.offsetHeight/2) - this.y;
                    if (Math.sqrt(difX*difX + difY*difY) < this.dom_element.offsetHeight/3 + 10) {
                        this.container.parentNode.removeChild(this.container);
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
                    if (!document.querySelector('input:focus, textarea:focus')) {
                        pony.setMemory('explode', false);
                        for (var i = 0; i < 20; i++) {
                            new Particle('<div class="muffin"></div>', this.x, this.y, (Math.random() * 50) - 25, (Math.random() * 50) - 25);
                        }
                        this.x = this.y = 0;
                        this.fadeOutText();
                        this.Say('');
                    }
                }
            }
        }), {'explode': false}),
        new SpecialPony('Doctor Hooves', 'dr', 10, "Great Wickering Stallions!;Did you know there was a spell for time travel? I wish I'd known that...;I'll try my hardest not to die, honest;Not impossible. Just... a bit unlikely;I'm always alright;Timey wimey, spacey wacey;Briliant! You are briliant!;Fantastic!;Allons-y!;Don't mind me, off to save time and space;Trust me. I'm the Doctor;Eh, no thanks;Would you please leave me alone!", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'tand': return buildRef(pon, img);
                case 'dash':
                case 'trot': return buildRef(pon, 'trot');
                case 'stand8': return buildRef(pon, 'fez');
                case 'dash8':
                case 'trot8': return buildRef(pon, 'trot_fez');
            }
        }),
        new Pony('Spitfire', 'wbsf', "Lets go, Wonderbolts!;Wanna come hang out with us?;Hey, I know you!;Looks like your skill saved us again;Rainbow Dash has heart and determination. I have no doubt she'll get in some day;*SWAG*;Please, no autographs;Dash thinks she's fast, we'll have to see about that;I'll give it to ya straight kid...;Why yes, I am a WonderBolt;I'm Spitfire™;Only the best-of-the-best make it out alive;I like ya kid;Lose? Pfft, this me you're talkin' to;Leave it to the professionals", (img, pon) => {
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
            pony.getSprite = function(ip, face, base, url) {
                var other = this.getMemory('disguise');
                if (other && this.cache.ready) return other.getSprite(ip, face, base, url);
                return this.__getSprite(ip, face, base, url);
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
                ['sleep','dash','stand','trot','fly'].forEach(a => {
                  this.cache.cache(other.bakeSprite(a));
                })
                return other;
            };
            return pony;
        })(attachCache(attachMemory(attachEvents(new Pony('Changeling', 'chng', "Hisssss...!;...Hhhhungry...;[laughing];Hi! I'm <insert generic pony name here>!", (img, pon) => {
            let sprite = img.split(/([0-9]+)/g);
            if (sprite[0] == 'sleep') sprite[0] = 'stand';
            return buildRef(pon, sprite[1], sprite[0]);
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
                        return `~${other.getSay(a)}~`;
                    }
                }
                return null;
            }
        }), {
            disguise: null,
            ticks_to_change: 900
        }))),
        new Pony('Sea Breeze', 'sb', ".. ...;.. .. .. ..;.... .. .;... . ... .  .... . . . ...;.... . .... . ... .. .;.;...;.... ..... ..;... .. .. . . .  . .  ..... . .... .", (img, pon) => {
            switch (img) {
                case 'stand':
                case 'sleep': return buildRef(pon, 'float');
                case 'trot':
                case 'dash': return buildRef(pon, 'fly');
            }
        }),
        Spacer('Fillies', new SpecialPony('Filly Rarity', 'frar', 4, "A ROCK!?;I. Don't Even...;I'm adorable and you can't stop me;Gently please;How can you be so insensitive?;Ooooooooooooooooooooooooooo;Pruney Hooves!!;This, is whining", (img, pon) => {
            switch (img) {
                case 'trot':
                case 'sleep':
                case 'stand': return buildRef(pon, img);
                case 'stand2':
                case 'dash': return buildRef(pon, 'pull');
                case 'dash3': return buildRef(pon, 'drag');
            }
        })),
        extendOriginalSays(new Pony('Filly Dash', 'fdash', "Awesome!;See you boys at the finish line!;Hey!;I need an adult", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'trot':
                case 'dash':
                case 'fly': return buildRef(pon, img);
            }
        }), 0.3),
        new SpecialPony('Apple Bloom', 'cmc1', 4, "Howdy, I'm Apple Bloom;CUTIE MARK CRUSADERS INTERNET EXPLORERS YAY!!;Somepony needs to put this thing out of its misery;Not the cupcakes!;Likely story;I'm not a baby, I can take care of myself!;I am a big pony!;But ah want it now!;Apple Bloom, Apple Bloom!;[BUY SOME APPLES]!", (img, pon) => {
            switch (img) {
                case 'trot2':
                case 'trot': return buildRef(pon, 'trot');
                case 'stand':
                case 'dash':
                case 'sleep': return buildRef(pon, img);
                case 'trot1': return buildRef(pon, 'skip');
                case 'stand2': return buildRef(pon, 'spin');
                case 'stand4': return buildRef(pon, 'push_ups');
            }
        }),
        new SpecialPony('Sweetie Belle', 'cmc2', 3, "I'm Sweeetiee Belle!;I wonder how that happened...;Stupid Horn!;Aww. That was such a sweet story;Are you sure I can't help?;Hush now, quiet now.;I can help, big sis!;Oh, oh, oh! Maybe I could....just...stand....over here....and watch.;That's a great safe idea.", (img, pon) => {
            switch (img) {
                case 'trot':
                case 'stand':
                case 'dash':
                case 'sleep': return buildRef(pon, img);
                case 'trot2': return buildRef(pon, 'skip');
                case 'stand1': return buildRef(pon, 'sit');
                case 'stand2': return buildRef(pon, 'sit_2');
                case 'stand3': return buildRef(pon, 'jump');
            }
        }, {
            1: "Ughh! I'm so BORED!;Dumb fabric!",
            2: "I know this one!;Hammer!;You cannot run from me!;We could form our own secret society!;♪ We are the Cutie Mark Crusaders! ♫"}),
        attachMemory(isOnDay(1, 4) ? new Pony('Scootaloo', 'chicken', "I'm a..." + speechPause(10) + "chicken?;Scoot- Scoot- SCOOTALOO!!!;What am I? A chicken?;Bukka bukka;Bukka bukka;Bukka bukka;Bukka bukka, scoot- SCOOTALOO!!!;Bukka...", (img, pon) => {
                switch (img) {
                    case 'sleep':
                    case 'stand': return buildRef(pon, 'stand');
                    case 'dash':
                    case 'trot': return buildRef(pon, 'trot');
                    case 'fly': return buildRef(pon, img);
                }
            })
            : attachEvents(new Pony('Scootaloo', 'cmc3', "I swear, they make one more chicken joke I'm gonna- Pequawk! *blushes*;I'm Scootaloo! The most awesome one!;I'm a... chicken?;Scoot- Scoot- SCOOTALOO!!!;What am I? A chicken?;Wha...huh?;TLC as in Tender Loving Care or Totally Lost Cause?;That's so funny I forgot to laugh;Bukka bukka;That is not how you call a chicken;You've got a problem with blank flanks?;Never, never, never!;These namby-pamby stories aren't going to take us any closer to our cutie marks;I'm liking this idea;I'll do whatever you want, Rainbow Dash!;Ewwww!;The possibilities are, like, endless!;We were making a table?;I'm going to get my mark first!;Do you know where we can find a cannon at this hour?;Sup.;Dash! Dash! Over here, Dash!;Are you my mummy?", (img, pon) => {
                switch (img) {
                    case 'sleep':
                    case 'stand': return buildRef(pon, 'stand');
                    case 'trot':
                    case 'dash':
                    case 'fly': return buildRef(pon, img);
                }
            }), {
                'mouseenter': function () {
                    if (Math.random() * 20 <= 5) {
                        this.Speak("What?;Watch it! That thing's sharp!;Ow!;Quit it!;BAD TOUCH! BAD TOUCH!");
                    }
                },
                'say': (angrySays => {
                    return function() {
                        if (this.ponyType().getMemory('special')) {
                            return pickOne(angrySays);
                        }
                        return null;
                    }
                })('Hey!;Leave him alone!;What are you doing to Pip!?'.split(';'))
            }), {'special': false}),
        new SpecialPony('Babs Seed', 'cmc4', 1, "Hey! That's not how you talk to my friends!;See ya later, Cutie Mark Crybabies!;Looks like somepony's pumpkin just got squashed!;*pooft*;Sup;Welcome to the Babs side 'a town;~bad seed, bad seed~ What? It's a catchy tune;Eh, I've seen better", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'trot':
                case 'dash': return buildRef(pon, 'trot');
                case 'sleep1':
                case 'stand1': return buildRef(pon, 'smug');
                case 'trot1':
                case 'dash1': return buildRef(pon, 'trot_smug');
            }
        }),
        attachEvents(attachMemory(sleepless(new SpecialPony('Pipqueak', 'pip', 2, "Onward to adventure!;Cheerio;Me first!;I want to learn how to become a Cutie Mark Crusader!;When I grow up I wanne be jus' like ma cap'n;*sneezes*" + speechPause(10) + "Sorry...;*whispers* When 'm 'lone I like to preten' t' be a pirate;Have you seen my peggy bank?", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'stand');
                case 'dash':
                case 'trot': return buildRef(pon, 'trot');
                case 'sleep2':
                case 'stand2': return buildRef(pon, 'stand_pirate');
                case 'dash2':
                case 'trot2': return buildRef(pon, 'trot_pirate');
            }
        }, {
            1: "Ever since I lost my eye, I've been craving nothing but candy!;Pipsqueak the pirate, at your service;Pipsqueak the pirate, at your service. Arrg;Arrrg matey;Scary, but fun;I be pirate Pip at yer service"})), {
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
                                const a = new InteractivePony();
                                a.fadeOutText();
                                a.ponyType = function () {
                                    return PoniesRegister['Scootaloo'];
                                };
                                PoniesRegister['Scootaloo'].setMemory('special', true);
                                a.InitPony();
                                a.Say('');
                                fQuery.animationFrame(function (time) {
                                    a.Update(time);
                                    a.Render()
                                }, 0.1);
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
        offset(sleepless(new Pony('Princess Flurry Heart', 'flur', 'Pftftft;Gugug...;*baby noises*;Gah! :D^', (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'sit');
                case 'dash':
                case 'trot':
                case 'fly': return buildRef(pon, 'fly');
            }
        })), function(el, state) {
            if (state == 'stand' || state == 'sleep') el.css('margin-top', '-20px');
        }),
        Spacer('Other', new SpecialPony('Fluffle Puff', 'flf', 2, "Pfftt.;Pffft pfftt;Pfffffffffffffffffftttttt;:P", (img, pon) => {
            switch (img) {
                case 'sleep':
                case 'stand': return buildRef(pon, 'phbbt');
                case 'sleep2':
                case 'stand2': return buildRef(pon, 'gasp');
                case 'trot':
                case 'dash': return buildRef(pon, 'trot');
            }
        }))
    ];

    let CustomPony = {
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
        pony.getSay = () => CustomPony.sayings[Math.floor(Math.random() * (CustomPony.sayings.length - 1))] || "...";
        pony.bakeGif = (url, suffex, cache) => pony.bakeSprite(stateMap[url] + suffex);
        pony.bakeSprite = img => CustomPony.sprites[img];
        pony.args = () => CustomPony;
        pony.Name = CustomPony.name;
        return pony;
    })(new Pony('Custom', 'custom', '', function(img) {
        return CustomPony.sprites[img];
    })));
    
    const PoniesRegister = {};
    Ponies.forEach(a => PoniesRegister[a.Id] = a);
    var GlobalInteractivePony = null, GlobalPonyType = getPonyType();
    addOptionsSelect();
    setupMorePonies();

    //--------------------------------------------------------------------------------------------------
    //----------------------------------------FUNCTIONS-------------------------------------------------
    //--------------------------------------------------------------------------------------------------

    function isOnDay(day, month) {
        if (!isOnDay.date) {
            const t = new Date();
            isOnDay.date = {day: t.getDate(), month: t.getMonth() + 1}
        }
        return isOnDay.date.day == day && isOnDay.date.month == month;
    }

    function getPonyType() {
        var result = docCookies.getItem("interactive_pony_type");
        return PoniesRegister[result] ? result : Ponies[0].Id;
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
        return Array(length + 1).join(' ');
    }

    function extendOriginalSays(pony, ratio) {
        const s = pony.getSay;
        pony.getSay = a => Math.random() < ratio ? s.call(pony, a) : a;
        return pony;
    }

    function attachCache(pony) {
        const record = {};
        let loading = 0;
        pony.cache = {
            ready: true,
            cache: img => {
                if (record[img] === undefined) {
                    record[img] = false;
                    pony.cache.ready = false;
                    loading++;
                    document.body.insertAdjacentHTML('beforeend', `<img style="display:none;" src="${img}"></img>`)
                    const image = document.body.lastChild;
                    image.addEventListener('load', () => {
                        image.parentNode.removeChild(image);
                        record[img] = true;
                        loading--;
                        pony.cache.ready = loading <= 0;
                    });
                    image.addEventListsner('error', () => {
                        image.parentNode.removeChild(image);
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
        pony.getMemory = key => memory[key],
        pony.setMemory = (key, val) => memory[key] = val;
        return pony;
    }

    function attachEvents(pony, eventObject) {
        eventObject.Trigger = (interactivePony, e) => {
            if (typeof e === 'string') e = {type: e};
            return eventObject[e.type] ? eventObject[e.type].call(interactivePony, e) : null;
        };
        pony.Events = eventObject;
        return pony;
    }

    function Spacer(name, pony) {
        pony.section = name;
        return pony;
    }

    function DummyPony(name) {
        return {
            Id: name, Name: name,
            getSay: a => a,
            getSprite: (ip, face, base, url) => base + url,
            getAccess: _ => '',
            cssImages: (ip, face) => ip.pony_element.style.transform = '',
            toJson: function() {
              return {
                name: name,
                sayings: dash_sayings,
                sprites: {
                  "sleep": "https://static.fimfiction.net/images/interactive_pony/dash/cloud_sleep_right.gif",
                  "stand": "https://static.fimfiction.net/images/interactive_pony/dash/stand_rainbow_right.gif",
                  "trot": "https://static.fimfiction.net/images/interactive_pony/dash/trotcycle_rainbow_right.gif",
                  "dash": "https://static.fimfiction.net/images/interactive_pony/dash/dashing_right.gif",
                  "fly": "https://static.fimfiction.net/images/interactive_pony/dash/fly_rainbow_right.gif"
                }
              }
            }
        };
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

        const parent = new Pony(name, key, sayings, giffactory, args);
        let Active = -1;
        let next_active_timer = 10;
        let Specials = {};
        let SpecialAccess = {};
        
        return {
            Id: name, Name: name,
            getSay: function(a) {
                if (Active > -1 && args[Active + 1] != null) {
                    return pickOne(args[Active + 1]);
                }
                return parent.getSay(a);
            },
            getState: _ => Active,
            setState: a => Active = a < 0 ? 0 : a,
            getSprite: function(ip, face, base, url) {
                url = parent.resolveUrl(face, url);
                var result = null;
                for (var looked = Active; looked > 0; looked--) {
                    if (!Specials[looked]) Specials[looked] = {};
                    result = parent.bakeGif(url, looked, Specials[looked]);
                    if (result) return result;
                    result = parent.bakeGif(url.replace('fly', 'trotcycle'), looked, Specials[looked]);
                    if (result) return result;
                }
                return parent.getSprite(ip, face, base, url);
            },
            bakeSprite: _ => parent.bakeSprite(img),
            getAccess: function(ip, face, base, url) {
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
                return parent.getAccess(ip, face, base, url);
            },
            cssImages: function(ip, face) {
                parent.internal__cssImages(ip, face);
                args = parent.args();
                if (args.effect && (args.effect.level == undefined || args.effect.level == Active)) {
                    const anim_target = (args.effect.target === 'self' ? ip.dom_element : ip.dom_element.querySelector(args.effect.target));
                    ip.dom_element.dataset.target = args.effect.target;
                    const keys = Object.keys(args.effect.css);
                    keys.forEach(a => {
                        anim_target.style[a] = args.effect.css[a];
                    });
                    ip.dom_element.dataset.label = keys.join(';');
                }
            },
            toJson: _ => parent.toJson()
        };
    }

    function Pony(name, key, sayings, giffactory, args) {
        if (!args) args = {};
        sayings = sayings.split(';');
        var Images = {};
        var Accessories = {};
        return {
            Id: name, Name: name,
            args: _ => args,
            getSay: a => pickOne(sayings),
            getSprite: function(ip, face, base, url) {
                return this.bakeGif(this.resolveUrl(face, url), '', Images);
            },
            getAccess: function(ip, face, base, url) {
                return this.bakeGif(this.resolveUrl(face, url), '_ac', Accessories);
            },
            resolveUrl: function(face, url) {
                if (!giffactory('fly', key)) url = url.replace('fly', 'trotcycle');
                return face == 'left' ? url.replace('left', 'right') : url;
            },
            bakeGif: function(url, suffex, cache) {
                if (cache[url] === undefined) cache[url] = this.bakeSprite(stateMap[url] + suffex, key);
                return cache[url];
            },
            bakeSprite: function(img) {
                return giffactory(img, key) || null;
            },
            internal__cssImages: function(ip, face) {
                ip.pony_element.style.transform = ip.accessory_element.style.transform = face == 'left' ? 'scaleX(-1)' : '';
                if (face == 'left') {
                    ip.accessory_element.style.left = '-30px';
                    ip.accessory_element.style.right = '';
                } else {
                    ip.accessory_element.style.left = '';
                    ip.accessory_element.style.right = '-30px';
                }
            },
            cssImages: function(ip, face) {
                this.internal__cssImages(ip, face);
                args = this.args();
                var anim_target = ip.dom_element.dataset.target;
                if (anim_target && anim_target != '') {
                    anim_target = (anim_target === 'self' ? ip.dom_element : ip.dom_element.querySelector(anim_target));
                    ip.dom_element.dataset.label.split(';').forEach(a => {
                        anim_target.style[a] = '';
                    });
                }
                if (args.effect) {
                    const anim_target = (args.effect.target === 'self' ? ip.dom_element : ip.dom_element.querySelector(args.effect.target));
                    ip.dom_element.dataset.target = args.effect.target;
                    const keys = Object.keys(args.effect.css);
                    keys.forEach(a => {
                        anim_target.style[a] = args.effects.css[a];
                    });
                    ip.dom_element.dataset.label = keys.join(';');
                }
            },
            toJson: function() {
              const json = this.args();
              json.name = name;
              json.sayings = sayings;
              json.sprites = this.fillSpritesObj(this.fillSpritesObj({}, ''), '_ac');
            },
            fillSpritesObj: function(obj, suffex) {
              ['sleep','dash','stand','fly','trot'].forEach(a => {
                let sprite = giffactory(a + suffex, key);
                if (sprite) obj.sprites[a + suffex] = sprite;
              });
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
        this.scrollX = document.scrollingElement.scrollLeft;
        this.scrollY = document.scrollingElement.scrollTop;
        this.element = el;
        document.body.appendChild(el);
        this.particleWidth = this.element.offsetWidth;
        this.particleHeight = this.element.offsetWidth;
        this.element.style.position = 'absolute';
        this.Tick();
    }
    Particle.prototype = {
        Tick: function() {
            this.Render();
            this.Update();
            if (!this.dead) setTimeout(() => this.Tick(), 16);
        },
        Update: function() {
            const posY = this.y - this.scrollY;
            if ((posY >= window.offsetHeight - this.particleHeight/2 && this.velY > 0) || (posY <= this.particleHeight/2 && this.velY < 0)) {
                this.velY = -this.velY * 0.9;
            }
            if (Math.random() * Math.abs(this.velY) < 1) {
                this.velY = -this.velY * 0.9;
                this.rotation = (this.rotation + 90) % 360;
            }
            const posX = this.x - this.scrollX;
            if ((posX >= window.offsetWidth - this.particleWidth/2 && this.velX > 0) || (posX <= this.particleWidth/2 && this.velX < 0)) {
                this.velX = -this.velX * 0.9;
            }
            this.x += this.velX;
            this.y += this.velY;
            this.velX *= 0.96;
            this.velY *= 0.99;
            this.dead = (this.velY < 0.1 && this.velY > -0.1) || (this.velX < 0.1 && this.velX > -0.1) || this.ticks++ > 50000;
        },
        Render: function() {
            this.element.style.left = (this.x - (this.particleWidth/2)) + 'px';
            this.element.style.top = (this.y - (this.particleHeight/2)) + 'px';
            this.element.style.transform = `rotate(${this.rotation}deg)`;
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
            this.FadeOutText();
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
            if (this.text) this.FadeInText();
        };
        InteractivePony.prototype.Speak = function (a) {
            this.text = pickOne(a.split(';'));
            this.next_text_timer = this.text_counter = 0;
            if (this.text) this.FadeInText();
        };
        InteractivePony.prototype.Clicked = function() {
            this.state = this.state == 'sleeping' ? 'default' : 'sleeping';
            this.forceSleep = this.state == 'sleeping';
            if (this.forceSleep) {
                this.SetSprite('cloud_sleep_right.gif');
                this.FadeOutText();
            }
            this.Trigger('click');
        };
        InteractivePony.prototype.SetSprite = function (a) {
            if (this.sprite != a) {
                this.sprite = a;
                var pone = this.ponyType();
                pone.cssImages(this, this.facing);
                var access = pone.getAccess(this, this.facing, this.base_url, a);
                this.accessory_element.src = access;
                this.accessory_element.style.display = access == '' ? 'none' : '';
                this.pony_element.src = pone.getSprite(this, this.facing, this.base_url, a);
                this.dom_element.style.margin = '';
                if (pone.offset) pone.offset(stateMap[a]);
            }
        };
        InteractivePony.prototype.__Render = InteractivePony.prototype.Render;
        InteractivePony.prototype.Render = function() {
            if (!this.accessory_element) {
                this.InitPony();
                GlobalInteractivePony = this;
                this.ponySwitched();
            }
            if (this.forceSleep) {
                return this.dom_element.querySelector('.speech').textContent = this.text.substr(0, parseInt(this.text_counter));
            }

            this.__Render();
        };

        function registerEvents(sender, handler) {
            'mousedown mouseenter mouseleave mousemove mouseover mouseout mouseup click hover'.split(' ').forEach(e => sender.dom_element.addEventListener(e, handler));
            'keydown keypress keyup'.split(' ').forEach(e => document.body.addEventListener(e, handler));
            sender.dom_element.addEventListener('mousedown', e => e.preventDefault());
        }

        InteractivePony.prototype.FindSecret = function(e) {
            const key = e.interactivePony_secret;
            return key && key.indexOf(this.uniqueId) > -1;
        }
        InteractivePony.prototype.AddSecret = function(e) {
            const key = e.interactivePony_secret || [];
            key.push(this.uniqueId);
            e.interactivePony_secret = key;
        }

        InteractivePony.prototype.FadeOutText = function() {
            //originally a noop, knitty pls
            if (this.text && this.text_counter >= this.text.length) {
                this.dom_element.querySelector('.speech').style.opacity = '0';
            }
        };
        InteractivePony.prototype.FadeInText = function() {
            //originally doesn't exist, knitty pls
            this.dom_element.querySelector('.speech').style.opacity = '1';
        };
        InteractivePony.prototype.InitPony = function() {
            this.pony_element = this.dom_element.querySelector('img.interactive_pony');
            this.pony_element.insertAdjacentHTML('afterend', '<img class="interactive_pony_accessory" style="position:absolute;bottom:0px;opacity:0" />');
            this.accessory_element = this.dom_element.querySelector('img.interactive_pony_accessory');

            this.pony_element.style.userSelect = this.accessory_element.userSelect = 'none';
            this.pony_element.style.pointerEvents = this.accessory_element.pointerEvents = 'none';

            this.dom_element.style.pointerEvents = 'initial'; //enable clicking, knitty pls

            this.Register();
            registerEvents(this, e => this.Trigger(e));
            document.body.addEventListener('mousemove', d => {
                var e = d.target;
                if (!fQuery.isOrChildOf(e, this.dom_element)) {
                    do {
                        if (e.getBoundingClientRect().height > 50) {
                            if (!this.FindSecret(d)) {
                                this.AddSecret(d);
                                return this.UpdateMouse(d.pageX, d.pageY, e, d);
                            }
                        }
                    } while (e = e.parentNode);
                }
            });

            this.Say('');
        }
        InteractivePony.prototype.__UpdateMouse = InteractivePony.prototype.UpdateMouse;
        InteractivePony.prototype.UpdateMouse = function(x, y, el, ev) {
            if (!ev) return;
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

        makeStyle(`
            .interactive_pony .speech {
                transition: opacity 0.5s linear;
                opacity: 0;}
            .interactive_pony .speech_container {pointer-events: none;}
            div.interactive_pony div.speech {font-size: 0.844em !important;}
            .muffin {
                z-index: 10;
                pointer-events: none;
                width:20px;
                height:20px;
                background:url("//raw.githubusercontent.com/Sollace/UserScripts/master/Interactive Ponies/muffin.png") center no-repeat;
                background-size:fit;
                border-radius:30px;}
            .wubadub {animation: wub 1.5s infinite alternate, acid 1.5s infinite alternate;}
            .wubadub.bass {
                animation: bass 1.5s infinite alternate, acid 1.5s infinite alternate;}
            ${expand(['@-webkit-', '@'], `keyframes bass {
                0% {transform: scale(1,1), translate(0,0);}
                10% {transform: scale(1.00125,1.00125) translate(5%,-5%);}
                20% {transform: scale(1.0125,1.0125) translate(-5%,5%);}
                30% {transform: scale(1.00125,1.00125);}
                40% {transform: scale(1.0125,1.0125);}
                50% {transform: scale(1.00125,1.00125) translate(-5%,5%);}
                60% {transform: scale(1,1);}
                70% {transform: scale(0.99985,0.99985) translate(-5%,5%);}
                80% {transform: scale(1,1) translate(-5%,5%);}
                90% {transform: scale(1.0125,1.0125) translate(5%,5%);}
                100% {transform: scale(1.00125,1.00125) translate(5%,-5%);}}`)}
            ${expand(['@-webkit-', '@'], `keyframes acid {
                0%: {filter: hue-rotate(0deg);}
                33% {filter: hue-rotate(180deg);}
                66% {filter: hue-rotate(270deg);}
                100%: {filter: hue-rotate(0deg);}}`)}
            ${expand(['@-webkit-', '@'], `keyframes wub {
                0% {transform: scale(1,1);}
                10% {transform: scale(1.00125,1.00125);}
                20% {transform: scale(1.0125,1.0125);}
                30% {transform: scale(1.00125,1.00125);}
                40% {transform: scale(1.0125,1.0125);}
                50% {transform: scale(1.00125,1.00125);}
                60% {transform: scale(1,1);}
                70% {transform: scale(0.99985,0.99985);}
                80% {transform: scale(1,1);}
                90% {transform: scale(1.0125,1.0125);}
                100% {transform: scale(1.00125,1.00125);}}`)}`);

        function expand(arr, block) {
            arr.push('');
            return arr.join(`${block}\n`);
        }

        function markTemp(ticker, interactivePony) {
            let timeout = 5000;
            const render = interactivePony.Render;
            interactivePony.Render = function() {
                if (timeout-- <= 0) {
                    this.dom_element.style.transition = 'opacity 0.5s linear';
                    this.dom_element.style.opacity = '0';
                    clearInterval(ticker);
                    setTimeout(() => {
                        this.Unregister();
                        this.dom_element.parentNode.removeChild(this.dom_element);
                    }, 500);
                }
                render.apply(this, arguments);
            }
        }
    }

    function addOptionsSelect() {
        const interactiveP = document.querySelector('input[name="show_interactive_pony"]');
        if (!interactiveP) return;
        const optItem = (a,i) => {
            let res = '';
            if (a.section) res += `${i ? '</optgroup>' : ''}<optgroup label="${a.section}">`;
            if (a.Id == 'Custom') return `${res}<option id="custom_option" value="Custom">Custom (${a.Name})</option>`;
            return `${res}<option value="${a.Name}">${a.Name}</option>`;
        };
        interactiveP.parentNode.closest('tr').insertAdjacentHTML('afterend', `<tr>
            <td class="label">Interactive Pony Type</td>
            <td><div id="ponyTypeDiv"><select name="interactive_pony_type">${Ponies.map(optItem).join('')}</select></div></td>
        </tr>
        <tr id="custom_pony_field" style="${GlobalPonyType != 'Custom' ? 'display:none' : ''}">
            <td class="label">Custom interactive Pony</td>
            <td><div id="pony_customDiv"><textarea style="resize:vertical;min-height:500px;">${JSON.stringify(CustomPony, null, 4)}</textarea></div></td>
        </tr>`);

        const InteractivePonyType = document.querySelector('#ponyTypeDiv select');
        InteractivePonyType.value = GlobalPonyType;

        const field = document.querySelector('#custom_pony_field');
        InteractivePonyType.addEventListener('change', e => {
            setPonyType(InteractivePonyType.value);
            field.style.display = InteractivePonyType.value == 'Custom' ? '' : 'none';
        });
        const customOption = document.querySelector('option#custom_option');
        customOption.innerText = `Custom (${CustomPony.name})`;

        const ponyCustom = document.querySelector('#pony_customDiv textarea');
        ponyCustom.addEventListener('change', ponyChanged);
        ponyCustom.addEventListener('keyup', ponyChanged);

        function ponyChanged() {
            try {
                CustomPony = JSON.parse(localStorage['custom_pony'] = this.value);
                PoniesRegister.Custom.Name = CustomPony.name;
                customOption.innerText = `Custom (${CustomPony.name})`;
            } catch (e) {}
            if (GlobalInteractivePony) GlobalInteractivePony.ponySwitched();
        }
    }

    function buildRef(pon, ...img) {
        return `//raw.githubusercontent.com/Sollace/UserScripts/master/Interactive Ponies/Sprites/${pon}/${img.join('/')}.gif`;
    }

    function playSong(ytid, loaded) {
        if (!document.querySelector('#song_frame')) {
            document.body.insertAdjacentHTML('beforeend', '<iframe style="display:none;" id="song_frame" />');
        }
        const player = document.querySelector('#song_frame');
        player.src = `//www.youtube.com/embed/${ytid}?autoplay=1&controls=0&enablejsapi=1&loop=1&playlist=uNHS09davuY&showinfo=0`;
        player.addEventListener('load', player.ready = (() => {
            loaded();
            player.removeEventListener('load', player.ready);
        }));
        return player;
    }
}
