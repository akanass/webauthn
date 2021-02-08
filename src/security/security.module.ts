import { Global, Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { CryptoModule } from '@akanass/nestjsx-crypto';
import { AuthGuard } from './guards/auth.guard';

@Global()
@Module({
  imports: [ CryptoModule ],
  providers: [ SecurityService, AuthGuard ],
  exports: [ SecurityService, AuthGuard ],
})
export class SecurityModule {
}
