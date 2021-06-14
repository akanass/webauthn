import { Exclude, Expose, Type } from 'class-transformer';
import {
  COSEAlgorithmIdentifier,
  PublicKeyCredentialType,
} from '@simplewebauthn/typescript-types/dist/dom';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PublicKeyCredentialParametersEntity {
  @ApiProperty({
    name: 'alg',
    description: 'Number representing the algorithm',
    example: -7,
  })
  @Expose()
  @Type(() => Number)
  alg: COSEAlgorithmIdentifier;

  @ApiProperty({
    name: 'type',
    description: 'Unique value for the parameter',
    example: 'public-key',
  })
  @Expose()
  @Type(() => String)
  type: PublicKeyCredentialType;
}
