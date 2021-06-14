import { Exclude, Expose, Type } from 'class-transformer';
import { CredentialEntity } from './credential.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsInstance, ValidateNested } from 'class-validator';

@Exclude()
export class CredentialsListEntity {
  @ApiProperty({
    name: 'credentials',
    description: 'List of all credentials',
    type: CredentialEntity,
    isArray: true,
  })
  @IsInstance(CredentialEntity)
  @ValidateNested()
  @Expose()
  @Type(() => CredentialEntity)
  credentials: CredentialEntity[];

  @ApiProperty({
    name: 'can_add_new_biometric',
    description:
      'Flag to know if user can add new biometric authenticator depending of his useragent',
    example: true,
  })
  @Expose()
  @Type(() => Boolean)
  can_add_new_biometric: boolean;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<CredentialsListEntity>) {
    Object.assign(this, partial);
  }
}
