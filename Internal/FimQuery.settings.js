// ==UserScript==
// @name        FimQuery.Settings (ref FimfictionAdvanced)
// @description An extension of FimQuery to add a Settings Page factory
// @author      Sollace
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @namespace   fimfiction-sollace
// @require     https://github.com/Sollace/UserScripts/raw/Dev/Internal/FimQuery.core.js
// @run-at      document-start
// @version     1.2.6
// @grant       none
// ==/UserScript==

var FimFicSettings = {};
win().FimFicSettings = FimFicSettings;

(() => {
  const addGenericInput = (me, id, name, type, clas) => me.AddOption(id, name, `<div><input${clas ? ` class="${clas}"` : ''} inputID="${id}" type="${type}"></input></div>`).firstChild;
  const all = (selector, holder, func) => func ? Array.prototype.forEach.call(holder.querySelectorAll(selector), func) : all(selector, document, holder);
  const each = (arrLike, func) => Array.prototype.forEach.call(arrLike, func);
	const addDelegatedEvent = (node, selector, event, func, capture) => {
    const k = ev => {
        for (let target = ev.target; target && target != document; ) {
            if (win().matchesSelector(target, selector)) {
                if (('mouseout' == event || 'mouseover' == event) && target.contains(ev.relatedTarget)) break;
                func.call(target, ev, target);
            }
            if (node == target) break;
            target = target.parentNode
        }
    };
    node.addEventListener(event, k, capture);
    return k;
	}
  function addPresetStyle() {
    const light = currentTheme() == 'light';
    const setting_foreground = light ? '#333' : '#a3abc3';
    makeStyle(`
a.premade_settings {
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px solid #394558;
    margin: 5px;
    cursor: pointer;
    transition: box-shadow 0.25s ease 0s;
    vertical-align: middle;
    border-radius: 4px;
    overflow: hidden;
    text-decoration: none;}
a.premade_settings_selected { box-shadow: 0px 0px 4px #302fff;}
a.premade_settings:hover { box-shadow: 0px 0px 4px rgb(196, 111, 111);}
a.premade_settings div.toolbar { height: 24px;border-bottom: inherit; }
a.premade_settings span {
    display: block;
    font-weight: bold;
    font-size: 0.8em;
    color: ${setting_foreground};
    padding: 8px;}`, "settingsTab_presetStyle");
  }
  function addPickerStyle() {
    const light = currentTheme() == 'light';
    const picker_background = light ? '#f8f8f8' : '#303949',
          picker_border = light ? '#bbb' : '#354052';
    
    makeStyle(`
div.colour_pick_selected {
    outline: 2px solid #d50;
    position: relative;
    z-index: 1;}
div.colour_picker_box {
    display: inline-block;
    vertical-align: middle;
    background-color: ${picker_background};
    border: 1px solid ${picker_border};
    margin-left: 10px;
    line-height: 0px;
    padding-bottom: 1px;}
div.colour_pick {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 1px 0px 0px 1px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    vertical-align: middle;
    cursor: pointer;
    box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.2) inset;}`, "settingsTab_colorPickerStyle");
  }
  function addMakerStyle() {
    makeStyle(`
.color-selector div {
    position: relative;
    width: 100%;}
.color-selector input[type='range'] {
    height: 20px;
    -webkit-appearance: initial;}
.color-selector input[type='text'] {
    padding-bottom: 20px !important;
    display: table-cell;}
.color-selector input[type='range'] {
    position: absolute;
    display: block;
    bottom: 0px;
    right: 0px;}
.color-selector .tooltip_popup_tooltip {width: 90px;}
.color-selector input[type='text']:focus + input[type='range'] {
    background-color: #FFECB2;
    border-color: rgba(0, 0, 0, 0.2);
    text-shadow: none;
    color: #4D4735;}
.color-selector .red input:focus {background-color: #fcc !important;}
.color-selector .red input[type='text']:focus + input[type='range'] {background-color: #fbb !important;}
.color-selector .green input:focus {background-color: #cfc !important;}
.color-selector .green input[type='text']:focus + input[type='range'] {background-color: #bfb !important;}
.color-selector .blue input:focus {background-color: #ccf !important;}
.color-selector .blue input[type='text']:focus + input[type='range'] {background-color: #bbf !important;}`, "settingsTab_colorMakerStyle");
  }
  FimFicSettings.OptionsBuilder = function OptionsBuilder(container, err, factory) {
    this.container = container;
    this.err = err;
		if (factory) factory(this);
  }
  FimFicSettings.OptionsBuilder.prototype = {
		ShowError: function() {if (this.err) this.err.style.display = "block";},
    HideError: function() {if (this.err) this.err.style.display = "none";},
		HasInit: function() {return this.container;},
    StartEndSection: function(title) {
      this.AddRaw(`<tr><td class="section_header" colspan="2"><b>${title}</b></td></tr>`);
    },
    getValue: function(id) {
      const field = this.container.querySelector(`input[inputID="${id}"`);
			return field ? (field.type == 'checkbox' ? field.checked : field.value) : null;
    },
    AddColorSliders: function(id, name, alpha, func) {
      if (!document.querySelector('#settingsTab_colorMakerStyle')) addMakerStyle();
      return this.AddOption(id, name, container => {
				const components = ['Red','Green','Blue'];
				if (alpha) components.push('Alpha');
        container.innerHTML = `<div class="color-selector">
					${components.map(key => `<div class="${key.toLowerCase()}">
						<input data-key="${key.toLowerCase()}" class="color" type="text" placeholder="${key == 'Alpha' ? 'Opacity' : key}"></input>
						<input data-key="${key.toLowerCase()}" value="${key == 'Alpha' ? 0.5 : 128}" type="range" max="${key == 'Alpha' ? 1 : 255}" step="${key == 'Alpha' ? 0.05 : 1}"></input>
					</div>`).join('')}
				</div>`;
        const div = container.firstChild;
        const result = {};
				all('input[data-key]', div, input => {
					result[input.dataset.key] = result[input.dataset.key] || [];
          result[input.dataset.key].push(input);
				});
        const up = (e, target) => {
          const val = parseFloat(target.value);
          all(`input[data-key="${target.dataset.key}"]`, target.parentNode, a => a.value = val);
          if (func) func(target, e, e.target);
        };
				addDelegatedEvent(div, 'input', 'input', up);
				addDelegatedEvent(div, 'keyup', 'input', up);
        return result;
      });
    },
    AddColorPick: function(id, name, selected, func) {
      if (!document.querySelector('#settingsTab_colorPickerStyle')) addPickerStyle();
      return this.AddOption(id, name, function(container) {
        const picks = a => `<div class="colour_pick${a == selected ? ' colour_pick_selected' : ''}" data-colour="${a}" style="background:${a};"></div>`;
        const colors = ["#d3926b","#d3b76b","#d3cf6b","#b4d36b","#88d36b","#6bd38d","#6bd3bc","#6bafd3","#6b81d3","#8b6bd3","#bc6bd3","#d36bab","#d36b77"];
        const grayScale = ["#000","#111","#333","#555","#777","#999","#aaa","#ccc","#ddd","#eee"];
				
        container.insertAdjacentHTML('beforeend', `<div>
					<input style="width:100px;" data-type="colour" type="text" value="${selected}"></input>
					<div class="colour_picker_box">
						${colors.map(picks).join('')}<br></br>${grayScale.map(picks).join('')}
					</div>
				</div>`);
				const picker = container.querySelector('.colour_picker_box');
				const input = container.querySelector('input');
				input.change = e => {
					all('[data-colour]', picker, a => a.classList.toggle('colour_pick_selected', a.dataset.colour == input.value));
					func(input);
				};
				input.addEventListener('change', input.change);
				addDelegatedEvent(picker, '[data-colour]', 'click', (e, target) => {
          e.preventDefault();
          input.value = target.dataset.colour;
          input.change(e);
        });
        return input;
      });
    },
    AddLabelCheckBox: function(id, name, label) {
      return this.AddOption(id, name, `<label><input inputID="${id}" type="checkbox"></i>${label}</label>`).firstChild;
    },
    AddCheckBox: function(id, name, value) {
      return this.AddOption(id, name, `<div>
				<label class="toggleable-switch">
					<input id="checkbox_${id}" inputID="${id}" type="checkbox" ${value ? 'checked="checked"' : ''}"></input>
					<a></a>
				</label>
			</div>`).querySelector('input');
    },
    AddSlider: function(id, name, val, min, max) {
			return this.AddOption(id, name, `<div><input inputID="${id}" type="range" min="${min}" max="${max}" style="max-width:50%;" value="${val}">${val}</input></div>`).firstChild;
    },
    AddRaw: function(field) {
      if (typeof field === 'string') {
				return this.container.insertAdjacentHTML('beforeend', `<div>${field}</div>`);
      }
      this.container.appendChild(field);
    },
    AddEmailBox: function(id, name) {return addGenericInput(this, id, name, "text", "email");},
    AddNameBox: function(id, name) {return addGenericInput(this, id, name, "text", "name");},
    AddTextBox: function(id, name) {return addGenericInput(this, id, name, "text");},
    AddPassword: function(id, name) {return addGenericInput(this, id, name, "password", "password");},
    AddDropDown: function(id, name, items, value) {return this.AddOption(id, name, `<select inputID="${id}">${items.map((a, i) => `<option value="${i}" ${i === value ? ' selected' : ''}>${a}</option>`).join('')}</select>`);},
    AddPresetSelect: function(id, name, revert, defaultIndex) {
      if (!document.querySelector('#settingsTab_presetStyle')) addPresetStyle();
      return this.AddOption(id, name, container => {
				let i = 0;
        container.innerHTML = `<div></div>`;
        if (revert) this.AppendResetButton(container.firstChild, defaultIndex).addEventListener('click', () => container.childNodes[defaultIndex].click());
				container = container.firstChild;
        return {
					element: container,
					add: func => {
						container.insertAdjacentHTML('beforeend', `<a class="premade_settings" data-index="${i++}"><div class="toolbar"></div><span></span></a>`);
						func(container.lastChild);
					}
				};
      });
    },
    AddTextArea: function(id, name, defaul) {return this.AddOption(id, name, `<div><textarea inputID="${id}" >${defaul}</textarea></div>`).firstChild;},
    AddOption: function(id, name, content) {
      this.container.insertAdjacentHTML('beforeend', `<tr><td id="${id}" class="label">${name}</td><td>${typeof(content) === 'string' ? content : ''}</td></tr>`);
			const data = this.container.lastChild.lastChild;
      return data.firstChild || content.call(this, data);
    },
    AddToolbar: function(id, span) {
      this.container.insertAdjacentHTML('beforeend', `<tr>
				<td colspan="${span}" id="${id}" style="padding: 0px;" >
					<div class="notifications"></div>
				</td>
			</tr>`);
      return {
				element: this.container.querySelector('.notifications'),
				add: function(func) {
					this.row.insertAdjacentHTML('beforeend', '<a class="styled_button styled_button_grey" href="javascript:void();"></a>');
					func(this.row.lastChild);
				}
			}
    },
    AppendControl: (holder, appended) => {
      holder.insertAdjacentHTML('beforeend', appended);
      return holder.lastChild;
    },
    AppendResetButton: function(control, defaultIndex) {
      const rev = this.AppendButton(control, '<i class="fa fa-undo"></i> Revert to default');
      if (defaultIndex !== undefined) rev.dataset.revertIndex = defaultIndex;
      return rev;
    },
    AppendButton: function(control, content) {return this.AppendControl(control.parentNode, `<a class="styled_button styled_button_blue">${content}</a>`);},
    AddButton: function(id, name, label) {return this.AddOption(id, name, `<a inputID="${id}" class="styled_button styled_button_blue">"${label}</a>`);},
    AddFinishButton: function(name, func) {
      const field = this.AddOption('captch', name, `<div>
				<button class="styled_button"><i class="fa fa-save"></i>Save Settings</button>
				<span style="display:none;opacity:1;transition:opacity 0.5s ease">
					<i class="fa fa-spinner fa-spin" style="font-size: 25px;vertical-align: middle;padding: 10px;"></i>
				</span>
			</div>`);
			const img = field.querySelector('span');
      field.querySelector('button').addEventListener('click', () => {
        img.style.display = 'inline';
        func(fails => {
					if (fails) this.showError(fails);
					img.append(document.createTextNode('Saved!'));
					img.style.opacity = '0';
					img.style.display = '';
					setTimeout(() => {
						img.style.display = 'none';
						img.style.opacity = '1';
					}, 500);
				});
      });
      return field;
    },
    SetEnabled: function(selector, enable) {
      all(selector, a => all('.premade_settings, label, input, select, button', a.parentNode, d => {
				if (enable) {
					d.removeAttribute('disabled');
				} else {
					d.setAttribute('disabled', true);
				}
				d.style.opacity = enable ? '' : '0.5';
				d.style.pointerEvents = enable ? '' : 'none';
			}));
    }
  };
  FimFicSettings.SettingsTab = function SettingsTab(title, description, name, img, category, categoryIcon, buildFunc) {
    let page = document.location.href.split('://')[1].split('?')[0].split('#')[0].split('/').reverse();
    if (page[page.length > 3 ? 2 : 1] != 'manage') {
      return new FimFicSettings.OptionsBuilder();
    }
    if (!category || category.trim().length == 0) category = 'Account';
    return initialiseTabs((tabs, reference) => {
      const canvas = newCanvas(img, description);
      const tab = new FimFicSettings.OptionsBuilder(canvas.querySelector('tbody'), canvas.querySelector('#validation_error_message'));
      if (!document.querySelector(`li[pageName="${name}"]`)) {
        newTabSwitcher(getTab(tabs, category, categoryIcon), name, img, title, e => {
          document.querySelector('head title').innerText = `${description} - Fimfiction`;
          reference.style.display = 'none';
          all('.user-cp-content.generated', a => a.parentNode.removeChild(a));
					reference.insertAdjacentElement('beforebegin', canvas);
          if (buildFunc) buildFunc(tab);
          const s = document.querySelector('.tab.tab_selected');
          if (s) s.classList.remove('tab_selected');
          e.target.classList.add('tab_selected');
        });
      }
      return tab;
    });
  };
  
  function newTabSwitcher(tab, name, img, title, click) {
    tab.lastElementChild.insertAdjacentHTML('beforeend', `<li class="tag" pageName="${name}">
			<a href="#${name}"><i class="${img}"></i><span>${title}</span></a>
		</li>`);
    tab.querySelector(`[pageName="${name}"]`).addEventListener('click', click);
    if (document.location.hash.replace('#', '') == name) requestAnimationFrame(() => {
      click({target: tab.querySelector(`[pageName="${name}"]`)});
    });
  }
  
  function newCanvas(img, description) {
    const canvas = document.createElement('DIV');
    canvas.setAttribute('class', 'user-cp-content generated');
    canvas.innerHTML = `<div class="user-cp-content-box">
			<h1><i class="fa ${img}"></i>${description}</h1>
			<form>
				<div id="SettingsPage_Parent">
					<table class="properties">
						<colgroup><col><col></colgroup>
						<tbody></tbody>
					</table>
				</div>
				<div id="validation_error_message" class="validation_error" style="display:none">
					<div class="message" style="margin-bottom:10px;">There were errors with the settings you chose. Please correct the fields marked<img class="icon_16" style="vertical-align:-3px;" src="${staticFimFicDomain()}/images/icons/cross.png"></img>. Hover over to see the error.</div>
				</div>
			</form>
		</div>`;
    return canvas;
  }
  
  function getTab(tabs, category, categoryIcon) {
    const tabGroups = tabs.querySelectorAll('.tab-collection');
		let tab;
    each(tabGroups, item => {
      if (item.querySelector('h1 span').innerText == category) tab = item;
    });
    if (tab) return tab;
		each(tabGroups, item => item.style.marginBottom = '20px');
		tabs.insertAdjacentHTML('beforeend', `<div class="tab-collection">
			<h1><i class="fa fa-fw fa-${categoryIcon}" ></i> <span>${category}</span></h1><ul></ul>
		</div>`);
		return tabs.lastChild;
  }
  
  function initialiseTabs(continuation) {
    const tabs = document.querySelector('.tabs');
    if (tabs) return continuation(tabs, document.querySelector('.user-cp-content'));
    const userCpContentBox = document.querySelector('.user-cp-content-box');
    if (!userCpContentBox) {
       setTimeout(() => initialiseTabs(continuation), 50);
       return new FimFicSettings.OptionsBuilder();
    }
    
		userCpContentBox.insertAdjacentHTML('beforebegin', `<div class="content mobile-no-margin">
			<div class="user_cp">
				<div class="tabs">
					<div class="sidebar-shadow">
						<div class="light-gradient"></div>
						<div class="dark-gradient"></div>
					</div>
					<a href="#" data-no-user-popup="true"><img src="https://static.fimfiction.net/images/none_64.png"></a>
					<div class="tab-collection" style="margin-bottom:20px;">
						<h1><i class="fa fa-fw fa-cog"></i> <span>My Account</span></h1>
						<ul>
							<li class="tab ">
								<a title="Local Settings" href="/manage/local-settings"><i class="fa fa-fw fa-cog"></i><span> Local Settings</span></a>
							</li>
						</ul>
					</div>
				</div>
        <div class="user-cp-content"></div>
			</div>
		</div>`);
		const root = document.querySelector('.user-cp-content');
		root.appendChild(userCpContentBox);
    return continuation(document.querySelector('.tabs'), root);
  }
})();