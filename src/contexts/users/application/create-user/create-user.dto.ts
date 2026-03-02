export interface CreateUserDto {
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  birthday: Date | null;
  authId: string;
}
