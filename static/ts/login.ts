// get page elements
/*const checkSupported: HTMLButtonElement = document.querySelector('#checkSupported');
const supported: HTMLDivElement = document.querySelector('#supported');
const unsupported: HTMLDivElement = document.querySelector('#unsupported');

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
}));*/
const form: HTMLFormElement = document.querySelector('#login');

// add event listener on window.load
window.addEventListener("load", () => {
  // intercept submit form
  form.addEventListener('submit', e => {
    // stop normal process
    e.preventDefault();

    // get form values
    const username = form.elements['username'].value;
    const password = form.elements['password'].value;
    console.log(username, password);
  });
});
