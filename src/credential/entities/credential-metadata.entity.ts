import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CredentialMetadataEntity {
  @ApiProperty({
    name: 'authenticator_attachment',
    description: 'Authenticator attachment',
    example: 'cross-platform',
    enum: [ 'cross-platform', 'platform' ],
  })
  @Expose()
  @Type(() => String)
  authenticator_attachment: 'cross-platform' | 'platform';

  @ApiProperty({
    name: 'os',
    description: 'Operating system for platform authenticator attachment',
    example: 'Mac OSX 11.2.1',
    required: false
  })
  @Expose()
  @Type(() => String)
  os?: string;

  @ApiProperty({
    name: 'device',
    description: 'Device for platform authenticator attachment',
    example: 'Macbook Pro',
    required: false
  })
  @Expose()
  @Type(() => String)
  device?: string;
}
