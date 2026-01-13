import { InvalidUuidError } from 'src/shared/contexts/exceptions/invalid-uuid.error';
import { randomUUID as v4 } from 'crypto';
import { UserTasks } from 'src/contexts/users/domain/value-objects/user-tasks.vo';

describe('UserTasks Value Object', () => {
  const validUuid1 = v4();
  const validUuid2 = v4();

  it('should create a valid UserTasks instance with an array of UUIDs', () => {
    const tasks = [validUuid1, validUuid2];
    const vo = new UserTasks(tasks);

    expect(vo.getValue()).toEqual(tasks);
    expect(vo.count()).toBe(2);
  });

  it('should create an empty UserTasks instance', () => {
    const vo = new UserTasks([]);
    expect(vo.count()).toBe(0);
    expect(vo.getValue()).toEqual([]);
  });

  it('should throw InvalidUuidError if any string in the array is not a valid UUID v4', () => {
    const invalidTasks = [validUuid1, 'not-a-uuid'];

    expect(() => new UserTasks(invalidTasks)).toThrow(InvalidUuidError);
  });

  it('should throw an error if the input is not an array', () => {
    // @ts-expect-error - Testing runtime check for non-array input
    expect(() => new UserTasks('not-an-array')).toThrow(
      'Tasks must be an array of strings',
    );
  });

  describe('Utility methods', () => {
    it('should return true if it contains a specific taskId', () => {
      const vo = new UserTasks([validUuid1]);
      expect(vo.hasTask(validUuid1)).toBe(true);
      expect(vo.hasTask(validUuid2)).toBe(false);
    });

    it('should maintain immutability (getValue returns a copy)', () => {
      const tasks = [validUuid1];
      const vo = new UserTasks(tasks);
      const retrievedTasks = vo.getValue();

      retrievedTasks.push(validUuid2);

      expect(vo.count()).toBe(1);
      expect(vo.getValue()).not.toContain(validUuid2);
    });

    it('should maintain immutability (internal value is a copy of input)', () => {
      const tasks = [validUuid1];
      const vo = new UserTasks(tasks);

      tasks.push(validUuid2);

      expect(vo.count()).toBe(1);
      expect(vo.getValue()).not.toContain(validUuid2);
    });
  });
});
