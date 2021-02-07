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

    // patch user info if he wants to skip enrollment
    if (!!checkboxStopEnrollment.checked) {

    } else {
      // import webauthn script
      import('./_webauthn').then(({ webAuthn }) => {
        // check if webauthn is supported in this browser
        if (!webAuthn.supported) {
          // display error message and stop redirection
          displayLoginAuthenticatorWebAuthnErrorMessage();
        } else {
          // redirect user to webauthn/authenticator page
          window.location.href = '/webauthn/authenticator';
        }
      });
    }
  });
};
