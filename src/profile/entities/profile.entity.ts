export class Profile {
  id: string;
  code: string;
  profileName: string;
  userId?: string;

  constructor(partial: Partial<Profile>) {
    Object.assign(this, partial);
    this.id = crypto.randomUUID();
  }
}
