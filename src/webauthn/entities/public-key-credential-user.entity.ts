import { Exclude, Expose, Type } from 'class-transformer';
import { Base64URLString } from '@simplewebauthn/typescript-types';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PublicKeyCredentialUserEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier for the user',
    example: 'EC7pwA0q1VJlVwMIipmVKoSVvaSBwyTGCdmfQMzegb2xX7KEcGDkRGUkvxT7ytDy',
  })
  @Expose()
  @Type(() => String)
  id: Base64URLString;

  @ApiProperty({
    name: 'name',
    description: 'Username of the user',
    example: 'akanass',
  })
  @Expose()
  @Type(() => String)
  name: string;

  @ApiProperty({
    name: 'displayName',
    description: 'Display name of the user',
    example: 'Akanass',
  })
  @Expose()
  @Type(() => String)
  displayName: string;
}
