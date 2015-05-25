// ==UserScript==
// @name        FimFiction Sommenter
// @description Adds an option to pin the comment box to the bottom of the window.
// @author      Sollace
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net*
// @include     https://www.fimfiction.net*
// @version     2.2.5
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
$('.jump-to').on('click', function(b) {
  b.preventDefault();
  b.stopPropagation();
  if (!$('body').hasClass('pin_comment')) {
    var a;
    if ('bottom' == $(this).data('align')) {
      a = $($(this).data('jump'));
      a = a.offset().top - $(window).height() + a.height();
    } else {
      a = $($(this).data('jump')).offset().top;
    }
    $("html, body").animate({scrollTop: a}, 500);
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
function makeButton(a, text, img){
  var result = $('<li class="button-group"><button class="drop-down-expander" title="' + text + '"><i class="' + img + '"></i></button></li>');
  $(a).append(result);
  return result.find('button');
}

var vendor = vendor || null;
//==API FUNCTION==//
function getVendorPrefix() {
  if (vendor == null) {
    var styles = window.getComputedStyle(document.documentElement, '');
    var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
    var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    vendor = {dom: dom, lowercase: pre, css: '-' + pre + '-', js: pre[0].toUpperCase() + pre.substring(1)};
  }
  return vendor;
}

//==API FUNCTION==//
function makeStyle(input, id) {
  while (input.indexOf('  ') != -1) input = input.replace(/  /g,' ');
  input = input.replace(/-\{0\}-/g, getVendorPrefix().css);
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = input;
  if (id) style.id = id;
  document.head.appendChild(style);
}