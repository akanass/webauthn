import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {
  }

  @Get()
  async homePage(@Req() req, @Res() res) {
    await res
      .status(302)
      .redirect(`login${this._appService.buildQueryString(req.query)}`);
  }

  @Get('login')
  async loginPage(@Res() res) {
    await res
      .view('login', this._appService.getMetadata('login'));
  }
}
