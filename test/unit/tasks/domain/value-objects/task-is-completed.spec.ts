import { TaskIsCompleted } from 'src/contexts/tasks/domain/value-objects/task-is-completed.vo';

describe('TaskIsCompleted Value Object', () => {
  it('should store a boolean value', () => {
    expect(new TaskIsCompleted(true).getValue()).toBe(true);
    expect(new TaskIsCompleted(false).getValue()).toBe(false);
  });

  it('should return true when isDone() is called on completed task', () => {
    const completed = new TaskIsCompleted(true);
    expect(completed.isDone()).toBe(true);
  });

  it('should return false when isDone() is called on pending task', () => {
    const pending = new TaskIsCompleted(false);
    expect(pending.isDone()).toBe(false);
  });
});
