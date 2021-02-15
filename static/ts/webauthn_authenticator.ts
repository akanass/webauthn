import { User } from './_user';
import { Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Credential } from './_credential';
import { CredentialsList } from './_credentials_list';
import { AjaxError } from 'rxjs/ajax';
import { MDCDialog } from '@material/dialog';

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
const mainDiv: HTMLDivElement = document.querySelector('#main-content');

/**
 * Register dialog elements
 */
const webauthnDialogRegister: MDCDialog = new MDCDialog(document.querySelector('#webauthn-dialog-register'));
const registerSecurityKey: HTMLDivElement = document.querySelector('#register-security-key');
const registerProcessing: HTMLDivElement = document.querySelector('#register-processing');
const registerCancelButton: HTMLButtonElement = document.querySelector('#register-cancel-action');
const registerDoButton: HTMLButtonElement = document.querySelector('#register-do-action');
const errorRegisterCredential: HTMLDivElement = document.querySelector('#error-register-credential');
const buttonRegisterDoActionIcon: HTMLElement = document.querySelector('#register-do-action-icon');
const buttonRegisterDoActionLabel: HTMLLabelElement = document.querySelector('#register-do-action-label');
const registerSuccess: HTMLDivElement = document.querySelector('#register-success');
const errorRegisterCredentialEdit: HTMLDivElement = document.querySelector('#error-register-credential-edit');
const errorRegisterCredentialEditMessage: HTMLSpanElement = document.querySelector('#error-register-credential-edit-message');
const registerEditCredentialNameInput: HTMLInputElement = document.querySelector('#register-edit-credential-name');
const registerEditCredentialOriginalNameInput: HTMLInputElement = document.querySelector('#register-edit-credential-original-name');
const registerEditCredentialIdInput: HTMLInputElement = document.querySelector('#register-edit-credential-id');
const registerEditCredentialTextField: HTMLLabelElement = document.querySelector('#register-edit-credential-text-field');
const registerEditCredentialNameLabel: HTMLSpanElement = document.querySelector('#register-edit-credential-name-label');

/**
 * Edit dialog elements
 */
const webauthnDialogEdit: MDCDialog = new MDCDialog(document.querySelector('#webauthn-dialog-edit'));
const editSecurityKeyTitle: HTMLDivElement = document.querySelector('#edit-security-key-title');
const editBiometricTitle: HTMLDivElement = document.querySelector('#edit-biometric-title');
const editCredentialNameInput: HTMLInputElement = document.querySelector('#edit-credential-name');
const editCredentialOriginalNameInput: HTMLInputElement = document.querySelector('#edit-credential-original-name');
const editCredentialIdInput: HTMLInputElement = document.querySelector('#edit-credential-id');
const editCredentialCreatedAt: HTMLSpanElement = document.querySelector('#edit-credential-created-at');
const editCredentialRemoveButton: HTMLButtonElement = document.querySelector('#edit-remove-action');
const editCredentialDoneButton: HTMLButtonElement = document.querySelector('#edit-done-action');
const errorEditCredential: HTMLDivElement = document.querySelector('#error-edit-credential');
const errorEditCredentialMessage: HTMLSpanElement = document.querySelector('#error-edit-credential-message');
const editCredentialTextField: HTMLLabelElement = document.querySelector('#edit-credential-text-field');
const editCredentialNameLabel: HTMLSpanElement = document.querySelector('#edit-credential-name-label');

/**
 * Variables to store subscription
 */
let initSubscription: Subscription;
let editSubscription: Subscription;
let registerSubscription: Subscription;

/**
 * Variable to store current logged in user
 */
let currentUser: User;

/**
 * Variable to store add biometrics button status
 */
let addBiometricIsEnabled = true;

/**
 * Variable to store credential type to register
 */
let credentialTypeToBeRegistered: 'cross-platform' | 'platform';

/**
 * Variable to store register do action button state
 */
let registerDoActionState: 'security-key' | 'processing' | 'retry' | 'success';

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

  // hide edit dialog error message
  resetEditErrorMessage();

  // hide register dialog error message
  resetRegisterErrorMessage();
  resetRegisterEditErrorMessage();
};

/**
 * Function to reset edit dialog error message block
 */
const resetEditErrorMessage = () => {
  errorEditCredential.style.display = 'none';
  errorEditCredentialMessage.innerText = '';
};

/**
 * Function to reset register dialog error message block
 */
const resetRegisterErrorMessage = () => {
  errorRegisterCredential.style.display = 'none';
};

/**
 * Function to display register dialog error message block
 */
