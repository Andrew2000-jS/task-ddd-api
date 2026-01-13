export interface CreateTaskDto {
  title: string;
  slug: string;
  description: string | null;
  isCompleted: boolean;
  userId: string;
}
