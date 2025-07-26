export type Project = {
  id: number;
  name: string;
  owner?: {
    id: number;
    username: string;
    email: string;
    role: string;
    createdAt: string;
  };
  description: string;
  createdAt: string;
};

export type CreateProjectPayload = {
  name: string;
  description: string;
};

export type UpdateProjectPayload = {
  name?: string;
  description?: string;
  state?: string;
};
