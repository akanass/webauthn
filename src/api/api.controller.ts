import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NoContentInterceptor } from './interceptors/no-content.interceptor';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
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
import { ClearSessionDataDto } from '../security/dto/clear-session-data.dto';
import { AuthGuard } from '../security/guards/auth.guard';

@ApiTags('api')
@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(NoContentInterceptor)
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
        tap(() => this._securityService.setSessionData(session, 'from_login', true)),
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
   * Handler to answer to GET /api/logged-in route
   *
   * @param {ClearSessionDataDto} clearSessionData payload to clear a session value
   * @param {secureSession.Session} session secure data for the current session
   *
   * @return Observable<void>
   */
  @ApiNoContentResponse({ description: 'The value in session has been successfully deleted' })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnauthorizedResponse({ description: 'User is not logged in' })
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Delete('clear-session-data')
  clearSessionData(@Body() clearSessionData: ClearSessionDataDto, @Session() session: secureSession.Session): Observable<void> {
    return of(this._securityService.clearSessionData(session, clearSessionData.key));
  }
}
