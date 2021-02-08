import { Observable, throwError } from 'rxjs';
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax';
import { User } from './_user';
import { catchError, map } from 'rxjs/operators';

export class Auth {
  // private static property to store singleton instance
  private static _instance: Auth;

  /**
   * Create new instance
   * @private
   */
  private constructor() {
  }

  /**
   * Method returns new singleton instance
   */
  static instance(): Auth {
    if (!(Auth._instance instanceof Auth)) {
      Auth._instance = new Auth();
    }

    return Auth._instance;
  }

  /**
   * Function to log in an user by username/password
   *
   * @param {string} username of the user who wants to log in
   * @param {string} password of the user who wants to log in
   */
  login(username: string, password: string): Observable<User> {
    return ajax({
      url: '/api/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        username,
        password,
      },
    }).pipe(
      map((resp: AjaxResponse) => new User(resp.response)),
      catchError((err: AjaxError) => throwError(err.response)),
    );
  }

  /**
   * Function to return logged-in user
   */
  loggedIn(): Observable<User> {
    return ajax({
      url: '/api/logged-in',
      method: 'GET',
    }).pipe(
      map((resp: AjaxResponse) => new User(resp.response)),
      catchError((err: AjaxError) => throwError(err.response)),
    );
  }
}

// create singleton instance
const auth: Auth = Auth.instance();

// export it
export { auth };
