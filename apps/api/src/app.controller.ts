import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('public')
  getPublic() {
    return { message: 'This is a public endpoint.' };
  }
}
