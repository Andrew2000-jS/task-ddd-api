export interface CreateAuth {
  authID: string;
  rawPassword: string;
  userEmail: string;
}

export interface CreateUser {
  userID: string;
  username: string;
  authId: string;
}

export interface CreateTask {
  taskID: string;
  title: string;
  slug: string;
  description?: string;
  isCompleted?: boolean;
  userId: string;
}
