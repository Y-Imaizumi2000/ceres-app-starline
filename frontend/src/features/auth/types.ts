export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userId: string, displayName: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface User {
  userId: Long;
  username: string;
  displayName: string;
}

export type Long = number | bigint;
