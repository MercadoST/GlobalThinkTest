import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockProfile = {
    profileName: 'Test Profile',
    code: 'TEST001',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  describe('create', () => {
    it('should create a profile successfully', () => {
      const createProfileDto: CreateProfileDto = mockProfile;
      const result = service.create(createProfileDto);

      expect(result).toBeDefined();
      expect(result.profileName).toBe(mockProfile.profileName);
      expect(result.code).toBe(mockProfile.code);
      expect(result.id).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all profiles', () => {
      service.create(mockProfile);
      const result = service.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter profiles by name', () => {
      service.create(mockProfile);
      const result = service.findAll('Test');

      expect(result).toBeInstanceOf(Array);
      expect(result[0].profileName).toContain('Test');
    });
  });

  describe('findOne', () => {
    it('should return a profile by id', () => {
      const created = service.create(mockProfile);
      const result = service.findOne(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
    });

    it('should throw NotFoundException if profile not found', () => {
      expect(() => service.findOne('nonexistent-id')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a profile successfully', () => {
      const created = service.create(mockProfile);
      const updateDto = { profileName: 'Updated Profile' };

      const result = service.update(created.id, updateDto);

      expect(result.profileName).toBe(updateDto.profileName);
      expect(result.code).toBe(created.code);
    });

    it('should throw NotFoundException if profile to update not found', () => {
      expect(() =>
        service.update('nonexistent-id', { profileName: 'New Name' }),
      ).toThrow(NotFoundException);
    });
  });
});
