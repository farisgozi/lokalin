export type UserRole = "user" | "owner" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: Exclude<UserRole, "admin">;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}
