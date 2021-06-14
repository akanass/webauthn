import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInstance,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CredentialPropertiesOutputDto } from './credential-properties-output.dto';
import { Type } from 'class-transformer';
import { UvmEntries } from '@simplewebauthn/typescript-types';

export class AuthenticationExtensionsClientOutputsDto {
  @ApiProperty({
    name: 'appid',
    description: 'Flag to know if the extension is an app id',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  appid?: boolean;

  @ApiProperty({
    name: 'credProps',
    description: 'Credential properties output',
    type: CredentialPropertiesOutputDto,
    required: false,
  })
  @IsInstance(CredentialPropertiesOutputDto)
  @ValidateNested()
  @Type(() => CredentialPropertiesOutputDto)
  @IsOptional()
  credProps?: CredentialPropertiesOutputDto;

  @ApiProperty({
    name: 'uvm',
    description: 'UVM entries',
    type: Array,
    required: false,
  })
  @IsArray()
  @IsOptional()
  uvm?: UvmEntries;
}
