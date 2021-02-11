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

@Injectable()
export class ApiService {
  /**
   * Class constructor
   *
   * @param {UserService} _userService dependency injection of UserService instance
   * @param {CredentialService} _credentialService dependency injection of CredentialService instance
   */
  constructor(private readonly _userService: UserService, private readonly _credentialService: CredentialService) {
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
        defaultIfEmpty([ // TODO DELETE MOCK
          new CredentialEntity({
            id: '5763cd4dc378a38ecd387737',
            type: 'yk5series',
            name: 'YubiKey 5 Series',
            metadata: {
              authenticator_attachment: 'cross-platform',
            },
            last_access_time: 1613051133445,
          }),
          new CredentialEntity({
            id: '5763cd4dc378a38ecd386689',
            type: 'unknown',
            name: 'Macbook Pro',
            metadata: {
              authenticator_attachment: 'platform',
              os: 'Mac OS X 11.2.1',
              device: 'Other 0.0.0',
            },
            last_access_time: 1613051140324,
          }),
        ]),
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
        //defaultIfEmpty(undefined), // TODO ACTIVATE DEFAULT WHEN MOCK DELETED
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
}
