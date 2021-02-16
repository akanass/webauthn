import { AjaxError } from 'rxjs/ajax';
import { Subscription } from 'rxjs';

/**
 * Get page's elements
 */
const buttonLogout: HTMLButtonElement = document.querySelector('#logout');
const buttonAuthenticatorManagement: HTMLButtonElement = document.querySelector('#authenticator-management');
const errorEnd: HTMLDivElement = document.querySelector('#error-end');
const errorEndMessage: HTMLSpanElement = document.querySelector('#error-end-message');
const errorWebAuthnMessage: HTMLSpanElement = document.querySelector('#error-webauthn-message');

/**
 * Variables to store subscription
 */
let logoutSubscription: Subscription;
let sessionSubscription: Subscription;

/**
 * Add event listener on window.load to put all process in place
 */
window.addEventListener('load', () => {
  // reset all error messages
  resetErrorMessage();

  // set logout process
  logoutProcess();

  // set authenticator redirection process
  authenticatorProcess();
});

/**
 * Function to reset error message block
 */
const resetErrorMessage = () => {
  // hide error messages
  errorEnd.style.display = 'none';
  errorEndMessage.style.display = 'none';
  errorEndMessage.innerText = '';
  errorWebAuthnMessage.style.display = 'none';
};

/**
 * Function to display login error message
 */
const displayEndErrorMessage = (message: string) => {
  errorEnd.style.display = 'flex';
  errorEndMessage.style.display = 'inline';
  errorEndMessage.innerText = message;
  errorWebAuthnMessage.style.display = 'none';
};

/**
 * Function to display WebAuthn error message
 */
const displayWebAuthnErrorMessage = () => {
  errorEnd.style.display = 'flex';
  errorEndMessage.style.display = 'none';
  errorEndMessage.innerText = '';
  errorWebAuthnMessage.style.display = 'inline';
};

/**
 * Function to disable buttons
 */
const disableButtons = () => {
  // disable button & checkbox
  buttonLogout.disabled = true;
  buttonAuthenticatorManagement.disabled = true;
}

/**
 * Function to enable buttons
 */
const enableButtons = () => {
  // enable button & checkbox
  buttonLogout.disabled = false;
  buttonAuthenticatorManagement.disabled = false;
}

/**
 * Function to enable logout button
 */
const enableOnlyLogoutButton = () => {
  buttonLogout.disabled = false;
}

/**
 * Function to manage logout process
 */
const logoutProcess = () => {
  buttonLogout.addEventListener('click', () => {
    // reset error messages
    resetErrorMessage();

    // disable button & checkbox
    disableButtons();

    // delete previous subscription to memory free
    if (!!logoutSubscription) {
      logoutSubscription.unsubscribe();
    }

    // import api script
    import('./_api').then(({ api }) => {
      logoutSubscription = api.logout()
        .subscribe(
          () => {
            // delete previous subscription to memory free
            logoutSubscription.unsubscribe();

            // redirect user to home page
            window.location.href = '/';
          },
          (err: AjaxError) => manageApiError(err, logoutSubscription),
        );
    });
  });
}


/**
 * Function to manage authenticator process
 */
const authenticatorProcess = () => {
  buttonAuthenticatorManagement.addEventListener('click', () => {
    // reset error messages
    resetErrorMessage();

    // disable button & checkbox
    disableButtons();

    // delete previous subscription to memory free
    if (!!sessionSubscription) {
      sessionSubscription.unsubscribe();
    }

    // import webauthn script
    import('./_webauthn').then(({ webAuthn }) => {
      // check if webauthn is supported in this browser
      if (!webAuthn.supported) {
        // display error message and stop redirection
        displayWebAuthnErrorMessage();
        // enable buttons
        setTimeout(() => enableOnlyLogoutButton(), 500);
      } else {
        import('./_api').then(({ api }) => {
          sessionSubscription = api.patchSession({ key: 'previous_step', value: 'end' })
            .subscribe(
              () => {
                // delete previous subscription to memory free
                sessionSubscription.unsubscribe();

                // redirect user to webauthn/authenticator page
                window.location.href = '/webauthn/authenticator';
              },
              (err: AjaxError) => manageApiError(err, sessionSubscription),
            );
        });
      }
    });
  });
}

/**
 * Function to manage API error
 *
 * @param {AjaxError} err instance of AjaxError
 * @param {Subscription} sub instance of Subscription
 */
const manageApiError = (err: AjaxError, sub: Subscription) => {
  // check if user is authenticated
  if (err.status === 401) {
    // delete previous subscription to memory free
    if (!!sub) {
      sub.unsubscribe();
    }
    // redirect user to error page
    window.location.href = '/error';
  } else {
    // error message is an array so we take only the first one
    // and we set the message in the page
    const errorMessage = [].concat(err.response.message).shift();

    // display message
    displayEndErrorMessage(errorMessage);

    // enable buttons
    setTimeout(() => enableButtons(), 500);
  }
};
