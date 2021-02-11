import { Credential } from './_credential';

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
        <button class="mdc-button mdc-button--raised edit-authenticator" data-authenticatorid="{{credentialId}}">
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
        .replace('{{credentialName}}', credential.credentialName)
        .replace('{{lastAccessTime}}', credential.lastAccessTime)
        .replace('{{credentialId}}', credential.credentialId)
        .replace('{{imageType}}', credential.credentialMetadata.authenticator_attachment === 'cross-platform' ? 'key' : 'computer')
    ).join('');
  }
}

// create singleton instance
const template: Template = Template.instance();

// export it
export { template };
