export interface UpdateTaskDto {
  title?: string;
  slug?: string;
  description?: string | null;
  isCompleted?: boolean;
}
