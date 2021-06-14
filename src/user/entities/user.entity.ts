import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier in the database',
    example: '5763cd4dc378a38ecd387737',
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    name: 'username',
    description: 'Username of the user',
    example: 'akanass',
  })
  @Expose()
  @Type(() => String)
  username: string;

  @ApiProperty({
    name: 'display_name',
    description: 'Display name of the user',
    example: 'Akanass',
  })
  @Expose()
  @Type(() => String)
  display_name: string;

  @ApiProperty({
    name: 'skip_authenticator_registration',
    description:
      'Flag to know if user wants to display authenticator registration page after login by username/password',
    example: false,
  })
  @Expose()
  @Type(() => Boolean)
  skip_authenticator_registration: boolean;

  @ApiProperty({
    name: 'last_access_time',
    description:
      'Last access time, in timestamp format, when user was connected',
    example: 101343600000,
    required: false,
  })
  @Expose()
  @Type(() => Number)
  last_access_time: number;

  /**
   * Creation date in timestamp format - not exposed in API answer
   */
  created_at: number;

  /**
   * Update date in timestamp format - not exposed in API answer
   */
  updated_at: number;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
