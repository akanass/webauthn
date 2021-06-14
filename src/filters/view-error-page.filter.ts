import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AppService } from '../app.service';
import { SecurityService } from '../security/security.service';

@Catch(
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
)
export class ViewErrorPageFilter implements ExceptionFilter {
  /**
   * Class constructor
   *
   * @param {AppService} _appService dependency injection of AppService instance
   * @param {Logger} _logger dependency injection of Logger instance
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   */
  constructor(
    private readonly _appService: AppService,
    private readonly _logger: Logger,
    private readonly _securityService: SecurityService,
  ) {}

  /**
   * Catch error and display error page
   *
   * @param exception
   * @param host
   */
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<FastifyReply>();
    const request: FastifyRequest = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    // log error
    this._logger.error(
      exception.getResponse().message,
      JSON.stringify(exception.getResponse()),
      'ViewErrorPageFilter',
    );

    // delete session
    this._securityService.deleteSession(request.session);

    // display error page
    response
      .status(status)
      .view('error', this._appService.getMetadata('error'));
  }
}
