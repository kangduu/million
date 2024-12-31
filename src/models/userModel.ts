interface User {
  id: number;
  name: string;
  email: string;
}

class UserModel {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }
}

export default new UserModel();
