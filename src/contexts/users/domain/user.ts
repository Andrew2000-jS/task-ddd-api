import { randomUUID as v4 } from 'crypto';
import { UserFirstName } from './value-objects/user-first-name.vo';
import { UserLastName } from './value-objects/user-last-name.vo';
import { UserName } from './value-objects/username.vo';
import { UserBirthday } from './value-objects/user-birthday.vo';
import { UserTasks } from './value-objects/user-tasks.vo';
import { AuthId } from './value-objects/auth-id.vo';
import { CreatedAt } from 'src/shared/contexts/domain/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/contexts/domain/value-objects/updated-at.vo';
import { UserId } from './value-objects/user-id.vo';

export interface PrimitivesUser {
  id: string;
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  birthday: Date | null;
  tasks: string[];
  authId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(
    private readonly id: UserId,
    private readonly firstname: UserFirstName | null,
    private readonly lastname: UserLastName | null,
    private readonly username: UserName | null,
    private readonly birthday: UserBirthday | null,
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
      data.firstname ? new UserFirstName(data.firstname) : null,
      data.lastname ? new UserLastName(data.lastname) : null,
      data.username ? new UserName(data.username) : null,
      data.birthday ? new UserBirthday(data.birthday) : null,
      new UserTasks([]),
      new AuthId(data.authId),
      new CreatedAt(now),
      new UpdatedAt(now),
    );
  }

  static fromPrimitives(data: PrimitivesUser): User {
    return new User(
      new UserId(data.id),
      data.firstname ? new UserFirstName(data.firstname) : null,
      data.lastname ? new UserLastName(data.lastname) : null,
      data.username ? new UserName(data.username) : null,
      data.birthday ? new UserBirthday(data.birthday) : null,
      new UserTasks(data.tasks),
      new AuthId(data.authId),
      new CreatedAt(data.createdAt),
      new UpdatedAt(data.updatedAt),
    );
  }

  toPrimitives(): PrimitivesUser {
    return {
      id: this.id.getValue(),
      firstname: this.firstname?.getValue() || null,
      lastname: this.lastname?.getValue() || null,
      username: this.username?.getValue() || null,
      birthday: this.birthday?.getValue() || null,
      tasks: this.tasks.getValue(),
      authId: this.authId.getValue(),
      createdAt: this.createdAt.getValue(),
      updatedAt: this.updatedAt.getValue(),
    };
  }
}
