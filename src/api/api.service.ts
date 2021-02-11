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
   *
   * @return {Observable<Credential[] | void>} list of credentials or undefined if not found
   */
  findCredentialsForUser(userId: string): Observable<CredentialEntity[] | void> {
    return this._credentialService.findCredentialsForUser(userId)
      .pipe(
        filter((credentials:CredentialEntity[]) => !!credentials && credentials.length > 0),
        map(_ => _),
        defaultIfEmpty( // TODO DELETE MOCK
          [
            new CredentialEntity({
              id: "5763cd4dc378a38ecd387737",
              type: "yk5series",
              name: "YubiKey 5 Series",
              metadata: {
                authenticator_attachment: "cross-platform",
              },
              last_access_time: 1613051133445
            }),
            new CredentialEntity({
              id: "5763cd4dc378a38ecd386689",
              type: "unknown",
              name: "Macbook Pro",
              metadata: {
                authenticator_attachment: "platform",
                os: "Mac OSX 11.2.1",
                device: "Macbook Pro"
              },
              last_access_time: 1613051140324
            })
          ]
        )
      );
  }
}
