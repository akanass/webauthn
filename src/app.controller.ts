import {
  Controller,
  Get,
  NotFoundException,
  Req,
  Res,
  Session,
  SetMetadata,
  UnauthorizedException,
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
  constructor(
    private readonly _appService: AppService,
    private readonly _securityService: SecurityService,
  ) {}

  /**
   * Handler to answer to GET / route and redirect to login page
   */
  @Get()
  async homePage(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Session() session: secureSession.Session,
  ) {
    await this.checkIfUserIsAlreadyAuthenticatedThenRedirectOrDisplayPage(
      res,
      session,
      () =>
        res
          .status(302)
          .redirect(`login${this._appService.buildQueryString(req.query)}`),
    );
  }

  /**
   * Handler to answer to GET /login route and display the associated page
   */
  @Get('login')
  async loginPage(@Res() res, @Session() session: secureSession.Session) {
    await this.checkIfUserIsAlreadyAuthenticatedThenRedirectOrDisplayPage(
      res,
      session,
      () => res.view('login', this._appService.getMetadata('login')),
    );
  }

  /**
   * Handler to answer to GET /webauthn route and display the associated page
   */
  @Get('webauthn')
  async webAuthnPage(@Res() res, @Session() session: secureSession.Session) {
    await this.checkIfUserIsAlreadyAuthenticatedThenRedirectOrDisplayPage(
      res,
      session,
      () => res.view('webauthn', this._appService.getMetadata('webauthn')),
    );
  }

  /**
   * Function to check if user is already authenticated and redirect him or display page
   */
  async checkIfUserIsAlreadyAuthenticatedThenRedirectOrDisplayPage(
    res: any,
    session: secureSession.Session,
    cb: () => void,
  ) {
    // get authentication type
    const auth_type = this._securityService.getSessionData(
      session,
      'auth_type',
    );

    // get user
    const user = this._securityService.getSessionData(session, 'user');

    // check if we are already logged in
    if (!!user) {
      // indicate we are going from login or webauthn page regarding authentication type
      this._securityService.setSessionData(session, 'previous_step', auth_type);

      // check type of authentication and if user skipped authenticator registration page
      if (auth_type === 'login' && !user.skip_authenticator_registration) {
        // redirect to login/authenticator page
        await res.status(302).redirect('login/authenticator');
      } else {
        await res.status(302).redirect('end');
      }
    } else {
      await cb();
    }
  }

  /**
   * Handler to answer to GET /login/authenticator route and display the associated page
   *  if user is logged in else the error page
   */
  @SetMetadata('session_data', { key: 'previous_step', value: 'login' })
  @UseGuards(AuthGuard, SessionValueGuard)
  @Get('login/authenticator')
  async loginAuthenticatorPage(
    @Res() res,
    @Session() session: secureSession.Session,
  ) {
    // get user in session
    const user: UserEntity = this._securityService.getLoggedInUserSync(session);

    // check if user has skipped this step before displaying this page
    if (!!user.skip_authenticator_registration) {
      await res.status(302).redirect('end');
    } else {
      await res.view(
        'login_authenticator',
        Object.assign({}, this._appService.getMetadata('login_authenticator'), {
          dynamicTitleValue: user.display_name,
        }),
      );
    }
  }

  /**
   * Handler to answer to GET /webauthn/authenticator route and display the associated page
   *  if user is logged in else the error page
   */
  @SetMetadata('session_data', {
    key: 'previous_step',
    value: ['login_authenticator', 'end'],
  })
  @UseGuards(AuthGuard, SessionValueGuard)
  @Get('webauthn/authenticator')
  async webauthnAuthenticatorPage(@Res() res) {
    await res.view(
      'webauthn_authenticator',
      this._appService.getMetadata('webauthn_authenticator'),
    );
  }

  /**
   * Handler to answer to GET /end route and display the associated page
   *  if user is logged in else the error page
   */
  @SetMetadata('session_data', {
    key: 'previous_step',
    value: ['login', 'webauthn'],
  })
  @UseGuards(AuthGuard, SessionValueGuard)
  @Get('end')
  async endPage(@Res() res, @Session() session: secureSession.Session) {
    // get authentication type
    const auth_type = this._securityService.getSessionData(
      session,
      'auth_type',
    );

    // get user
    const user = this._securityService.getSessionData(session, 'user');

    // display page
    await res.view(
      'end',
      Object.assign({}, this._appService.getMetadata('end'), {
        dynamicTitleValue: user.display_name,
        webauthn_login: auth_type === 'webauthn',
      }),
    );
  }

  /**
   * Handle error page
   */
  @Get('error')
  errorPage() {
    throw new UnauthorizedException('User is not logged in');
  }

  /**
   * Handle not found pages
   */
  @Get('*')
  notFoundPage() {
    throw new NotFoundException('The requested page does not exist');
  }
}
