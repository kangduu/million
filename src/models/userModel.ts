class UserModel {
  private users: Account.UserBase[] = [
    { id: 1, username: "admin", role: "admin" },
    { id: 2, username: "test", role: "user" },
    { id: 3, username: "user", role: "user" },
  ];

  async findAll(): Promise<Account.UserBase[]> {
    return this.users;
  }

  async findByUsername(username: string): Promise<Account.UserBase | null> {
    return this.users.find((user) => user.username === username) || null;
  }
}

export default new UserModel();
