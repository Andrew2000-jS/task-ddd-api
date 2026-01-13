import { UserName } from './username.vo';

export class UserFirstName extends UserName {
  constructor(value: string) {
    UserFirstName.validate(value, 'User first name');
    super(value);
  }
}
