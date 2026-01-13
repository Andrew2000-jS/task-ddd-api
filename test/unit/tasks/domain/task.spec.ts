import { Task } from 'src/contexts/tasks/domain/task';

describe('Task Aggregate', () => {
  it('should create a Task instance from primitives', () => {
    const taskData = {
      title: 'Test Task',
      slug: 'test-task',
      description: 'This is a long enough description',
      isCompleted: false,
      userId: '550e8400-e29b-41d4-a716-446655440000',
    };

    const task = Task.create(taskData);
    const primitives = task.toPrimitives();

    expect(primitives.title).toBe(taskData.title);
    expect(primitives.id).toBeDefined();
    expect(primitives.isCompleted).toBe(false);
  });
});
