import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { SecurityService } from '../security.service';
import { Reflector } from '@nestjs/core';
import { mergeMap } from 'rxjs/operators';
import { SessionData } from '../interfaces/session-data.interface';
import * as secureSession from 'fastify-secure-session';

@Injectable()
export class SessionValueGuard implements CanActivate {
  /**
   * Class constructor
   *
   * @param {Reflector} _reflector dependency injection of Reflector instance
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   */
  constructor(private readonly _reflector: Reflector, private readonly _securityService: SecurityService) {
  }

  /**
   * Guard method to check if the value stored in the secure session is the one to display the page
   *
   * @param {ExecutionContext} context current execution context
   *
   * @return {Observable<boolean>} flag to know if we can access to the resource
   */
  canActivate(context: ExecutionContext): Observable<boolean> {
    return of(context.switchToHttp().getRequest().session)
      .pipe(
        mergeMap((session: secureSession.Session) => this._securityService.checkSessionData(session, this._reflector.get<SessionData>('session_data', context.getHandler()))),
      );
  }
}
