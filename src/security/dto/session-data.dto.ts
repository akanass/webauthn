import { KeySessionDataDto } from './key-session-data.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SessionDataDto extends KeySessionDataDto {
  @ApiProperty({
    name: 'value',
    description: 'The value in the secure session',
    example: 'login',
  })
  @IsNotEmpty()
  value: any;
}
