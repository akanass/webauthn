import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Req,
  Res,
  Session,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import * as secureSession from 'fastify-secure-session';
import { AppService } from './app.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SecurityService } from './security/security.service';
import { AuthGuard } from './security/guards/auth.guard';
import { ViewErrorPageFilter } from './filters/view-error-page.filter';
import { UserEntity } from './user/entities/user.entity';
import { SessionValueGuard } from './security/guards/session-value.guard';

@Controller()
@UseFilters(ViewErrorPageFilter)
export class AppController {
  /**
   * Class constructor
   *
   * @param {AppService} _appService dependency injection of AppService instance
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   */
  constructor(private readonly _appService: AppService, private readonly _securityService: SecurityService) {
  }

  /**
   * Handler to answer to GET / route and redirect to login page
   */
  @Get()
  async homePage(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    await res
      .status(302)
      .redirect(`login${this._appService.buildQueryString(req.query)}`); // TODO USE MIDDLEWARE
  }

  /**
   * Handler to answer to GET /login route and display the associated page
   */
  @Get('login')
  async loginPage(@Res() res) {
    await res
      .view('login', this._appService.getMetadata('login')); // TODO USE MIDDLEWARE
  }

  /**
   * Handler to answer to GET /login/authenticator route and display the associated page
   *  if user is logged in else the error page
   */
  @SetMetadata('session_data', { key: 'previous_step', value: 'login' })
  @UseGuards(AuthGuard, SessionValueGuard)
  @Get('login/authenticator')
  async loginAuthenticatorPage(@Res() res, @Session() session: secureSession.Session) {
    // get user in session
    const user: UserEntity = this._securityService.getLoggedInUserSync(session);

    // check if user has skipped this step before displaying this page
    if (!!user.skip_authenticator_registration) { // TODO USE MIDDLEWARE
      await res.status(302).redirect('end');
    } else {
      await res
        .view('login_authenticator', Object.assign({}, this._appService.getMetadata('login_authenticator'), { dynamicTitleValue: user.display_name }));
    }
  }

  /**
   * Handler to answer to GET /webauthn/authenticator route and display the associated page
   *  if user is logged in else the error page
   */
  @SetMetadata('session_data', { key: 'previous_step', value: 'login_authenticator' })
  @UseGuards(AuthGuard, SessionValueGuard)
  @Get('webauthn/authenticator')
  async webauthnAuthenticatorPage(@Res() res, @Session() session: secureSession.Session) {
    // get user in session
    const user: UserEntity = this._securityService.getLoggedInUserSync(session);

    // check if user has skipped this step before displaying this page
    if (!!user.skip_authenticator_registration) { // TODO USE MIDDLEWARE
      await res.status(302).redirect('end');
    } else {
      await res
        .view('webauthn_authenticator', this._appService.getMetadata('webauthn_authenticator'));
    }
  }

  /**
   * Handler to answer to GET /end route and display the associated page
   *  if user is logged in else the error page
   */
  @UseGuards(AuthGuard)
  @Get('end')
  async endPage(@Res() res, @Session() session: secureSession.Session) {
    await res
      .view('end', Object.assign({}, this._appService.getMetadata('end'), { dynamicTitleValue: this._securityService.getSessionData(session, 'user').display_name }));
  }

  /**
   * Handle not found pages
   */
  @Get('*')
  NotFoundPage() {
    throw new NotFoundException('The requested page does not exist');
  }
}
