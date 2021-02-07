import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, Session, UseInterceptors } from '@nestjs/common';
import { NoContentInterceptor } from './interceptors/no-content.interceptor';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiPreconditionFailedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ApiService } from './api.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { Observable } from 'rxjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as secureSession from 'fastify-secure-session';
import { tap } from 'rxjs/operators';

@ApiTags('api')
@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(NoContentInterceptor)
export class ApiController {
  /**
   * Class constructor
   *
   * @param {ApiService} _apiService dependency injection of ApiService instance
   */
  constructor(private readonly _apiService: ApiService) {
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
        tap((user: UserEntity) => session.set('user', user)),
        tap(() => session.set('from_login', true)),
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
}
