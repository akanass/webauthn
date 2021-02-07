import { Controller, Get, Req, Res, Session } from '@nestjs/common';
import * as secureSession from 'fastify-secure-session';
import { AppService } from './app.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserEntity } from './user/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {
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
    const user: UserEntity = session.get('user');
    await res
      .view('login_authenticator', Object.assign({}, this._appService.getMetadata('login_authenticator'), { dynamicTitleValue: user?.display_name }));
  }

  @Get('webauthn/authenticator')
  async webauthnAuthenticatorPage(@Res() res) {
    await res
      .view('webauthn_authenticator', this._appService.getMetadata('webauthn_authenticator'));
  }

  @Get('end')
  async endPage(@Res() res, @Session() session: secureSession.Session) {
    const user = session.get('user');
    await res
      .view('end', Object.assign({}, this._appService.getMetadata('end'), { dynamicTitleValue: user?.display_name }));
  }

  @Get('*')
  async ErrorPage(@Res() res) {
    await res
      .view('error', this._appService.getMetadata('error'));
  }
}
