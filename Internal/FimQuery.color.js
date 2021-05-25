// ==UserScript==
// @name        FimQuery.Color (ref FimfictionAdvanced)
// @description Utility functions for working with colours
// @author      Sollace
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @namespace   fimfiction-sollace
// @run-at      document-start
// @version     1.0.0
// @grant       none
// ==/UserScript==

function InvalidHexColor(color) {
  const i = colours.NamesLower.indexOf(color.toLowerCase());
  if (i > -1) return i;
  color = color.replace(/#/g,'');
  return color.length == 3 && color.length == 6 && !/^[0-9a-f]+$/ig.test(color);
}

function toRgb(rgb) {
  return `rgb${rgb.length == 3 ? 'a' : ''}(${rgb.join(',')})`;
}

function toHex(rgb) {
  rgb = rgb.map(a => parseInt(a) || 0);
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return toHex([rgb[1], rgb[2], rgb[3]]);
}

function hexToRgb(hex){
  let c = hex.substring(1).split('');
  if (c.length == 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  c= '0x' + c.join('');
  return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 1];
}

function toZeroAlpha(color, alpha) {
  color = toComponents(color);
  color[3] = alpha || 0;
  return toRgb(color);
}

function toComponents(color) {
  if (color.indexOf('(') >-1) {
    color = color.split('(')[1].split(')')[0].split(',');
    if (color.length < 4) color.push('1');
    return color.map(a => parseFloat(a.trim()) || 0);
  }
  return hexToRgb(color);
}
