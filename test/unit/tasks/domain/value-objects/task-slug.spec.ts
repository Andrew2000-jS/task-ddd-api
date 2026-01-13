import { InvalidTaskSlugError } from 'src/contexts/tasks/domain/exceptions/task-slug.error';
import { TaskSlug } from 'src/contexts/tasks/domain/value-objects/task-slug.vo';

describe('TaskSlug Value Object', () => {
  it('should allow valid slugs', () => {
    const valid = 'my-first-task-2026';
    expect(new TaskSlug(valid).getValue()).toBe(valid);
  });

  it('should throw InvalidTaskSlugError for invalid characters', () => {
    const invalidSlugs = ['My Slug', 'slug!', 'slug_test', '-slug'];
    invalidSlugs.forEach((slug) => {
      expect(() => new TaskSlug(slug)).toThrow(InvalidTaskSlugError);
    });
  });
});
