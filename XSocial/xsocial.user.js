// ==UserScript==
// @name        XSocial
// @author      sollace
// @namespace   Violentmonkey Scripts
// @include     /^https*://twitter.com/.*/
// @grant       none
// @version     1.1
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
  document.body.querySelectorAll('svg:not(.script-applied) path[d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"]').forEach(element => {
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
