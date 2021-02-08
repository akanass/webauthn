import { Global, Logger, Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { CryptoModule } from '@akanass/nestjsx-crypto';
import { AuthGuard } from './guards/auth.guard';
import { SessionValueGuard } from './guards/session-value.guard';
import { OwnerGuard } from './guards/owner.guard';

@Global()
@Module({
  imports: [ CryptoModule ],
  providers: [ SecurityService, AuthGuard, SessionValueGuard, OwnerGuard, Logger ],
  exports: [ SecurityService, AuthGuard, SessionValueGuard, OwnerGuard ],
})
export class SecurityModule {
}
