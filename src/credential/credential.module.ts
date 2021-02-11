import { Global, Module } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialDao } from './dao/credential.dao';
import { MongooseModule } from '@nestjs/mongoose';
import { Credential, CredentialSchema } from './schemas/credential.schema';

@Global()
@Module({
  imports: [ MongooseModule.forFeature([ { name: Credential.name, schema: CredentialSchema } ]) ],
  providers: [ CredentialService ],
  exports: [ CredentialService, CredentialDao ],
})
export class CredentialModule {
}
