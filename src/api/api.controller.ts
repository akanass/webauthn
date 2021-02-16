import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
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
import { CredentialEntity } from '../credential/entities/credential.entity';
import { FastifyRequest } from 'fastify';
import { CredentialsListEntity } from '../credential/entities/credentials-list.entity';
import { CredentialIdParams } from './validators/credential-id.params';
import { PatchCredentialDto } from '../credential/dto/patch-credential.dto';
import { AttestationStartDto } from '../webauthn/dto/attestation-start.dto';

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
        tap(() => this._securityService.setSessionData(session, 'previous_step', 'login')),
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
  @ApiBadRequestResponse({ description: 'The payload or the parameter provided to patch the user isn\'t good' })
  @ApiUnprocessableEntityResponse({ description: 'The request can\'t be performed in the database' })
  @ApiPreconditionFailedResponse({ description: 'An error occurred during patch process' })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
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
   * Handler to answer to GET /api/users/:id/credentials route
   *
   * @param {UserIdParams} params path parameters
   * @param {FastifyRequest} request current request object
   *
   * @return Observable<CredentialsListEntity>
   */
  @ApiOkResponse({ description: 'Returns an array of credentials', type: CredentialsListEntity })
  @ApiBadRequestResponse({ description: 'The parameter or the parameter provided to patch the credential isn\'t good' })
  @ApiNoContentResponse({ description: 'No credential exists in the database for this user' })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  @ApiForbiddenResponse({ description: 'User is not the owner of the resource' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuard, OwnerGuard)
  @Get('users/:id/credentials')
  findCredentialsListForUser(@Param() params: UserIdParams, @Req() request: FastifyRequest): Observable<CredentialsListEntity | void> {
    return this._apiService.findCredentialsListForUser(params.id, request.headers[ 'user-agent' ]);
  }

  /**
   * Handler to answer to PATCH /api/users/:id/credentials/:credId route
   *
   * @param {CredentialIdParams} params path parameters
   * @param {PatchCredentialDto} credential payload to patch the credential
   *
   * @return Observable<CredentialEntity>
   */
  @ApiOkResponse({ description: 'The credential has been successfully patched', type: CredentialEntity })
  @ApiBadRequestResponse({ description: 'The payload or the parameters provided to patch the credential isn\'t good' })
  @ApiUnprocessableEntityResponse({ description: 'The request can\'t be performed in the database' })
  @ApiPreconditionFailedResponse({ description: 'An error occurred during patch process' })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  @ApiForbiddenResponse({ description: 'User is not the owner of the resource' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiParam({
    name: 'credId',
    description: 'Unique identifier of the credential in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBody({ description: 'Payload to patch a credential', type: PatchCredentialDto })
  @ApiCookieAuth()
  @UseGuards(AuthGuard, OwnerGuard)
  @Patch('users/:id/credentials/:credId')
  patchCredential(@Param() params: CredentialIdParams, @Body() credential: PatchCredentialDto): Observable<CredentialEntity> {
    return this._apiService.patchCredential(params.credId, params.id, credential);
  }

  /**
   * Handler to answer to POST /api/users/:id/credentials/mock route
   *
   * @param {UserIdParams} params path parameters
   * @param {PatchCredentialDto} dto payload to create the credential mock
   * @param {FastifyRequest} request current request object
   *
   * @return Observable<CredentialEntity>
   */
  @ApiCreatedResponse({ description: 'The credential mock has been successfully created', type: CredentialEntity })
  @ApiConflictResponse({ description: 'The credential mock already exists in the database' })
  @ApiBadRequestResponse({ description: 'The payload or the parameter provided to create the credential mock isn\'t good' })
  @ApiUnprocessableEntityResponse({ description: 'The request can\'t be performed in the database' })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  @ApiForbiddenResponse({ description: 'User is not the owner of the resource' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBody({ description: 'Payload to create a credential mock', type: AttestationStartDto })
  @ApiCookieAuth()
  @UseGuards(AuthGuard, OwnerGuard)
  @Post('users/:id/credentials/mock')
  createCredentialMock(@Param() params: UserIdParams, @Body() dto: AttestationStartDto, @Req() request: FastifyRequest): Observable<CredentialEntity> {
    return this._apiService.createCredentialMock(params.id, dto, request.headers[ 'user-agent' ]);
  }

  /**
   * Handler to answer to DELETE /api/users/:id/credentials/:credId route
   *
   * @param {CredentialIdParams} params path parameters
   *
   * @return {Observable<void>}
   */
  @ApiNoContentResponse({ description: 'The credential has been successfully deleted' })
  @ApiBadRequestResponse({ description: 'The payload or the parameters provided to remove the credential isn\'t good' })
  @ApiUnprocessableEntityResponse({ description: 'The request can\'t be performed in the database' })
  @ApiPreconditionFailedResponse({ description: 'An error occurred during remove process' })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  @ApiForbiddenResponse({ description: 'User is not the owner of the resource' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiParam({
    name: 'credId',
    description: 'Unique identifier of the credential in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuard, OwnerGuard)
  @Delete('users/:id/credentials/:credId')
  removeCredential(@Param() params: CredentialIdParams): Observable<void> {
    return this._apiService.removeCredential(params.credId, params.id);
  }

  /**
   * Handler to answer to GET /api/clean-session-data route
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
  @Patch('clean-session-data')
  cleanSessionData(@Body() keySessionData: KeySessionDataDto, @Session() session: secureSession.Session): Observable<void> {
    return of(this._securityService.cleanSessionData(session, keySessionData.key));
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

  /**
   * Handler to answer to GET /api/delete-session route
   *
   * @param {secureSession.Session} session secure data for the current session
   *
   * @return Observable<void>
   */
  @ApiNoContentResponse({ description: 'The logout process has been successfully finished' })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Delete('delete-session')
  deleteSession(@Session() session: secureSession.Session): Observable<void> {
    return of(this._securityService.deleteSession(session));
  }
}
