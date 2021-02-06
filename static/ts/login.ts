/**
 * Get page's elements
 */
const form: HTMLFormElement = document.querySelector('#login');
const errorLogin: HTMLDivElement = document.querySelector('#error-login');
const errorLoginMessage: HTMLSpanElement = document.querySelector('#error-login-message');
const errorWebAuthnMessage: HTMLSpanElement = document.querySelector('#error-webauthn-message');
const webauthnRedirectLink: HTMLLinkElement = document.querySelector('#webauthn-redirect');

/**
 * Add event listener on window.load to put all process in place
 */
window.addEventListener("load", () => {
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
}

/**
 * Function to display login error message
 */
const displayLoginErrorMessage = () => {
  errorLogin.style.display = 'flex';
  errorLoginMessage.style.display = 'inline';
  errorWebAuthnMessage.style.display = 'none';
}

/**
 * Function to display WebAuthn error message
 */
const displayWebAuthnErrorMessage = () => {
  errorLogin.style.display = 'flex';
  errorLoginMessage.style.display = 'none';
  errorLoginMessage.innerText = '';
  errorWebAuthnMessage.style.display = 'inline';
}

/**
 * Function to authenticate user by username/password
 */
const authenticationProcess = () => {
  // add event listener on submit process
  form.addEventListener('submit', e => {
    // stop normal process
    e.preventDefault();

    // reset error messages
    resetErrorMessage();

    // get form values
    const username = form.elements['username'].value.toLowerCase();
    const password = form.elements['password'].value;

    // import auth script
    import('./_auth').then(({auth}) => {
      // login user
      auth.login(username, password)
        .subscribe(
          user => {
            console.log(user.userName);// TODO redirect to good page
          },
          error => {
            // error message is an array so we take only the first one
            // and we set the message in the page
            errorLoginMessage.innerText = [].concat(error.message).shift();

            // display message
            displayLoginErrorMessage();
          }
        );
    });
  });
}

/**
 * Function to check if WebAuthn is supported then display error message or redirect user
 */
const webauthnRedirection = () => {
  webauthnRedirectLink.addEventListener('click', e => {
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
    })
  });
}
