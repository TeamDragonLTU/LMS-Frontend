export interface IAuthContext {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

// User.ts
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  lastActive: string;
}

// Payload for creating a new user
export interface RegisterUserRequest {
  Password: string;
  Email: string;
  UserName: string;
  Role: string;
}
