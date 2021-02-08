import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AppService } from '../app.service';

@Catch(UnauthorizedException, NotFoundException, ForbiddenException)
export class ViewErrorPageFilter implements ExceptionFilter {
  /**
   * Class constructor
   *
   * @param {AppService} _appService dependency injection of AppService instance
   */
  constructor(private readonly _appService: AppService) {
  }

  /**
   * Catch error and display error page
   *
   * @param exception
   * @param host
   */
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();

    // display error page
    response.status(status).view('error', this._appService.getMetadata('error'));
  }
}