const displayRegisterErrorMessage = () => {
  errorRegisterCredential.style.display = 'flex';
};

/**
 * Function to reset register edition dialog error message block
 */
const resetRegisterEditErrorMessage = () => {
  errorRegisterCredentialEdit.style.display = 'none';
  errorRegisterCredentialEditMessage.innerText = '';
};

/**
 * Function to display register edition dialog error message
 */
const displayRegisterEditErrorMessage = (message: string) => {
  errorRegisterCredentialEdit.style.display = 'flex';
  errorRegisterCredentialEditMessage.innerText = message;
};

/**
 * Function to display security keys elements in register dialog
 */
const displayRegisterSecurityKeyElements = () => {
  // display right elements
  registerSecurityKey.style.display = 'block';
  displayButtonRegisterDoActionElements('security-key');
};

/**
 * Function to display processing elements in register dialog
 */
const displayRegisterProcessingElements = (hideSecurityKey: boolean) => {
  // hide security key elements
  if (!!hideSecurityKey) registerSecurityKey.style.display = 'none';
  // display right elements
  registerProcessing.style.display = 'block';
  displayButtonRegisterDoActionElements('processing');
};

/**
 * Function to display retry elements in register dialog
 */
const displayRegisterRetryElements = () => {
  // display right elements
  displayRegisterErrorMessage();
  displayButtonRegisterDoActionElements('retry');
};

/**
 * Function to display register edition elements in register dialog
 */
const displayRegisterEditElements = () => {
  // hide processing elements
  registerProcessing.style.display = 'none';
  // display right elements
  registerSuccess.style.display = 'block';
  displayButtonRegisterDoActionElements('success');
};

/**
 * Function to display good element on register button action
 */
const displayButtonRegisterDoActionElements = (state?: 'security-key' | 'processing' | 'retry' | 'success') => {
  // set global state
  if (!!state) {
    registerDoActionState = state;
  } else {
    registerDoActionState = undefined;
  }

  // display good element on button
  switch (registerDoActionState) {
    case 'security-key':
      buttonRegisterDoActionIcon.innerText = 'vpn_key';
      buttonRegisterDoActionLabel.innerText = 'Next';
      registerCancelButton.style.visibility = 'visible';
      registerDoButton.style.visibility = 'visible';
      break;
    case 'processing':
    case 'retry':
      buttonRegisterDoActionIcon.innerText = 'restart_alt';
      buttonRegisterDoActionLabel.innerText = 'Retry';
      registerCancelButton.style.visibility = 'visible';
      registerDoButton.style.visibility = 'visible';
      break;
    case 'success':
      buttonRegisterDoActionIcon.innerText = 'done_outline';
      buttonRegisterDoActionLabel.innerText = 'Done';
      registerCancelButton.style.display = 'none';
      registerDoButton.style.visibility = 'visible';
      break;
    default:
      // hide all buttons
      hideRegisterDialogButtons();
      registerCancelButton.style.display = 'inline-flex';
      registerDoButton.style.display = 'inline-flex';
      buttonRegisterDoActionIcon.innerText = '';
      buttonRegisterDoActionLabel.innerText = '';
  }
};

/**
 * Function to display edit dialog error message
 */
const displayEditErrorMessage = (message: string) => {
  errorEditCredential.style.display = 'flex';
  errorEditCredentialMessage.innerText = message;
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

const disableEditDialogButtons = (disabled: boolean) => {
  editCredentialRemoveButton.disabled = disabled;
  editCredentialDoneButton.disabled = disabled;
};

const disableRegisterDialogButtons = (disabled: boolean) => {
  registerCancelButton.disabled = disabled;
  registerDoButton.disabled = disabled;
};

const hideRegisterDialogButtons = () => {
  registerCancelButton.style.visibility = 'hidden';
  registerDoButton.style.visibility = 'hidden';
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
  });
};

/**
 * Function to display edit security key title
 */
const displayEditSecurityKeyTitle = () => {
  editSecurityKeyTitle.style.display = 'block';
  editBiometricTitle.style.display = 'none';
};

/**
 * Function to display edit biometric title
 */
const displayEditBiometricTitle = () => {
  editSecurityKeyTitle.style.display = 'none';
  editBiometricTitle.style.display = 'block';
};

/**
 * Function to reset edit dialog elements
 */
