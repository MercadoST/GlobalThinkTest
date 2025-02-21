import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  private profiles: Map<string, Profile> = new Map();

  create(createProfileDto: CreateProfileDto): Profile {
    const profile = new Profile(createProfileDto);
    this.profiles.set(profile.id, profile);
    return profile;
  }

  findAll(filter?: string): Profile[] {
    const allProfiles = Array.from(this.profiles.values());

    if (!filter) {
      return allProfiles;
    }

    const filterLower = filter.toLowerCase();
    return allProfiles.filter(
      (profile) =>
        profile.profileName.toLowerCase().includes(filterLower) ||
        profile.code.toLowerCase().includes(filterLower),
    );
  }

  findOne(id: string): Profile {
    const profile = this.profiles.get(id);
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  update(id: string, updateProfileDto: Partial<CreateProfileDto>): Profile {
    try {
      const profile = this.findOne(id);
      if (!profile) throw new NotFoundException('Profile not found');
      const updatedProfile = new Profile({
        ...profile,
        ...updateProfileDto,
      });

      this.profiles.set(id, updatedProfile);
      return updatedProfile;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  delete(id: string): void {
    const exists = this.profiles.delete(id);
    if (!exists) throw new NotFoundException('Profile not found');
  }
}
