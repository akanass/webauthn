import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { merge, Observable, of, throwError } from 'rxjs';
import * as Config from 'config';
import { PasswordConfig } from '../interfaces/security-config.interface';
import { HashService, RandomStringService } from '@akanass/nestjsx-crypto';
import { defaultIfEmpty, filter, map, mergeMap } from 'rxjs/operators';
import * as secureSession from 'fastify-secure-session';
import { UserEntity } from '../user/entities/user.entity';
import { SessionData } from './interfaces/session-data.interface';
import { WebAuthnAttestationSession } from '../webauthn/interfaces/webauthn-attestation-session.interface';
import { WebAuthnAssertionSession } from '../webauthn/interfaces/webauthn-assertion-session.interface';

@Injectable()
export class SecurityService {
  /**
   * Class constructor
   *
   * @param {HashService} _hashService dependency injection of HashService instance
   * @param {RandomStringService} _randomStringService dependency injection of RandomStringService instance
   */
  constructor(private readonly _hashService: HashService, private readonly _randomStringService: RandomStringService) {
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
   * Function to check if user is store in secure session and return it else throw an error
   *
   * @param {secureSession.Session} session the current secure session instance
   * @param {string} userId unique identifier of the user resource
   *
   * @return {Observable<boolean>} the flag to know if the user who is logged in is the same than the resource updated
   */
  checkIfUserIsOwner(session: secureSession.Session, userId: string): Observable<boolean> {
    return of(this.getLoggedInUser(session))
      .pipe(
        mergeMap((obs: Observable<UserEntity>) =>
          merge(
            obs.pipe(
              filter((user: UserEntity) => !!user && user.id === userId),
              map(() => true),
            ),
            obs.pipe(
              filter((user: UserEntity) => !user || user.id !== userId),
              mergeMap(() => throwError(new ForbiddenException('User is not the owner of the resource'))),
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
    return of(this.getLoggedInUserSync(session))
      .pipe(
        filter((user: UserEntity) => typeof user !== 'undefined'),
        map((user: UserEntity) => new UserEntity(user)),
        defaultIfEmpty(),
      );
  }

  /**
   * Function to return the user stored in secure session without any check
   * You have to check if user is really inside the session and the returned value is not undefined
   *
   * This function should not be used and the previous one is better
   * Only created to be used in display page checks because the previous one is called in Guard
   *
   * @param {secureSession.Session} session the current secure session instance
   *
   * @return {UserEntity} the entity representing the user in the secure session
   */
  getLoggedInUserSync(session: secureSession.Session): UserEntity {
    return this.getSessionData(session, 'user');
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
  cleanSessionData(session: secureSession.Session, key: string): void {
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
  deleteSession(session: secureSession.Session): void {
    session.delete();
  }

  /**
   * Function to check if the value in session in the one expected
   *
   * @param {secureSession.Session} session the current secure session instance
   * @param {SessionData} data the key/value to check in the session
   *
   * @return {Observable<boolean>} the flag to know if the data in the secure session is good
   */
  checkSessionData(session: secureSession.Session, data: SessionData): Observable<boolean> {
    return of(of(data))
      .pipe(
        mergeMap((obs: Observable<SessionData>) =>
          merge(
            obs.pipe(
              filter(_ => !!_),
              map((_: SessionData) => [].concat(_.value).indexOf(this.getSessionData(session, _.key)) > -1),
            ),
            obs.pipe(
              filter(_ => !_),
              mergeMap(() => throwError(new InternalServerErrorException('Missing metadata on the route handler'))),
            ),
          ),
        ),
      );
  }

  /**
   * Function to check if the webauthn value in session in the one expected
   *
   * @param {secureSession.Session} session the current secure session instance
   * @param {'webauthn_attestation' | 'webauthn_assertion'} type the type of webauthn data in session
   *
   * @return {Observable<boolean>} the flag to know if the data in the secure session is good
   */
  checkWebAuthnSessionData(session: secureSession.Session, type: 'webauthn_attestation' | 'webauthn_assertion'): Observable<boolean> {
    return of(of(type))
      .pipe(
        mergeMap((obs: Observable<'webauthn_attestation' | 'webauthn_assertion'>) =>
          merge(
            obs.pipe(
              filter(_ => !!_ && _ === 'webauthn_attestation'),
              map((_: 'webauthn_attestation') => this.getSessionData(session, _)),
              map((_: WebAuthnAttestationSession) => !!_ && !!_.challenge && !!_.user_handle && !!_.authenticator_attachment),
              mergeMap((_: boolean) =>
                !!_ ?
                  of(_) :
                  throwError(new ForbiddenException('Missing WebAuthn data to verify attestation')),
              ),
            ),
            obs.pipe(
              filter(_ => !!_ && _ === 'webauthn_assertion'),
              map((_: 'webauthn_assertion') => this.getSessionData(session, _)),
              map((_: WebAuthnAssertionSession) => !!_ && !!_.challenge),
              mergeMap((_: boolean) =>
                !!_ ?
                  of(_) :
                  throwError(new ForbiddenException('Missing WebAuthn data to verify assertion')),
              ),
            ),
            obs.pipe(
              filter(_ => !_ || (_ !== 'webauthn_attestation' && _ !== 'webauthn_assertion')),
              mergeMap(() => throwError(new InternalServerErrorException('Missing metadata on the route handler'))),
            ),
          ),
        ),
      );
  }

  /**
   * Function to generate 64 bytes random string
   *
   * @return {Observable<string>} the random user handle string
   */
  generateUserHandle(): Observable<string> {
    return this._randomStringService.generate(64);
  }
}
