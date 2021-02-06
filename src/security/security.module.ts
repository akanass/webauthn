import { Global, Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { CryptoModule } from '@akanass/nestjsx-crypto';

@Global()
@Module({
  imports: [ CryptoModule ],
  providers: [ SecurityService ],
  exports: [ SecurityService ],
})
export class SecurityModule {
}
