import { AuthenticatorAttachment } from '@simplewebauthn/typescript-types';

export class WebAuthnAttestationSession {
  challenge: string;
  user_handle: string;
  authenticator_attachment: AuthenticatorAttachment;
}
