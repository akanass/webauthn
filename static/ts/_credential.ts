export class Credential {
  // private property to store credential's id
  private id: string;
  // private property to store credential's type
  private type: 'unknown' | string;
  // private property to store credential's name
  private name: string;
  // private property to store credential's metadata
  private metadata: CredentialMetadata;
  // private property to store last access time, in timestamp format, when user used this credential
  private last_access_time: number;

  /**
   * Class constructor
   *
   * @param {Credential} credential data from the API
   */
  constructor(credential: Credential) {
    Object.assign(this, credential);
  }

  /**
   * Returns credential unique identifier
   */
  get credentialId(): string {
    return this.id;
  }

  /**
   * Returns credential type
   */
  get credentialType(): 'unknown' | string {
    return this.type;
  }

  /**
   * Returns credential name
   */
  get credentialName(): string {
    return this.name;
  }

  /**
   * Returns credential metadata
   */
  get credentialMetadata(): CredentialMetadata {
    return this.metadata;
  }

  /**
   * Returns last access time, in timestamp format, when user used this authenticator
   */
  get lastAccessTime(): string {
    return new Date(this.last_access_time).toString();
  }
}

export interface CredentialMetadata {
  authenticator_attachment: 'cross-platform' | 'platform';
  os?: string;
  device?: string;
}
