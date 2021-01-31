import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';

// add ripple effect
const rippleSelectors = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';
[].map.call(document.querySelectorAll(rippleSelectors), el => new MDCRipple(el));

// add text field
[].map.call(document.querySelectorAll('.mdc-text-field'), el => new MDCTextField(el));
