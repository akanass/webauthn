import { Credential } from './_credential';

export class CredentialsList {
  // private property to store all type of credentials
  private readonly credentials: Credential[];
  // private property to store the flag to know if user can add more biometric credential
  private readonly can_add_new_biometric: boolean;

  /**
   * Class constructor
   */
  constructor(credentialsList: CredentialsList) {
    // set default values
    this.credentials = [];
    this.can_add_new_biometric = true;
    this._securityKeys = [];
    this._biometrics = [];

    // update object with API data if provided
    if (typeof credentialsList !== 'undefined') {
      Object.assign(this, credentialsList);
    }

    // update list for given credentials
    this.credentials.forEach((credential: any) =>
      credential.metadata.authenticator_attachment === 'cross-platform'
        ? this.addSecurityKey(new Credential(credential))
        : this.addBiometrics(new Credential(credential)),
    );
  }

  // private property to store security keys credential array
  private _securityKeys: Credential[];

  /**
   * Returns all security keys
   */
  get securityKeys(): Credential[] {
    return this._securityKeys;
  }

  // private property to store biometrics credential array
  private _biometrics: Credential[];

  /**
   * Returns all biometrics
   */
  get biometrics(): Credential[] {
    return this._biometrics;
  }

  /**
   * Returns flag to know is add biometrics button is enabled
   */
  get addBiometricsButtonIsEnabled(): boolean {
    return this.can_add_new_biometric;
  }

  /**
   * Add new security key in array
   *
   * @param {Credential} credential to add in the security keys array
   */
  addSecurityKey = (credential: Credential): void => {
    this._securityKeys = this._securityKeys.concat(credential);
  };

  /**
   * Add new biometric in array
   *
   * @param {Credential} credential to add in the biometrics array
   */
  addBiometrics = (credential: Credential): void => {
    this._biometrics = this._biometrics.concat(credential);
  };
}
