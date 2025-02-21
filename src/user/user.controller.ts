import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from './entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResourceOwnerGuard } from '../auth/guards/resource-owner.guard';

@ApiTags('Usuarios')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiSecurity('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Crear nuevo usuario',
    description: 'Solo usuarios con rol ADMIN pueden crear nuevos usuarios',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      ejemplo1: {
        value: {
          email: 'nuevo@ejemplo.com',
          name: 'Nuevo Usuario',
          age: 25,
          password: 'Contraseña123!',
          profile: {
            profileName: 'Perfil Nuevo',
            code: 'PROF002',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 403,
    description: 'No autorizado - Requiere rol ADMIN',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Solo usuarios con rol ADMIN pueden listar todos los usuarios',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filtrar por nombre o email',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({
    status: 403,
    description: 'No autorizado - Requiere rol ADMIN',
  })
  findAll(@Query('filter') filter?: string) {
    return this.userService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(ResourceOwnerGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description:
      'ADMIN puede ver cualquier usuario, USER solo puede ver su propio perfil',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ResourceOwnerGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({
    summary: 'Actualizar usuario',
    description:
      'ADMIN puede actualizar cualquier usuario, USER solo su propio perfil',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      ejemplo1: {
        value: {
          name: 'Nombre Actualizado',
          age: 31,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(ResourceOwnerGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Solo ADMIN puede eliminar usuarios',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({
    status: 403,
    description: 'No autorizado - Requiere rol ADMIN',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
}
