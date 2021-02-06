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
var t=function(r,o){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])})(r,o)};function r(r,o){if("function"!=typeof o&&null!==o)throw new TypeError("Class extends value "+String(o)+" is not a constructor or null");function n(){this.constructor=r}t(r,o),r.prototype=null===o?Object.create(o):(n.prototype=o.prototype,new n)}var o=function(){return(o=Object.assign||function(t){for(var r,o=1,n=arguments.length;o<n;o++)for(var e in r=arguments[o])Object.prototype.hasOwnProperty.call(r,e)&&(t[e]=r[e]);return t}).apply(this,arguments)};function n(t,r){var o="function"==typeof Symbol&&t[Symbol.iterator];if(!o)return t;var n,e,a=o.call(t),c=[];try{for(;(void 0===r||r-- >0)&&!(n=a.next()).done;)c.push(n.value)}catch(t){e={error:t}}finally{try{n&&!n.done&&(o=a.return)&&o.call(a)}finally{if(e)throw e.error}}return c}function e(){for(var t=[],r=0;r<arguments.length;r++)t=t.concat(n(arguments[r]));return t}export{e as _,r as a,o as b};
