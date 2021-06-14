import { Exclude, Expose, Type } from 'class-transformer';
import {
  Base64URLString,
  UserVerificationRequirement,
} from '@simplewebauthn/typescript-types';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PublicKeyCredentialRequestOptionsEntity {
  @ApiProperty({
    name: 'challenge',
    description: 'Unique challenge to secure the verification',
    example: 'sCV8NYILGpRl2wZybe_MM3h8y7yBfLxs_FZRwal2K90',
  })
  @Expose()
  @Type(() => String)
  challenge: Base64URLString;

  @ApiProperty({
    name: 'timeout',
    description: 'Timeout in milliseconds before verification failed',
    example: 60000,
    required: false,
  })
  @Expose()
  @Type(() => Number)
  timeout?: number;

  @ApiProperty({
    name: 'userVerification',
    description: 'User verification requirement',
    example: 'required',
    enum: ['discouraged', 'preferred', 'required'],
    required: false,
  })
  @Expose()
  @Type(() => String)
  userVerification?: UserVerificationRequirement;

  @ApiProperty({
    name: 'rpId',
    description: 'Unique identifier for the Relying Party',
    example: 'akanass.local',
    required: false,
  })
  @Expose()
  @Type(() => String)
  rpId?: string;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<PublicKeyCredentialRequestOptionsEntity>) {
    Object.assign(this, partial);
  }
}
