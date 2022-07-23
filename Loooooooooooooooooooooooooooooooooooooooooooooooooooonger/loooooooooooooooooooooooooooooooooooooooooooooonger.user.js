// ==UserScript==
// @name        Looooooooooooooooooooooooooooooooooooooooooo
// @description Make links Looooooooooooooooooooooooooooooooooooooooooo
// @version     1.0.0
// @author      Sollace
// @namespace   fun-sollace
// @include     /.*/
// @grant       none
// @inject-into content
// @run-at      document-start
// ==/UserScript==

// Based on code by @Nicell (cleaned up a little)
// Original: https://github.com/Nicell/loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ng/blob/main/src/pages/index.astro
// The irony of making code for lengthening urls so short is not lost on me - Sollace
const bases = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
const site = 'https://loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ng/';
function longer(input) {
  input = new URL(!/https?/.test('https://') ? `https://${input}` : input).toString();
  return `${site}l${[].map.call(btoa(input), ch => bases.indexOf(ch).toString(2)
    .padStart(9, '0')
    .replace(/(0|1)/g, ch => ch == '1' ? 'O' : 'o')).join('')}ng`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a:not([data-longified]').forEach(link => {
    try {
      link.dataset.longified = true;
      link.href = longer(link.href);
    } catch (ignored) {}
  });
});
