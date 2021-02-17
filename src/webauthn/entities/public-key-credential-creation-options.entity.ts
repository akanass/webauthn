import { Exclude, Expose, Type } from 'class-transformer';
import { AttestationConveyancePreference, Base64URLString } from '@simplewebauthn/typescript-types';
import { ApiProperty } from '@nestjs/swagger';
import { PublicKeyCredentialRpEntity } from './public-key-credential-rp.entity';
import { PublicKeyCredentialUserEntity } from './public-key-credential-user.entity';
import { PublicKeyCredentialParametersEntity } from './public-key-credential-parameters.entity';
import { PublicKeyCredentialDescriptorEntity } from './public-key-credential-descriptor.entity';
import { AuthenticatorSelectionCriteriaEntity } from './authenticator-selection-criteria.entity';
import { IsInstance, ValidateNested } from 'class-validator';

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
    type: PublicKeyCredentialRpEntity,
  })
  @IsInstance(PublicKeyCredentialRpEntity)
  @ValidateNested()
  @Expose()
  @Type(() => PublicKeyCredentialRpEntity)
  rp: PublicKeyCredentialRpEntity;

  @ApiProperty({
    name: 'user',
    description: 'User data',
    type: PublicKeyCredentialUserEntity,
  })
  @IsInstance(PublicKeyCredentialUserEntity)
  @ValidateNested()
  @Expose()
  @Type(() => PublicKeyCredentialUserEntity)
  user: PublicKeyCredentialUserEntity;

  @ApiProperty({
    name: 'pubKeyCredParams',
    description: 'PublicKey Credential Parameters',
    type: PublicKeyCredentialParametersEntity,
    isArray: true,
  })
  @IsInstance(PublicKeyCredentialParametersEntity)
  @ValidateNested()
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
    type: PublicKeyCredentialDescriptorEntity,
    isArray: true,
  })
  @IsInstance(PublicKeyCredentialDescriptorEntity)
  @ValidateNested()
  @Expose()
  @Type(() => PublicKeyCredentialDescriptorEntity)
  excludeCredentials: PublicKeyCredentialDescriptorEntity[];

  @ApiProperty({
    name: 'authenticatorSelection',
    description: 'Authenticator selection criteria',
    type: AuthenticatorSelectionCriteriaEntity,
    required: false,
  })
  @IsInstance(AuthenticatorSelectionCriteriaEntity)
  @ValidateNested()
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
