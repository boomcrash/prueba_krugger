export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  refresh_token: string;
};

export type DecodedToken = {
  roles: string[];
  sub: string;
  exp: number;
  iat: number;
};
