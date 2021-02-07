import {
  ConflictException,
  Injectable,
  PreconditionFailedException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserDao } from './dao/user.dao';
import { LoginUserDto } from './dto/login-user.dto';
import { merge, Observable, of, throwError } from 'rxjs';
import { UserEntity } from './entities/user.entity';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { User } from './schemas/user.schema';
import { SecurityService } from '../security/security.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  /**
   * Class constructor
   *
   * @param {UserDao} _userDao dependency injection of UserDao instance
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   */
  constructor(private readonly _userDao: UserDao, private readonly _securityService: SecurityService) {
  }

  /**
   * Function to login an user by username/password
   *
   * @param {LoginUserDto} loginUser couple username/password to login the user
   *
   * @return {Observable<UserEntity>} the entity representing the logged in user
   */
  login(loginUser: LoginUserDto): Observable<UserEntity> {
    return this._userDao.findByUsername(loginUser.username)
      .pipe(
        catchError(e => throwError(new UnprocessableEntityException(e.message))),
        mergeMap((user: User) =>
          !!user ?
            of(user) :
            throwError(new UnauthorizedException('Username and Password don\'t match')),
        ),
        map((user: User) => ({
          user,
          passwordIsValid: this._securityService.checkPassword(loginUser.password, Buffer.from(user.password_hash)),
        })),
        mergeMap((_: { user: User, passwordIsValid: Observable<boolean> }) =>
          merge(
            _.passwordIsValid
              .pipe(
                filter((passwordIsValid: boolean) => !!passwordIsValid),
                map(() => _.user),
              ),
            _.passwordIsValid
              .pipe(
                filter((passwordIsValid: boolean) => !passwordIsValid),
                mergeMap(() => throwError(new UnauthorizedException('Username and Password don\'t match'))),
              ),
          ),
        ),
        mergeMap((user: User & { id: string }) =>
          this._userDao.updateLastAccessTime(user.id)
            .pipe(
              catchError(e => throwError(new UnprocessableEntityException(e.message))),
              mergeMap((user: User) =>
                !!user ?
                  of(user) :
                  throwError(new PreconditionFailedException('An error occurred during login process')),
              ),
            )
        ),
        tap((user: User) => delete user.password_hash),
        map((user: User) => new UserEntity(user)),
      );
  }

  /**
   * Function to create a new user in the database
   *
   * @param {CreateUserDto} user payload
   *
   * @return {Observable<UserEntity>} the entity representing the new user
   */
  create(user: CreateUserDto): Observable<UserEntity> {
    return this._securityService.hashPassword(user.password)
      .pipe(
        map((hashPassword: Buffer) => ({
          username: user.username,
          display_name: user.display_name,
          password_hash: hashPassword,
        })),
        mergeMap((_: Omit<CreateUserDto, 'password'> & { password_hash: Buffer }) => this._userDao.save(_)),
        catchError(e =>
          e.code === 11000 ?
            throwError(
              new ConflictException(`Username '${user.username}' already exists`),
            ) :
            throwError(new UnprocessableEntityException(e.message)),
        ),
        map((user: User) => new UserEntity(user)),
      );
  }
}
