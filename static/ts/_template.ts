import { Credential } from './_credential';
import { MDCDialog } from '@material/dialog';

export class Template {
  // private static property to store singleton instance
  private static _instance: Template;
  // private property to store credential template
  private _credentialTpl = `
    <div class="authenticator-detail">
      <div class="content-center authenticator-icon-container">
        <img class="authenticator-icon" src="/public/img/authenticator-{{imageType}}.svg" alt="authenticator" />
      </div>
      <div class="authenticator-description-container">
        <div>
          <div class="mdc-typography--body2">{{credentialName}}</div>
          <div class="mdc-typography--caption">Last Used: {{lastAccessTime}}</div>
        </div>
      </div>
      <div class="authenticator-action-container">
        <button class="mdc-button mdc-button--raised edit-authenticator" data-credential='{{credential}}'>
          <div class="mdc-button__ripple"></div>
          <i class="material-icons mdc-button__icon" aria-hidden="true">mode_edit</i>
          <span class="mdc-button__label"></span>
        </button>
      </div>
    </div>
  `;
  // private property to store credentials empty list template
  private _credentialsListEmptyTpl = `
    <p>No authenticator added.</p>
  `;

  // private property to store loading template
  private _loadingCredentialListTpl = `
    <p>Loading...</p>
  `;

  /**
   * Function to returns loading template
   */
  get loadingCredentialListTpl(): string {
    return this._loadingCredentialListTpl;
  }

  /**
   * Method returns new singleton instance
   */
  static instance(): Template {
    if (!(Template._instance instanceof Template)) {
      Template._instance = new Template();
    }

    return Template._instance;
  }

  /**
   * Returns HTML of the credentials list
   *
   * @param {Credential[]} credentials to be displayed in the page
   */
  generateCredentialsList(credentials: Credential[]): string {
    if (!credentials || credentials.length === 0) {
      return this._credentialsListEmptyTpl;
    }

    return credentials.map((credential: Credential) =>
      this._credentialTpl
        .replace('{{credential}}', JSON.stringify(credential))
        .replace('{{credentialName}}', credential.credentialName)
        .replace('{{lastAccessTime}}', credential.lastAccessTime)
        .replace('{{imageType}}', credential.credentialMetadata.authenticator_attachment === 'cross-platform' ? 'key' : 'computer'),
    ).join('');
  }

  /**
   * Function to handle webauthn dialog process
   *
   * @param {MDCDialog} dialog instance to display and execute callbacks
   * @param {function} onOpening callback to execute on 'MDCDialog:opening' event
   * @param {function} onOpened callback to execute on 'MDCDialog:opened' event
   * @param {function} onClosing callback to execute on 'MDCDialog:closing' event
   * @param {function} onClosed callback to execute on 'MDCDialog:closed' event
   */
  openDialog(dialog: MDCDialog, onOpening?: () => void, onOpened?: () => void, onClosing?: (e: CustomEvent) => void, onClosed?: (e: CustomEvent) => void): void {
    // set listener on MDCDialog:opening
    if (!!onOpening) {
      dialog.listen('MDCDialog:opening', onOpening, { once: true });
    }

    // set listener on MDCDialog:opened
    if (!!onOpened) {
      dialog.listen('MDCDialog:opened', onOpened, { once: true });
    }

    // set listener on MDCDialog:closing
    if (!!onClosing) {
      dialog.listen('MDCDialog:closing', onClosing, { once: true });
    }

    // set listener on MDCDialog:closed
    if (!!onClosed) {
      dialog.listen('MDCDialog:closed', onClosed, { once: true });
    }

    // open the dialog
    dialog.open();
  }
}

// create singleton instance
const template: Template = Template.instance();

// export it
export { template };