const resetEditDialogElements = () => {
  editSecurityKeyTitle.style.display = 'none';
  editBiometricTitle.style.display = 'none';
  editCredentialNameInput.value = '';
  editCredentialOriginalNameInput.value = '';
  editCredentialIdInput.value = '';
  editCredentialCreatedAt.innerText = '';
  editCredentialTextField.classList.remove('mdc-text-field--invalid');
  editCredentialNameLabel.classList.add('mdc-floating-label--float-above');
  disableEditDialogButtons(false);
};

/**
 * Function to reset register dialog elements
 */
const resetRegisterDialogElements = () => {
  registerSecurityKey.style.display = 'none';
  registerProcessing.style.display = 'none';
  registerSuccess.style.display = 'none';
  registerEditCredentialNameInput.value = '';
  registerEditCredentialOriginalNameInput.value = '';
  registerEditCredentialIdInput.value = '';
  registerEditCredentialTextField.classList.remove('mdc-text-field--invalid');
  registerEditCredentialNameLabel.classList.add('mdc-floating-label--float-above');
  disableRegisterDialogButtons(false);
  displayButtonRegisterDoActionElements();
};

/**
 * Set default credential values in the edit form
 *
 * @param {Credential} credential instance of Credential to be edited
 */
const setCredentialValuesInEditForm = (credential: Credential) => {
  editCredentialNameInput.value = editCredentialOriginalNameInput.value = credential.credentialName;
  editCredentialIdInput.value = credential.credentialId;
  editCredentialCreatedAt.innerText = credential.createdAt;
};

const setCredentialValuesInRegisterEditForm = (credential: Credential) => {
  registerEditCredentialNameInput.value = registerEditCredentialOriginalNameInput.value = credential.credentialName;
  registerEditCredentialIdInput.value = credential.credentialId;
};

/**
 * Function to handle credential edition button click
 */
const editCredentialButtonProcess = () => {
  [].map.call(document.querySelectorAll('.edit-authenticator'), (button: HTMLButtonElement) => {
    button.addEventListener('click', () => {
      // reset error message
      resetErrorMessage();

      // reset edit dialog
      resetEditDialogElements();

      // disable all buttons
      disableAllCredentialsEditButtons(true);
      disableBothAddButtons(true);

      // get credential object
      let credential: Credential;
      try {
        credential = new Credential(JSON.parse(button.dataset.credential));
      } catch (e) {
        displayAuthenticatorListErrorMessage(e.message);
        // enable only add buttons
        disableAddSecurityKeyButton(false);
        disableAddBiometricButton(!addBiometricIsEnabled);
        return;
      }

      // open the dialog
      import('./_template').then(({ template }) => {
        template.openDialog(
          webauthnDialogEdit,
          () => {
            // display good element in the dialog
            if (credential.credentialMetadata.authenticator_attachment === 'cross-platform') {
              displayEditSecurityKeyTitle();
            } else {
              displayEditBiometricTitle();
            }

            // set credential values
            setCredentialValuesInEditForm(credential);
          },
          () => {
            // set attribute on main content
            mainDiv.setAttribute('aria-hidden', 'true');
          },
          () => {
            // remove attribute on main content
            mainDiv.removeAttribute('aria-hidden');

            // reset all elements to good state
            resetEditDialogElements();
          },
          () => {
            // reset all elements to good state
            setTimeout(() => {
              disableAllCredentialsEditButtons(false);
              disableAddBiometricButton(!addBiometricIsEnabled);
              disableAddSecurityKeyButton(false);
            }, 100);
          },
        );
      });
    });
  });
};

/**
 * Function to edit credential name or delete credential in database
 */
const editCredentialProcess = (action: 'done' | 'remove') => {
  // reset error messages
  resetEditErrorMessage();

  // disable buttons
  disableEditDialogButtons(true);

  // delete previous subscription to memory free
  if (!!editSubscription) {
    editSubscription.unsubscribe();
  }

  // get credential id
  const credentialId = editCredentialIdInput.value;

  // do right action
  switch (action) {
    case 'done':
      // get form values
      const credentialName = editCredentialNameInput.value;
      const credentialOriginalName = editCredentialOriginalNameInput.value;

      // check if new name is different than original one
      if (credentialName !== credentialOriginalName) {
        // we update name in database
        editCredentialName(credentialId, credentialName, webauthnDialogEdit, disableEditDialogButtons);
      } else {
        // nothing to do so we close the dialog
        webauthnDialogEdit.close();
      }
      break;
    case 'remove':
      removeCredential(credentialId, webauthnDialogEdit, disableEditDialogButtons)
      break;
  }
};

/**
 * Function to set edit dialog buttons process
 */
