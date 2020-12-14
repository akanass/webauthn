import { MDCRipple } from '@material/ripple';

// get page elements
const checkSupported: HTMLButtonElement = document.querySelector('#checkSupported');
const supported: HTMLDivElement = document.querySelector('#supported');
const unsupported: HTMLDivElement = document.querySelector('#unsupported');

// add ripple effect
new MDCRipple(checkSupported);

// set button listener
checkSupported.addEventListener('click', () => import('./_webauthn').then(({ webAuthn }) => {
  // Reset supported/unsupported messages
  supported.style.display = 'none';
  unsupported.style.display = 'none';

  if (!!webAuthn.supported) {
    supported.style.display = 'block';
  } else {
    unsupported.style.display = 'block';
  }
}));
