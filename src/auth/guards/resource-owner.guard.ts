import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, User } from 'src/user/entities/user.entity';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const resourceId = request.params.id;

    // Los ADMIN pueden acceder a cualquier recurso
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Los usuarios normales solo pueden acceder a sus propios recursos
    if (user.id === resourceId || user.profile?.id === resourceId) {
      return true;
    }

    throw new ForbiddenException(
      'No tienes permiso para acceder a este recurso',
    );
  }
}
