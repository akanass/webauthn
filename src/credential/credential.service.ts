import { Injectable } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { CredentialDao } from './dao/credential.dao';
import { Observable } from 'rxjs';
import { CredentialEntity } from './entities/credential.entity';
import { Credential } from './schemas/credential.schema';
import { map } from 'rxjs/operators';

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
        map((credentials: Credential[]) => !!credentials ? credentials.map((credential: Credential) => new CredentialEntity(credential)) : undefined),
      );
  }
}
