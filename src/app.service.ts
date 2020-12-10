import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'Click on the button to know if your browser supports WebAuthn protocol',
      supported: 'Your browser supports WebAuthn protocol :) - You can enjoy its new features !!!',
      unsupported: 'Your browser doesn\'t support WebAuthn protocol :( - You have to update it or having an SSL connection if you want to enjoy those new features !!!',
      checkSupported: 'WebAuthn ?',
      script: { // TODO make it dynamic with metadata retrieved during build process
        es: 'login-76b8cbb0.min.mjs',
        system: 'login-9b832bb7.min.js'
      }
    };
  }
}
