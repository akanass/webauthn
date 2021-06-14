import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Base64URLString } from '@simplewebauthn/typescript-types';

export class AuthenticationAssertionResponseDto {
  @ApiProperty({
    name: 'authenticatorData',
    description: 'Authenticator data object in base64',
    required: true,
    example: 'IiIRnoKsjMNIKQ-DyMJERZTtRSUfzAXBgcRxw3m1s-wFYC3d0g',
  })
  @IsString()
  @IsNotEmpty()
  authenticatorData: Base64URLString;

  @ApiProperty({
    name: 'clientDataJSON',
    description: 'Client data in base64',
    required: true,
    example:
      'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiQUR0UGozemJtSWcyYUJTVjZ3TUtGZURuaUI3NVFOWGtDTGthYV9McGJHdyIsIm9yaWdpbiI6Imh0dHBzOi8vYWthbmFzcy5sb2NhbDozMDAwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ',
  })
  @IsString()
  @IsNotEmpty()
  clientDataJSON: Base64URLString;

  @ApiProperty({
    name: 'signature',
    description: 'Assertion signature in base64',
    required: true,
    example:
      'MEQCIAn3SacZhA4h9BUEI-g-aoOc_6EaKNAnVCT2GBpjUkQcAiAUIqfECfbsvlkISmBCfu3C22u3_13jm9viEyCs7PA3rw',
  })
  @IsString()
  @IsNotEmpty()
  signature: Base64URLString;

  @ApiProperty({
    name: 'userHandle',
    description: 'User handle in utf-8 string',
    example: 'PdDIDkL7TR0GfV8OHAJYOrSxujcdNEuqMoXgo8VFk9BGSYGcTLC7PLq7msqvefvd',
  })
  @IsString()
  @IsOptional()
  userHandle?: string;
}
