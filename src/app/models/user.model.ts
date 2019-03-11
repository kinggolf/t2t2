export interface UserModel {
  token: string;
  user: {
    name: string;
    email: string;
    role: string;
    scope?: string;
  };
}
