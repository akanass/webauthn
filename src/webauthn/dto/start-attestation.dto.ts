import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthenticatorAttachment } from '@simplewebauthn/typescript-types';

export class StartAttestationDto {
  @ApiProperty({
    name: 'authenticator_attachment',
    description: 'Credential authenticator attachment',
    required: true,
    enum: ['cross-platform', 'platform'],
  })
  @IsString()
  @IsNotEmpty()
  authenticator_attachment: AuthenticatorAttachment;
}
