export class Auth {
  // private property to store username
  private _username: string;
  // private property to store password
  private _password: string;

  /**
   * Create new instance and set username/password values
   *
   * @param username of the user who wants to be authenticated
   * @param password of the user who wants to be authenticated
   */
  constructor(username: string, password: string) {
    this._username = username;
    this._password = password;
  }

  //login() {}
}
