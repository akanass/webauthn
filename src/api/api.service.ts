import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Observable } from 'rxjs';
import { UserEntity } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PatchUserDto } from '../user/dto/patch-user.dto';
import { CredentialService } from '../credential/credential.service';
import { CredentialEntity } from '../credential/entities/credential.entity';
import { defaultIfEmpty, filter, map } from 'rxjs/operators';
import { CredentialsListEntity } from '../credential/entities/credentials-list.entity';
import * as useragent from 'useragent';
import { UserAgentData } from './interfaces/useragent-data.interface';
import { PatchCredentialDto } from '../credential/dto/patch-credential.dto';
import { StartAttestationDto } from '../webauthn/dto/start-attestation.dto';
import { WebAuthnService } from '../webauthn/webauthn.service';
import * as secureSession from 'fastify-secure-session';
import { AuthenticatorAttachment } from '@simplewebauthn/typescript-types';
import { PublicKeyCredentialCreationOptionsEntity } from '../webauthn/entities/public-key-credential-creation-options.entity';
import { VerifyAttestationDto } from '../webauthn/dto/verify-attestation.dto';
import { PublicKeyCredentialRequestOptionsEntity } from '../webauthn/entities/public-key-credential-request-options.entity';
import { VerifyAssertionDto } from '../webauthn/dto/verify-assertion.dto';

@Injectable()
export class ApiService {
  /**
   * Class constructor
   *
   * @param {UserService} _userService dependency injection of UserService instance
   * @param {CredentialService} _credentialService dependency injection of CredentialService instance
   * @param {WebAuthnService} _webauthnService dependency injection of WebAuthnService instance
   */
  constructor(private readonly _userService: UserService, private readonly _credentialService: CredentialService, private readonly _webauthnService: WebAuthnService) {
  }

  /**
   * Function to log in the user
   *
   * @param {LoginUserDto} loginUser payload to log in the user
   *
   * @return {Observable<UserEntity>} the entity representing the logged in user
   */
  login(loginUser: LoginUserDto): Observable<UserEntity> {
    return this._userService.login(loginUser);
  }

  /**
   * Function to create a new user in the database
   *
   * @param {CreateUserDto} user payload to create the new user
   *
   * @return {Observable<UserEntity>} the entity representing the new user
   */
  createUser(user: CreateUserDto): Observable<UserEntity> {
    return this._userService.create(user);
  }

  /**
   * Function to patch an user in the database
   *
   * @param {string} id user unique identifier
   * @param {PatchUserDto} user payload to patch the user
   *
   * @return {Observable<UserEntity>} the entity representing the patched user
   */
  patchUser(id: string, user: PatchUserDto): Observable<UserEntity> {
    return this._userService.patch(id, user);
  }

  /**
   * Function to patch a credential in the database
   *
   * @param {string} id credential unique identifier
   * @param {string} userId user unique identifier
   * @param {PatchCredentialDto} credential payload to patch the user
   *
   * @return {Observable<CredentialEntity>} the entity representing the patched credential
   */
  patchCredential(id: string, userId: string, credential: PatchCredentialDto): Observable<CredentialEntity> {
    return this._credentialService.patch(id, userId, credential);
  }

  /**
   * Function to remove a credential in the database
   *
   * @param {string} id credential unique identifier
   * @param {string} userId user unique identifier
   *
   * @return {Observable<void>}
   */
  removeCredential(id: string, userId: string): Observable<void> {
    return this._credentialService.remove(id, userId);
  }

  /**
   * Function to create credential MOCK
   *
   * @param {string} userId unique identifier of the owner of all credentials
   * @param {StartAttestationDto} authenticatorAttachment type of mock
   * @param {string} ua value of the useragent making the request
   *
   * @return {Observable<CredentialEntity>} the entity representing the patched credential
   */

