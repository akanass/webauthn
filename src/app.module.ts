import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { UserModule } from './user/user.module';
import { WebAuthnModule } from './webauthn/webauthn.module';
import { SecurityModule } from './security/security.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import * as Config from 'config';

@Module({
  imports: [
    ApiModule,
    UserModule,
    WebAuthnModule,
    SecurityModule,
    MongooseModule.forRoot(Config.get<string>('mongodb.uri'), Config.get<MongooseModuleOptions>('mongodb.options')) ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule {
}
