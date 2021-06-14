import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { SecurityService } from '../security.service';
import { Reflector } from '@nestjs/core';
import { catchError, mergeMap } from 'rxjs/operators';
import { SessionData } from '../interfaces/session-data.interface';
import * as secureSession from 'fastify-secure-session';

@Injectable()
export class SessionValueGuard implements CanActivate {
  /**
   * Class constructor
   *
   * @param {Reflector} _reflector dependency injection of Reflector instance
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   * @param {Logger} _logger dependency injection of Logger instance
   */
  constructor(
    private readonly _reflector: Reflector,
    private readonly _securityService: SecurityService,
    private readonly _logger: Logger,
  ) {}

  /**
   * Guard method to check if the value stored in the secure session is the one to display the page
   *
   * @param {ExecutionContext} context current execution context
   *
   * @return {Observable<boolean>} flag to know if we can access to the resource
   */
  canActivate = (context: ExecutionContext): Observable<boolean> =>
    of(context.switchToHttp().getRequest().session).pipe(
      mergeMap((session: secureSession.Session) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this._securityService.checkSessionData(
          session,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this._reflector.get<SessionData>(
            'session_data',
            context.getHandler(),
          ),
        ),
      ),
      catchError((err) => {
        this._logger.error(
          err.getResponse().message,
          JSON.stringify(err.getResponse()),
          'SessionValueGuard',
        );
        return throwError(() => err);
      }),
    );
}
