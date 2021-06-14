import { Base64URLString } from '@simplewebauthn/typescript-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticatorAttestationResponseDto {
  @ApiProperty({
    name: 'clientDataJSON',
    description: 'Client data in base64',
    required: true,
    example:
      'o2NmbXRmcGFja2VkZ2F0dFN0bXSjY2FsZyZjc2lnWEgwRgIhAIacS3FF0XIrhMgFenVcTOHzRIJueUTCiT3AlftDU8xDAiEA7guGx9gJ06EyLk1RNgrZHVT4EiM0t87SqnKOL4QrqyZjeDVjgVkCwTCCAr0wggGloAMCAQICBB6PhzQwDQYJKoZIhvcNAQELBQAwLjEsMCoGA1UEAxMjWXViaWNvIFUyRiBSb290IENBIFNlcmlhbCA0NTcyMDA2MzEwIBcNMTQwODAxMDAwMDAwWhgPMjA1MDA5MDQwMDAwMDBaMG4xCzAJBgNVBAYTAlNFMRIwEAYDVQQKDAlZdWJpY28gQUIxIjAgBgNVBAsMGUF1dGhlbnRpY2F0b3IgQXR0ZXN0YXRpb24xJzAlBgNVBAMMHll1YmljbyBVMkYgRUUgU2VyaWFsIDUxMjcyMjc0MDBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABKh5-CM47RSUusBwS8x_xmPRsnFxWXYkMQHHYFEV18FSnigcHGcyLThLXNVd0-mBjV_YXCKvMm4MZPwgr-M_I2ajbDBqMCIGCSsGAQQBgsQKAgQVMS4zLjYuMS40LjEuNDE0ODIuMS43MBMGCysGAQQBguUcAgEBBAQDAgQwMCEGCysGAQQBguUcAQEEBBIEEC_AV5-BE0fqsRa7Wo25ICowDAYDVR0TAQH_BAIwADANBgkqhkiG9w0BAQsFAAOCAQEAhpP_Yt8NV3nUdI1_yNECJzGKjlgOajpXwQjpTgPDhWizZolPzlYkvko-_X80EYs9mTdD95KhmJFgyPya4LBOPfnuFePojAT8gqjcv1gY4QjcwpaFd655_2YrlHNOPexFlzBdc-blXuK-uc2WeMoJNeUz62OPjib6u4F82kQfvpgxgyrl9uKtmS-eu9tMYiOLj416tIHW0yY7zb-eSldVA3CYitWBNED6AyyttnI8rdj417qAn3W0PP-gpbmt0UIy752eFIEmOCM8TKSoc7n4rJjjK6GRZ2BuFZCfzdtKLf-9rkYgJJ-aZkasgeSDLREZ_r-qcxqILaJad4J9RtGQF2hhdXRoRGF0YViiIiIRnoKsjMNIKQ-DyMJERZTtRSUfzAXBgcRxw3m1s-zFAAAAAS_AV5-BE0fqsRa7Wo25ICoAEH5I_d2hAzfObCRkIEojTXulAQIDJiABIVggvtk7upFL7-kZE9Ri-AF7-Mbknq0bXg2Js8DDNhh_s3oiWCBcTk1pkiOQQYgUIOLl87xwQ-vbrn8epKDJfddOP3uVGKFrY3JlZFByb3RlY3QC',
  })
  @IsString()
  @IsNotEmpty()
  clientDataJSON: Base64URLString;

  @ApiProperty({
    name: 'attestationObject',
    description: 'Attestation object in base64',
    required: true,
    example:
      'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiUXljbWs2ckw1T0RMNzd6blJSUUhRMEpxNlZXRHVBWjRIOG8xT0pXV2lQYyIsIm9yaWdpbiI6Imh0dHBzOi8vYWthbmFzcy5sb2NhbDozMDAwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ',
  })
  @IsString()
  @IsNotEmpty()
  attestationObject: Base64URLString;
}
