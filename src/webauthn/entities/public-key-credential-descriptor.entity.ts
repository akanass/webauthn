import { Exclude, Expose, Type } from 'class-transformer';
import { Base64URLString, AuthenticatorTransport } from '@simplewebauthn/typescript-types';
import { ApiProperty } from '@nestjs/swagger';
import { PublicKeyCredentialType } from '@simplewebauthn/typescript-types/dist/dom';

@Exclude()
export class PublicKeyCredentialDescriptorEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier for the credential',
    example: 'Y3JlZGVudGlhbF9pZC1jcm9zcy1wbGF0Zm9ybQ',
  })
  @Expose()
  @Type(() => String)
  id: Base64URLString;

  @ApiProperty({
    name: 'transports',
    description: 'This enumeration defines hints as to how clients might communicate with a particular authenticator',
    example: 'usb',
    isArray: true,
    required: false
  })
  @Expose()
  @Type(() => String)
  transports?: AuthenticatorTransport[];

  @ApiProperty({
    name: 'type',
    description: 'Credential type',
    example: 'public-key',
  })
  @Expose()
  @Type(() => String)
  type: PublicKeyCredentialType;
}
