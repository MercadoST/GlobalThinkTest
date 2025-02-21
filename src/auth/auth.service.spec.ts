import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserRole } from '../user/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    name: 'Test User',
    age: 25,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('validateUser', () => {
    it('should validate user successfully', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );
      expect(result).toBeDefined();
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.access_token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockUser.email);
    });
  });
});
