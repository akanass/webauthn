import { AuthenticatorTransport, Base64URLString } from '@simplewebauthn/typescript-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInstance, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AuthenticatorAttestationResponseDto } from './authenticator-attestation-response.dto';
import { Type } from 'class-transformer';
import { AuthenticationExtensionsClientOutputsDto } from './authentication-extensions-client-outputs.dto';

export class VerifyAttestationDto {
  @ApiProperty({
    name: 'id',
    description: 'Credential unique identifier',
    required: true,
    example: 'fkj93aEDN85sJGQgSiNNew',
  })
  @IsString()
  @IsNotEmpty()
  id: Base64URLString;

  @ApiProperty({
    name: 'rawId',
    description: 'Credential unique identifier in raw format',
    required: true,
    example: 'fkj93aEDN85sJGQgSiNNew',
  })
  @IsString()
  @IsNotEmpty()
  rawId: Base64URLString;

  @ApiProperty({
    name: 'response',
    description: 'Authenticator attestation response object',
    type: AuthenticatorAttestationResponseDto,
  })
  @IsInstance(AuthenticatorAttestationResponseDto)
  @ValidateNested()
  @Type(() => AuthenticatorAttestationResponseDto)
  response: AuthenticatorAttestationResponseDto;

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
    example: {}
  })
  @IsInstance(AuthenticationExtensionsClientOutputsDto)
  @ValidateNested()
  @Type(() => AuthenticationExtensionsClientOutputsDto)
  clientExtensionResults: AuthenticationExtensionsClientOutputsDto;

  @ApiProperty({
    name: 'transports',
    description: 'This enumeration defines hints as to how clients might communicate with a particular authenticator',
    example: [ 'ble', 'internal', 'nfc', 'usb' ],
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  transports?: AuthenticatorTransport[];
}
