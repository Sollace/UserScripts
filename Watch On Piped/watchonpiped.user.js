// ==UserScript==
// @name        Watch on Piped
// @namespace   sollace
// @include     /^http?[s]://.*\.youtube\..*/
// @grant       none
// @run-at      document-start
// @version     1.3
// @author      Sollace
// @description Adds a button on youtube videos to open them with Piped
// ==/UserScript==

requireRemoveEventListeners();

const PIPED_ICON = `
<svg version="1.1" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
	<path d="m12.473 9.5625 0.0017 17.234c1.31e-4 1.2746 4.809 1.216 4.8095 0.0756l0.0072-16.806c6.9e-4 -1.6132-4.8184-1.3484-4.8184-0.50391z" fill="#fff" stroke-width=".026338"/>
	<path d="m19.889 9.1094c-0.58209 0.054299-1.3809-0.060553-1.6317 0.63105-0.47376 0.91925-0.42935 2.0854 0.06126 2.9865 0.34594 0.62191 1.0824 0.37617 1.6401 0.55779 0.90555 0.18883 1.8087 0.82294 1.9692 1.7855 0.13776 0.82768-0.44799 1.6136-1.2051 1.8959-0.57715 0.26047-1.2272 0.24667-1.8389 0.27482-0.67134 0.32005-0.82265 1.1413-0.89173 1.8089-0.05725 0.83945 0.02796 1.8116 0.66817 2.4243 0.53802 0.33202 1.193 0.10562 1.7831 0.11712 1.9492-0.15544 3.9317-1.2144 4.7717-3.0442 1.4305-2.9716 0.30139-6.9487-2.5511-8.6421-0.83713-0.51791-1.8095-0.70245-2.775-0.79556z" fill="#fff" stroke-width=".026338"/>
</svg>
`;
const INVIDIOUS_ICON = `
<svg height="24" viewBox="0 0 24 24" width="24">
  <path d="M21 7v10H3V7h18m1-1H2v12h20V6zM11.5 2v3h1V2h-1zm1 17h-1v3h1v-3zM3.79 3 6 5.21l.71-.71L4.5 2.29 3.79 3zm2.92 16.5L6 18.79 3.79 21l.71.71 2.21-2.21zM19.5 2.29 17.29 4.5l.71.71L20.21 3l-.71-.71zm0 19.42.71-.71L18 18.79l-.71.71 2.21 2.21z" fill="white"></path>
</svg>`;

function addButton() {
  if (!document.body) {
    return false;
  }

  const referenceButton = document.body.querySelector('.ytp-subtitles-button');

  if (!referenceButton || referenceButton.classList.contains('piped-applied')) {
    return false;
  }

  const insertionPoint = document.body.querySelector('.ytp-youtube-button') || referenceButton;

  const menu = createMenu(referenceButton);

  menu.addOption({
    icon: PIPED_ICON,
    label: 'Piped',
    clickHandler(e) {
      openVideo(e, 'piped.kavin.rocks');
    }
  });
  menu.addOption({
    label: 'Invidious',
    clickHandler(e) {
      menu.menus.main.classList.add('hidden');
      menu.menus.invidious.classList.remove('hidden');
      if (menu.menus.invidious.innerHTML == '') {
        menu.menus.invidious.innerHTML = 'Loading...';
        getInvidiousInstances().then(json => {
          menu.menus.invidious.innerHTML = '';
          json.filter(instance => {
            if (!instance[1].stats) {
              instance[1].stats = {usage: {users: {total: -1}}};
              return true;
            }
            return instance[1].stats.usage.users.total > 1;
          }).forEach(instance => {
            addMenuOption(menu.menus.invidious, {
              icon: instance[1].flag,
              label: instance[0].substring(0, Math.min(instance[0].length, 20)),
              tooltip: 'Users: ' + instance[1].stats.usage.users.total + ' ' + instance[1].uri,
              clickHandler(e) {
                openVideo(e, instance[0]);
              }
            });
          });
        }).catch(t => {
          console.error(t);
          menu.menus.invidious.innerHTML = '';
        });
      }
    }
  });
  createButton(insertionPoint, referenceButton, e => {
    e.stopPropagation();
    menu.toggle();
  });

  return true;
}