  /*createCredentialMock(userId: string, authenticatorAttachment: StartAttestationDto, ua: string): Observable<CredentialEntity> {
    let credential: Credential;
    const userAgentData: UserAgentData = this.userAgentData(ua);

    switch (authenticatorAttachment.authenticator_attachment) {
      case 'cross-platform':
        credential = {
          user_id: userId,
          credential_id: new Buffer('credential_id-cross-platform'),
          type: 'public-key',
          name: 'YubiKey 5 Series',
          aaguid: '' + new Date().getTime(),
          user_handle: new Buffer('user_handle-cross-platform'),
          user_verified: false,
          public_key: new Buffer('public_key-cross-platform'),
          signature_count: 1,
          attestation_format: ATTESTATION_FORMAT.FIDO_U2F,
          attestation: new Buffer('attestation-cross-platform'),
          metadata: {
            authenticator_attachment: authenticatorAttachment.authenticator_attachment,
          },
          transports: [ 'usb', 'nfc' ],
          last_access_time: new Date().getTime(),
        };
        break;
      case 'platform':
        credential = {
          user_id: userId,
          credential_id: new Buffer('credential_id-platform'),
          type: 'public-key',
          name: 'My Computer',
          aaguid: '' + new Date().getTime(),
          user_handle: new Buffer('user_handle-platform'),
          user_verified: false,
          public_key: new Buffer('public_key-platform'),
          signature_count: 1,
          attestation_format: ATTESTATION_FORMAT.APPLE,
          attestation: new Buffer('attestation-platform'),
          metadata: {
            authenticator_attachment: authenticatorAttachment.authenticator_attachment,
            os: userAgentData.os,
            device: userAgentData.device,
          },
          transports: [ 'internal' ],
          last_access_time: new Date().getTime(),
        };
        break;
    }

    return this._credentialService.create(credential);
  }*/

  /**
   * Returns all credentials for the given user
   *
   * @param {string} userId unique identifier of the owner of all credentials
   * @param {string} ua value of the useragent making the request
   *
   * @return {Observable<CredentialsListEntity | void>} list of credentials or undefined if not found
   */
  findCredentialsListForUser(userId: string, ua: string): Observable<CredentialsListEntity | void> {
    return this._credentialService.findCredentialsForUser(userId)
      .pipe(
        filter((credentials: CredentialEntity[]) => !!credentials),
        map((credentials: CredentialEntity[]) => {
          // get user agent data
          const userAgentData: UserAgentData = this.userAgentData(ua);

          // flag to know if we can add more biometric credential
          let canAddNewBiometric = true;

          // check if we can add more biometric credential
          credentials
            .filter((credential: CredentialEntity) => credential.metadata.authenticator_attachment === 'platform')
            .forEach((credential: CredentialEntity) => {
              if (!!userAgentData.os && !!userAgentData.device && credential.metadata.os === userAgentData.os && credential.metadata.device === userAgentData.device) {
                canAddNewBiometric = false;
              }
            });

          // return new credentials list with the flag
          return new CredentialsListEntity({ credentials, can_add_new_biometric: canAddNewBiometric });
        }),
        defaultIfEmpty(undefined),
      );
  }

  /**
   * Returns user agent data
   *
   * @param {string} ua value of the useragent making the request
   */
  userAgentData(ua: string): UserAgentData {
    return {
      os: useragent.parse(ua)?.os?.toString(),
      device: useragent.parse(ua)?.device?.toString(),
    };
  }

  /**
   * Returns attestation options object
   *
   * @param {AuthenticatorAttachment} authenticatorAttachment type of platform
   * @param {secureSession.Session} session the current session instance
   *
   * @return {Observable<PublicKeyCredentialCreationOptionsEntity>} attestation options object
   */
  startAttestation(authenticatorAttachment: AuthenticatorAttachment, session: secureSession.Session): Observable<PublicKeyCredentialCreationOptionsEntity> {
    return this._webauthnService.startAttestation(authenticatorAttachment, session);
  }

  /**
   * Returns the new credential after attestation was verified
   *
   * @param {VerifyAttestationDto} attestation to verify
   * @param {secureSession.Session} session the current session instance
   * @param {string} ua value of the useragent making the request
   *
   * @return {Observable<CredentialEntity>} the new credential for the given attestation
   */
  verifyAttestation(attestation: VerifyAttestationDto, session: secureSession.Session, ua: string): Observable<CredentialEntity> {
    return this._webauthnService.finishAttestation(attestation, session, this.userAgentData(ua));
  }

  /**
   * Returns assertion options object
   *
   * @return {Observable<PublicKeyCredentialRequestOptionsEntity>} assertion options object
   */
  startAssertion(): Observable<PublicKeyCredentialRequestOptionsEntity> {
    return this._webauthnService.startAssertion();
  }

  /**
   * Returns the logged in user after assertion verification
   *
   * @param {VerifyAssertionDto} assertion to verify
   * @param {secureSession.Session} session secure data for the current session
   *
   * @return {Observable<UserEntity>} the logged in user after assertion verification
   */
  finishAssertion(assertion: VerifyAssertionDto, session: secureSession.Session): Observable<UserEntity> {
    return this._webauthnService.finishAssertion(assertion, session);
  }
}
