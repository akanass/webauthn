/**
 * Get page's elements
 */
const errorLoginAuthenticator: HTMLDivElement = document.querySelector('#error-login-authenticator');
const errorLoginAuthenticatorMessage: HTMLSpanElement = document.querySelector('#error-login-authenticator-message');
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

  // set start enrollment process
  startEnrollmentProcess();
});

/**
 * Function to reset error message block
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const resetErrorMessage = () => {
  // hide error messages
  errorLoginAuthenticator.style.display = 'none';
  errorLoginAuthenticatorMessage.innerText = '';
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
    if (!!checkboxStopEnrollment.checked) {
      resetButtonToStopEnrollment();
    } else {
      resetButtonToStartEnrollment();
    }
  });
};

const startEnrollmentProcess = () => {
  buttonEnrollment.addEventListener('click', () => {
    console.log(checkboxStopEnrollment.checked);
  });
};
