import { randomUUID as v4 } from 'crypto';
import { UserFirstName } from './value-objects/user-first-name.vo';
import { UserLastName } from './value-objects/user-last-name.vo';
import { UserName } from './value-objects/username.vo';
import { UserBirthday } from './value-objects/user-birthday.vo';
import { UserTasks } from './value-objects/user-tasks.vo';
import { AuthId } from './value-objects/auth-id.vo';
import { CreatedAt } from 'src/shared/contexts/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/contexts/value-objects/updated-at.vo';
import { UserId } from './value-objects/user-id.vo';

export interface PrimitivesUser {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  birthday: Date;
  tasks: string[];
  authId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(
    private readonly id: UserId,
    private readonly firstname: UserFirstName,
    private readonly lastname: UserLastName,
    private readonly username: UserName,
    private readonly birthday: UserBirthday,
    private readonly tasks: UserTasks,
    private readonly authId: AuthId,
    private readonly createdAt: CreatedAt,
    private readonly updatedAt: UpdatedAt,
  ) {}

  static create(
    data: Omit<PrimitivesUser, 'id' | 'tasks' | 'createdAt' | 'updatedAt'>,
  ): User {
    const now = new Date();
    return new User(
      new UserId(v4()),
      new UserFirstName(data.firstname),
      new UserLastName(data.lastname),
      new UserName(data.username),
      new UserBirthday(data.birthday),
      new UserTasks([]),
      new AuthId(data.authId),
      new CreatedAt(now),
      new UpdatedAt(now),
    );
  }

  static fromPrimitives(data: PrimitivesUser): User {
    return new User(
      new UserId(data.id),
      new UserFirstName(data.firstname),
      new UserLastName(data.lastname),
      new UserName(data.username),
      new UserBirthday(data.birthday),
      new UserTasks(data.tasks),
      new AuthId(data.authId),
      new CreatedAt(data.createdAt),
      new UpdatedAt(data.updatedAt),
    );
  }

  toPrimitives(): PrimitivesUser {
    return {
      id: this.id.getValue(),
      firstname: this.firstname.getValue(),
      lastname: this.lastname.getValue(),
      username: this.username.getValue(),
      birthday: this.birthday.getValue(),
      tasks: this.tasks.getValue(),
      authId: this.authId.getValue(),
      createdAt: this.createdAt.getValue(),
      updatedAt: this.updatedAt.getValue(),
    };
  }
}
