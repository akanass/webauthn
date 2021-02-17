import { Exclude, Expose, Type } from 'class-transformer';
import { AttestationConveyancePreference, Base64URLString } from '@simplewebauthn/typescript-types';
import { ApiProperty } from '@nestjs/swagger';
import { PublicKeyCredentialRpEntity } from './public-key-credential-rp.entity';
import { PublicKeyCredentialUserEntity } from './public-key-credential-user.entity';
import { PublicKeyCredentialParametersEntity } from './public-key-credential-parameters.entity';
import { PublicKeyCredentialDescriptorEntity } from './public-key-credential-descriptor.entity';
import { AuthenticatorSelectionCriteriaEntity } from './authenticator-selection-criteria.entity';

@Exclude()
export class PublicKeyCredentialCreationOptionsEntity {
  @ApiProperty({
    name: 'challenge',
    description: 'Unique challenge to secure the registration',
    example: 'sCV8NYILGpRl2wZybe_MM3h8y7yBfLxs_FZRwal2K90',
  })
  @Expose()
  @Type(() => String)
  challenge: Base64URLString;

  @ApiProperty({
    name: 'rp',
    description: 'Relying Party data',
    example: {
      id: 'akanass.local:3000',
      name: 'Fido2 WebAuthn Example by Akanass',
    },
    type: PublicKeyCredentialRpEntity,
  })
  @Expose()
  @Type(() => PublicKeyCredentialRpEntity)
  rp: PublicKeyCredentialRpEntity;

  @ApiProperty({
    name: 'user',
    description: 'User data',
    example: {
      id: 'EC7pwA0q1VJlVwMIipmVKoSVvaSBwyTGCdmfQMzegb2xX7KEcGDkRGUkvxT7ytDy',
      name: 'akanass',
      displayName: 'Akanass',
    },
    type: PublicKeyCredentialUserEntity,
  })
  @Expose()
  @Type(() => PublicKeyCredentialRpEntity)
  user: PublicKeyCredentialUserEntity;

  @ApiProperty({
    name: 'pubKeyCredParams',
    description: 'PublicKey Credential Parameters',
    example: {
      alg: -7,
      type: 'public-key',
    },
    type: PublicKeyCredentialParametersEntity,
    isArray: true,
  })
  @Expose()
  @Type(() => PublicKeyCredentialParametersEntity)
  pubKeyCredParams: PublicKeyCredentialParametersEntity[];

  @ApiProperty({
    name: 'timeout',
    description: 'Timeout in milliseconds before registration failed',
    example: 60000,
    required: false,
  })
  @Expose()
  @Type(() => Number)
  timeout?: number;

  @ApiProperty({
    name: 'attestation',
    description: 'Attestation Conveyance Preference',
    example: 'direct',
    enum: [ 'direct', 'enterprise', 'indirect', 'none' ],
    required: false,
  })
  @Expose()
  @Type(() => String)
  attestation?: AttestationConveyancePreference;

  @ApiProperty({
    name: 'excludeCredentials',
    description: 'List of credentials, already registered, to be excluded',
    example: {
      id: 'Y3JlZGVudGlhbF9pZC1jcm9zcy1wbGF0Zm9ybQ',
      transports: [
        'usb',
        'nfc',
      ],
      type: 'public-key',
    },
    type: PublicKeyCredentialDescriptorEntity,
    isArray: true,
  })
  @Expose()
  @Type(() => PublicKeyCredentialDescriptorEntity)
  excludeCredentials: PublicKeyCredentialDescriptorEntity[];

  @ApiProperty({
    name: 'authenticatorSelection',
    description: 'Authenticator selection criteria',
    example: {
      residentKey: 'required',
      userVerification: 'required',
      authenticatorAttachment: 'cross-platform',
      requireResidentKey: true,
    },
    type: AuthenticatorSelectionCriteriaEntity,
    required: false,
  })
  @Expose()
  @Type(() => AuthenticatorSelectionCriteriaEntity)
  authenticatorSelection?: AuthenticatorSelectionCriteriaEntity;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<PublicKeyCredentialCreationOptionsEntity>) {
    Object.assign(this, partial);
  }
}
