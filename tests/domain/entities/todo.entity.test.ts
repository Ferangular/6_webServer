import { TodoEntity } from '../../../src/domain/entities/todo.entity.js';
import { describe, expect, test } from '@jest/globals';

describe('TodoEntity', () => {
    test('creates an entity from a valid object', () => {
        const entity = TodoEntity.fromObject({ id: 1, text: 'Test', completedAt: null });

        expect(entity).toEqual({ id: 1, text: 'Test', completedAt: null });
        expect(entity.isCompleted).toBe(false);
    });

    test('rejects an invalid id', () => {
        expect(() => TodoEntity.fromObject({ id: 0, text: 'Test' })).toThrow('ID is required');
    });
});
