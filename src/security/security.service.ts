import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as Config from 'config';
import { PasswordConfig } from '../interfaces/security-config.interface';
import { HashService } from '@akanass/nestjsx-crypto';
import { map } from 'rxjs/operators';

@Injectable()
export class SecurityService {
  /**
   * Class constructor
   *
   * @param {HashService} _hashService dependency injection of HashService instance
   */
  constructor(private readonly _hashService: HashService) {
  }

  /**
   * Function to hash password
   *
   * @param {string} password the value to hash
   *
   * @return {Observable<Buffer>} the hashed password in buffer format
   */
  hashPassword(password: string): Observable<Buffer> {
    const passwordConfig: PasswordConfig = Config.get<PasswordConfig>('security.password');
    return this._hashService.generate(password, passwordConfig.salt, passwordConfig.iterations, passwordConfig.keylen, passwordConfig.digest);
  }

  /**
   * Function to compare and validate password
   *
   * @param {string} password the value has validated
   * @param hash
   */
  checkPassword(password: string, hash: Buffer): Observable<boolean> {
    return this.hashPassword(password)
      .pipe(
        map((hashPassword: Buffer) => hashPassword.toString('hex') === hash.toString('hex')),
      );
  }
}
