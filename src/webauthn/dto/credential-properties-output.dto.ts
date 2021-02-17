import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class CredentialPropertiesOutputDto {
  @ApiProperty({
    name: 'rk',
    description: 'Flag to know if the credential properties output is a rk',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  rk?: boolean;
}
