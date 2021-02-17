import { Exclude, Expose, Type } from 'class-transformer';
import {
  AuthenticatorAttachment,
  ResidentKeyRequirement,
  UserVerificationRequirement,
} from '@simplewebauthn/typescript-types';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class AuthenticatorSelectionCriteriaEntity {
  @ApiProperty({
    name: 'authenticatorAttachment',
    description: 'Authenticator attachment',
    example: 'cross-platform',
    enum: [ 'cross-platform', 'platform' ],
    required: false
  })
  @Expose()
  @Type(() => String)
  authenticatorAttachment?: AuthenticatorAttachment;

  @ApiProperty({
    name: 'requireResidentKey',
    description: 'Flag to know if resident key is required',
    example: true,
    required: false,
  })
  @Expose()
  @Type(() => Boolean)
  requireResidentKey?: boolean;

  @ApiProperty({
    name: 'residentKey',
    description: 'Resident key requirement',
    example: 'required',
    enum: [ 'discouraged', 'preferred', 'required' ],
    required: false,
  })
  @Expose()
  @Type(() => String)
  residentKey?: ResidentKeyRequirement;

  @ApiProperty({
    name: 'userVerification',
    description: 'User verification requirement',
    example: 'required',
    enum: [ 'discouraged', 'preferred', 'required' ],
    required: false,
  })
  @Expose()
  @Type(() => String)
  userVerification?: UserVerificationRequirement;
}
