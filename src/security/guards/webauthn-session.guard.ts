import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { SecurityService } from '../security.service';
import { catchError, mergeMap } from 'rxjs/operators';
import * as secureSession from 'fastify-secure-session';

@Injectable()
export class WebAuthnSessionGuard implements CanActivate {
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
  canActivate(context: ExecutionContext): Observable<boolean> {
    return of(context.switchToHttp().getRequest().session).pipe(
      mergeMap((session: secureSession.Session) =>
        this._securityService.checkWebAuthnSessionData(
          session,
          this._reflector.get<'webauthn_attestation' | 'webauthn_assertion'>(
            'webauthn_session',
            context.getHandler(),
          ),
        ),
      ),
      catchError((err) => {
        this._logger.error(
          err.getResponse().message,
          JSON.stringify(err.getResponse()),
          'WebAuthnSessionGuard',
        );
        return throwError(() => err);
      }),
    );
  }
}
