import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateUserDto } from '../dto/create-user.dto';
import { PatchUserDto } from '../dto/patch-user.dto';

@Injectable()
export class UserDao {
  /**
   * Class constructor
   *
   * @param {Model<User>} _userModel instance of the model representing an User
   */
  constructor(@InjectModel(User.name) private readonly _userModel: Model<UserDocument>) {
  }

  /**
   * Find an User by his username
   *
   * @param username of the User
   *
   * @return {Observable<User | void>} user or undefined if not found
   */
  findByUsername(username: string): Observable<User | void> {
    return from(this._userModel.findOne({ username }))
      .pipe(
        map((doc: UserDocument) => !!doc ? doc.toJSON() : undefined),
      );
  }

  /**
   * Update last access time for the given user id
   *
   * @param {string} id of the User
   *
   * @return {Observable<User | void>} updated user or undefined if not found
   */
  updateLastAccessTime(id: string): Observable<User | void> {
    return this.patch(id, { last_access_time: new Date().getTime() });
  }

  /**
   * Patch the user for the given user id with the given patch values
   *
   * @param {string} id of the User
   * @param {Partial<PatchUserDto & { last_access_time: number }>} patch the values to patch the user
   *
   * @return {Observable<User | void>} patched user or undefined if not found
   */
  patch(id: string, patch: Partial<PatchUserDto & { last_access_time: number }>): Observable<User | void> {
    return from(this._userModel.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    }))
      .pipe(
        map((doc: UserDocument) => !!doc ? doc.toJSON() : undefined),
      );
  }

  /**
   * Create a new user
   *
   * @param {Omit<CreateUserDto, 'password'> & { password_hash: Buffer }} user to create
   *
   * @return {Observable<User>} new user created
   */
  save(user: Omit<CreateUserDto, 'password'> & { password_hash: Buffer }): Observable<User> {
    return from(new this._userModel(user).save())
      .pipe(
        map((doc: UserDocument) => doc.toJSON()),
      );
  }
}
