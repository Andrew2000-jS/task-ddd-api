import {
  UserNameEmptyError,
  UserNameTooLongError,
  UserNameTooShortError,
} from 'src/contexts/users/domain/exceptions/user-username.error';
import { UserFirstName } from 'src/contexts/users/domain/value-objects/user-first-name.vo';
import { UserLastName } from 'src/contexts/users/domain/value-objects/user-last-name.vo';
import { UserName } from 'src/contexts/users/domain/value-objects/username.vo';

describe('User Name Value Objects', () => {
  describe('UserName (Base Logic)', () => {
    it('should create a valid UserName', () => {
      const name = 'johndoe';
      const vo = new UserName(name);
      expect(vo.getValue()).toBe(name);
    });

    it('should trim the value', () => {
      const vo = new UserName('  alice  ');
      expect(vo.getValue()).toBe('alice');
    });

    it('should throw UserNameEmptyError if empty after trim', () => {
      expect(() => new UserName('   ')).toThrow(UserNameEmptyError);
    });

    it('should throw UserNameTooShortError if less than 2 characters', () => {
      expect(() => new UserName('a')).toThrow(UserNameTooShortError);
    });

    it('should throw UserNameTooLongError if exceeds 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => new UserName(longName)).toThrow(UserNameTooLongError);
    });
  });

  describe('UserFirstName (Inheritance & Context)', () => {
    it('should create a valid UserFirstName', () => {
      const vo = new UserFirstName('Andres');
      expect(vo.getValue()).toBe('Andres');
    });

    it('should throw error with "User first name" context', () => {
      try {
        new UserFirstName('a');
      } catch (error) {
        expect(error).toBeInstanceOf(UserNameTooShortError);
        expect(error.message).toContain('User first name');
      }
    });
  });

  describe('UserLastName (Inheritance & Context)', () => {
    it('should create a valid UserLastName', () => {
      const vo = new UserLastName('Dev');
      expect(vo.getValue()).toBe('Dev');
    });

    it('should throw error with "User last name" context', () => {
      try {
        new UserLastName('');
      } catch (error) {
        expect(error).toBeInstanceOf(UserNameEmptyError);
        expect(error.message).toContain('User last name');
      }
    });
  });
});
