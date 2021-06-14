import {
  AttestationConveyancePreference,
  AuthenticatorSelectionCriteria,
  AuthenticatorTransport,
} from '@simplewebauthn/typescript-types';

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
  signed: boolean;
  sameSite: boolean;
  maxAge: number;
}

export interface WebAuthnConfig {
  rpName: string;
  rpID: string;
  rpPort?: number;
  useRpPort: boolean;
  timeout: number;
  attestationType: AttestationConveyancePreference;
  authenticatorSelection: AuthenticatorSelectionCriteria;
  defaultSecurityKeyName: string;
  defaultBiometricName: string;
  defaultTransports: AuthenticatorTransport[];
}
