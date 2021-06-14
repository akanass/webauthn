import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialMetadataEntity } from './credential-metadata.entity';
import { AuthenticatorTransport } from '@simplewebauthn/typescript-types';
import { ATTESTATION_FORMAT } from '../enums/attestation-format.enum';
import { IsInstance, ValidateNested } from 'class-validator';

@Exclude()
export class CredentialEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier in the database',
    example: '5763cd4dc378a38ecd387737',
  })
  @Expose()
  @Type(() => String)
  id: string;

  /**
   * User id - not exposed in API answer
   */
  user_id: string;

  /**
   * Credential id to be link with the browser - not exposed in API answer
   */
  credential_id: Buffer;

  @ApiProperty({
    name: 'type',
    description: 'Credential type',
    example: 'public-key',
  })
  @Expose()
  @Type(() => String)
  type: PublicKeyCredentialType;

  @ApiProperty({
    name: 'name',
    description: 'Credential name',
    example: 'YubiKey 5C NFC',
  })
  @Expose()
  @Type(() => String)
  name: string;

  /**
   * Unique identifier which links a credential to the metadataservice provided by FIDO - not exposed in API answer
   */
  aaguid: string;

  /**
   * Unique identifier which links a credential to an user in the browser - not exposed in API answer
   */
  user_handle: Buffer;

  /**
   * Whether the user was uniquely identified during attestation - not exposed in API answer
   */
  user_verified: boolean;

  /**
   * Public key of the credential - not exposed in API answer
   */
  public_key: Buffer;

  /**
   * Signature counter verification - not exposed in API answer
   */
  signature_count: number;

  /**
   * Attestation format - not exposed in API answer
   */
  attestation_format: ATTESTATION_FORMAT;

  /**
   * Attestation object - not exposed in API answer
   */
  attestation: Buffer;

  @ApiProperty({
    name: 'metadata',
    description: 'Authenticator metadata',
    example: {
      authenticator_attachment: 'cross-platform',
    },
    type: CredentialMetadataEntity,
  })
  @IsInstance(CredentialMetadataEntity)
  @ValidateNested()
  @Expose()
  @Type(() => CredentialMetadataEntity)
  metadata: CredentialMetadataEntity;

  /**
   * Credential transports - not exposed in API answer
   */
  transports: AuthenticatorTransport[];

  @ApiProperty({
    name: 'last_access_time',
    description:
      'Last access time, in timestamp format, when user used this authenticator',
    example: 101343600000,
  })
  @Expose()
  @Type(() => Number)
  last_access_time: number;

  @ApiProperty({
    name: 'created_at',
    description: 'Creation date, in timestamp format',
    example: 101343600000,
  })
  @Expose()
  @Type(() => Number)
  created_at: number;

  /**
   * Update date in timestamp format - not exposed in API answer
   */
  updated_at: number;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<CredentialEntity>) {
    Object.assign(this, partial);
  }
}
