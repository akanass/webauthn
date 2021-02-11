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
 * Add event listener on window.load to put all process in place
 */
window.addEventListener('load', () => {
  // reset all error messages
  resetErrorMessage();

  // tar bar switch process
  tabBarSwitch();

  // edit authenticator process
  editAuthenticatorProcess();
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
  })
}

/**
 * Function to handle authenticator edition
 */
const editAuthenticatorProcess = () => {
  [].map.call(document.querySelectorAll('.edit-authenticator'), (button: HTMLButtonElement) => {
    button.addEventListener('click', () => {
      // reset error message
      resetErrorMessage();

      // get authenticator id
      const authenticatorId = button.dataset?.authenticatorid;

      console.log(authenticatorId);
    });
  });
}
