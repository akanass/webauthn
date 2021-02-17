import { Observable } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { User } from './_user';
import { map } from 'rxjs/operators';
import { CredentialsList } from './_credentials_list';
import { Credential } from './_credential';
import {
  AttestationCredentialJSON,
  AuthenticatorAttachment,
  PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/typescript-types';

export class Api {
  // private static property to store singleton instance
  private static _instance: Api;

  /**
   * Create new instance
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
  }

  /**
   * Method returns new singleton instance
   */
  static instance(): Api {
    if (!(Api._instance instanceof Api)) {
      Api._instance = new Api();
    }

    return Api._instance;
  }

  /**
   * Function to log in an user by username/password
   *
   * @param {string} username of the user who wants to log in
   * @param {string} password of the user who wants to log in
   */
  login(username: string, password: string): Observable<User> {
    return ajax({
      url: '/api/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        username,
        password,
      },
    }).pipe(
      map((resp: AjaxResponse) => new User(resp.response)),
    );
  }

  /**
   * Function to return logged-in user
   */
  loggedIn(): Observable<User> {
    return ajax({
      url: '/api/logged-in',
      method: 'GET',
    }).pipe(
      map((resp: AjaxResponse) => new User(resp.response)),
    );
  }

  /**
   * Function to delete the session
   */
  logout(): Observable<void> {
    return ajax({
      url: `/api/delete-session`,
      method: 'DELETE',
    }).pipe(
      map((resp: AjaxResponse) => resp.response),
    );
  }

  /**
   * Function to patch user value
   *
   * @param {string} userId unique identifier of the user
   * @param {any} partial user object to patch it
   *
   * @return {Observable<User>} the new instance of the user with the patched value
   */
  patchUser(userId: string, partial: any): Observable<User> {
    return ajax({
      url: `/api/users/${userId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: partial,
    }).pipe(
      map((resp: AjaxResponse) => new User(resp.response)),
    );
  }

  /**
   * Function to patch session value
   *
   * @param {any} partial session object to patch it
   */
  patchSession(partial: { key: string, value: any }): Observable<void> {
    return ajax({
      url: `/api/set-session-data`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: partial,
    }).pipe(
      map((resp: AjaxResponse) => resp.response),
    );
  }

  /**
   * Function to clean session value
   *
   * @param {any} partial session key to clear it
   */
  cleanSession(partial: { key: string }): Observable<void> {
    return ajax({
      url: `/api/clean-session-data`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: partial,
    }).pipe(
      map((resp: AjaxResponse) => resp.response),
    );
  }

  /**
   * Function to get all credentials for current user
   *
   * @param {string} userId unique identifier of the user
   *
   * @return {Observable<CredentialsList>} list of all credentials
   */
  getCredentialsList(userId: string): Observable<CredentialsList> {
    return ajax({
      url: `/api/users/${userId}/credentials`,
      method: 'GET',
    })
      .pipe(
        map((resp: AjaxResponse) => new CredentialsList(resp.response)),
      );
  }

  /**
   * Function to patch user value
   *
   * @param {string} userId unique identifier of the user
   * @param {string} credentialId unique identifier of the credential
   * @param {{ name: string }} partial credential object to patch it
   *
   * @return {Observable<Credential>} the new instance of the credential with the patched value
   */
  patchCredential(userId: string, credentialId: string, partial: { name: string }): Observable<Credential> {
    return ajax({
      url: `/api/users/${userId}/credentials/${credentialId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: partial,
    }).pipe(
      map((resp: AjaxResponse) => new Credential(resp.response)),
    );
  }

  /**
   * Function to delete the credential
   *
   * @param {string} userId unique identifier of the user
   * @param {string} credentialId unique identifier of the credential
   *
   * return {Observable<void>}
   */
  deleteCredential(userId: string, credentialId: string): Observable<void> {
    return ajax({
      url: `/api/users/${userId}/credentials/${credentialId}`,
      method: 'DELETE',
    }).pipe(
      map((resp: AjaxResponse) => resp.response),
    );
  }

  /**
   * Function to start webauthn attestation
   *
   * @param {{ authenticator_attachment: AuthenticatorAttachment }} authenticatorAttachment type of authenticator attachment
   *
   * @return {Observable<PublicKeyCredentialCreationOptionsJSON>} attestation options object
   */
  startAttestation(authenticatorAttachment: { authenticator_attachment: AuthenticatorAttachment }): Observable<PublicKeyCredentialCreationOptionsJSON> {
    return ajax({
      url: `/api/webauthn/register/start`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: authenticatorAttachment,
    }).pipe(
      map((resp: AjaxResponse) => resp.response),
    );
  }

  verifyAttestation(attestation: AttestationCredentialJSON): Observable<Credential> {
    return ajax({
      url: `/api/webauthn/register/finish`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: attestation,
    }).pipe(
      map((resp: AjaxResponse) => new Credential(resp.response)),
    );
  }
}

// create singleton instance
const api: Api = Api.instance();

// export it
export { api };
