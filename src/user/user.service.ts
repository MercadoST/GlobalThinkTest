import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileService } from 'src/profile/profile.service';
import { hash } from 'bcrypt';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map();

  constructor(private readonly profileService: ProfileService) {
    // Inicializar usuario admin
    void this.initializeAdmin();
  }

  private async initializeAdmin() {
    const adminProfile = this.profileService.create({
      profileName: 'Admin Profile',
      code: 'ADMIN001',
    });

    const hashedPassword = await hash('admin123', 10);

    const adminUser = new User({
      email: 'admin@example.com',
      name: 'Administrator',
      age: 30,
      password: hashedPassword,
      role: UserRole.ADMIN,
      profile: adminProfile,
    });

    this.users.set(adminUser.id, adminUser);
  }

  private excludePassword(user: User): UserWithoutPassword {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const existingUser = Array.from(this.users.values()).find(
      (user) => user.email === createUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    try {
      const hashedPassword = await hash(createUserDto.password, 10);
      const { profile: profileDto, ...userData } = createUserDto;

      const newProfile = this.profileService.create(profileDto);

      const user = new User({
        ...userData,
        password: hashedPassword,
        profile: newProfile,
      });

      this.users.set(user.id, user);
      return this.excludePassword(user);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  findAll(filter?: string): UserWithoutPassword[] {
    const users = Array.from(this.users.values());
    const filteredUsers = filter
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(filter.toLowerCase()) ||
            user.email.toLowerCase().includes(filter.toLowerCase()),
        )
      : users;
    return filteredUsers.map((user) => this.excludePassword(user));
  }

  findOne(id: string): UserWithoutPassword {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): UserWithoutPassword {
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
      return this.excludePassword(updatedUser);
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
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
}
