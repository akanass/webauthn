import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { SecurityService } from '../security.service';
import { mergeMap } from 'rxjs/operators';
import * as secureSession from 'fastify-secure-session';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Class constructor
   *
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   */
  constructor(private readonly _securityService: SecurityService) {
  }

  /**
   * Guard method to check if user is stored in the secure session
   *
   * @param {ExecutionContext} context current execution context
   *
   * @return {Observable<boolean>} flag to know if we can access to the resource
   */
  canActivate(context: ExecutionContext): Observable<boolean> {
    return of(context.switchToHttp().getRequest().session)
      .pipe(
        mergeMap((session: secureSession.Session) => this._securityService.checkIfUserIsLoggedIn(session)),
      );
  }
}
