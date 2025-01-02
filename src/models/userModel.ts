/// <reference types="../types/index.d.ts" />

class UserModel {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find((user) => user.username === username) || null;
  }
}

export default new UserModel();
