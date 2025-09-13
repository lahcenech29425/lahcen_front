export interface UserRegisterType {
  username: string;
  email: string;
  password: string;
}

export interface UserType {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  token?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AuthResponseType {
  jwt: string;
  user: UserType;
}