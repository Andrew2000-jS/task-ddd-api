import { TaskId } from 'src/contexts/tasks/domain/value-objects/task-id.vo';
import { TaskUserId } from 'src/contexts/tasks/domain/value-objects/task-user-id.vo';
import { InvalidUuidError } from 'src/shared/contexts/domain/exceptions/invalid-uuid.error';

describe('ID Value Objects (TaskId & TaskUserId)', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';
  const invalidUuid = 'not-a-uuid';

  describe('TaskId', () => {
    it('should create a valid TaskId', () => {
      expect(new TaskId(validUuid).getValue()).toBe(validUuid);
    });

    it('should throw InvalidUuidError for malformed UUID', () => {
      expect(() => new TaskId(invalidUuid)).toThrow(InvalidUuidError);
    });
  });

  describe('TaskUserId', () => {
    it('should create a valid TaskUserId', () => {
      expect(new TaskUserId(validUuid).getValue()).toBe(validUuid);
    });

    it('should throw InvalidUuidError if empty (current implementation)', () => {
      expect(() => new TaskUserId('')).toThrow(InvalidUuidError);
    });
  });
});
