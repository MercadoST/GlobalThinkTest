import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map();

  constructor(private readonly profileService: ProfileService) {}

  create(createUserDto: CreateUserDto): User {
    // Validar que el email no exista
    const existingUser = Array.from(this.users.values()).find(
      (user) => user.email === createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const { profile, ...userData } = createUserDto;

    if (!profile) {
      throw new BadRequestException('Profile is required');
    }

    try {
      const newProfile = this.profileService.create(profile);
      const user = new User({
        ...userData,
        profile: newProfile,
      });

      this.users.set(user.id, user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating user or profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  findAll(filter?: string): User[] {
    const allUsers = Array.from(this.users.values());

    if (!filter) {
      return allUsers;
    }

    const filterLower = filter.toLowerCase();
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(filterLower) ||
        user.email.toLowerCase().includes(filterLower) ||
        user.profile?.profileName.toLowerCase().includes(filterLower),
    );
  }

  findOne(id: string): User {
    const user = this.users.get(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  update(id: string, updateUserDto: Partial<CreateUserDto>): User {
    const user = this.findOne(id);
    const { profile: profileDto, email, ...restUpdateDto } = updateUserDto;

    // Validar email único si se está actualizando
    if (email) {
      const existingUser = Array.from(this.users.values()).find(
        (u) => u.email === email && u.id !== id,
      );
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    try {
      const updatedUser = new User({
        ...user,
        ...restUpdateDto,
        email: email || user.email,
        profile: profileDto
          ? this.profileService.create(profileDto)
          : user.profile,
      });

      this.users.set(id, updatedUser);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  delete(id: string): void {
    const exists = this.users.delete(id);
    if (!exists) {
      throw new NotFoundException('User not found');
    }
  }

  findByEmail(email: string): User | undefined {
    const user = Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
    return user;
  }
}
