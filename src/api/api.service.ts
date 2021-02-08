import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Observable } from 'rxjs';
import { UserEntity } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PatchUserDto } from '../user/dto/patch-user.dto';

@Injectable()
export class ApiService {
  /**
   * Class constructor
   *
   * @param {UserService} _userService dependency injection of UserService instance
   */
  constructor(private readonly _userService: UserService) {
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
}
