import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { SecurityService } from '../security.service';
import { catchError, mergeMap } from 'rxjs/operators';
import * as secureSession from 'fastify-secure-session';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Class constructor
   *
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   * @param {Logger} _logger dependency injection of Logger instance
   */
  constructor(
    private readonly _securityService: SecurityService,
    private readonly _logger: Logger,
  ) {}

  /**
   * Guard method to check if user is stored in the secure session
   *
   * @param {ExecutionContext} context current execution context
   *
   * @return {Observable<boolean>} flag to know if we can access to the resource
   */
  canActivate(context: ExecutionContext): Observable<boolean> {
    return of(context.switchToHttp().getRequest().session).pipe(
      mergeMap((session: secureSession.Session) =>
        this._securityService.checkIfUserIsLoggedIn(session),
      ),
      catchError((err) => {
        this._logger.error(
          err.getResponse().message,
          JSON.stringify(err.getResponse()),
          'AuthGuard',
        );
        return throwError(() => err);
      }),
    );
  }
}
