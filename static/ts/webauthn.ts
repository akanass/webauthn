import { MDCDialog } from '@material/dialog';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AssertionCredentialJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';

/**
 * Get page's elements
 */
const errorLoginWebAuthn: HTMLDivElement = document.querySelector('#error-login-webauthn');
const webAuthnLoginButton: HTMLButtonElement = document.querySelector('#webAuthnLoginButton');
const mainDiv: HTMLDivElement = document.querySelector('#main-content');

/**
 * Verify dialog elements
 */
const webAuthnDialogVerify: MDCDialog = new MDCDialog(document.querySelector('#webauthn-dialog-verify'));
const verifyCancelButton: HTMLButtonElement = document.querySelector('#verify-cancel-action');
const verifyRetryButton: HTMLButtonElement = document.querySelector('#verify-retry-action');
const errorVerifyCredential: HTMLDivElement = document.querySelector('#error-verify-credential');

/**
 * Variable to store verify subscription
 */
let verifySubscription: Subscription;

/**
 * Add event listener on window.load to put all process in place
 */
window.addEventListener('load', () => {
  // reset all error messages
  resetErrorMessage();

  // webauthn login process
  webAuthnProcess();

  // retry process
  retryProcess();
});

/**
 * Function to reset error message block
 */
const resetErrorMessage = () => {
  // hide error messages
  errorLoginWebAuthn.style.display = 'none';

  // hide verify dialog error messages
  resetVerifyErrorMessage();
};

/**
 * Function to display WebAuthn error message
 */
const displayWebAuthnErrorMessage = () => {
  errorLoginWebAuthn.style.display = 'flex';
};

/**
 * Function to disable login button
 */
const disableWebAuthnLoginButton = (disable: boolean) => {
  webAuthnLoginButton.disabled = disable;
};

/**
 * Function to disable dialog buttons
 */
const disableVerifyDialogButtons = (disabled: boolean) => {
  verifyCancelButton.disabled = disabled;
  verifyRetryButton.disabled = disabled;
};

/**
 * Function to reset verify dialog error message block
 */
const resetVerifyErrorMessage = () => {
  errorVerifyCredential.style.display = 'none';
};

/**
 * Function to display verify dialog error message block
 */
const displayVerifyErrorMessage = () => {
  errorVerifyCredential.style.display = 'flex';
};

/**
 * Function to handle click on login button
 */
const webAuthnProcess = () => {
  webAuthnLoginButton.addEventListener('click', () => {
    // reset all error messages
    resetErrorMessage();

    // disable button
    disableWebAuthnLoginButton(true);

    // enable dialog buttons
    disableVerifyDialogButtons(false);

    // import webauthn script
    import('./_webauthn').then(({ webAuthn }) => {
      if (!webAuthn.supported) {
        // display error message
        displayWebAuthnErrorMessage();
        // enable only edit buttons
        setTimeout(() => disableWebAuthnLoginButton(false), 500);
      } else {
        // open the dialog
        import('./_template').then(({ template }) => {
          template.openDialog(
            webAuthnDialogVerify,
            undefined,
            () => {
              // set attribute on main content
              mainDiv.setAttribute('aria-hidden', 'true');

              // launch process to verify authenticator
              verifyCredentialProcess();
            },
            () => {
              // remove attribute on main content
              mainDiv.removeAttribute('aria-hidden');
            },
            () => {
              setTimeout(() => disableWebAuthnLoginButton(false), 500);
            },
          );
        });
      }
    });
  });
};

/**
 * Function to handle click on retry process
 */
const retryProcess = () => {
  verifyRetryButton.addEventListener('click', () => verifyCredentialProcess(false));
};

/**
 * Function to verify credential and login user
 */
const verifyCredentialProcess = (waitToDisableButtons = true) => {
  // reset error messages
  resetVerifyErrorMessage();

  // disable buttons with timeout to avoid flickering in dialog open state
  if (!!waitToDisableButtons) {
    setTimeout(() => disableVerifyDialogButtons(true), 200);
  } else {
    disableVerifyDialogButtons(true);
  }

  // delete previous subscription to memory free
  if (!!verifySubscription) {
    verifySubscription.unsubscribe();
  }

  // import webauthn and api to start verification process
  import('./_webauthn').then(({ webAuthn }) => import('./_api').then(({ api }) => {
    verifySubscription = api.startAssertion()
      .pipe(
        mergeMap((_: PublicKeyCredentialRequestOptionsJSON) => webAuthn.startAssertion(_)),
        mergeMap((_: AssertionCredentialJSON) => api.verifyAssertion(_)),
      )
      .subscribe(
        () => {
          // delete previous subscription to memory free
          verifySubscription.unsubscribe();

          // redirect user to end page
          window.location.href = '/end';
        },
        (err: any) => {
          console.error(err);
          displayVerifyErrorMessage();
          setTimeout(() => disableVerifyDialogButtons(false), 500);
        },
      );
  }));
};
