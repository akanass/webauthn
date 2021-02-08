import { IsBoolean, IsLowercase, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatchUserDto {
  @ApiProperty({
    name: 'username',
    description: 'Username of the user',
    example: 'akanass',
    minLength: 5,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @IsLowercase()
  username?: string;

  @ApiProperty({
    name: 'display_name',
    description: 'Display name of the user',
    example: 'Akanass',
    minLength: 2,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  display_name?: string;

  @ApiProperty({
    name: 'skip_authenticator_registration',
    description: 'Flag to know if user wants to display authenticator registration page after login by username/password',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  skip_authenticator_registration?: boolean;
}
