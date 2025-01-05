declare namespace Account {
  type Role = "admin" | "user";

  interface UserBase {
    id: number;
    username: string;
    role: Role;
  }

  interface UserSecret extends UserBase {
    password: string;
  }
}
