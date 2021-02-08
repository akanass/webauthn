import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpInterceptor } from './interceptors/http.interceptor';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiPreconditionFailedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ApiService } from './api.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as secureSession from 'fastify-secure-session';
import { tap } from 'rxjs/operators';
import { SecurityService } from '../security/security.service';
import { KeySessionDataDto } from '../security/dto/key-session-data.dto';
import { AuthGuard } from '../security/guards/auth.guard';
import { SessionDataDto } from '../security/dto/session-data.dto';
import { UserIdParams } from './validators/user-id.params';
import { PatchUserDto } from '../user/dto/patch-user.dto';
import { OwnerGuard } from '../security/guards/owner.guard';

@ApiTags('api')
@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class ApiController {
  /**
   * Class constructor
   *
   * @param {ApiService} _apiService dependency injection of ApiService instance
   * @param {SecurityService} _securityService dependency injection of SecurityService instance
   */
  constructor(private readonly _apiService: ApiService, private readonly _securityService: SecurityService) {
  }

  /**
   * Handler to answer to POST /api/login route
   *
   * @param {LoginUserDto} loginUser payload to log in the user
   * @param {secureSession.Session} session secure data for the current session
   *
   * @return Observable<UserEntity>
   */
  @ApiOkResponse({ description: 'Returns the successful login data', type: UserEntity })
  @ApiBadRequestResponse({ description: 'The payload provided to log in the user isn\'t good' })
  @ApiUnprocessableEntityResponse({ description: 'The request can\'t be performed in the database' })
  @ApiUnauthorizedResponse({ description: 'Username and Password don\'t match' })
  @ApiPreconditionFailedResponse({ description: 'An error occurred during login process' })
  @ApiBody({ description: 'Payload to log in an user', type: LoginUserDto })
  @HttpCode(200)
  @Post('login')
  login(@Body() loginUser: LoginUserDto, @Session() session: secureSession.Session): Observable<UserEntity> {
    return this._apiService.login(loginUser)
      .pipe(
        tap((user: UserEntity) => this._securityService.setSessionData(session, 'user', user)),
        tap((user: UserEntity) => !user.skip_authenticator_registration ? this._securityService.setSessionData(session, 'previous_step', 'login') : null),
      );
  }

  /**
   * Handler to answer to POST /api/users route
   *
   * @param {CreateUserDto} user payload to create the new user
   *
   * @return Observable<UserEntity>
   */
  @ApiCreatedResponse({ description: 'The user has been successfully created', type: UserEntity })
  @ApiConflictResponse({ description: 'The username already exists in the database' })
  @ApiBadRequestResponse({ description: 'The payload provided to create the user isn\'t good' })
  @ApiUnprocessableEntityResponse({ description: 'The request can\'t be performed in the database' })
  @ApiBody({ description: 'Payload to create a new user', type: CreateUserDto })
  @Post('users')
  createUser(@Body() user: CreateUserDto): Observable<UserEntity> {
    return this._apiService.createUser(user);
  }

  /**
   * Handler to answer to GET /api/logged-in route
   *
   * @param {secureSession.Session} session secure data for the current session
   *
   * @return Observable<UserEntity>
   */
  @ApiOkResponse({ description: 'Returns the user store in the secure session', type: UserEntity })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('logged-in')
  loggedIn(@Session() session: secureSession.Session): Observable<UserEntity> {
    return this._securityService.getLoggedInUser(session);
  }

  /**
   * Handler to answer to POST /api/users/:id route
   *
   * @param {UserIdParams} params list of route params to take user id
   * @param {PatchUserDto} user payload to patch the user
   * @param {secureSession.Session} session secure data for the current session
   *
   * @return Observable<UserEntity>
   */
  @ApiOkResponse({ description: 'The user has been successfully patched', type: UserEntity })
  @ApiConflictResponse({ description: 'The username already exists in the database' })
  @ApiBadRequestResponse({ description: 'The payload provided to patch the user isn\'t good' })
  @ApiUnprocessableEntityResponse({ description: 'The request can\'t be performed in the database' })
  @ApiPreconditionFailedResponse({ description: 'An error occurred during patch process' })
  @ApiForbiddenResponse({ description: 'User is not the owner of the resource' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBody({ description: 'Payload to patch an user', type: PatchUserDto })
  @ApiCookieAuth()
  @UseGuards(AuthGuard, OwnerGuard)
  @Patch('users/:id')
  patchUser(@Param() params: UserIdParams, @Body() user: PatchUserDto, @Session() session: secureSession.Session): Observable<UserEntity> {
    return this._apiService.patchUser(params.id, user)
      .pipe(
        tap((user: UserEntity) => this._securityService.setSessionData(session, 'user', user)),
      );
  }

  /**
   * Handler to answer to GET /api/clear-session-data route
   *
   * @param {KeySessionDataDto} keySessionData payload to clear a session value
   * @param {secureSession.Session} session secure data for the current session
   *
   * @return Observable<void>
   */
  @ApiNoContentResponse({ description: 'The value in session has been successfully deleted' })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  @ApiBody({ description: 'Payload to clear a session value', type: KeySessionDataDto })
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch('clear-session-data')
  clearSessionData(@Body() keySessionData: KeySessionDataDto, @Session() session: secureSession.Session): Observable<void> {
    return of(this._securityService.clearSessionData(session, keySessionData.key));
  }

  /**
   * Handler to answer to GET /api/set-session-data route
   *
   * @param {SessionDataDto} sessionData payload to set a session value
   * @param {secureSession.Session} session secure data for the current session
   *
   * @return Observable<void>
   */
  @ApiNoContentResponse({ description: 'The value in session has been successfully deleted' })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  @ApiBody({ description: 'Payload to set a session value', type: SessionDataDto })
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch('set-session-data')
  setSessionData(@Body() sessionData: SessionDataDto, @Session() session: secureSession.Session): Observable<void> {
    return of(this._securityService.setSessionData(session, sessionData.key, sessionData.value));
  }
}
