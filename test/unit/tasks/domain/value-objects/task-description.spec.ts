import { TaskDescriptionTooShortError } from 'src/contexts/tasks/domain/exceptions/task-description.error';
import { TaskDescription } from 'src/contexts/tasks/domain/value-objects/task-description.vo';

describe('TaskDescription Value Object', () => {
  it('should create a valid description', () => {
    const validDesc = 'This is a valid description';
    expect(new TaskDescription(validDesc).getValue()).toBe(validDesc);
  });

  it('should trim whitespace', () => {
    const desc = new TaskDescription('   Description with spaces   ');
    expect(desc.getValue()).toBe('Description with spaces');
  });

  it('should throw TaskDescriptionTooShortError if length < 10', () => {
    const shortDesc = '123456789';
    expect(() => new TaskDescription(shortDesc)).toThrow(
      TaskDescriptionTooShortError,
    );
  });

  it('should allow exactly 10 characters', () => {
    const tenChars = '1234567890';
    expect(new TaskDescription(tenChars).getValue()).toBe(tenChars);
  });
});