function createButton(insertionPoint, referenceButton, clickHandler) {
  insertionPoint.insertAdjacentHTML('afterend', referenceButton.outerHTML);
  referenceButton.classList.add('piped-applied');
  const myButton = insertionPoint.nextSibling;
  myButton.classList.remove('ytp-subtitles-button');
  myButton.title = 'Watch on...';
  myButton.setAttribute('aria-label', myButton.title);
  myButton.setAttribute('aria-pressed', '');
  myButton.innerHTML = PIPED_ICON;
  myButton.style = '';
  myButton.addEventListener('click', clickHandler);
  referenceButton.getEventListeners('mouseover').forEach(listener => {
    myButton.addEventListener('mouseover', listener);
  });
  referenceButton.getEventListeners('focus').forEach(listener => {
    myButton.addEventListener('focus', listener);
  });
}

function createMenu(referenceButton) {
  const insertionPoint = referenceButton.closest('#movie_player').querySelector('.ytp-gradient-bottom');
  insertionPoint.insertAdjacentHTML('beforebegin', `
    <style type="text/css">
      .piped-settings-menu {
        width: min-content;
        height: min-content;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.1s ease, visibility 0.1s ease;
      }
      .piped-settings-menu .ytp-panel {
        position: relative;
        max-width: 250px;
        max-height: 350px;
      }
      .piped-settings-menu.shown {
        opacity: 1;
        visibility: visible;
      }
      .piped-settings-menu .hidden {
        display: none;
      }
    </style>
    <div class="ytp-popup ytp-settings-menu ytp-rounded-menu piped-settings-menu" data-layer="6">
      <div class="ytp-panel" style="position:relative">
        <div class="ytp-panel-menu pipe-main-menu" role="menu"></div>
        <div class="ytp-panel-menu pipe-invidious-menu hidden" role="menu"></div>
      </div>
    </div>`);
  const container = insertionPoint.previousSibling;
  window.addEventListener('blur', () => {
    container.classList.remove('shown');
  });
  document.body.addEventListener('mouseup', () => {
    container.classList.remove('shown');
  });
  container.addEventListener('mouseup', e => e.stopPropagation());

  const menus = {
    main: container.querySelector('.pipe-main-menu'),
    invidious: container.querySelector('.pipe-invidious-menu')
  };

  return {
    menus,
    toggle() {
      container.classList.toggle('shown');
      menus.main.classList.remove('hidden');
      menus.invidious.classList.add('hidden');
    },
    addOption(option) {
      addMenuOption(menus.main, option);
    }
  };
}

function addMenuOption(menu, option) {
  menu.insertAdjacentHTML('beforeend', `
    <div class="ytp-menuitem" role="menuitemcheckbox" aria-checked="true" tabindex="0" title="${option.tooltip || ''}">
      <div class="ytp-menuitem-icon">
        ${option.icon || INVIDIOUS_ICON}
      </div>
      <div class="ytp-menuitem-label">${option.label}</div>
      <div class="ytp-menuitem-content">${option.content || ''}</div>
  </div>`);
  menu.lastChild.addEventListener('click', option.clickHandler);
}

function openVideo(e, host) {
  const video = e.target.closest('#movie_player').querySelector('video');

  let location = document.location.href.replace(document.location.host, host);
  if (video.currentTime > 0) {
    location = setTimestamp(location, video.currentTime);
  }
  window.open(location);
}

function getInvidiousInstances() {
  return fetch('https://api.invidious.io/instances.json?pretty=1&sort_by=type,users').then(resp => resp.json());
}

function setTimestamp(location, time) {
  return location.replaceAll(/&?t=[^&]+/g, '').replace('?&', '?') + (location.indexOf('?') >= 0 ? '&' : '?') + 't=' + time;
}

document.addEventListener('mousemove', addButton);

addButton();

// soft-dependency: only do this if requested by the host
function requireRemoveEventListeners() {
  if (window.EventTarget.prototype.removeEventListeners) {
    return;
  }

  const extend = (saved, onto, offof) => {
    Object.keys(offof).forEach(member => {
      saved[member] = onto[member];
      onto[member] = offof[member];
    });
    return saved;
  };

  const ov = extend({}, window.EventTarget.prototype, {
    addEventListener(ev, f, c) {
      if (!this.eventListeners) this.eventListeners = {};
      if (!this.eventListeners[ev]) this.eventListeners[ev] = [];
      this.eventListeners[ev].push(f);
      return ov.addEventListener.apply(this, arguments);
    },
    removeEventListener(ev, f) {
      let l = this.getEventListeners(ev), i = l.indexOf(f);
      if (i > -1) l.splice(i, 1);
      return ov.removeEventListener.apply(this, arguments);
    },
    getEventListeners(event) {
      return (this.eventListeners || {})[event] || [];
    }
  });
}