const editCredentialButtonsProcess = () => {
  editCredentialDoneButton.addEventListener('click', () => {
    if (!!editCredentialNameInput.validity.valid) {
      editCredentialProcess('done');
    } else {
      displayEditErrorMessage('Authenticator name is mandatory and must have at least 2 characters');
    }
  });

  editCredentialRemoveButton.addEventListener('click', () => editCredentialProcess('remove'));
};

/**
 * Function to register credential in browser and database
 */
const registerCredentialProcess = (waitToDisableButtons = true) => {
  // reset error messages
  resetRegisterErrorMessage();

  // disable buttons with timeout to avoid flickering in dialog open state
  if (!!waitToDisableButtons) {
    setTimeout(() => disableRegisterDialogButtons(true), 200);
  } else {
    disableRegisterDialogButtons(true)
  }

  console.log('REGISTER CREDENTIAL TYPE =>', credentialTypeToBeRegistered);
  setTimeout(() => {
    displayRegisterEditElements();
    disableRegisterDialogButtons(false);
    setCredentialValuesInRegisterEditForm(new Credential({ id: '1234567890', name: 'My Super Authenticator' } as any));
  }, 3000); // TODO REGISTER PROCESS
};

/**
 * Function to edit credential name database after registration succeed
 */
const registerCredentialEditProcess = () => {
  // reset error message
  resetRegisterEditErrorMessage();

  // disable buttons
  disableRegisterDialogButtons(true);

  // delete previous subscription to memory free
  if (!!editSubscription) {
    editSubscription.unsubscribe();
  }

  // get form values
  const credentialId = registerEditCredentialIdInput.value;
  const credentialName = registerEditCredentialNameInput.value;
  const credentialOriginalName = registerEditCredentialOriginalNameInput.value;

  // check if new name is different than original one
  if (credentialName !== credentialOriginalName) {
    // we update name in database
    editCredentialName(credentialId, credentialName, webauthnDialogRegister, disableRegisterDialogButtons);
  } else {
    // nothing to do so we close the dialog
    webauthnDialogRegister.close();
  }
};

/**
 * Function to edit credential name in database through the API
 *
 * @param {string} credentialId unique identifier of the credential
 * @param {string} credentialName new name of the credential
 * @param {MDCDialog} dialogToCLose dialog to close at the end of the edition
 * @param {Function} funcToDisableButtons function to disable buttons
 */
const editCredentialName = (credentialId: string, credentialName: string, dialogToCLose: MDCDialog, funcToDisableButtons: (display: boolean) => void) => {
  console.log('EDIT CREDENTIAL WITH ID =>', credentialId, ' | NAME =>', credentialName);
  setTimeout(() => dialogToCLose.close(), 2000); // TODO EDIT PROCESS
};

/**
 * Function to remove credential in database through the API
 *
 * @param {string} credentialId unique identifier of the credential
 * @param {MDCDialog} dialogToCLose dialog to close at the end of the edition
 * @param {Function} funcToDisableButtons function to disable buttons
 */
const removeCredential = (credentialId: string, dialogToCLose: MDCDialog, funcToDisableButtons: (display: boolean) => void) => {
  console.log('REMOVE CREDENTIAL WITH ID =>', credentialId);
  setTimeout(() => dialogToCLose.close(), 2000); // TODO REMOVE PROCESS
};

/**
 * Function to handle click on add buttons
 */
const addCredentialButtonsProcess = () => {
  addSecurityKeyButton.addEventListener('click', () => addCredentialProcess('cross-platform'));
  addBiometricButton.addEventListener('click', () => addCredentialProcess('platform'));
};

/**
 * Function to set register dialog buttons process
 */
const registerCredentialButtonsProcess = () => {
  registerDoButton.addEventListener('click', () => {
    switch (registerDoActionState) {
      case 'security-key':
        // display good elements
        displayRegisterProcessingElements(true);
        // launch process
        registerCredentialProcess(false);
        break;
      case 'processing':
        break;
      case 'retry':
        // display good elements
        displayRegisterProcessingElements(false);
        // launch process
        registerCredentialProcess(false);
        break;
      case 'success':
        // launch process
        if (!!registerEditCredentialNameInput.validity.valid) {
          registerCredentialEditProcess();
        } else {
          displayRegisterEditErrorMessage('Authenticator name is mandatory and must have at least 2 characters');
        }
        break;
    }
  });
};

/**
 * Function to handle credential registration button click
 */
