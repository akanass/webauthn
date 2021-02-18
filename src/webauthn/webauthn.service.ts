import { BadRequestException, Injectable, PreconditionFailedException, UnauthorizedException } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { CredentialService } from '../credential/credential.service';
import {
  AuthenticatorAttachment,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/typescript-types';
import * as secureSession from 'fastify-secure-session';
import { UserEntity } from '../user/entities/user.entity';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import * as Config from 'config';
import { WebAuthnConfig } from '../interfaces/security-config.interface';
import { CredentialEntity } from '../credential/entities/credential.entity';
import {
  generateAssertionOptions,
  generateAttestationOptions,
  verifyAssertionResponse,
  verifyAttestationResponse,
} from '@simplewebauthn/server';
import { PublicKeyCredentialCreationOptionsEntity } from './entities/public-key-credential-creation-options.entity';
import { WebAuthnAttestationSession } from './interfaces/webauthn-attestation-session.interface';
import { UserAgentData } from '../api/interfaces/useragent-data.interface';
import { VerifiedAttestation } from '@simplewebauthn/server/dist/attestation/verifyAttestationResponse';
import { Credential } from '../credential/schemas/credential.schema';
import { VerifyAttestationDto } from './dto/verify-attestation.dto';
import { PublicKeyCredentialRequestOptionsEntity } from './entities/public-key-credential-request-options.entity';
import { VerifyAssertionDto } from './dto/verify-assertion.dto';
import { WebAuthnAssertionSession } from './interfaces/webauthn-assertion-session.interface';
import { VerifiedAssertion } from '@simplewebauthn/server/dist/assertion/verifyAssertionResponse';
import { UserService } from '../user/user.service';

@Injectable()
export class WebAuthnService {
  /**
   * Class constructor
   *
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   * @param {CredentialService} _credentialService dependency injection of CredentialService instance
   * @param {UserService} _userService dependency injection of UserService instance
   */
  constructor(private readonly _securityService: SecurityService, private readonly _credentialService: CredentialService, private readonly _userService: UserService) {
  }

  /**
   * Generate attestation options
   *
   * @param {AuthenticatorAttachment} authenticatorAttachment type of platform
   * @param {secureSession.Session} session the current secure session instance
   *
   * @return {Observable<PublicKeyCredentialCreationOptionsEntity>}
   */
  startAttestation(authenticatorAttachment: AuthenticatorAttachment, session: secureSession.Session): Observable<PublicKeyCredentialCreationOptionsEntity> {
    return this._securityService.getLoggedInUser(session)
      .pipe(
        mergeMap((user: UserEntity) =>
          forkJoin([
            of(user),
            this._credentialService.findCredentialsForUserWithAuthenticatorAttachment(user.id, authenticatorAttachment),
            this._securityService.generateUserHandle(),
            of(Config.get<WebAuthnConfig>('security.webauthn')),
          ]),
        ),
        map((merged: [ UserEntity, CredentialEntity[], string, WebAuthnConfig ]) => ({
          user: merged[ 0 ],
          credentials: merged[ 1 ],
          userHandle: merged[ 2 ],
          config: merged[ 3 ],
        })),
        map((_: { user: UserEntity, credentials: CredentialEntity[], userHandle: string, config: WebAuthnConfig }) => ({
          userName: _.user.username,
          userDisplayName: _.user.display_name,
          userID: _.userHandle,
          rpName: _.config.rpName,
          rpID: _.config.rpID,
          timeout: _.config.timeout,
          attestationType: _.config.attestationType,
          authenticatorSelection: Object.assign({}, _.config.authenticatorSelection, { authenticatorAttachment }),
          excludeCredentials: !!_.credentials ? _.credentials.map((credential: CredentialEntity) => ({
            id: credential.credential_id,
            transports: credential.transports,
            type: 'public-key',
          })) : [],
        })),
        map((_: any) => generateAttestationOptions(_)),
        map((_: PublicKeyCredentialCreationOptionsJSON) => new PublicKeyCredentialCreationOptionsEntity(_)),
      );
  }

  /**
   * Verify attestation and create credential in database
   *
   * @param {VerifyAttestationDto} attestation to verify
   * @param {secureSession.Session} session the current secure session instance
   * @param {UserAgentData} userAgentData info for platform authenticator
   *
   * @return {Observable<CredentialEntity>} new credential for the given attestation
   */
  finishAttestation(attestation: VerifyAttestationDto, session: secureSession.Session, userAgentData: UserAgentData): Observable<CredentialEntity> {
    return forkJoin([
      this._securityService.getLoggedInUser(session),
      of(this._securityService.getSessionData(session, 'webauthn_attestation')),
      of(Config.get<WebAuthnConfig>('security.webauthn')),
    ])
      .pipe(
        map((merged: [ UserEntity, WebAuthnAttestationSession, WebAuthnConfig ]) => ({
          user: merged[ 0 ],
          data: merged[ 1 ],
          config: merged[ 2 ],
        })),
        map((_: { user: UserEntity, data: WebAuthnAttestationSession, config: WebAuthnConfig }) => ({
          verifyAttestationOptions: {
            credential: attestation,
            expectedChallenge: _.data.challenge,
            expectedOrigin: !!_.config.useRpPort && !!_.config.rpPort ? `https://${_.config.rpID}:${_.config.rpPort}` : `https://${_.config.rpID}`,
            expectedRPID: _.config.rpID,
            requireUserVerification: _.config.authenticatorSelection.userVerification === 'required',
          },
          data: {
            user_id: _.user.id,
            name: _.data.authenticator_attachment === 'cross-platform' ? _.config.defaultSecurityKeyName : _.config.defaultBiometricName,
            user_handle: Buffer.from(_.data.user_handle),
            metadata: _.data.authenticator_attachment === 'platform' ?
              Object.assign({}, { authenticator_attachment: _.data.authenticator_attachment }, userAgentData) :
              { authenticator_attachment: _.data.authenticator_attachment },
            transports: !!attestation.transports && attestation.transports.length > 0 ? attestation.transports : _.config.defaultTransports,
          },
        })),
        mergeMap((_: { verifyAttestationOptions: any, data: Partial<Credential> }) =>
          forkJoin([
            from(verifyAttestationResponse(_.verifyAttestationOptions)),
            of(_.data),
          ]),
        ),
        catchError(err => throwError(new BadRequestException(err.message))),
        map((merged: [ VerifiedAttestation, Partial<Credential> ]) => ({
          verifiedAttestation: merged[ 0 ],
          data: merged[ 1 ],
        })),
        mergeMap((_: { verifiedAttestation: VerifiedAttestation, data: Partial<Credential> }) =>
          !!_.verifiedAttestation.verified ?
            of(Object.assign({}, _.data, {
              credential_id: _.verifiedAttestation.attestationInfo.credentialID,
              type: _.verifiedAttestation.attestationInfo.credentialType,
              aaguid: _.verifiedAttestation.attestationInfo.aaguid,
              user_verified: _.verifiedAttestation.attestationInfo.userVerified,
              public_key: _.verifiedAttestation.attestationInfo.credentialPublicKey,
              signature_count: _.verifiedAttestation.attestationInfo.counter,
              attestation_format: _.verifiedAttestation.attestationInfo.fmt,
              attestation: _.verifiedAttestation.attestationInfo.attestationObject,
              last_access_time: new Date().getTime(),
            })) :
            throwError(new PreconditionFailedException('WebAuthn attestation can\'t be verified')),
        ),
        mergeMap((_: Credential) => this._credentialService.create(_)),
      );
  }

  /**
   * Generate attestation options
   *
   * @return {Observable<PublicKeyCredentialRequestOptionsEntity>} assertion options object
   */
  startAssertion(): Observable<PublicKeyCredentialRequestOptionsEntity> {
    return of(Config.get<WebAuthnConfig>('security.webauthn'))
      .pipe(
        map((_: WebAuthnConfig) => ({
          timeout: _.timeout,
          userVerification: _.authenticatorSelection.userVerification,
          rpID: _.rpID,
        })),
        map((_: any) => generateAssertionOptions(_)),
        map((_: PublicKeyCredentialRequestOptionsJSON) => new PublicKeyCredentialRequestOptionsEntity(_)),
      );
  }

  /**
   * Verify assertion and log in the user
   *
   * @param {VerifyAssertionDto} assertion to verify
   * @param {secureSession.Session} session secure data for the current session
   *
   * @return {Observable<UserEntity>} the user logged in with this credential
   */
  finishAssertion(assertion: VerifyAssertionDto, session: secureSession.Session): Observable<UserEntity> {
    return this._credentialService.findCredentialByUserHandle(Buffer.from(assertion.response.userHandle, 'base64'))
      .pipe(
        mergeMap((credential: CredentialEntity) =>
          !!credential ?
            of(credential) :
            throwError(new UnauthorizedException('User cannot use this authenticator to authenticate')),
        ),
        mergeMap((credential: CredentialEntity) =>
          forkJoin([
            of(credential),
            of(this._securityService.getSessionData(session, 'webauthn_assertion')),
            of(Config.get<WebAuthnConfig>('security.webauthn')),
          ]),
        ),
        map((merged: [ CredentialEntity, WebAuthnAssertionSession, WebAuthnConfig ]) => ({
          credential: merged[ 0 ],
          data: merged[ 1 ],
          config: merged[ 2 ],
        })),
        map((_: { credential: CredentialEntity, data: WebAuthnAssertionSession, config: WebAuthnConfig }) => ({
          credential: assertion,
          expectedChallenge: _.data.challenge,
          expectedOrigin: !!_.config.useRpPort && !!_.config.rpPort ? `https://${_.config.rpID}:${_.config.rpPort}` : `https://${_.config.rpID}`,
          expectedRPID: _.config.rpID,
          authenticator: {
            credentialID: Buffer.from(_.credential.credential_id),
            credentialPublicKey: Buffer.from(_.credential.public_key),
            counter: _.credential.signature_count,
            transports: _.credential.transports,
          },
          fidoUserVerification: _.config.authenticatorSelection.userVerification === 'required',
        })),
        mergeMap((_: any) =>
          of(verifyAssertionResponse(_))
            .pipe(
              catchError(err => throwError(new BadRequestException(err.message))),
            ),
        ),
        mergeMap((_: VerifiedAssertion) =>
          !!_.verified ?
            of(_) :
            throwError(new PreconditionFailedException('WebAuthn assertion can\'t be verified')),
        ),
        mergeMap((_: VerifiedAssertion) => this._credentialService.updateLoginData(_.assertionInfo.credentialID, _.assertionInfo.newCounter)),
        mergeMap((credential: CredentialEntity) => this._userService.webAuthnLogin(credential.user_id)),
      );
  }
}
