/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var t=function(r,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])})(r,n)};function r(r,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=r}t(r,n),r.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}var n=function(){return(n=Object.assign||function(t){for(var r,n=1,o=arguments.length;n<o;n++)for(var e in r=arguments[n])Object.prototype.hasOwnProperty.call(r,e)&&(t[e]=r[e]);return t}).apply(this,arguments)};function o(t){var r="function"==typeof Symbol&&Symbol.iterator,n=r&&t[r],o=0;if(n)return n.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")}function e(t,r){var n="function"==typeof Symbol&&t[Symbol.iterator];if(!n)return t;var o,e,a=n.call(t),i=[];try{for(;(void 0===r||r-- >0)&&!(o=a.next()).done;)i.push(o.value)}catch(t){e={error:t}}finally{try{o&&!o.done&&(n=a.return)&&n.call(a)}finally{if(e)throw e.error}}return i}function a(){for(var t=[],r=0;r<arguments.length;r++)t=t.concat(e(arguments[r]));return t}export{r as _,n as a,a as b,o as c,e as d};
