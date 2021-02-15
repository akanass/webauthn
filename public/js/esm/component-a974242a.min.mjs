import{c as t,_ as e,a as i}from"./tslib.es6-470a695b.min.mjs";var n;
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var a=function(){function t(t){void 0===t&&(t={}),this.adapter=t}return Object.defineProperty(t,"cssClasses",{get:function(){return{}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"strings",{get:function(){return{}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"numbers",{get:function(){return{}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"defaultAdapter",{get:function(){return{}},enumerable:!0,configurable:!0}),t.prototype.init=function(){},t.prototype.destroy=function(){},t}(),r=function(){function e(e,i){for(var n=[],a=2;a<arguments.length;a++)n[a-2]=arguments[a];this.root=e,this.initialize.apply(this,t(n)),this.foundation=void 0===i?this.getDefaultFoundation():i,this.foundation.init(),this.initialSyncWithDOM()}return e.attachTo=function(t){return new e(t,new a({}))},e.prototype.initialize=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e]},e.prototype.getDefaultFoundation=function(){throw new Error("Subclasses must override getDefaultFoundation to return a properly configured foundation class")},e.prototype.initialSyncWithDOM=function(){},e.prototype.destroy=function(){this.foundation.destroy()},e.prototype.listen=function(t,e,i){this.root.addEventListener(t,e,i)},e.prototype.unlisten=function(t,e,i){this.root.removeEventListener(t,e,i)},e.prototype.emit=function(t,e,i){var n;void 0===i&&(i=!1),"function"==typeof CustomEvent?n=new CustomEvent(t,{bubbles:i,detail:e}):(n=document.createEvent("CustomEvent")).initCustomEvent(t,i,!1,e),this.root.dispatchEvent(n)},e}();
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
function o(t){return void 0===t&&(t=window),!!function(t){void 0===t&&(t=window);var e=!1;try{var i={get passive(){return e=!0,!1}},n=function(){};t.document.addEventListener("test",n,i),t.document.removeEventListener("test",n,i)}catch(t){e=!1}return e}
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */(t)&&{passive:!0}}function s(t,e){if(t.closest)return t.closest(e);for(var i=t;i;){if(u(i,e))return i;i=i.parentElement}return null}function u(t,e){return(t.matches||t.webkitMatchesSelector||t.msMatchesSelector).call(t,e)}function d(t){var e=t;if(null!==e.offsetParent)return e.scrollWidth;var i=e.cloneNode(!0);i.style.setProperty("position","absolute"),i.style.setProperty("transform","translate(-9999px, -9999px)"),document.documentElement.appendChild(i);var n=i.scrollWidth;return document.documentElement.removeChild(i),n}
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var c={BG_FOCUSED:"mdc-ripple-upgraded--background-focused",FG_ACTIVATION:"mdc-ripple-upgraded--foreground-activation",FG_DEACTIVATION:"mdc-ripple-upgraded--foreground-deactivation",ROOT:"mdc-ripple-upgraded",UNBOUNDED:"mdc-ripple-upgraded--unbounded"},l={VAR_FG_SCALE:"--mdc-ripple-fg-scale",VAR_FG_SIZE:"--mdc-ripple-fg-size",VAR_FG_TRANSLATE_END:"--mdc-ripple-fg-translate-end",VAR_FG_TRANSLATE_START:"--mdc-ripple-fg-translate-start",VAR_LEFT:"--mdc-ripple-left",VAR_TOP:"--mdc-ripple-top"},p={DEACTIVATION_TIMEOUT_MS:225,FG_DEACTIVATION_MS:150,INITIAL_ORIGIN_SCALE:.6,PADDING:10,TAP_DELAY_MS:300},f=["touchstart","pointerdown","mousedown","keydown"],v=["touchend","pointerup","mouseup","contextmenu"],h=[],_=function(t){function n(e){var a=t.call(this,i(i({},n.defaultAdapter),e))||this;return a.activationAnimationHasEnded_=!1,a.activationTimer_=0,a.fgDeactivationRemovalTimer_=0,a.fgScale_="0",a.frame_={width:0,height:0},a.initialSize_=0,a.layoutFrame_=0,a.maxRadius_=0,a.unboundedCoords_={left:0,top:0},a.activationState_=a.defaultActivationState_(),a.activationTimerCallback_=function(){a.activationAnimationHasEnded_=!0,a.runDeactivationUXLogicIfReady_()},a.activateHandler_=function(t){return a.activate_(t)},a.deactivateHandler_=function(){return a.deactivate_()},a.focusHandler_=function(){return a.handleFocus()},a.blurHandler_=function(){return a.handleBlur()},a.resizeHandler_=function(){return a.layout()},a}return e(n,t),Object.defineProperty(n,"cssClasses",{get:function(){return c},enumerable:!0,configurable:!0}),Object.defineProperty(n,"strings",{get:function(){return l},enumerable:!0,configurable:!0}),Object.defineProperty(n,"numbers",{get:function(){return p},enumerable:!0,configurable:!0}),Object.defineProperty(n,"defaultAdapter",{get:function(){return{addClass:function(){},browserSupportsCssVars:function(){return!0},computeBoundingRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},containsEventTarget:function(){return!0},deregisterDocumentInteractionHandler:function(){},deregisterInteractionHandler:function(){},deregisterResizeHandler:function(){},getWindowPageOffset:function(){return{x:0,y:0}},isSurfaceActive:function(){return!0},isSurfaceDisabled:function(){return!0},isUnbounded:function(){return!0},registerDocumentInteractionHandler:function(){},registerInteractionHandler:function(){},registerResizeHandler:function(){},removeClass:function(){},updateCssVariable:function(){}}},enumerable:!0,configurable:!0}),n.prototype.init=function(){var t=this,e=this.supportsPressRipple_();if(this.registerRootHandlers_(e),e){var i=n.cssClasses,a=i.ROOT,r=i.UNBOUNDED;requestAnimationFrame((function(){t.adapter.addClass(a),t.adapter.isUnbounded()&&(t.adapter.addClass(r),t.layoutInternal_())}))}},n.prototype.destroy=function(){var t=this;if(this.supportsPressRipple_()){this.activationTimer_&&(clearTimeout(this.activationTimer_),this.activationTimer_=0,this.adapter.removeClass(n.cssClasses.FG_ACTIVATION)),this.fgDeactivationRemovalTimer_&&(clearTimeout(this.fgDeactivationRemovalTimer_),this.fgDeactivationRemovalTimer_=0,this.adapter.removeClass(n.cssClasses.FG_DEACTIVATION));var e=n.cssClasses,i=e.ROOT,a=e.UNBOUNDED;requestAnimationFrame((function(){t.adapter.removeClass(i),t.adapter.removeClass(a),t.removeCssVars_()}))}this.deregisterRootHandlers_(),this.deregisterDeactivationHandlers_()},n.prototype.activate=function(t){this.activate_(t)},n.prototype.deactivate=function(){this.deactivate_()},n.prototype.layout=function(){var t=this;this.layoutFrame_&&cancelAnimationFrame(this.layoutFrame_),this.layoutFrame_=requestAnimationFrame((function(){t.layoutInternal_(),t.layoutFrame_=0}))},n.prototype.setUnbounded=function(t){var e=n.cssClasses.UNBOUNDED;t?this.adapter.addClass(e):this.adapter.removeClass(e)},n.prototype.handleFocus=function(){var t=this;requestAnimationFrame((function(){return t.adapter.addClass(n.cssClasses.BG_FOCUSED)}))},n.prototype.handleBlur=function(){var t=this;requestAnimationFrame((function(){return t.adapter.removeClass(n.cssClasses.BG_FOCUSED)}))},n.prototype.supportsPressRipple_=function(){return this.adapter.browserSupportsCssVars()},n.prototype.defaultActivationState_=function(){return{activationEvent:void 0,hasDeactivationUXRun:!1,isActivated:!1,isProgrammatic:!1,wasActivatedByPointer:!1,wasElementMadeActive:!1}},n.prototype.registerRootHandlers_=function(t){var e=this;t&&(f.forEach((function(t){e.adapter.registerInteractionHandler(t,e.activateHandler_)})),this.adapter.isUnbounded()&&this.adapter.registerResizeHandler(this.resizeHandler_)),this.adapter.registerInteractionHandler("focus",this.focusHandler_),this.adapter.registerInteractionHandler("blur",this.blurHandler_)},n.prototype.registerDeactivationHandlers_=function(t){var e=this;"keydown"===t.type?this.adapter.registerInteractionHandler("keyup",this.deactivateHandler_):v.forEach((function(t){e.adapter.registerDocumentInteractionHandler(t,e.deactivateHandler_)}))},n.prototype.deregisterRootHandlers_=function(){var t=this;f.forEach((function(e){t.adapter.deregisterInteractionHandler(e,t.activateHandler_)})),this.adapter.deregisterInteractionHandler("focus",this.focusHandler_),this.adapter.deregisterInteractionHandler("blur",this.blurHandler_),this.adapter.isUnbounded()&&this.adapter.deregisterResizeHandler(this.resizeHandler_)},n.prototype.deregisterDeactivationHandlers_=function(){var t=this;this.adapter.deregisterInteractionHandler("keyup",this.deactivateHandler_),v.forEach((function(e){t.adapter.deregisterDocumentInteractionHandler(e,t.deactivateHandler_)}))},n.prototype.removeCssVars_=function(){var t=this,e=n.strings;Object.keys(e).forEach((function(i){0===i.indexOf("VAR_")&&t.adapter.updateCssVariable(e[i],null)}))},n.prototype.activate_=function(t){var e=this;if(!this.adapter.isSurfaceDisabled()){var i=this.activationState_;if(!i.isActivated){var n=this.previousActivationEvent_;if(!(n&&void 0!==t&&n.type!==t.type))i.isActivated=!0,i.isProgrammatic=void 0===t,i.activationEvent=t,i.wasActivatedByPointer=!i.isProgrammatic&&(void 0!==t&&("mousedown"===t.type||"touchstart"===t.type||"pointerdown"===t.type)),void 0!==t&&h.length>0&&h.some((function(t){return e.adapter.containsEventTarget(t)}))?this.resetActivationState_():(void 0!==t&&(h.push(t.target),this.registerDeactivationHandlers_(t)),i.wasElementMadeActive=this.checkElementMadeActive_(t),i.wasElementMadeActive&&this.animateActivation_(),requestAnimationFrame((function(){h=[],i.wasElementMadeActive||void 0===t||" "!==t.key&&32!==t.keyCode||(i.wasElementMadeActive=e.checkElementMadeActive_(t),i.wasElementMadeActive&&e.animateActivation_()),i.wasElementMadeActive||(e.activationState_=e.defaultActivationState_())})))}}},n.prototype.checkElementMadeActive_=function(t){return void 0===t||"keydown"!==t.type||this.adapter.isSurfaceActive()},n.prototype.animateActivation_=function(){var t=this,e=n.strings,i=e.VAR_FG_TRANSLATE_START,a=e.VAR_FG_TRANSLATE_END,r=n.cssClasses,o=r.FG_DEACTIVATION,s=r.FG_ACTIVATION,u=n.numbers.DEACTIVATION_TIMEOUT_MS;this.layoutInternal_();var d="",c="";if(!this.adapter.isUnbounded()){var l=this.getFgTranslationCoordinates_(),p=l.startPoint,f=l.endPoint;d=p.x+"px, "+p.y+"px",c=f.x+"px, "+f.y+"px"}this.adapter.updateCssVariable(i,d),this.adapter.updateCssVariable(a,c),clearTimeout(this.activationTimer_),clearTimeout(this.fgDeactivationRemovalTimer_),this.rmBoundedActivationClasses_(),this.adapter.removeClass(o),this.adapter.computeBoundingRect(),this.adapter.addClass(s),this.activationTimer_=setTimeout((function(){return t.activationTimerCallback_()}),u)},n.prototype.getFgTranslationCoordinates_=function(){var t,e=this.activationState_,i=e.activationEvent;return{startPoint:t={x:(t=e.wasActivatedByPointer?function(t,e,i){if(!t)return{x:0,y:0};var n,a,r=e.x,o=e.y,s=r+i.left,u=o+i.top;if("touchstart"===t.type){var d=t;n=d.changedTouches[0].pageX-s,a=d.changedTouches[0].pageY-u}else{var c=t;n=c.pageX-s,a=c.pageY-u}return{x:n,y:a}}(i,this.adapter.getWindowPageOffset(),this.adapter.computeBoundingRect()):{x:this.frame_.width/2,y:this.frame_.height/2}).x-this.initialSize_/2,y:t.y-this.initialSize_/2},endPoint:{x:this.frame_.width/2-this.initialSize_/2,y:this.frame_.height/2-this.initialSize_/2}}},n.prototype.runDeactivationUXLogicIfReady_=function(){var t=this,e=n.cssClasses.FG_DEACTIVATION,i=this.activationState_,a=i.hasDeactivationUXRun,r=i.isActivated;(a||!r)&&this.activationAnimationHasEnded_&&(this.rmBoundedActivationClasses_(),this.adapter.addClass(e),this.fgDeactivationRemovalTimer_=setTimeout((function(){t.adapter.removeClass(e)}),p.FG_DEACTIVATION_MS))},n.prototype.rmBoundedActivationClasses_=function(){var t=n.cssClasses.FG_ACTIVATION;this.adapter.removeClass(t),this.activationAnimationHasEnded_=!1,this.adapter.computeBoundingRect()},n.prototype.resetActivationState_=function(){var t=this;this.previousActivationEvent_=this.activationState_.activationEvent,this.activationState_=this.defaultActivationState_(),setTimeout((function(){return t.previousActivationEvent_=void 0}),n.numbers.TAP_DELAY_MS)},n.prototype.deactivate_=function(){var t=this,e=this.activationState_;if(e.isActivated){var n=i({},e);e.isProgrammatic?(requestAnimationFrame((function(){return t.animateDeactivation_(n)})),this.resetActivationState_()):(this.deregisterDeactivationHandlers_(),requestAnimationFrame((function(){t.activationState_.hasDeactivationUXRun=!0,t.animateDeactivation_(n),t.resetActivationState_()})))}},n.prototype.animateDeactivation_=function(t){var e=t.wasActivatedByPointer,i=t.wasElementMadeActive;(e||i)&&this.runDeactivationUXLogicIfReady_()},n.prototype.layoutInternal_=function(){var t=this;this.frame_=this.adapter.computeBoundingRect();var e=Math.max(this.frame_.height,this.frame_.width);this.maxRadius_=this.adapter.isUnbounded()?e:Math.sqrt(Math.pow(t.frame_.width,2)+Math.pow(t.frame_.height,2))+n.numbers.PADDING;var i=Math.floor(e*n.numbers.INITIAL_ORIGIN_SCALE);this.adapter.isUnbounded()&&i%2!=0?this.initialSize_=i-1:this.initialSize_=i,this.fgScale_=""+this.maxRadius_/this.initialSize_,this.updateLayoutCssVars_()},n.prototype.updateLayoutCssVars_=function(){var t=n.strings,e=t.VAR_FG_SIZE,i=t.VAR_LEFT,a=t.VAR_TOP,r=t.VAR_FG_SCALE;this.adapter.updateCssVariable(e,this.initialSize_+"px"),this.adapter.updateCssVariable(r,this.fgScale_),this.adapter.isUnbounded()&&(this.unboundedCoords_={left:Math.round(this.frame_.width/2-this.initialSize_/2),top:Math.round(this.frame_.height/2-this.initialSize_/2)},this.adapter.updateCssVariable(i,this.unboundedCoords_.left+"px"),this.adapter.updateCssVariable(a,this.unboundedCoords_.top+"px"))},n}(a),m=function(t){function i(){var e=null!==t&&t.apply(this,arguments)||this;return e.disabled=!1,e}return e(i,t),i.attachTo=function(t,e){void 0===e&&(e={isUnbounded:void 0});var n=new i(t);return void 0!==e.isUnbounded&&(n.unbounded=e.isUnbounded),n},i.createAdapter=function(t){return{addClass:function(e){return t.root.classList.add(e)},browserSupportsCssVars:function(){return function(t,e){void 0===e&&(e=!1);var i,a=t.CSS;if("boolean"==typeof n&&!e)return n;if(!a||"function"!=typeof a.supports)return!1;var r=a.supports("--css-vars","yes"),o=a.supports("(--css-vars: yes)")&&a.supports("color","#00000000");return i=r||o,e||(n=i),i}(window)},computeBoundingRect:function(){return t.root.getBoundingClientRect()},containsEventTarget:function(e){return t.root.contains(e)},deregisterDocumentInteractionHandler:function(t,e){return document.documentElement.removeEventListener(t,e,o())},deregisterInteractionHandler:function(e,i){return t.root.removeEventListener(e,i,o())},deregisterResizeHandler:function(t){return window.removeEventListener("resize",t)},getWindowPageOffset:function(){return{x:window.pageXOffset,y:window.pageYOffset}},isSurfaceActive:function(){return u(t.root,":active")},isSurfaceDisabled:function(){return Boolean(t.disabled)},isUnbounded:function(){return Boolean(t.unbounded)},registerDocumentInteractionHandler:function(t,e){return document.documentElement.addEventListener(t,e,o())},registerInteractionHandler:function(e,i){return t.root.addEventListener(e,i,o())},registerResizeHandler:function(t){return window.addEventListener("resize",t)},removeClass:function(e){return t.root.classList.remove(e)},updateCssVariable:function(e,i){return t.root.style.setProperty(e,i)}}},Object.defineProperty(i.prototype,"unbounded",{get:function(){return Boolean(this.unbounded_)},set:function(t){this.unbounded_=Boolean(t),this.setUnbounded_()},enumerable:!0,configurable:!0}),i.prototype.activate=function(){this.foundation.activate()},i.prototype.deactivate=function(){this.foundation.deactivate()},i.prototype.layout=function(){this.foundation.layout()},i.prototype.getDefaultFoundation=function(){return new _(i.createAdapter(this))},i.prototype.initialSyncWithDOM=function(){var t=this.root;this.unbounded="mdcRippleIsUnbounded"in t.dataset},i.prototype.setUnbounded_=function(){this.foundation.setUnbounded(Boolean(this.unbounded_))},i}(r);export{a as M,r as a,o as b,m as c,_ as d,d as e,s as f,u as m};
