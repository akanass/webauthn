import { User } from './_user';
import { Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Credential } from './_credential';
import { CredentialsList } from './_credentials_list';
import { AjaxError } from 'rxjs/ajax';

/**
 * Get page's elements
 */
const errorAuthenticatorsList: HTMLDivElement = document.querySelector('#error-authenticators-list');
const errorAuthenticatorsListMessage: HTMLSpanElement = document.querySelector('#error-authenticators-list-message');
const errorAuthenticatorsListWebAuthnMessage: HTMLSpanElement = document.querySelector('#error-webauthn-message');
const tabBar: HTMLDivElement = document.querySelector('#authenticators-tab-bar');
const securityKeys: HTMLDivElement = document.querySelector('#security-keys');
const securityKeysList: HTMLDivElement = document.querySelector('#security-keys-list');
const biometrics: HTMLDivElement = document.querySelector('#biometrics');
const biometricsList: HTMLDivElement = document.querySelector('#biometrics-list');
const addSecurityKeyButton: HTMLButtonElement = document.querySelector('#add-security-key');
const addBiometricButton: HTMLButtonElement = document.querySelector('#add-biometric');

/**
 * Variables to store subscription
 */
let initSubscription: Subscription;

/**
 * Variable to store current logged in user
 */
let currentUser: User;

/**
 * Add event listener on window.load to put all process in place
 */
window.addEventListener('load', () => {
  // initial process - all processes have to be initialized in subscription
  initProcess();
});

/**
 * Function to reset error message block
 */
const resetErrorMessage = () => {
  // hide error messages
  errorAuthenticatorsList.style.display = 'none';
  errorAuthenticatorsListMessage.style.display = 'none';
  errorAuthenticatorsListMessage.innerText = '';
  errorAuthenticatorsListWebAuthnMessage.style.display = 'none';
};

/**
 * Function to display authenticator list error message
 */
const displayAuthenticatorListErrorMessage = (message: string) => {
  errorAuthenticatorsList.style.display = 'flex';
  errorAuthenticatorsListMessage.style.display = 'inline';
  errorAuthenticatorsListMessage.innerText = message;
  errorAuthenticatorsListWebAuthnMessage.style.display = 'none';
};

/**
 * Function to display WebAuthn error message
 */
const displayAuthenticatorListWebAuthnErrorMessage = () => {
  errorAuthenticatorsList.style.display = 'flex';
  errorAuthenticatorsListMessage.style.display = 'none';
  errorAuthenticatorsListMessage.innerText = '';
  errorAuthenticatorsListWebAuthnMessage.style.display = 'inline';
};

/**
 * Methods to disable/enable buttons
 *
 * @param disabled
 */
const disableAddBiometricButton = (disabled: boolean) => addBiometricButton.disabled = disabled;
const disableAddSecurityKeyButton = (disabled: boolean) => addSecurityKeyButton.disabled = disabled;
const disableBothAddButtons = (disabled: boolean) => {
  disableAddBiometricButton(disabled);
  disableAddSecurityKeyButton(disabled);
};
const disableAllCredentialsEditButtons = (disabled: boolean) => [].map.call(document.querySelectorAll('.edit-authenticator'), (button: HTMLButtonElement) => button.disabled = disabled);

/**
 * Function to handle tab bar switch
 */
const tabBarSwitch = () => {
  tabBar.addEventListener('MDCTabBar:activated', (e: CustomEvent) => {
    // reset error message
    resetErrorMessage();

    switch (e.detail.index) {
      case 0:
        securityKeys.classList.add('authenticators-list--active');
        biometrics.classList.remove('authenticators-list--active');
        break;
      case 1:
        securityKeys.classList.remove('authenticators-list--active');
        biometrics.classList.add('authenticators-list--active');
        break;
      default:
        securityKeys.classList.remove('authenticators-list--active');
        biometrics.classList.remove('authenticators-list--active');
        displayAuthenticatorListErrorMessage('Authenticators list can\'t be displayed');
    }
  });
};

/**
 * Function to handle credential edition
 */
const editCredentialProcess = () => {
  [].map.call(document.querySelectorAll('.edit-authenticator'), (button: HTMLButtonElement) => {
    button.addEventListener('click', () => {
      // reset error message
      resetErrorMessage();

      // get authenticator id
      const authenticatorId = button.dataset?.authenticatorid;

      console.log(authenticatorId);
    });
  });
};

/**
 * We get current user and generate credentials HTML when page is loaded
 */
const initProcess = () => {
  // reset all error messages
  resetErrorMessage();

  // disable both buttons
  disableBothAddButtons(true);

  // delete previous subscriptions to memory free
  if (!!initSubscription) {
    initSubscription.unsubscribe();
  }

  import('./_api').then(({ api }) => {
    // get logged in user
    initSubscription = api.loggedIn()
      .pipe(
        tap((user: User) => currentUser = user),
        mergeMap((user: User) => api.getCredentialsList(user.userId)),
      )
      .subscribe(
        (credentialsList: CredentialsList) => {
          // delete previous subscription to memory free
          initSubscription.unsubscribe();

          // build html
          buildHtmlProcess(credentialsList);

          // set tar bar switch process
          tabBarSwitch();

          // enable add security key button
          disableAddSecurityKeyButton(false);
        },
        (err: AjaxError) => manageApiError(err, initSubscription),
      );
  });
};

/**
 * Function to handle user credentials list html generation
 */
const generateCredentialsListHTML = (container: HTMLDivElement, credentials: Credential[]) => {
  import('./_template').then(({ template }) => container.innerHTML = template.generateCredentialsList(credentials));
};

/**
 * Function to build html and set events on the page
 *
 * @param {CredentialsList} credentialsList source for page content build
 */
const buildHtmlProcess = (credentialsList: CredentialsList): void => {
  // generate html for security keys list
  generateCredentialsListHTML(securityKeysList, credentialsList.securityKeys);
  // generate html for biometrics list
  generateCredentialsListHTML(biometricsList, credentialsList.biometrics);
  // enable add biometric button if allowed
  disableAddBiometricButton(!credentialsList.addBiometricsButtonIsEnabled);
  // set event listener on all credential edit button - use timeout to wait for html rendering
  setTimeout(() => editCredentialProcess(), 100);
};

/**
 * Function to manage API error
 *
 * @param {AjaxError} err instance of AjaxError
 * @param {Subscription} sub instance of Subscription
 * @param {boolean} enableButtons flag to know we have to enable edit buttons
 */
const manageApiError = (err: AjaxError, sub: Subscription, enableButtons?: { add?: boolean, edit?: boolean }) => {
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
    const errorMessage = [].concat(err.message).shift();

    // display message
    displayAuthenticatorListErrorMessage(errorMessage);

    // enable buttons with timeout to avoid flickering
    const hasEnableAddValue = !!enableButtons && typeof enableButtons.add !== 'undefined';
    const hasEnableEditValue = !!enableButtons && typeof enableButtons.edit !== 'undefined';

    if (!!hasEnableAddValue || !!hasEnableEditValue) {
      setTimeout(() => {
        if (!!hasEnableAddValue) {
          disableBothAddButtons(!enableButtons.add);
        }
        if (!!hasEnableEditValue) {
          disableAllCredentialsEditButtons(!enableButtons.edit);
        }
      }, 500);
    }
  }
};
