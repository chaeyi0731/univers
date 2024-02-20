export interface LoginContextType {
  login: (username: string, password: string) => Promise<void>;
}
