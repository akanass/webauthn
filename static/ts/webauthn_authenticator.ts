/**
 * Get page's elements
 */

const errorAuthenticatorList: HTMLDivElement = document.querySelector('#error-authenticator-list');
const errorAuthenticatorListMessage: HTMLSpanElement = document.querySelector('#error-authenticator-list-message');
const errorAuthenticatorListWebAuthnMessage: HTMLSpanElement = document.querySelector('#error-webauthn-message');
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
});


/**
 * Function to reset error message block
 */
const resetErrorMessage = () => {
  // hide error messages
  errorAuthenticatorList.style.display = 'none';
  errorAuthenticatorListMessage.style.display = 'none';
  errorAuthenticatorListMessage.innerText = '';
  errorAuthenticatorListWebAuthnMessage.style.display = 'none';
};

/**
 * Function to display authenticator list error message
 */
const displayAuthenticatorListErrorMessage = (message: string) => {
  errorAuthenticatorList.style.display = 'flex';
  errorAuthenticatorListMessage.style.display = 'inline';
  errorAuthenticatorListMessage.innerText = message;
  errorAuthenticatorListWebAuthnMessage.style.display = 'none';
};

/**
 * Function to display WebAuthn error message
 */
const displayAuthenticatorListWebAuthnErrorMessage = () => {
  errorAuthenticatorList.style.display = 'flex';
  errorAuthenticatorListMessage.style.display = 'none';
  errorAuthenticatorListMessage.innerText = '';
  errorAuthenticatorListWebAuthnMessage.style.display = 'inline';
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
        securityKeys.classList.add('authenticator-list--active');
        biometrics.classList.remove('authenticator-list--active');
        break;
      case 1:
        securityKeys.classList.remove('authenticator-list--active');
        biometrics.classList.add('authenticator-list--active');
        break;
      default:
        securityKeys.classList.remove('authenticator-list--active');
        biometrics.classList.remove('authenticator-list--active');
        displayAuthenticatorListErrorMessage('Authenticators list can\'t be displayed');
    }
  })
}
