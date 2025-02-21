import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      ejemplo1: {
        value: {
          email: 'usuario@ejemplo.com',
          password: 'Contraseña123!',
          name: 'Juan Pérez',
          age: 30,
          profile: {
            profileName: 'Perfil Principal',
            code: 'PROF001',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  register(@Body() registerDto: RegisterDto) {
    return this.userService.create(registerDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({
    type: LoginDto,
    examples: {
      ejemploUsuario: {
        value: {
          email: 'usuario@ejemplo.com',
          password: 'Contraseña123!',
        },
      },
      ejemploAdmin: {
        value: {
          email: 'admin@example.com',
          password: 'admin123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'usuario@ejemplo.com',
          role: 'user',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
