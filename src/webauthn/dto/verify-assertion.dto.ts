import { ApiProperty } from '@nestjs/swagger';
import {
  IsInstance,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Base64URLString } from '@simplewebauthn/typescript-types';
import { AuthenticationExtensionsClientOutputsDto } from './authentication-extensions-client-outputs.dto';
import { Type } from 'class-transformer';
import { AuthenticationAssertionResponseDto } from './authentication-assertion-response.dto';

export class VerifyAssertionDto {
  @ApiProperty({
    name: 'id',
    description: 'Credential unique identifier',
    required: true,
    example:
      'AUX0tOacjaXYm0xLoBkIyjvizs_DGm1CJAnHOgnMb7osVdZs1V_wgT1dnrwGtQyj7JbbK1Bc2t_-A4WwKOPPKWWYL7c9uRwujhnzCypUCS6n5xKSZwZlcumGwk6VBb1i5C0smbQz8cq5hWdEAgDkaAc',
  })
  @IsString()
  @IsNotEmpty()
  id: Base64URLString;

  @ApiProperty({
    name: 'rawId',
    description: 'Credential unique identifier in raw format',
    required: true,
    example:
      'AUX0tOacjaXYm0xLoBkIyjvizs_DGm1CJAnHOgnMb7osVdZs1V_wgT1dnrwGtQyj7JbbK1Bc2t_-A4WwKOPPKWWYL7c9uRwujhnzCypUCS6n5xKSZwZlcumGwk6VBb1i5C0smbQz8cq5hWdEAgDkaAc',
  })
  @IsString()
  @IsNotEmpty()
  rawId: Base64URLString;

  @ApiProperty({
    name: 'response',
    description: 'Authenticator assertion response object',
    type: AuthenticationAssertionResponseDto,
  })
  @IsInstance(AuthenticationAssertionResponseDto)
  @ValidateNested()
  @Type(() => AuthenticationAssertionResponseDto)
  response: AuthenticationAssertionResponseDto;

  @ApiProperty({
    name: 'type',
    description: 'Credential type',
    example: 'public-key',
  })
  @IsString()
  @IsNotEmpty()
  type: PublicKeyCredentialType;

  @ApiProperty({
    name: 'clientExtensionResults',
    description: 'Client extension results',
    type: AuthenticationExtensionsClientOutputsDto,
    example: {},
  })
  @IsInstance(AuthenticationExtensionsClientOutputsDto)
  @ValidateNested()
  @Type(() => AuthenticationExtensionsClientOutputsDto)
  clientExtensionResults: AuthenticationExtensionsClientOutputsDto;
}
