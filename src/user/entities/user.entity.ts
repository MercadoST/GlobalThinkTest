import { v4 as uuidv4 } from 'uuid';
import { Profile } from '../../profile/entities/profile.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class User {
  id: string;
  email: string;
  name: string;
  age: number;
  role: UserRole;
  profile?: Profile;
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    this.id = uuidv4();
    this.role = partial.role || UserRole.USER;
  }
}
