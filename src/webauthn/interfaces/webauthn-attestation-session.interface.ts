import { AuthenticatorAttachment } from '@simplewebauthn/typescript-types';

export interface WebAuthnAttestationSession {
  challenge: string;
  user_handle: string;
  authenticator_attachment: AuthenticatorAttachment;
}
