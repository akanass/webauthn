import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { User } from './_user';
import { AjaxError } from 'rxjs/ajax';

/**
 * Get page's elements
 */
const errorLoginAuthenticator: HTMLDivElement = document.querySelector('#error-login-authenticator');
const errorLoginAuthenticatorMessage: HTMLSpanElement = document.querySelector('#error-login-authenticator-message');
const errorLoginAuthenticatorWebAuthnMessage: HTMLSpanElement = document.querySelector('#error-webauthn-message');
const buttonEnrollmentIcon: HTMLElement = document.querySelector('#button-icon');
const buttonEnrollmentLabel: HTMLLabelElement = document.querySelector('#button-label');
const buttonEnrollment: HTMLButtonElement = document.querySelector('#start-enrollment');
const checkboxStopEnrollment: HTMLInputElement = document.querySelector('#stop-enrollment');

/**
 * Variables to store subscription
 */
let userSubscription: Subscription;
let sessionSubscription: Subscription;

/**
 * Add event listener on window.load to put all process in place
 */
window.addEventListener('load', () => {
  // reset all error messages
  resetErrorMessage();

  // reset button to start enrollment
  resetButtonToStartEnrollment();

  // set checkbox stop enrollment process
  checkStopEnrollmentProcess();

  // set start or skip enrollment process
  startOrSkipEnrollmentProcess();
});

/**
 * Function to reset error message block
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const resetErrorMessage = () => {
  // hide error messages
  errorLoginAuthenticator.style.display = 'none';
  errorLoginAuthenticatorMessage.style.display = 'none';
  errorLoginAuthenticatorMessage.innerText = '';
  errorLoginAuthenticatorWebAuthnMessage.style.display = 'none';
};

/**
 * Function to display login error message
 */
const displayLoginAuthenticatorErrorMessage = (message: string) => {
  errorLoginAuthenticator.style.display = 'flex';
  errorLoginAuthenticatorMessage.style.display = 'inline';
  errorLoginAuthenticatorMessage.innerText = message;
  errorLoginAuthenticatorWebAuthnMessage.style.display = 'none';
};

/**
 * Function to display WebAuthn error message
 */
const displayLoginAuthenticatorWebAuthnErrorMessage = () => {
  errorLoginAuthenticator.style.display = 'flex';
  errorLoginAuthenticatorMessage.style.display = 'none';
  errorLoginAuthenticatorMessage.innerText = '';
  errorLoginAuthenticatorWebAuthnMessage.style.display = 'inline';
};

/**
 * Function to display start enrollment button info
 */
const resetButtonToStartEnrollment = () => {
  buttonEnrollmentIcon.innerText = 'fingerprint';
  buttonEnrollmentLabel.innerText = 'Start Enrollment';
};

/**
 * Function to display stop enrollment button info
 */
const resetButtonToStopEnrollment = () => {
  buttonEnrollmentIcon.innerText = 'exit_to_app';
  buttonEnrollmentLabel.innerText = 'Skip Enrollment';
};

/**
 * Function to change UI when click on the checkbox
 */
const checkStopEnrollmentProcess = () => {
  checkboxStopEnrollment.addEventListener('click', () => {
    // reset error messages
    resetErrorMessage();

    // display good label on the enrollment button
    if (!!checkboxStopEnrollment.checked) {
      resetButtonToStopEnrollment();
    } else {
      resetButtonToStartEnrollment();
    }
  });
};

/**
 * Function to start/skip enrollment process
 */
const startOrSkipEnrollmentProcess = () => {
  buttonEnrollment.addEventListener('click', () => {
    // reset error messages
    resetErrorMessage();

    // disable button & checkbox
    buttonEnrollment.disabled = true;
    checkboxStopEnrollment.disabled = true;

    // delete previous subscriptions to memory free
    if (!!userSubscription) {
      userSubscription.unsubscribe();
    }

    if (!!sessionSubscription) {
      sessionSubscription.unsubscribe();
    }

    // patch user info if he wants to skip enrollment
    if (!!checkboxStopEnrollment.checked) {
      import('./_api').then(({ api }) => {
        // get logged in user
        userSubscription = api.loggedIn()
          .pipe(
            mergeMap((user: User) => api.patchUser(user.userId, { skip_authenticator_registration: true })),
            mergeMap(() => api.clearSession({ key: 'previous_step' })),
          )
          .subscribe(
            () => {
              // delete previous subscription to memory free
              userSubscription.unsubscribe();

              window.location.href = '/end'; // TODO THIS IS THE END OF THE PROCESS FOR NOW - SHOULD BE AN OIDC STEP
            },
            (err: AjaxError) => manageApiError(err),
          );
      });
    } else {
      // import webauthn script
      import('./_webauthn').then(({ webAuthn }) => {
        // check if webauthn is supported in this browser
        if (!webAuthn.supported) {
          // display error message and stop redirection
          displayLoginAuthenticatorWebAuthnErrorMessage();
        } else {
          import('./_api').then(({ api }) => {
            sessionSubscription = api.patchSession({ key: 'previous_step', value: 'login_authenticator' })
              .subscribe(
                () => {
                  // delete previous subscription to memory free
                  sessionSubscription.unsubscribe();

                  // redirect user to webauthn/authenticator page
                  window.location.href = '/webauthn/authenticator';
                },
                (err: AjaxError) => manageApiError(err),
              );
          });
        }
      });
    }
  });
};

/**
 * Function to manage API error
 *
 * @param {AjaxError} err instance of AjaxError
 */
const manageApiError = (err: AjaxError) => {
  // check if user is authenticated
  if (err.status === 401) {
    window.location.href = '/error';
  } else {
    // error message is an array so we take only the first one
    // and we set the message in the page
    const errorMessage = [].concat(err.message).shift();

    // display message
    displayLoginAuthenticatorErrorMessage(errorMessage);

    // enable button with timeout to avoid flickering
    setTimeout(() => {
      buttonEnrollment.disabled = false;
      checkboxStopEnrollment.disabled = false;
    }, 500);
  }
};
