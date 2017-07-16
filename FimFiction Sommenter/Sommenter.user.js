// ==UserScript==
// @name        FimFiction Sommenter
// @description Adds an option to pin the comment box to the bottom of the window.
// @author      Sollace
// @namespace   fimfiction-sollace
// @include     http://www.fimfiction.net*
// @include     https://www.fimfiction.net*
// @version     3.1
// @grant       none
// ==/UserScript==

var interactiveP = document.querySelector('input[name="show_interactive_pony"]');
if (interactiveP) {
  setupOptionsToggle(interactiveP.parentNode.parentNode.parentNode.parentNode);
}

var commentBox = document.querySelector("#add_comment_box .toolbar_buttons");
if (commentBox) {
  setupTogglePin(commentBox);
}

var preview = document.getElementById('comment_preview');
if (preview) {
  preview.addEventListener('mouseenter', function() {
    document.body.classList.add('hold_comment');
  })
  preview.addEventListener('mouseleave', function() {
    document.body.classList.remove('hold_comment');
  });
}

makeStyle("\
.comments_pinner:before {\
  content: '';}\
body.pin_comment .comments_pinner:before {\
  content: '';}\
body.pin_comment #add_comment_box {\
  position: fixed;\
  margin: 0;\
  bottom: 0;\
  left: 0;\
  right: 0;\
  height: 90px;\
  border-radius: 0px;\
  z-index: 99999;}\
body.pin_comment.hide_comment #add_comment_box {\
  height: 60px;\
  right: 98%;}\
@media (min-width: 1300px) {\
  body.pin_comment.hide_comment #add_comment_box {\
    right: calc(1300px + (100% - 1300px)/2);}}\
body.pin_comment.hide_comment #add_comment_box::before {\
  font-family: 'FontAwesome';\
  font-size: 3em;\
  position: absolute;\
  top: 0;\
  left: 0;\
  display: block;\
  content: '';\
  height: 60px;\
  width: 100%;\
  text-align: center;\
  line-height: 60px;}\
body.pin_comment #add_comment_box:hover,\
body.pin_comment.hold_comment #add_comment_box {\
  right: 0;\
  height: 380px;}\
body.pin_comment #add_comment_box:hover::before,\
body.pin_comment.hold_comment #add_comment_box::before {\
  display: none;}\
body.pin_comment #add_comment_box textarea {\
  resize: none;}\
body.pin_comment:not(.hold_comment) #add_comment_box:not(:hover) .format-toolbar {\
  display: none;}\
body.pin_comment #add_comment_box,\
body.pin_comment #add_comment_box textarea {\
  transition: height 0.45s ease, right 0.45s ease !important;}\
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

function setupOptionsToggle(me) {
  var row = document.createElement('TR');
  row.innerHTML = '<td class="label">Pin Comment Section on load</td><td><label class="toggleable-switch" ><input type="checkbox" name="pin_comments"></input><a></a></label></td>';
  var Option = row.querySelector('input');
  me.parentNode.insertBefore(row, me);
  Option.checked = getPinComments();
  Option.addEventListener('click', function () {
    setPinComments(this.checked);
  });
  row = document.createElement('TR');
  row.innerHTML = '<td class="label">Minimise Comment Box to corner</td><td><label class="toggleable-switch" ><input type="checkbox" name="compact"></input><a></a></label></td>';
  Option = row.querySelector('input');
  Option.checked = getCompact();
  Option.click(function() {
    setCompact(this.checked);
  });
  me.parentNode.insertBefore(row, me);
}

function setupTogglePin(toolbar) {
  if (!document.querySelector('#add_comment_box_pin')) {
    var tog = makeButton(toolbar, "Toggle Pin (Temporary)", "fa comments_pinner");
    tog.setAttribute('id', 'add_comment_box_pin');
    tog.dataset.click = 'togglePin';
    
    registerButton(tog, App.GetControllerFromElement(toolbar.parentNode.parentNode), 1);
    
    if (getPinComments()) document.body.classList.add('pin_comment');
    if (getCompact()) document.body.classList.add('hide_comment');
    
    BBCodeEditorController.prototype.togglePin = function(sender, event) {
        event.preventDefault();
        document.body.classList.toggle('pin_comment');
    };
    
    CommentListController.prototype.__replyToComment = CommentListController.prototype.replyToComment;
    CommentListController.prototype.replyToComment = function(sender, event) {
      event.ctrlKey |= document.body.classList.contains('pin_comment');
      return this.__replyToComment(sender, event);
    };
    
    NewCommentController.prototype.__save = NewCommentController.prototype.save;
    NewCommentController.prototype.save = function(sender, event) {
      this.__save(sender, event);
      if (document.body.classList.contains('pin_comment')) {
        var commentPreview = document.getElementById('comment_preview');
        commentPreview.style.opacity = 0;
        setTimeout(function () {
          commentPreview.innerHTML = '';
          commentPreview.style.display = '';
          commentPreview.style.opacity = '';
        }, 500);
      }
    };
  }
}

//--------------------------------------------------------------------------------------------------
//-----------------------------------OPTION FUNCTIONS-----------------------------------------------
//--------------------------------------------------------------------------------------------------

//==API FUNCTION==//
function getPinComments() {
  return (localStorage['pin_comments'] || '0') == '1';
}

function setPinComments(val) {
  localStorage['pin_comments'] = val ? '1' : '0';
}

//==API FUNCTION==//
function getCompact() {
  return (localStorage['compact'] || '0') == '1';
}

function setCompact(val) {
  localStorage['compact'] = val ? '1' : '0';
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------API FUNCTIONS-----------------------------------------------
//--------------------------------------------------------------------------------------------------

//==API FUNCTION==//
function registerButton(button, controller, priority) {
  button = button.parentNode;
  button.dataset.order = button.parentNode.children.length;
  button.dataset.priority = priority;
  if (controller.toolbarItems) {
    controller.toolbarItems.push({
      node: button,
      order: (button.dataset.order = controller.toolbarItems.length),
      priority: priority,
      width: 35
    });
  }
}

//==API FUNCTION==//
function makeButton(a, text, img) {
  var result = document.createElement('LI');
  result.classList.add('button-group');
  result.dataset.priority = 1;
  result.dataset.order = 200;
  result.innerHTML = '<button type="button" class="drop-down-expander" title="' + text + '"><i class="' + img + '"></i></button>';
  a.appendChild(result);
  return result.firstChild;
}

var vendor = vendor || null;
//==API FUNCTION==//
function getVendorPrefix() {
  if (!vendor) {
    var styles = window.getComputedStyle(document.documentElement, '');
    var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
    var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    vendor = {dom: dom, lowercase: pre, css: '-' + pre + '-', js: pre[0].toUpperCase() + pre.substring(1)};
  }
  return vendor;
}

//==API FUNCTION==//
function makeStyle(input, id) {
  var style = styleSheet(input.replace(/-\{0\}-/g, getVendorPrefix().css));
  if (id) style.id = id;
  document.head.appendChild(style);
}

//==API FUNCTION==//
function styleSheet(css) {
  var style = document.createElement('style');
  style.innerHTML = css;
  style.type = 'text/css';
  return style;
}