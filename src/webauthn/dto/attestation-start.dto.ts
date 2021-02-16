import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AttestationStartDto {
  @ApiProperty({
    name: 'authenticator_attachment',
    description: 'Credential authenticator attachment',
    required: true,
    enum: [ 'cross-platform', 'platform' ],
  })
  @IsString()
  @IsNotEmpty()
  authenticator_attachment: 'cross-platform' | 'platform';
}
