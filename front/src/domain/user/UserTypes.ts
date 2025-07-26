export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

export type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
  role: string;
};

export type UpdateUserPayload = {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
};
