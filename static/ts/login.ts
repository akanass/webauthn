// set button listener
const checkSupported: HTMLButtonElement = document.querySelector("#checkSupported");
const supported: HTMLDivElement = document.querySelector("#supported");
const unsupported: HTMLDivElement = document.querySelector("#unsupported");

checkSupported.addEventListener('click', () => import('./_webauthn').then(({webAuthn}) => {
  // Reset supported/unsupported messages
  supported.style.display = 'none';
  unsupported.style.display = 'none';

  if (!!webAuthn.supported) {
    supported.style.display = 'block';
  } else {
    unsupported.style.display = 'block';
  }

  console.log('SUPPORTED =>', webAuthn.supported);
}));
