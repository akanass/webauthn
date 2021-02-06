export interface PasswordConfig {
  salt: string;
  iterations: number;
  keylen: number;
  digest: 'sha256' | 'sha512';
}

export interface SessionConfig {
  cookieName: string;
  secret: string;
  salt: string;
  cookie: CookieOptions;
}

export interface CookieOptions {
  path: string;
  httpOnly: boolean;
  secure: boolean;
}
