import {
  startAssertion,
  startAttestation,
  supportsWebauthn,
} from '@simplewebauthn/browser';
import {
  AssertionCredentialJSON,
  AttestationCredentialJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/typescript-types';
import { from, Observable } from 'rxjs';

export class WebAuthn {
  // private static property to store singleton instance
  private static _instance: WebAuthn;
  // private property flag to know if the browser supports WebAuthn protocol
  private readonly _supported: boolean;

  /**
   * Create new instance and set flag to know if the browser supports WebAuthn protocol
   * @private
   */
  private constructor() {
    this._supported = supportsWebauthn();
  }

  /**
   * Returns flag to know if the browser supports WebAuthn protocol
   */
  get supported(): boolean {
    return this._supported;
  }

  /**
   * Method returns new singleton instance
   */
  static instance = (): WebAuthn => {
    if (!(WebAuthn._instance instanceof WebAuthn)) {
      WebAuthn._instance = new WebAuthn();
    }

    return WebAuthn._instance;
  };

  /**
   * Function to pass options to the authenticator through webauthn protocol to register it
   *
   * @param {PublicKeyCredentialCreationOptionsJSON} creationOptionsJSON attestation options object
   *
   * @return {Observable<AttestationCredentialJSON>} attestation response object to be verified by the server
   */
  startAttestation = (
    creationOptionsJSON: PublicKeyCredentialCreationOptionsJSON,
  ): Observable<AttestationCredentialJSON> =>
    from(startAttestation(creationOptionsJSON));

  /**
   * Function to pass options to the authenticator through webauthn protocol to verify it
   *
   * @param {PublicKeyCredentialRequestOptionsJSON} requestOptionsJSON assertion options object
   *
   * @return {Observable<AssertionCredentialJSON>} assertion response object to be verified by the server
   */
  startAssertion = (
    requestOptionsJSON: PublicKeyCredentialRequestOptionsJSON,
  ): Observable<AssertionCredentialJSON> =>
    from(startAssertion(requestOptionsJSON));
}

// export singleton instance
export const webAuthn: WebAuthn = WebAuthn.instance();
