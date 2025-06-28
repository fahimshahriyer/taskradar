import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('api')
export class ProtectedController {
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedData(@Request() req) {
    return {
      message: 'This is protected data from NestJS API',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('user-profile')
  getUserProfile(@Request() req) {
    return {
      message: 'User profile data',
      user: {
        id: req.user.userId,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
      },
      timestamp: new Date().toISOString(),
    };
  }
  @Get('public')
  getPublicData() {
    return {
      message: 'This is public data from NestJS API',
      timestamp: new Date().toISOString(),
    };
  }
}
