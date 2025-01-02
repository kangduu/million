declare global {
  interface User {
    id: number;
    username: string;
    password: string;
    role: string;
  }

  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
