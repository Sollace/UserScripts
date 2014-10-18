// ==UserScript==
// @name        Fimfiction Chapter Themes API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.0.1
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
  function createStyleSet(styles) {
    var result = '';
    for (var i in styles) result += i + ': ' + styles[i].replace(/ \!important/g, '') + ' !important;';
    return result;
  }
  function ponyTheme(name, style) {
    this.Name = name.replace(/_/g, ' ');
    name = name.replace(/ /g, '_');
    this.option = '<option value="' + name + '">' + this.Name + '</option>';
    this.css = '';
    if (style['story']) this.css += '.content_format_' + name + ' a.story_name {' + createStyleSet(style.story) + '}';
    if (style['content']) this.css += '.content_format_' + name + ' {' + createStyleSet(style.content) + '}';
    if (style['p']) this.css += '.content_format_' + name + ' p {' + createStyleSet(style.p) + '}';
    if (style['pnth']) this.css += '.content_' + name + ' p:nth-child(' + style.pnth.n + ') {' + createStyleSet(style.pnth) + '}';
  }
  if ($('#format_colours').attr('apiInit') != '1') {
    $('#format_colours').attr('apiInit', '1');
    $(document).ready(function() {
      $('#format_colours').on('change', function() {
        unsafeWindow.LocalStorageSet( "format_colours_2", $("#format_colours").val());
      });
    });
  }
  return {
    apply: function() {
      var sheet = '';
      for (var i in data) {
        for (var j in data[i]) {
          sheet += data[i][j].css;
          if (!$('optgroup[label="' + i + '"]').length) {
            $('optgroup[label="Ponies"]').after('<optgroup label="' + i + '" />');
          }
          $('optgroup[label="' + i + '"]').append(data[i][j].option);
        }
      }
      addGlobalStyle(sheet);
      $('#format_colours').val(unsafeWindow.LocalStorageGet('format_colours_2', unsafeWindow.LocalStorageGet('format_colours', 'bow')));      unsafeWindow.UpdateColours();
    }, add: function(category, name, style) {
      if (!data[category]) data[category] = {};
      data[category][name] = new ponyTheme(name, style);
      return {one: category, two: name};
    }, remove: function(key) {
      data[key.one][key.two] = null;
    }
  }
})();