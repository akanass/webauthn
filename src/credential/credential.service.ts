import {
  ConflictException,
  Injectable,
  PreconditionFailedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { CredentialDao } from './dao/credential.dao';
import { Observable, of, throwError } from 'rxjs';
import { CredentialEntity } from './entities/credential.entity';
import { Credential } from './schemas/credential.schema';
import { catchError, defaultIfEmpty, filter, map, mergeMap } from 'rxjs/operators';
import { PatchCredentialDto } from './dto/patch-credential.dto';
import { AuthenticatorAttachment } from '@simplewebauthn/typescript-types';

@Injectable()
export class CredentialService {
  /**
   * Class constructor
   *
   * @param {CredentialDao} _credentialDao dependency injection of CredentialDao instance
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   */
  constructor(private readonly _credentialDao: CredentialDao, private readonly _securityService: SecurityService) {
  }

  /**
   * Returns all credentials for the given user
   *
   * @param {string} userId unique identifier of the owner of all credentials
   *
   * @return {Observable<Credential[] | void>} list of credentials or undefined if not found
   */
  findCredentialsForUser(userId: string): Observable<CredentialEntity[] | void> {
    return this._credentialDao.findAllByUserId(userId)
      .pipe(
        filter((credentials: Credential[]) => !!credentials),
        map((credentials: Credential[]) => credentials.map((credential: Credential) => new CredentialEntity(credential))),
        defaultIfEmpty(undefined),
      );
  }

  /**
   * Returns all credentials for the given user and authenticator attachment
   *
   * @param {string} userId unique identifier of the owner of all credentials
   * @param {AuthenticatorAttachment} authenticatorAttachment type of platform
   *
   * @return {Observable<Credential[] | void>} list of credentials or undefined if not found
   */
  findCredentialsForUserWithAuthenticatorAttachment(userId: string, authenticatorAttachment: AuthenticatorAttachment): Observable<CredentialEntity[] | void> {
    return this._credentialDao.findAllByUserIdAndAuthenticatorAttachment(userId, authenticatorAttachment)
      .pipe(
        filter((credentials: Credential[]) => !!credentials),
        map((credentials: Credential[]) => credentials.map((credential: Credential) => new CredentialEntity(credential))),
        defaultIfEmpty(undefined),
      );
  }

  /**
   * Patch the credential for the given credential id and user id with the given patch values
   *
   * @param {string} id of the Credential
   * @param {string} userId unique identifier of the owner of the credential to update
   * @param {PatchCredentialDto} patch the values to patch the credential
   *
   * @return {Observable<Credential>} patched credential
   */
  patch(id: string, userId: string, patch: PatchCredentialDto): Observable<CredentialEntity> {
    return this._credentialDao.updateCredentialName(id, userId, patch)
      .pipe(
        catchError(e => throwError(new UnprocessableEntityException(e.message))),
        mergeMap((credential: Credential) =>
          !!credential ?
            of(credential) :
            throwError(new PreconditionFailedException(`Credential with id "${id}" for the Owner with id "${userId}" doesn't exist in the database`)),
        ),
        map((credential: Credential) => new CredentialEntity(credential)),
      );
  }

  /**
   * Remove the credential for the given credential id and user id
   *
   * @param {string} id of the Credential
   * @param {string} userId unique identifier of the owner of the credential to update
   *
   * @return {Observable<void>}
   */
  remove(id: string, userId: string): Observable<void> {
    return this._credentialDao.findByIdAndUserIdThenRemove(id, userId)
      .pipe(
        catchError(e => throwError(new UnprocessableEntityException(e.message))),
        mergeMap((credential: Credential) =>
          !!credential ?
            of(undefined) :
            throwError(new PreconditionFailedException(`Credential with id "${id}" for the Owner with id "${userId}" doesn't exist in the database`)),
        ),
      );
  }

  /**
   * Function to create credential in database
   *
   * @param {Credential} credential to insert in database
   *
   * {Observable<CredentialEntity>} the entity representing the new credential
   */
  create(credential: Credential): Observable<CredentialEntity> {
    return this._credentialDao.save(credential)
      .pipe(
        catchError(e =>
          e.code === 11000 ?
            throwError(
              new ConflictException(`Credential with these data already exists`),
            ) :
            throwError(new UnprocessableEntityException(e.message)),
        ),
        map((credential: Credential) => new CredentialEntity(credential)),
      );
  }
}
