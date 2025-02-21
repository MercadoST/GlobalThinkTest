import { v4 as uuidv4 } from 'uuid';

export class Profile {
  id: string;
  code: string;
  profileName: string;
  userId?: string;

  constructor(partial: Partial<Profile>) {
    Object.assign(this, partial);
    this.id = uuidv4();
  }
}
