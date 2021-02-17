import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PublicKeyCredentialRpEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier for the Relying Party',
    example: 'akanass.local:3000',
    required: false
  })
  @Expose()
  @Type(() => String)
  id?: string;

  @ApiProperty({
    name: 'name',
    description: 'Relying Party name',
    example: 'Fido2 WebAuthn Example by Akanass',
  })
  @Expose()
  @Type(() => String)
  name: string;
}
