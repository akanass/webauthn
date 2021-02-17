import { Injectable } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { CredentialService } from '../credential/credential.service';
import { AuthenticatorAttachment, PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
import * as secureSession from 'fastify-secure-session';
import { UserEntity } from '../user/entities/user.entity';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import * as Config from 'config';
import { WebAuthnConfig } from '../interfaces/security-config.interface';
import { CredentialEntity } from '../credential/entities/credential.entity';
import { generateAttestationOptions } from '@simplewebauthn/server';
import { PublicKeyCredentialCreationOptionsEntity } from './entities/public-key-credential-creation-options.entity';

@Injectable()
export class WebAuthnService {
  /**
   * Class constructor
   *
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   * @param {CredentialService} _credentialService dependency injection of CredentialService instance
   */
  constructor(private readonly _securityService: SecurityService, private readonly _credentialService: CredentialService) {
  }

  /**
   * Generate attestation options
   *
   * @param {AuthenticatorAttachment} authenticatorAttachment type of platform
   * @param {secureSession.Session} session the current secure session instance
   *
   * @return {Observable<PublicKeyCredentialCreationOptionsEntity>}
   */
  attestationStart(authenticatorAttachment: AuthenticatorAttachment, session: secureSession.Session): Observable<PublicKeyCredentialCreationOptionsEntity> {
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
        map((merged: UserEntity | CredentialEntity[] | string | WebAuthnConfig) => ({
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
}
