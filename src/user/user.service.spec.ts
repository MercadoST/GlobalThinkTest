import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ProfileService } from '../profile/profile.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Profile } from '../profile/entities/profile.entity';

describe('UserService', () => {
  let service: UserService;

  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
    age: 25,
    password: 'password123',
    profile: {
      profileName: 'Test Profile',
      code: 'TEST001',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: ProfileService,
          useValue: {
            create: jest.fn().mockImplementation(
              (dto): Profile => ({
                id: 'profile-123',
                ...dto,
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user successfully', () => {
      const createUserDto: CreateUserDto = mockUser;
      const result = service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(mockUser.email);
      expect(result.profile).toBeDefined();
      expect(result.profile?.profileName).toBe(mockUser.profile.profileName);
    });

    it('should throw BadRequestException if email already exists', () => {
      const createUserDto: CreateUserDto = mockUser;
      service.create(createUserDto);

      expect(() => service.create(createUserDto)).toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all users', () => {
      service.create(mockUser);
      const result = service.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter users by name', () => {
      service.create(mockUser);
      const result = service.findAll('Test');

      expect(result).toBeInstanceOf(Array);
      expect(result[0].name).toContain('Test');
    });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      const created = service.create(mockUser);
      const result = service.findOne(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
    });

    it('should throw NotFoundException if user not found', () => {
      expect(() => service.findOne('nonexistent-id')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user successfully', () => {
      const created = service.create({
        ...mockUser,
        email: 'different@example.com',
      });
      const updateDto = { name: 'Updated Name' };
      const result = service.update(created.id, updateDto);

      expect(result.name).toBe(updateDto.name);
      expect(result.email).toBe(created.email);
    });

    it('should throw NotFoundException if user to update not found', () => {
      expect(() =>
        service.update('nonexistent-id', { name: 'New Name' }),
      ).toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', () => {
      const created = service.create(mockUser);
      service.delete(created.id);

      expect(() => service.findOne(created.id)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user to delete not found', () => {
      expect(() => service.delete('nonexistent-id')).toThrow(NotFoundException);
    });
  });
});
