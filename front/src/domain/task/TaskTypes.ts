export type Task = {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  assignedToId: number | null;
  projectId: number | null;
  dueDate: string;
  createdAt: string;
};

export type CreateTaskPayload = {
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  assignedToId: number;
  projectId: number;
  dueDate: string;
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "DONE";
  assignedToId?: number;
  projectId?: number;
  dueDate?: string;
};
