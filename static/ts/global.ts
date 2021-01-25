import { MDCRipple } from '@material/ripple';

// add ripple effect
const selector = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';
[].map.call(document.querySelectorAll(selector), function(el) {
  return new MDCRipple(el);
});
