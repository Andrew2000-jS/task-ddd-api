import {
  TaskTitleEmptyError,
  TaskTitleTooLongError,
  TaskTitleTooShortError,
} from 'src/contexts/tasks/domain/exceptions/task-title.error';
import { TaskTitle } from 'src/contexts/tasks/domain/value-objects/task-title.vo';

describe('TaskTitle Value Object', () => {
  it('should create a valid title', () => {
    const validTitle = 'Learn Unit Testing';
    const title = new TaskTitle(validTitle);
    expect(title.getValue()).toBe(validTitle);
  });

  it('should trim whitespace', () => {
    const title = new TaskTitle('   Clean Code   ');
    expect(title.getValue()).toBe('Clean Code');
  });

  it('should throw TaskTitleEmptyError if empty', () => {
    expect(() => new TaskTitle('')).toThrow(TaskTitleEmptyError);
  });

  it('should throw TaskTitleTooShortError if length < 3', () => {
    expect(() => new TaskTitle('ab')).toThrow(TaskTitleTooShortError);
  });

  it('should throw TaskTitleTooLongError if length > 100', () => {
    const longTitle = 'a'.repeat(101);
    expect(() => new TaskTitle(longTitle)).toThrow(TaskTitleTooLongError);
  });
});
