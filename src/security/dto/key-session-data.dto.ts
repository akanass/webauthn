import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class KeySessionDataDto {
  @ApiProperty({
    name: 'key',
    description: 'The key in the secure session',
    example: 'previous_step',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  key: string;
}
