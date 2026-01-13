import { randomUUID as v4 } from 'crypto';
import { PrimitivesUser, User } from 'src/contexts/users/domain/user';

describe('User Aggregate', () => {
  const validUserParams = {
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe123',
    birthday: new Date('1990-01-01'),
    authId: v4(),
  };

  describe('create()', () => {
    it('should create a new user instance with valid data', () => {
      const user = User.create(validUserParams);
      const primitives = user.toPrimitives();

      expect(primitives.id).toBeDefined();
      expect(primitives.firstname).toBe(validUserParams.firstname);
      expect(primitives.tasks).toEqual([]);
      expect(primitives.createdAt).toBeInstanceOf(Date);
    });

    it('should throw an error if username is too short (VO Validation)', () => {
      expect(() => {
        User.create({ ...validUserParams, username: 'j' });
      }).toThrow(/must be at least 2 characters long/);
    });

    it('should throw an error if birthday is in the future', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      expect(() => {
        User.create({ ...validUserParams, birthday: futureDate });
      }).toThrow();
    });
  });

  describe('fromPrimitives()', () => {
    it('should reconstitute a user from raw data', () => {
      const rawData: PrimitivesUser = {
        id: v4(),
        firstname: 'Jane',
        lastname: 'Smith',
        username: 'janesmith',
        birthday: new Date('1995-05-10'),
        tasks: [v4(), v4()],
        authId: v4(),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const user = User.fromPrimitives(rawData);
      expect(user.toPrimitives()).toEqual(rawData);
    });
  });
});
