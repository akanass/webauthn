import { Global, Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { CryptoModule } from '@akanass/nestjsx-crypto';
import { AuthGuard } from './guards/auth.guard';
import { SessionValueGuard } from './guards/session-value.guard';

@Global()
@Module({
  imports: [ CryptoModule ],
  providers: [ SecurityService, AuthGuard, SessionValueGuard ],
  exports: [ SecurityService, AuthGuard, SessionValueGuard ],
})
export class SecurityModule {
}
