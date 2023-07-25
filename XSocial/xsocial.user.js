// ==UserScript==
// @name        XSocial
// @author      sollace
// @namespace   sollace
// @include     /^https*://twitter.com/.*/
// @grant       none
// @version     1.0
// @inject-into content
// @run-at      document-start
// ==/UserScript==


function logoFor(element) {
  return `
 <g transform="translate(-46.834 -99.974)">
  <g transform="matrix(1.0413 0 -.089837 .92782 2.6097 -5.0228)" fill="#f30000" stroke-linejoin="round" stroke-width="57.444" aria-label="X">
   <path d="m124.8 150.15 24.854-36.981h18.26l-33.642 50.253m-0.0781 21.12 36.413 54.258h-18.26l-27.573-41.02zm-52.783 54.258h-18.344l44.85-67.065-39.128-58.566h18.26l39.491 59.376z" fill="#f30000"/>
  </g>
 </g>`;
}


function applyScript() {
  document.body.querySelectorAll('svg:not(.script-applied) path[d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0"]').forEach(element => {
    element = element.closest('svg');
    element.innerHTML = logoFor(element);
    element.classList.add('script-applied');
    element.setAttribute('viewBox', '0 0 120.47 116.56');
  });
  const span = document.body.querySelector('svg.script-applied + div + div > span');
  if (span && span.innerText.indexOf('Twitter') != -1) {
    span.innerText = span.innerText.replace('Twitter', 'X');
  }
  document.querySelectorAll('title, #modal-header > span > span').forEach(a => a.innerText = a.innerText.replace('Twitter', 'X'));
}

window.addEventListener('DOMContentLoaded', () => {
  try {
    document.head.insertAdjacentHTML('afterbegin', `<style type="text/css" id="xsocial-styles">
  img[src*="abs.twimg.com/sticky/illustrations"], *[style*="abs.twimg.com/sticky/illustrations"] {
    filter: hue-rotate(180deg) blur(50px);
  }
</style>`);
    applyScript();
  } catch (e) {
    alert(e);
  }
});
setInterval(applyScript, 100);

