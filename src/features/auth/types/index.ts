export interface IAuthContext {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  role: "Student" | "Teacher" | null;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

// User.ts
export interface User {
  password: string;
  email: string;
  userName: string;
  role: string;
}

// Payload for creating a new user
export interface RegisterUserRequest {
  Password: string;
  Email: string;
  UserName: string;
  Role: string;
}
