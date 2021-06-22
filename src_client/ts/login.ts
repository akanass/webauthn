import { Subscription } from 'rxjs';
import { User } from './_user';
import { AjaxError } from 'rxjs/ajax';

/**
 * Get page's elements
 */
const form: HTMLFormElement = document.querySelector('#login');
const errorLogin: HTMLDivElement = document.querySelector('#error-login');
const errorLoginMessage: HTMLSpanElement = document.querySelector(
  '#error-login-message',
);
const errorWebAuthnMessage: HTMLSpanElement = document.querySelector(
  '#error-webauthn-message',
);
const webauthnRedirectLink: HTMLLinkElement =
  document.querySelector('#webauthn-redirect');
const loginButton: HTMLButtonElement = document.querySelector('#loginButton');

/**
 * Variable to store auth subscription
 */
let loginSubscription: Subscription;

/**
 * Add event listener on window.load to put all process in place
 */
window.addEventListener('load', () => {
  // reset all error messages
  resetErrorMessage();

  // set authentication process
  authenticationProcess();

  // set WebAuthn redirection process
  webauthnRedirection();
});

/**
 * Function to reset error message block
 */
const resetErrorMessage = () => {
  // hide error messages
  errorLogin.style.display = 'none';
  errorLoginMessage.style.display = 'none';
  errorLoginMessage.innerText = '';
  errorWebAuthnMessage.style.display = 'none';
};

/**
 * Function to display login error message
 */
const displayLoginErrorMessage = (message: string) => {
  errorLogin.style.display = 'flex';
  errorLoginMessage.style.display = 'inline';
  errorLoginMessage.innerText = message;
  errorWebAuthnMessage.style.display = 'none';
};

/**
 * Function to display WebAuthn error message
 */
const displayWebAuthnErrorMessage = () => {
  errorLogin.style.display = 'flex';
  errorLoginMessage.style.display = 'none';
  errorLoginMessage.innerText = '';
  errorWebAuthnMessage.style.display = 'inline';
};

/**
 * Function to authenticate user by username/password
 */
const authenticationProcess = () => {
  // add event listener on submit process
  form.addEventListener('submit', (e) => {
    // stop normal process
    e.preventDefault();

    // reset error messages
    resetErrorMessage();

    // disable button
    loginButton.disabled = true;

    // get form values
    const username = form.elements['username'].value.toLowerCase();
    const password = form.elements['password'].value;

    // delete previous subscription to memory free
    if (!!loginSubscription) {
      loginSubscription.unsubscribe();
    }

    // import auth script
    import('./_api').then(({ api }) => {
      // login user
      loginSubscription = api.login(username, password).subscribe({
        next: (user: User) => {
          // check if user has to be redirected to login/authenticator
          if (!user.skipAuthenticatorRegistration) {
            window.location.href = '/login/authenticator';
          } else {
            window.location.href = '/end';
          }
        },
        error: (err: AjaxError) => {
          // error message is an array so we take only the first one
          // and we set the message in the page
          const errorMessage = [].concat(err.response.message).shift();

          // display message
          displayLoginErrorMessage(errorMessage);

          // enable button with timeout to avoid flickering
          setTimeout(() => (loginButton.disabled = false), 500);
        },
        // delete previous subscription to memory free
        complete: () => loginSubscription.unsubscribe(),
      });
    });
  });
};

/**
 * Function to check if WebAuthn is supported then display error message or redirect user
 */
const webauthnRedirection = () => {
  webauthnRedirectLink.addEventListener('click', (e) => {
    // stop normal process
    e.preventDefault();

    // reset error messages
    resetErrorMessage();

    // import webauthn script
    import('./_webauthn').then(({ webAuthn }) => {
      // check if webauthn is supported in this browser
      if (!webAuthn.supported) {
        // display error message and stop redirection
        displayWebAuthnErrorMessage();
      } else {
        // redirect user to webauthn page
        window.location.href = webauthnRedirectLink.href;
      }
    });
  });
};
