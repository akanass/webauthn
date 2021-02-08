import { Injectable, UnauthorizedException } from '@nestjs/common';
import { merge, Observable, of, throwError } from 'rxjs';
import * as Config from 'config';
import { PasswordConfig } from '../interfaces/security-config.interface';
import { HashService } from '@akanass/nestjsx-crypto';
import { defaultIfEmpty, filter, map, mergeMap } from 'rxjs/operators';
import * as secureSession from 'fastify-secure-session';
import { UserEntity } from '../user/entities/user.entity';

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

  /**
   * Function to check if user is store in secure session and return it else throw an error
   *
   * @param {secureSession.Session} session the current secure session instance
   *
   * @return {Observable<boolean>} the flag to know if the user is logged in and store in the secure session
   */
  checkIfUserIsLoggedIn(session: secureSession.Session): Observable<boolean> {
    return of(this.getLoggedInUser(session))
      .pipe(
        mergeMap((obs: Observable<UserEntity>) =>
          merge(
            obs.pipe(
              filter((user: UserEntity) => !!user),
              map(() => true),
            ),
            obs.pipe(
              filter((user: UserEntity) => !user),
              mergeMap(() => throwError(new UnauthorizedException('User is not logged in'))),
            ),
          ),
        ),
      );
  }

  /**
   * Function to return the user stored in secure session
   *
   * @param {secureSession.Session} session the current secure session instance
   *
   * @return {Observable<UserEntity>} the entity representing the user in the secure session
   */
  getLoggedInUser(session: secureSession.Session): Observable<UserEntity> {
    return of(this.getSessionData(session, 'user'))
      .pipe(
        filter((user: UserEntity) => typeof user !== 'undefined'),
        map((user: UserEntity) => new UserEntity(user)),
        defaultIfEmpty(),
      );
  }

  /**
   * Function to set key/value in secure session
   *
   * @param {secureSession.Session} session the current secure session instance
   * @param {string} key of the new value to store in the secure session
   * @param {any} value to store in the secure session
   */
  setSessionData(session: secureSession.Session, key: string, value: any): void {
    session.set(key, value);
  }

  /**
   * Function to return value in secure session for the given key
   *
   * @param {secureSession.Session} session the current secure session instance
   * @param {string} key of the value stored in the secure session
   *
   * @return {any} value stored in the secure session associated to the given key
   */
  getSessionData(session: secureSession.Session, key: string): any {
    return session.get(key);
  }

  /**
   * Function to delete key/value in secure session
   *
   * @param {secureSession.Session} session the current secure session instance
   * @param {string} key of the value stored in the secure session
   */
  clearSessionData(session: secureSession.Session, key: string): void {
    const data = this.getSessionData(session, key);
    if (typeof data !== 'undefined') {
      this.setSessionData(session, key, undefined);
    }
  }

  /**
   * Function to delete the secure session
   *
   * @param {secureSession.Session} session the current secure session instance
   */
  cleanSession(session: secureSession.Session): void {
    session.delete();
  }
}
