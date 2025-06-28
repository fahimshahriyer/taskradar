import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { auth } from './auth.config';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.substring(7);
    try {
      const headers = new Headers();
      headers.set('authorization', `Bearer ${token}`);
      if (request.headers.cookie) {
        headers.set('cookie', request.headers.cookie);
      }

      const session = await auth.api.getSession({
        headers: headers,
      });
      if (!session) {
        throw new UnauthorizedException('Invalid session');
      }
      request.user = {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        session: session,
      };
      return true;
    } catch (error) {
      console.error('Auth error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
