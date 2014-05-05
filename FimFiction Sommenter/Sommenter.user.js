// ==UserScript==
// @name        FimFiction Sommenter
// @description Adds an option to pin the comment box to the bottom of the window.
// @author      Sollace
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net*
// @include     https://www.fimfiction.net*
// @version     1.2
// @require     http://code.jquery.com/jquery-1.8.3.min.js
// @require     https://github.com/Sollace/FimFiction-UserScripts/raw/Dev/Internal/SpecialTitles.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

function contains(me, it) { return me != null ? me.indexOf(it) != -1 : false; }
function replaceAll(find, replace, me) {
    var escapeRegExp = function (str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
    return me.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

var interactiveP = $('input[name="show_interactive_pony"]');
if (interactiveP.length > 0) {
    interactiveP = interactiveP.parent().parent().parent();
    var Option = $('<input type="checkbox" name="pin_comments">');

    var row = $('<tr><td class="label">Pin Comment Section on load</td><td><div id="pin_commDiv" /></td></tr>');
    row.find('#pin_commDiv').append(Option);
    interactiveP.before(row);

    Option.attr('checked', getPinComments());
    Option.click(function () {
        setPinComments(this.checked);
    });
}

var commentBox = $("#add_comment_box a[title='Text Color']");
if (commentBox.length > 0) {
    setupTogglePin(commentBox.parent()[0]);

    $(document).ready(function () {
        $('#add_comment_box .form_submitter').on('click', function () {
            $('body.pin_comment #comment_preview').css('opacity', 0);
            setTimeout(function () {
                $('body.pin_comment #comment_preview').html('');
                $('body.pin_comment #comment_preview').css('display', '');
                $('body.pin_comment #comment_preview').css('opacity', '');
            }, 500);
        });
    });
}

makeStyle(".comments_pinner:before {\
        content: '';}\
body.pin_comment .comments_pinner:before {\
        content: '';\
        color: yellow;}\
body.pin_comment #add_comment_box {\
        position: fixed;\
        bottom: -30px;\
        left: 0px;\
        width: 100%;\
    z-index: 99999;}\
body.pin_comment #add_comment_form {\
        height: 90px;}\
body.pin_comment #add_comment_form:hover,\
body.pin_comment.hold_comment #add_comment_form {\
        transition: height 0.45s ease !important;\
        height: 350px;}\
body.pin_comment #add_comment_box:hover .dark_toolbar,\
body.pin_comment.hold_comment #add_comment_box .dark_toolbar {\
        transition: bottom 0.45s ease;}\
body.pin_comment #add_comment_form .dark_toolbar {\
        position: absolute;\
        bottom: 70px;\
        background: none;\
        border: none;}\
body.pin_comment #add_comment_form:hover .dark_toolbar,\
body.pin_comment.hold_comment #add_comment_form .dark_toolbar {\
        bottom: 330px;}\
body.pin_comment #add_comment_form textarea {\
        resize: none;}\
body.pin_comment #add_comment_form:hover textarea,\
body.pin_comment.hold_comment #add_comment_form textarea {\
        margin-top: 5px;\
        height: 285px !important;}\
body.pin_comment:not(.hold_comment) #add_comment_form:not(:hover) textarea {\
        position: absolute;\
        bottom: 0px;\
    min-height: 85px !important;\
        height: 85px !important;}\
body.pin_comment #add_comment_box .emoticons_panel {\
        transition: width 1s ease, opacity 2s ease 0.5s;}\
body.pin_comment:not(.hold_comment) #add_comment_form:not(:hover) .emoticons_panel {\
        width: 0px;\
        opacity: 0;\
        transition: none;}\
body.pin_comment #add_comment_box #comment_preview {\
        position: absolute;\
        bottom: 100%;\
        width: 100%;\
        padding: 0px;\
        background: white;\
        max-height: 500px;\
        min-height: 200px;\
        overflow-y: auto;\
        transition: opacity 0.5s ease;\
        pointer-events: none;}\
body.pin_comment:not(.hold_comment) #add_comment_box:not(:hover) #comment_preview {\
        opacity: 0.3;}");

//--------------------------------------------------------------------------------------------------
//----------------------------------------FUNCTIONS-------------------------------------------------
//--------------------------------------------------------------------------------------------------

function setupTogglePin(toolbar) {
    if ($('#add_comment_box_pin').length == 0) {
        var tog = makeButton(toolbar, "Toggle Pin (Temporary)", "fa comments_pinner");
        $(tog).attr('id', 'add_comment_box_pin');
        $(tog).click(function () {
            var bod = $('body');
            if (bod.hasClass('pin_comment')) {
                bod.removeClass('pin_comment');
            } else {
                bod.addClass('pin_comment');
            }
        });

        if (getPinComments()) {
            $('body').addClass('pin_comment');
        }
    }
}

//--------------------------------------------------------------------------------------------------
//-----------------------------------OPTION FUNCTIONS-----------------------------------------------
//--------------------------------------------------------------------------------------------------

//==API FUNCTION==//
function getPinComments() {
    return GM_getValue('pin_comments', 0) == 1;
}

function setPinComments(val) {
    GM_setValue('pin_comments', val ? 1 : 0);
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------API FUNCTIONS-----------------------------------------------
//--------------------------------------------------------------------------------------------------

//==API FUNCTION==//
function makeButton(a, text, img) {
    var b = document.createElement("li");
    $(b).append("<a href=\"javascript:void();\" title=\"" + text + "\"><i class=\"" + img + "\"></i></a>");
    $(a.parentNode).append(b);
    return b;
}

//==API FUNCTION==//
function makeStyle(input, id) {
    while (contains(input, '  ')) {
        input = replaceAll('  ', ' ', input);
    }
    var style = document.createElement('style');
    $(style).attr('type', 'text/css');
    $(style).append(input);
    if (id != undefined && id != null) {
        style.id = id;
    }
    $('head').append(style);
}