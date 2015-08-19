// ==UserScript==
// @name        FimQuery.Settings
// @description An extension of FimQuery to add a Settings Page factory
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1
// @grant       none
// ==/UserScript==
var FimFicSettings = {};
(function() {
  function addGenericInput(me, id, name, type, clas) {
    return me.AddOption(id, name, '<div><input' + (clas != null ? ' class="' + clas + '"' : '') + ' inputID="' + id + '" type="' + type + '" /></div>').find('input');
  }
  function addPresetStyle() {
    makeStyle("\
a.premade_settings {\
    display: inline-block;\
    width: 100px;\
    height: 100px;\
    border: 1px solid rgba(0, 0, 0, 0.5);\
    margin-right: 10px;\
    cursor: pointer;\
    transition: box-shadow 0.25s ease 0s;\
    vertical-align: middle;\
    text-decoration: none;}\
a.premade_settings_selected {\
    box-shadow: 0px 0px 10px #302FFF;}\
a.premade_settings:hover {\
    box-shadow: 0px 0px 10px rgb(196, 111, 111);}\
a.premade_settings div.toolbar {\
    height: 24px;\
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);\
    box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.2) inset;}\
a.premade_settings span {\
    display: block;\
    font-weight: bold;\
    font-size: 0.8em;\
    color: rgb(51, 51, 51);\
    padding: 8px;}", "settingsTab_presetStyle");
  }
  function addPickerStyle() {
    makeStyle("\
div.colour_pick_selected {\
    outline: 2px solid rgb(221, 85, 0);\
    position: relative;\
    z-index: 1;}\
div.colour_picker_box {\
    display: inline-block;\
    vertical-align: middle;\
    background-color: rgb(248, 248, 248);\
    border: 1px solid rgb(187, 187, 187);\
    margin-left: 10px;\
    line-height: 0px;\
    padding-bottom: 1px;}\
div.colour_pick {\
    display: inline-block;\
    width: 16px;\
    height: 16px;\
    margin: 1px 0px 0px 1px;\
    border: 1px solid rgba(0, 0, 0, 0.2);\
    vertical-align: middle;\
    cursor: pointer;\
    box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.2) inset;}", "settingsTab_colorPickerStyle");
  }
  function addMakerStyle() {
    makeStyle("\
.color-selector div {\
    position: relative;\
    width: 100%;}\
.color-selector input[type='text'] {\
    padding-bottom: 20px !important;\
    display: table-cell;}\
.color-selector input[type='range'] {\
    position: absolute;\
    display: block;\
    bottom: 0px;\
    right: 0px;}\
.color-selector .tooltip_popup_tooltip {\
    width: 90px;}\
.color-selector input[type='text']:focus + input[type='range'] {\
    background-color: #FFECB2;\
    border-color: rgba(0, 0, 0, 0.2);\
    text-shadow: none;\
    color: #4D4735;}\
.color-selector .red input:focus {\
    background-color: #fcc !important;}\
.color-selector .red input[type='text']:focus + input[type='range'] {\
    background-color: #fbb !important;}\
.color-selector .green input:focus {\
    background-color: #cfc !important;}\
.color-selector .green input[type='text']:focus + input[type='range'] {\
    background-color: #bfb !important;}\
.color-selector .blue input:focus {\
    background-color: #ccf !important;}\
.color-selector .blue input[type='text']:focus + input[type='range'] {\
    background-color: #bbf !important;}");
  }
  FimFicSettings.OptionsBuilder = function OptionsBuilder(container, err) {
    this.container = $(container);
    
    var has_init = this.container.length;
    var error = err;
    
    this.HasInit = function() {return has_init;};
    this.ShowError = function() {if (error) error.style.display = "block";};
    this.HideError = function() {if (error) error.style.display = "none";};
  }
  FimFicSettings.OptionsBuilder.prototype = {
    StartEndSection: function(title) {if (this.HasInit()) this.container.append('<tr><td class="section_header" colspan="2"><b>' + title + '</b></td></tr>');},
    getValue: function(id) {
      var fields = this.container.getElementsByTagName("input");
      var len = fields.length;
      for (var i = 0; i < len; i++) {
        if (fields[i].getAttribute("inputID") == id) {
          var field = fields[i];
          return field.getAttribute("type") == "checkbox" ? field.checked : field.value;
        }
      }
    },
    AddColorSliders: function(id, name, alpha, func) {
      if (!$('#settingsTab_colorMakerStyle').length) addMakerStyle();
      var result = {};
      var div = $('<div class="color-selector" />');
      var colourHolder = $('<div class="red" />');
      colourHolder.append(result.red = $('<input class="color" type="text" placeholder="Red" /><input value="128" type="range" max="255" />'));
      div.append(colourHolder);
      colourHolder = $('<div class="green" />');
      colourHolder.append(result.green = $('<input class="color" type="text" placeholder="Green" /><input value="128" type="range" max="255" />'));
      div.append(colourHolder);
      colourHolder = $('<div class="blue" />');
      colourHolder.append(result.blue = $('<input class="color" type="text" placeholder="Blue" /><input value="128" type="range" max="255" />'));
      div.append(colourHolder);
      if (alpha) {
        colourHolder = $('<div class="alpha" />');
        colourHolder.append(result.alpha = $('<input class="color" type="text" placeholder="Opacity" /><input value="0.5" type="range" max="1" step="0.01" />'));
        div.append(colourHolder);
      }
      div.find('input').on('keydown mousedown', function() {
        $(this).attr('data-changed', '1');
      });
      div.find('input').on('change mousemove keyup', function(e) {
        var me = $(this);
        if (me.attr('data-changed') == '1') {
          me.parent().find('input').val(this.value);
        }
        if (me.attr('type') == 'text' && me.val() == '') {
          me.parent().find('input').attr('data-changed', '0');
        }
        if (func) func(this, e);
      });
      this.AddOption(id, name, div);
      return result;
    },
    AddColorPick: function(id, name, selected, func) {
      if (!$('#settingsTab_colorPickerStyle').length) addPickerStyle();
      var div = $('<div />');
      var input = $('<input style="width:100px;" data-type="colour" type="text" />');
      div.append(input);
      input.val(selected);
      input.on('change', function(e) {
        var childs = picker.children();
        var i = childs.length;
        while (i--) {
          var c = $(childs[i]).attr("data-colour");
          if (c != null) {
            if (c == this.value) {
              $(childs[i]).addClass('colour_pick_selected');
            } else {
              $(childs[i]).removeClass('colour_pick_selected');
            }
          }
        }
        func(this, e);
      });

      var colors = ["#d3926b","#d3b76b","#d3cf6b","#b4d36b","#88d36b","#6bd38d","#6bd3bc","#6bafd3","#6b81d3","#8b6bd3","#bc6bd3","#d36bab","#d36b77"];
      var grayScale = ["#000","#111","#333","#555","#777","#999","#aaa","#ccc","#ddd","#eee"];

      for (var i = 0; i < colors.length; i++) {
        colors[i] = '<div class="colour_pick' + (colors[i] == selected ? ' colour_pick_selected' : '') + '" data-colour="' + colors[i] + '" style="background-color:' + colors[i] + ';" />';
      }
      for (var i = 0; i < grayScale.length; i++) {
        grayScale[i] = '<div class="colour_pick' + (grayScale[i] == selected ? ' colour_pick_selected' : '') + '" data-colour="' + grayScale[i] + '" style="background-color:' + grayScale[i] + ';" />';
      }
      var picker = $('<div class="colour_picker_box">' + colors.join('') + '<br />' + grayScale.join('') + '</div>');
      div.append(picker);
      picker.find('.colour_pick').on('click', function() {
        var i = $(this);
        input.val(i.attr("data-colour"));
        input.change();
      });
      this.AddOption(id, name, div);
      return input;
    },
    AddLabelCheckBox: function(id, name, label) {
      return this.AddOption(id, name, '<label><input inputID="' + id + '" type="checkbox" />' + label + '</label>').find('input');
    },
    AddCheckBox: function(id, name, value) {
      var check = addGenericInput(this, id, name, "checkbox");
      check.attr('id', 'checkBox_' + id);
      var label = $('<label class="toggleable-switch"><a /></label>');
      check.before(label);
      label.prepend(check);
      check[0].checked = !!value;
      return check;
    },
    AddSlider: function(id, name, val, min, max) {
      var sl = addGenericInput(this, id, name, "range");
      sl.attr({'min': min, 'max': max});
      sl.css('max-width', '50%');
      sl.val(val);
      return sl;
    },
    AddRaw: function(field) {if (this.HasInit()) tabl.append(field);},
    AddEmailBox: function(id, name) {return addGenericInput(this, id, name, "text", "email");},
    AddNameBox: function(id, name) {return addGenericInput(this, id, name, "text", "name");},
    AddTextBox: function(id, name) {return addGenericInput(this, id, name, "text");},
    AddPassword: function(id, name) {return addGenericInput(this, id, name, "password", "password");},
    AddDropDown: function(id, name, items, value) {
      var input = '<select inputID="' + id + '">';
      for (var i = 0, len = items.length; i < len; i++) {
        if (items[i]) input += '<option value="' + i + '">' + items[i] + '</option>';
      }
      input = $(input + '</select>');
      if (typeof value !== 'undefined') input.val(value);
      return this.AddOption(id, name, input);
    },
    AddPresetSelect: function(id, name, count, revert, defaultIndex) {
      if ($('#settingsTab_presetStyle').length == 0) addPresetStyle();
      var div = $('<div />');
      for (var i = 0; i < count; i++) {
        div.append('<a class="premade_settings" style="margin-bottom:10px"><div class="toolbar"></div><span>item ' + i + '</span></a>');
      }
      if (revert == true) {
        this.AppendResetButton(div.children()[0], defaultIndex).on('click', function() {
          div.children()[defaultIndex].click();
        });
      }
      return this.AddOption(id, name, div).children();
    },
    AddTextArea: function(id, name, defaul) {
      var div = $('<div />');
      var input = $('<textarea inputID="' + id + '"></textarea>');
      div.append(input);
      if (typeof defaul !== 'undefined') input.val(defaul);
      this.AddOption(id, name, div);
      return input;
    },
    AddOption: function(id, name, content) {
      var row = $('<tr><td id="' + id + '" class="label">' + name + '</td></tr>');
      var data = $('<td />');
      content = $(content);
      data.append(content);
      row.append(data);
      this.container.append(row);
      return content;
    },
    AddToolbar: function(id, buttonCount, span) {
      var row = $('<tr><td colspan="' + span + '" id="' + id + '" style="padding: 0px;" ><div class="notifications"><div class="type_selector" /></div></td></tr>');
      this.container.append(row);
      row = row.find('.type_selector');
      if (buttonCount) {
        var but = '<a class="styled_button styled_button_grey" href="javascript:void();" />';
        for (var i = 0; i < buttonCount; i++) {
          row.append(but);
        }
      }
      return row;
    },
    AppendResetButton: function(control, defaultIndex) {
      $(control).parent().append("</br></br>");
      var rev = this.AppendButton(control, '<i class="fa fa-undo" />Revert to default');
      if (defaultIndex != null) rev.attr("data-revert-index", defaultIndex);
      return rev;
    },
    AppendButton: function(control, content) {
      var rev = $('<a class="styled_button styled_button_blue" />');
      rev.append(content);
      return this.AppendControl($(control).parent(), rev);
    },
    AppendControl: function(holder, appended) {
      appended = $(appended);
      $(holder).append(appended);
      return appended;
    },
    AddButton: function(id, name, label) {
      return this.AddOption(id, name, '<a inputID="' + id + '" class="styled_button styled_button_blue">"' + label + '</a>');
    },
    AddFinishButton: function(name, func) {
      var me = this;
      var field = $('<div />');
      var link = $('<a class="styled_button form_cubmitter" href="javascript:void(0);"><img src="' + staticFimFicDomain() + '/images/icons/white/save.png"></img>Save</a>');
      field.append(link);
      var img = $('<img class="submitting_spinner" style="vertical-align:middle;display:none;" src="' + staticFimFicDomain() + '/themes/poni2.0/images/loader_light_toolbar.gif"></img>');
      field.append(img);
      link.on('click', function() {
        img.css('display', 'block');
        var fails = func();
        if (fails.length) {
          me.showError(fails);
        }
        img.css('display', 'none');
      });
      return this.AddOption('captch', name, field);
    },
    setEnabled: function(el, enable) {
      el = $(el);
      el.parent().each(function() {
        $(this).find('input,select,button').attr('disabled', !enable);
      });
      el.parent().find('.premade_settings,label,select').each(function() {
        $(this).css(enable ? {'opacity':'', 'pointer-events': ''} : {'opacity':'0.5','pointer-events': 'none'});
      });
    }
  }
  FimFicSettings.SettingsTab = function SettingsTab(title, description, name, img, category, categoryIcon) {
    return BuildSettingsTab.apply(this, arguments);
  }
  FimFicSettings.SettingsTab.isCustomTabPage = function isCustomTabPage(page, registered) {
    var i = registered.length;
    var match = page.split("=")[1];
    while (i--) {
      if (match == registered[i][0]) return true;
    }
    return false;
  }
  
  function BuildSettingsTab(title, description, name, img, category, categoryIcon) {
    if (category == '' || category == null) category = 'Account';
    var registered = getSafe('settingsTabsRegister', []);
    registered.push([name,img,title,category]);
    var page = document.location.href.split('/').reverse()[0];
    var indexPage = page.split('=');
    var isSettingsPage = indexPage[1] == 'local_settings'
    var isIndexPage = indexPage[0] == 'index.php?view';
    var tabs = $('.tab-collection');
    if (isIndexPage) {
      if (isSettingsPage) {
        if ($('.user-cp-content-box > form').length > 1) {
          $('.user-cp-content-box').first().remove();
        }
        var form = $('.user_cp');
        if (!$('.user-cp-content').length) {
          form.append('<div class="user-cp-content" />');
          form.find('.user-cp-content').append(form.find('.user-cp-content-box'));
        }
        form.attr("style", "overflow:hidden; display:table; width:100%; margin-bottom:30px;");
        var p = form.parent();
        if (!p.hasClass('inner')) {
          p.after(form).remove();
        }
      } else if (!tabs.length && FimFicSettings.SettingsTab.isCustomTabPage(page, registered)) {
        $('.content_box').after('<div class="user_cp" style="overflow:hidden; display:table; width:100%; margin-bottom:30px;"><div class="user-cp-content" /></div>').remove();
      }
      if (!tabs.length && $('.user-cp-content').length) {
        $('.content_box_header').remove();
        tabs = $('<div class="tabs" >' +
                 '<div class="sidebar-shadow">' + 
                 '<div class="light-gradient" />' + 
                 '<div class="dark-gradient" />' + 
                 '</div>' + 
                 '<a><img src="' + getDefaultAvatar() + '"></a>' +
                 '<div class="tab-collection">' + 
                 '<h1><i class="fa fa-fw fa-cog" /> <span>Account</span></h1>' + 
                 '<ul>' +
                 '<li class="tab' + (isSettingsPage ? ' tab_selected' : '') + '">' + 
                 '<a  title="Local Settings" href="/index.php?view=local_settings">' + 
                 '<i class="fa fa-cog" />' + 
                 '<span>Local Settings</span>' + 
                 '</a>' + 
                 '</li>' + 
                 '</ul>' + 
                 '</div>' +
                 '</div>');
        $('.user_cp').append(tabs);
        tabs = tabs.find('.tab-collection');
      }
    }
    var tab = null;
    for (var i = 0, len = tabs.length; i < len; i++) {
      var item = $(tabs[i]);
      if (item.find('h1 span').text() == category) {
        tab = item;
        break;
      }
    }
    if (!tab) {
      tab = $('<div class="tab-collection"><h1><i class="fa fa-fw fa-' + categoryIcon + '" /> <span>' + category + '</span></h1><ul /></div>');
      tabs.last().css('margin-bottom', '20px').after(tab);
    }
    if (tab) {
      for (var i = 0, len = registered.length; i < len; i++) {
        if (!$('li[pageName="' + registered[i][0] + '"]').length) {
          tab.find('ul').append('<li class="tab" pageName=' + registered[i][0] + '><a href="' + (isIndexPage ? "/index.php?view=" : "/manage_user/") + registered[i][0] + '"><i class="' + registered[i][1] + '"></i><span>' + registered[i][2] + '</span></a></li>');
        }
      }
      if ((isIndexPage ? indexPage[1].split('&')[0] : page).split('#')[0] == name) {
        var canvas = $('.user-cp-content').first();
        canvas.append('<div class="user-cp-content-box"><h1><i class="fa ' + img + '" />' + description + '</h1><form><div id="SettingsPage_Parent"><table class="properties"><tbody></tbody></table></div></form></div>');
        var context = canvas.find('form');
        var error = $('<div id="validation_error_message" class="validation_error" style="display:none;" ><div class="message" style="margin-bottom:10px;">There were errors with the settings you chose. Please correct the fields marked<img class="icon_16" style="vertical-align:-3px;" src="' + staticFimFicDomain() + '/images/icons/cross.png"></img>. Hover over to see the error.</div></div>');
        context.append(error);
        return new FimFicSettings.OptionsBuilder(context.find('tbody'), error);
      }
    }
    return new FimFicSettings.OptionsBuilder(null);
  }
})();