const addCredentialProcess = (type: 'cross-platform' | 'platform') => {
  // set credential type to global
  credentialTypeToBeRegistered = type;

  // reset error messages
  resetErrorMessage();

  // reset register dialog
  resetRegisterDialogElements();

  // disable all buttons
  disableBothAddButtons(true);
  disableAllCredentialsEditButtons(true);

  // import webauthn script
  import('./_webauthn').then(({ webAuthn }) => {
    // check if webauthn is supported in this browser
    if (!webAuthn.supported) {
      // display error message
      displayAuthenticatorListWebAuthnErrorMessage();
      // enable only edit buttons
      setTimeout(() => disableAllCredentialsEditButtons(false), 500);
    } else {
      // open the dialog
      import('./_template').then(({ template }) => {
        template.openDialog(
          webauthnDialogRegister,
          () => {
            switch (credentialTypeToBeRegistered) {
              case 'cross-platform':
                displayRegisterSecurityKeyElements();
                break;
              case 'platform':
                displayRegisterProcessingElements(false);
                break;
            }
          },
          () => {
            // set attribute on main content
            mainDiv.setAttribute('aria-hidden', 'true');

            // launch registration if platform
            if (credentialTypeToBeRegistered === 'platform') {
              registerCredentialProcess();
            }
          },
          () => {
            // remove attribute on main content
            mainDiv.removeAttribute('aria-hidden');

            // reset all elements to good state
            resetRegisterDialogElements();
          },
          () => {
            // reset all elements to good state
            setTimeout(() => {
              disableAllCredentialsEditButtons(false);
              disableAddBiometricButton(!addBiometricIsEnabled);
              disableAddSecurityKeyButton(false);
            }, 100);
          },
        );
      });
    }
  });
};

/**
 * We get current user and generate credentials HTML when page is loaded then initialize all processes
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

          // set add credential buttons process
          addCredentialButtonsProcess();

          // delete esc handler
          initDialogCancelAction();

          // reset edit dialog elements
          resetEditDialogElements();

          // set edit credential buttons dialog process
          editCredentialButtonsProcess();

          // reset register dialog elements
          resetRegisterDialogElements();

          // set register credential buttons dialog process
          registerCredentialButtonsProcess();
        },
        (err: AjaxError) => manageApiError(err, displayAuthenticatorListErrorMessage, initSubscription),
      );
  });
};

/**
 * Function to suppress cancel action outside cancel button
 */
const initDialogCancelAction = () => {
  webauthnDialogRegister.scrimClickAction = '';
  webauthnDialogRegister.escapeKeyAction = '';
  webauthnDialogEdit.scrimClickAction = '';
  webauthnDialogEdit.escapeKeyAction = '';
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
  addBiometricIsEnabled = credentialsList.addBiometricsButtonIsEnabled;
  disableAddBiometricButton(!addBiometricIsEnabled);
  // set event listener on all credential edit button - use timeout to wait for html rendering
  setTimeout(() => editCredentialButtonProcess(), 100);
};

/**
 * Function to manage API error
 *
 * @param {AjaxError} err instance of AjaxError
 * @param {Function} errorMessageFunc display right error message
 * @param {Subscription} sub instance of Subscription
 * @param {boolean} enableButtons flag to know we have to enable edit buttons
 */
const manageApiError = (err: AjaxError, errorMessageFunc: (message: string) => void, sub: Subscription, enableButtons?: { add?: boolean, edit?: boolean, registerDialog?: boolean, editDialog?: boolean }) => {
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
    errorMessageFunc(errorMessage);

    // enable buttons with timeout to avoid flickering
    const hasEnableAddValue = !!enableButtons && typeof enableButtons.add !== 'undefined';
    const hasEnableEditValue = !!enableButtons && typeof enableButtons.edit !== 'undefined';
    const hasEnableRegisterDialogValue = !!enableButtons && typeof enableButtons.registerDialog !== 'undefined';
    const hasEnableEditDialogValue = !!enableButtons && typeof enableButtons.editDialog !== 'undefined';

    if (!!hasEnableAddValue || !!hasEnableEditValue || !!hasEnableRegisterDialogValue || !!hasEnableEditDialogValue) {
      setTimeout(() => {
        if (!!hasEnableAddValue) {
          disableAddSecurityKeyButton(!enableButtons.add);
          disableAddBiometricButton(!addBiometricIsEnabled);
        }
        if (!!hasEnableEditValue) {
          disableAllCredentialsEditButtons(!enableButtons.edit);
        }
        if (!!hasEnableRegisterDialogValue) {
          disableRegisterDialogButtons(!enableButtons.registerDialog);
        }
        if (!!hasEnableEditDialogValue) {
          disableEditDialogButtons(!enableButtons.editDialog);
        }
      }, 500);
    }
  }
};
