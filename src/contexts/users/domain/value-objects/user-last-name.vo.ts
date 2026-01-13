import { UserName } from './username.vo';

export class UserLastName extends UserName {
  constructor(value: string) {
    UserLastName.validate(value, 'User last name');
    super(value);
  }
}
