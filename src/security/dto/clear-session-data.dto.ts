import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ClearSessionDataDto {
  @ApiProperty({
    name: 'key',
    description: 'The key of the value to clean in the secure session',
    example: 'from_login',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  key: string;
}
