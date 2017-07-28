// ==UserScript==
// @name        FimQuery.Settings
// @description An extension of FimQuery to add a Settings Page factory
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.1.1
// @grant       none
// ==/UserScript==
var FimFicSettings = {};
(function() {
  function addGenericInput(me, id, name, type, clas) {
    return me.AddOption(id, name, '<div><input' + (clas != null ? ' class="' + clas + '"' : '') + ' inputID="' + id + '" type="' + type + '"></input></div>').firstChild;
  }
  function all(selector, func, d) {
    return each((d || document).querySelectorAll(selector), func);
  }
  function each(arrLike, func, thisArg) {
    return Array.prototype.forEach.call(arrLike, func, thisArg);
  }
  function evIndirect(tag, func) {
    return function(e) {
      if (e.target && e.target != document && e.target.tagName == tag) {
        return func.call(e.target, e);
      }
    };
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
.color-selector input[type='range'] {\
    height: 20px;\
    -webkit-appearance: initial;}\
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
    background-color: #bbf !important;}", "settingsTab_colorMakerStyle");
  }
  FimFicSettings.OptionsBuilder = function OptionsBuilder(container, err) {
    var error = err;
    this.container = container;
    this.HasInit = function() {return this.container;};
    this.ShowError = function() {if (error) error.style.display = "block";};
    this.HideError = function() {if (error) error.style.display = "none";};
  }
  FimFicSettings.OptionsBuilder.prototype = {
    StartEndSection: function(title) {
      this.AddRaw('<tr><td class="section_header" colspan="2"><b>' + title + '</b></td></tr>');
    },
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
      return this.AddOption(id, name, function(container) {
        var result = {};
        container.innerHTML = '<div class="color-selector"></div>';
        var div = container.firstChild;
        
        slider('Red');
        slider('Green');
        slider('Blue');
        
        if (alpha) {
          var aa = slider('Alpha');
          aa.value = 0.5;
          aa.setAttribute('max', 1);
          aa.setAttribute('step', 0.1);
          aa.setAttribute('placeholder', 'Opacity');
        }
        
        function slider(key) {
          var lkey = key.toLowerCase();
          var colourHolder = document.createElement('DIV');
          colourHolder.classList.add(lkey);
          colourHolder.dataset.key = lkey;
          colourHolder.innerHTML = '<input class="color" type="text" placeholder="' + key + '"></input><input value="128" type="range" max="255"></input>';
          result[lkey] = [ colourHolder.firstChild, colourHolder.lastChild ]
          div.append(colourHolder);
          return colourHolder.lastChild;
        }
        
        var down = evIndirect('INPUT', function() {
          this.dataset.changed = '1';
        });
        div.addEventListener('keydown', down);
        div.addEventListener('mousedown', down);
        var up = evIndirect('INPUT', function() {
          var inputs = result[this.parentNode.dataset.key];
          if (this.dataset.changed == '1') {
            inputs[0].value = inputs[1].value = parseFloat(this.value);
          }
          if (this.getAttribute('type') == 'text' && this.value == '') {
            inputs[0].dataset.changed = inputs[1].dataset.changed = '0';
          }
          if (func) func(this, e);
        });
        div.addEventListener('input', up);
        div.addEventListener('keyup', up);
        
        return result;
      });
    },
    AddColorPick: function(id, name, selected, func) {
      if (!document.querySelector('#settingsTab_colorPickerStyle')) addPickerStyle();
      return this.AddOption(id, name, function(container) {
        var div = document.createElement('DIV');
        container.appendChild(div);
        div.innerHTML = '<input style="width:100px;" data-type="colour" type="text"></input>';
        var input = div.firstChild;
        input.value = selected;
        input.addEventListener('change', function(e) {
          var childs = picker.childNodes;
          var i = childs.length;
          while (i--) {
            var c = childs[i].dataset.colour;
            if (c != null) {
              childs[i].classList.toggle('colour_pick_selected', c == this.value);
            }
          }
          func(this, e);
        });
        
        var colors = ["#d3926b","#d3b76b","#d3cf6b","#b4d36b","#88d36b","#6bd38d","#6bd3bc","#6bafd3","#6b81d3","#8b6bd3","#bc6bd3","#d36bab","#d36b77"];
        var grayScale = ["#000","#111","#333","#555","#777","#999","#aaa","#ccc","#ddd","#eee"];
        
        for (var i = 0; i < colors.length; i++) {
          colors[i] = '<div class="colour_pick' + (colors[i] == selected ? ' colour_pick_selected' : '') + '" data-colour="' + colors[i] + '" style="background-color:' + colors[i] + ';"></div>';
        }
        for (var i = 0; i < grayScale.length; i++) {
          grayScale[i] = '<div class="colour_pick' + (grayScale[i] == selected ? ' colour_pick_selected' : '') + '" data-colour="' + grayScale[i] + '" style="background-color:' + grayScale[i] + ';"></div>';
        }
        var picker = document.createElement('DIV');
        picker.classList.add('colour_picker_box');
        picker.innerHTML = colors.join('') + '<br></br>' + grayScale.join('');
        div.appendChild(picker);
        picker.addEventListener('click', evIndirect('A', function(e) {
          e.stopPropagation();
          e.preventDefault();
          input.value = this.dataset.colour;
          input.change();
        }));
        return input;
      });
    },
    AddLabelCheckBox: function(id, name, label) {
      return this.AddOption(id, name, '<label><input inputID="' + id + '" type="checkbox"></i>' + label + '</label>').firstChild;
    },
    AddCheckBox: function(id, name, value) {
      var label = document.createElement('LABEL');
      label.innerHTML = '<a></a>';
      label.classList.add('toggleable-switch');
      var check = addGenericInput(this, id, name, "checkbox");
      check.parentNode.insertBefore(label, check);
      label.insertBefore(check, label.firstChild);
      check.id = 'checkBox_' + id;
      check.checked = !!value;
      return check;
    },
    AddSlider: function(id, name, val, min, max) {
      var sl = addGenericInput(this, id, name, "range");
      sl.setAttribute('min', min);
      sl.setAttribute('max', max);
      sl.style.maxWidth = '50%';
      sl.value = val;
      return sl;
    },
    AddRaw: function(field) {
      if (typeof field === 'string') {
        var d = document.createElement('DIV');
        this.container.appendChild(d);
        d.outerHTML = field;
        return;
      }
      this.container.appendChild(field);
    },
    AddEmailBox: function(id, name) {return addGenericInput(this, id, name, "text", "email");},
    AddNameBox: function(id, name) {return addGenericInput(this, id, name, "text", "name");},
    AddTextBox: function(id, name) {return addGenericInput(this, id, name, "text");},
    AddPassword: function(id, name) {return addGenericInput(this, id, name, "password", "password");},
    AddDropDown: function(id, name, items, value) {
      var input = this.AddOption(id, name, '<select inputID="' + id + '">' + items.map(function(a, i) {
        return '<option value="' + i + '">' + a + '</option>';
      }).join('') + '</select>');
      if (typeof value !== 'undefined') input.value = value;
      return input;
    },
    AddPresetSelect: function(id, name, count, revert, defaultIndex) {
      if (!document.querySelector('#settingsTab_presetStyle')) addPresetStyle();
      return this.AddOption(id, name, function(container) {
        var mm = '<div>';
        for (var i = 0; i < count; i++) {
          mm += '<a class="premade_settings" style="margin-bottom:10px"><div class="toolbar"></div><span>item ' + i + '</span></a>';
        }
        mm += '</div>';
        container.innerHTML = mm;
        container = container.firstChild;
        if (revert) {
          this.AppendResetButton(container.firstChild, defaultIndex).addEventListener('click', function() {
            container.childNodes[defaultIndex].click();
          });
        }
        return Array.apply(null, container.childNodes);
      });
    },
    AddTextArea: function(id, name, defaul) {
      var input = this.AddOption(id, name, '<div><textarea inputID="' + id + '" ></textarea></div>').firstChild;
      if (typeof defaul !== 'undefined') input.value = defaul;
      return input;
    },
    AddOption: function(id, name, content) {
      var row = document.createElement('TR');
      row.innerHTML = '<td id="' + id + '" class="label">' + name + '</td>';
      this.container.appendChild(row);
      var data = document.createElement('TD');
      row.appendChild(data);
      if (typeof content === 'string') {
        data.innerHTML = content;
        return data.firstChild;
      }
      return content.call(this, data);
    },
    AddToolbar: function(id, buttonCount, span) {
      var row = document.createElement('TR');
      row.innerHTML = '<td colspan="' + span + '" id="' + id + '" style="padding: 0px;" ><div class="notifications"><div class="type_selector"></div></div></td>';
      this.container.appendChild(row);
      row = row.firstChild.firstChild;
      if (buttonCount) {
        var but = '';
        for (var i = 0; i < buttonCount; i++) {
          but += '<a class="styled_button styled_button_grey" href="javascript:void();"></a>';
        }
        row.innerHTML = but;
      }
      return row;
    },
    AppendControl: function(holder, appended) {
      holder.insertAdjacentHTML('beforeend', appended);
      return holder.lastChild;
    },
    AppendResetButton: function(control, defaultIndex) {
      control.parentNode.appendChild(document.createElement('BR'));
      control.parentNode.appendChild(document.createElement('BR'));
      var rev = this.AppendButton(control, '<i class="fa fa-undo"></i> Revert to default');
      if (defaultIndex !== undefined) rev.dataset.revertIndex = defaultIndex;
      return rev;
    },
    AppendButton: function(control, content) {
      var rev = document.createElement('A');
      rev.setAttribute('class', 'styled_button styled_button_blue');
      control.parentNode.appendChild(rev);
      rev.innerHTML = content;
      return rev;
    },
    AddButton: function(id, name, label) {
      return this.AddOption(id, name, '<a inputID="' + id + '" class="styled_button styled_button_blue">"' + label + '</a>');
    },
    AddFinishButton: function(name, func) {
      var me = this;
      var field = document.createElement('DIV');
      var link = document.createElement('BUTTON');
      link.classList.add('styled_button');
      link.innerHTML = '<i class="fa fa-save"></i>Save Settings';
      field.appendChild(link);
      var img = document.createElement('SPAN');
      img.style.display = 'none';
      img.style.opacity = '1';
      img.style.transition = 'opacity 0.5s ease';
      img.innerHTML = '<i class="fa fa-spinner fa-spin" style="font-size: 25px;vertical-align: middle;padding: 10px;"></i>';
      field.appendChild(img);
      function complete(fails) {
        if (fails) me.showError(fails);
        img.append(document.createTextNode('Saved!'));
        img.style.opacity = '0';
        setTimeout(function() {
          img.style.display = 'none';
          img.style.opacity = '1';
        }, 500);
      }
      link.addEventListener('click', function() {
        img.style.display = 'inline';
        func(complete);
      });
      return this.AddOption('captch', name, field);
    },
    SetEnabled: function(selector, enable) {
      all(selector, function(el) {
        all('.premade_settings, label, input, select, button', function(d) {
          if (enable) {
            d.removeAttribute('disabled');
          } else {
            d.setAttribute('disabled', true);
          }
          d.style.opacity = enable ? '' : '0.5';
          d.style.pointerEvents = enable ? '' : 'none';
        }, el.parentNode);
      });
    }
  };
  FimFicSettings.SettingsTab = function SettingsTab(title, description, name, img, category, categoryIcon) {
    var page = document.location.href.split('://')[1].split('?')[0].split('#')[0].split('/').reverse();
    if (page[page.length > 3 ? 2 : 1] != 'manage') {
      return new FimFicSettings.OptionsBuilder();
    }
    if (!category || category.trim().length == 0) category = 'Account';
    return initialiseTabs(function(tabs, reference) {
      var tab = getTab(tabs, category, categoryIcon);
      var canvas = newCanvas(img, description);
      if (!document.querySelector('li[pageName="' + name + '"]')) {
        newTabSwitcher(tab, name, img, title, function() {
          reference.style.display = 'none';
          all('.user-cp-content.generated', function(el) {
            el.parentNode.removeChild(el);
          });
          reference.parentNode.insertBefore(canvas, reference);
          var s = document.querySelector('.tab.tab_selected');
          if (s) s.classList.remove('tab_selected');
          linker.addClass('tab_selected');
        });
      }
      return new FimFicSettings.OptionsBuilder(canvas.querySelector('tbody'), newError(canvas));
    });
  };
  
  function newTabSwitcher(tab, name, img, title, click) {
    var linker = document.createElement('LI');
    linker.classList.add('tab');
    linker.setAttribute('pageName', name);
    linker.innerHTML = '<a href="#"><i class="' + img + '"></i><span>' + title + '</span></a>';
    tab.lastElementChild.appendChild(linker);
    linker.firstChild.addEventListener('click', click);
  }
  
  function newCanvas(img, description) {
    var canvas = document.createElement('DIV');
    canvas.setAttribute('class', 'user-cp-content generated');
    canvas.innerHTML = '<div class="user-cp-content-box"><h1><i class="fa ' + img + '"></i>' + description + '</h1><form><div id="SettingsPage_Parent"><table class="properties"><colgroup><col><col></colgroup><tbody></tbody></table></div></form></div>';
    return canvas;
  }
  
  function newError(canvas) {
    var error = document.createElement('DIV');
    error.id = 'validation_error_message';
    error.classList.add('validation_error');
    error.style.display = 'none';
    error.innerHTML = '<div class="message" style="margin-bottom:10px;">There were errors with the settings you chose. Please correct the fields marked<img class="icon_16" style="vertical-align:-3px;" src="' + staticFimFicDomain() + '/images/icons/cross.png"></img>. Hover over to see the error.</div>';
    canvas.querySelector('form').appendChild(error);
    return error;
  }
  
  function getTab(tabs, category, categoryIcon) {
    var tabGroups = tabs.querySelectorAll('.tab-collection');
    each(tabGroups, function(item) {
      if (item.querySelector('h1 span').innerText == category) {
        tab = item;
      }
    });
    if (!tab) {
      tab = document.createElement('DIV');
      tab.classList.add('tab-collection');
      tab.innerHTML = '<h1><i class="fa fa-fw fa-' + categoryIcon + '" ></i> <span>' + category + '</span></h1><ul></ul>';
      each(tabGroups, function(item) {
        item.style.marginBottom = '20px';
      });
      tabs.appendChild(tab);
    }
    return tab;
  }
  
  function initialiseTabs(continuation) {
    var tabs = document.querySelector('.tabs');
    if (tabs) {
      return continuation(tabs, document.querySelector('.user-cp-content'));
    }
    
    tabs = document.createElement('DIV');
    tabs.classList.add('tabs');
    tabs.innerHTML = '\
    <div class="sidebar-shadow"><div class="light-gradient"></div><div class="dark-gradient"></div></div>\
    <a href="#" data-no-user-popup="true"><img src="https://static.fimfiction.net/images/none_64.png"></a>\
    <div class="tab-collection" style="margin-bottom:20px;">\
      <h1><i class="fa fa-fw fa-cog"></i> <span>My Account</span></h1>\
      <ul><li class="tab "><a title="Local Settings" href="/manage/local-settings"><i class="fa fa-fw fa-cog"></i><span> Local Settings</span></a></li>\
      </ul></div>';
    var userCpContentBox = document.querySelector('.user-cp-content-box');
    if (!userCpContentBox) {
      return new FimFicSettings.OptionsBuilder();
    }
    
    var contentMobile = document.createElement('DIV');
    contentMobile.setAttribute('class', 'content mobile-no-margin');
    contentMobile.innerHTML = '<div class="user_cp"><div class="user-cp-content"></div></div>';
    userCpContentBox.parentNode.insertBefore(contentMobile, userCpContentBox);
    contentMobile.firstChild.firstChild.appendChild(userCpContentBox);
    contentMobile.insertBefore(contentMobile.firstChild, tabs);
    
    return continuation(tabs, userCpContentBox.parentNode);
  }
})();
