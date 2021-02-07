import { Controller, Get, Req, Res, Session } from '@nestjs/common';
import * as secureSession from 'fastify-secure-session';
import { AppService } from './app.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SecurityService } from './security/security.service';

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService, private readonly _securityService: SecurityService) {
  }

  @Get()
  async homePage(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    await res
      .status(302)
      .redirect(`login${this._appService.buildQueryString(req.query)}`);
  }

  @Get('login')
  async loginPage(@Res() res) {
    await res
      .view('login', this._appService.getMetadata('login'));
  }

  @Get('login/authenticator')
  async loginAuthenticatorPage(@Res() res, @Session() session: secureSession.Session) {
    await res
      .view('login_authenticator', Object.assign({}, this._appService.getMetadata('login_authenticator'), { dynamicTitleValue: this._securityService.getSessionData(session, 'user')?.display_name }));
  }

  @Get('webauthn/authenticator')
  async webauthnAuthenticatorPage(@Res() res) {
    await res
      .view('webauthn_authenticator', this._appService.getMetadata('webauthn_authenticator'));
  }

  @Get('end')
  async endPage(@Res() res, @Session() session: secureSession.Session) {
    await res
      .view('end', Object.assign({}, this._appService.getMetadata('end'), { dynamicTitleValue: this._securityService.getSessionData(session, 'user')?.display_name }));
  }

  @Get('*')
  async ErrorPage(@Res() res) {
    await res
      .view('error', this._appService.getMetadata('error'));
  }
}
