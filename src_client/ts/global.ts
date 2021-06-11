import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
import { MDCCheckbox } from '@material/checkbox';
import { MDCFormField } from '@material/form-field/component';

// add ripple effect
const rippleSelectors =
  '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';
[].map.call(
  document.querySelectorAll(rippleSelectors),
  (el) => new MDCRipple(el),
);

// add text field
[].map.call(
  document.querySelectorAll('.mdc-text-field'),
  (el) => new MDCTextField(el),
);

// add checkbox
[].map.call(document.querySelectorAll('.mdc-checkbox'), (el) => {
  const checkbox = new MDCCheckbox(el);
  const parentNode = el.parentNode;
  if (parentNode.className.indexOf('mdc-form-field') > -1) {
    const formField = new MDCFormField(parentNode);
    formField.input = checkbox;
  }
});
