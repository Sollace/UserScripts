// ==UserScript==
// @name        FimFiction Sommenter
// @description Adds an option to pin the comment box to the bottom of the window.
// @author      Sollace
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net*
// @include     https://www.fimfiction.net*
// @version     2.2.3
// @require     http://code.jquery.com/jquery-1.8.3.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

var interactiveP = $('input[name="show_interactive_pony"]');
if (interactiveP.length > 0) {
    interactiveP = interactiveP.parent().parent().parent().parent();
    var Option = $('<input type="checkbox" name="pin_comments">');
    var row = $('<tr><td class="label">Pin Comment Section on load</td><td><label class="toggleable-switch" ><a /></label></td></tr>');
    row.find('.toggleable-switch').prepend(Option);
    interactiveP.before(row);
    Option.attr('checked', getPinComments());
    Option.click(function () {
        setPinComments(this.checked);
    });
}

var commentBox = $("#add_comment_box .toolbar_buttons");
if (commentBox.length > 0) {
    setupTogglePin(commentBox[0]);
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

unsafeWindow.AddQuote = function(id, shift) {};
$(document).on("click",".comment .reply_button",function(a){AddQuote($(this).data("comment-id"),a.shiftKey || $('body.pin_comment').length > 0)});

function AddQuote(a, b) {
  unsafeWindow.InsertTextAt($('#comment_entry textarea') [0], (0 < $('#comment_entry textarea').val().length ? '\n' : '') + '>>' + a + ' ');
  b || $('html, body').animate({
    scrollTop: $('#new_comment').offset().top
  }, 300)
}

$('#comment_preview').on('mouseenter', function() {
    $('body').addClass('hold_comment');
});
$('#comment_preview').on('mouseleave', function() {
    $('body').removeClass('hold_comment');
});
$(document).off('click','.jump-to').on('click','.jump-to', function(b) {
  b.preventDefault();
  if (!$('body').hasClass('pin_comment')) {
    $("html, body").animate({
      scrollTop: $($(this).data("jump")).offset().top
    }, 500);
  } else {
    $('body').addClass('hold_comment');
    setTimeout(function() {
      if (!$('#comment_preview').is(':hover')) {
        $('body').removeClass('hold_comment');
      }
    },2000);
  }
});

makeStyle("\
.comments_pinner:before {\
  content: '';}\
body.pin_comment .comments_pinner:before {\
  content: '';}\
body.pin_comment #add_comment_box {\
  position: fixed;\
  margin: 0px;\
  bottom: 0px;\
  left: 0px;\
  right: 0px;\
  height: 90px;\
  border-radius: 0px;\
  z-index: 99999;}\
body.pin_comment #add_comment_box:hover,\
body.pin_comment.hold_comment #add_comment_box {\
  height: 380px;}\
body.pin_comment #add_comment_box textarea {\
  resize: none;}\
body.pin_comment:not(.hold_comment) #add_comment_box:not(:hover) .format-toolbar {\
  display: none;}\
body.pin_comment #add_comment_box,\
body.pin_comment #add_comment_box textarea {\
  transition: height 0.45s ease !important;}\
body.pin_comment:not(.hold_comment) #add_comment_box:not(:hover) textarea {\
  min-height: 85px !important;\
  height: 85px !important;}\
body.pin_comment #add_comment_box:hover .add_comment_toolbar,\
body.pin_comment.hold_comment #add_comment_box .add_comment_toolbar {\
  padding: 0px;\
  padding-left: 5px;\
  padding-right: 5px;\
  height: 70px;}\
body.pin_comment #add_comment_box .add_comment_toolbar > * {\
  float: left;}\
body.pin_comment #add_comment_box .comment_success,\
body.pin_comment #add_comment_box .comment_processing {\
  margin: 3px;}\
body.pin_comment #comment_preview {\
  position: fixed !important;\
  top: auto !important;\
  bottom: 90px;\
  left: 0px;\
  right: 0px;\
  max-height: 500px;\
  background: white;\
  overflow-y: auto;\
  transition: opacity 0.5s ease, bottom 0.5s ease;\
  z-index: 99998;}\
body.pin_comment:not(.hold_comment) #add_comment_box:not(:hover) + #comment_preview:not(:hover) {\
  opacity: 0;\
  pointer-events: none;}\
body.pin_comment #add_comment_box + #comment_preview:hover,\
body.pin_comment.hold_comment #add_comment_box + #comment_preview,\
body.pin_comment #add_comment_box:hover + #comment_preview {\
  bottom: 380px;}");

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
    $(b).append("<button title=\"" + text + "\"><i class=\"" + img + "\"></i></button>");
    $(a).append(b);
    return b;
}

//==API FUNCTION==//
function makeStyle(input, id) {
    while (input.indexOf('  ') != -1) input = input.replace(/  /g,' ');
    var style = document.createElement('style');
    $(style).attr('type', 'text/css');
    $(style).append(input);
    if (id != undefined && id != null) {
        style.id = id;
    }
    $('head').append(style);
}