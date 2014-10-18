// ==UserScript==
// @name        Fimfiction Chapter Themes API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==
var ponyThemes = (function() {
  var data = {};
  function addGlobalStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    if (document.head != null) {
      document.head.appendChild(style);
    } else {
      document.body.appendChild(style);
    }
  }
  function ponyTheme(name, style) {
    this.Name = name.replace(/_/g, ' ');
    name = name.replace(/ /g, '_');
    this.option = '<option value="' + name + '">' + this.Name + '</option>';
    this.css = '';
    if (style['story']) this.css += '\
.content_format_' + name + ' a.story_name {\
  color: ' + style.story.color + ' !important;}';
    if (style['content']) this.css += '\
.content_format_' + name + ' {\
  background: ' + style.content.background + ' !important;\
  color: ' + style.content.color + ' !important;}';
  if (style['p']) this.css += '\
.content_format_' + name + ' p {\
  padding: 10px;\
  background: ' + style.p.background + ' !important;\
  color: ' + style.p.color + ' !important;\
  margin-top: 0px;\
  padding-top: 10px;\
  padding-bottom: 10px;}';
  if (style['pnth']) this.css += '\
.content_format_babs p:nth-child(' + style.pnth.n + ') {\
  background-color: ' + style.pnth.background + ' !important;\
  color: ' + style.pnth.color + ' !important;}';
  }
  return {
    apply: function() {
      var sheet = '';
      for (var i in data) {
        sheet += data[i].css;
        $('optgroup[label="Ponies"]').append(data[i].option);
      }
      addGlobalStyle(sheet);
    }, add: function(name, style) {
      data[name] = new ponyTheme(name, style);
      return name;
    }, remove: function(name) {
      data[name] = null;
    }
  }
})();