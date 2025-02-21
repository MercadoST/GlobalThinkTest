import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
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
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResourceOwnerGuard } from '../auth/guards/resource-owner.guard';

@ApiTags('Perfiles')
@Controller('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiSecurity('JWT-auth')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({
    summary: 'Crear nuevo perfil',
    description:
      'Usuarios ADMIN pueden crear cualquier perfil, USER solo puede crear su propio perfil',
  })
  @ApiBody({
    type: CreateProfileDto,
    examples: {
      ejemplo1: {
        value: {
          profileName: 'Perfil Profesional',
          code: 'PROF003',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Perfil creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener todos los perfiles',
    description: 'Solo usuarios con rol ADMIN pueden listar todos los perfiles',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filtrar por nombre o código',
  })
  @ApiResponse({ status: 200, description: 'Lista de perfiles' })
  @ApiResponse({
    status: 403,
    description: 'No autorizado - Requiere rol ADMIN',
  })
  findAll(@Query('filter') filter?: string) {
    return this.profileService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(ResourceOwnerGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({
    summary: 'Obtener perfil por ID',
    description:
      'ADMIN puede ver cualquier perfil, USER solo puede ver su propio perfil',
  })
  @ApiParam({ name: 'id', description: 'ID del perfil' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ResourceOwnerGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({
    summary: 'Actualizar perfil',
    description:
      'ADMIN puede actualizar cualquier perfil, USER solo puede actualizar su propio perfil',
  })
  @ApiParam({ name: 'id', description: 'ID del perfil' })
  @ApiBody({
    type: UpdateProfileDto,
    examples: {
      ejemplo1: {
        value: {
          profileName: 'Perfil Actualizado',
          code: 'PROF004',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Perfil actualizado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(id, updateProfileDto);
  }
}
