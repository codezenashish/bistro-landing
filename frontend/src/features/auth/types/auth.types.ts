export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "customer";
  avatar: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
