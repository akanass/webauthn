import { Global, Module } from '@nestjs/common';
import { WebAuthnService } from './webauthn.service';

@Global()
@Module({
  providers: [ WebAuthnService ],
  exports: [ WebAuthnService ],
})
export class WebAuthnModule {
}
