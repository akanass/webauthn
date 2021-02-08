import { Observable, throwError } from 'rxjs';
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';

export class User {
  // private property to store user's id
  private id: string;
  // private property to store user's username
  private username: string;
  // private property to store user's display name
  private display_name: string;
  // private property to store flag to know if user wants to display authenticator registration page after login by username/password
  private skip_authenticator_registration: boolean;
  // private property to store last access time, in timestamp format, when user was connected
  private last_access_time: number;

  /**
   * Class constructor
   *
   * @param {User} user data from the API
   */
  constructor(user: User) {
    Object.assign(this, user);
  }

  /**
   * Returns user unique identifier
   */
  get userId(): string {
    return this.id;
  }

  /**
   * Returns user's username
   */
  get userName(): string {
    return this.username;
  }

  /**
   * Returns user's display name
   */
  get displayName(): string {
    return this.display_name;
  }

  /**
   * Returns flag to know if user wants to display authenticator registration page after login by username/password
   */
  get skipAuthenticatorRegistration(): boolean {
    return this.skip_authenticator_registration;
  }

  /**
   * Returns last access time, in timestamp format, when user was connected
   */
  get lastAccessTime(): number {
    return this.last_access_time;
  }

  /**
   * Function to patch user value
   *
   * @param {Partial<User>} partial user object to patch it
   *
   * @return {Observable<User>} the new instance of the user with the patched value
   */
  patch(partial: Partial<User>): Observable<User> {
    return ajax({
      url: `/api/users/${this.id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: partial,
    }).pipe(
      map((resp: AjaxResponse) => new User(resp.response)),
      catchError((err: AjaxError) => throwError(err.response)),
    );
  }
}
