import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import request from 'supertest';
import { prisma } from '../../../src/data/postgres/index.js';
import { testServer } from '../../test-server.js';

describe('Todo routes', () => {
    beforeAll(async () => {
        await testServer.start();
    });

    beforeEach(async () => {
        await prisma.todo.deleteMany();
    });

    afterAll(async () => {
        testServer.close();
        await prisma.$disconnect();
    });

    test('GET /api/todos returns all todos', async () => {
        await prisma.todo.createMany({ data: [{ text: 'First' }, { text: 'Second' }] });

        const { body } = await request(testServer.app).get('/api/todos').expect(200);

        expect(body).toHaveLength(2);
        expect(body[0].text).toBe('First');
    });

    test('POST /api/todos creates a todo', async () => {
        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({ text: 'Learn testing' })
            .expect(201);

        expect(body).toEqual({ id: expect.any(Number), text: 'Learn testing', completedAt: null });
    });

    test('POST /api/todos rejects an empty body', async () => {
        const { body } = await request(testServer.app).post('/api/todos').send({}).expect(400);
        expect(body).toEqual({ error: 'Text property is required' });
    });

    test('PUT /api/todos/:id updates a todo', async () => {
        const todo = await prisma.todo.create({ data: { text: 'Before' } });
        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({ text: 'After', completedAt: '2026-10-05' })
            .expect(200);

        expect(body.text).toBe('After');
        expect(body.completedAt).toBe('2026-10-05T00:00:00.000Z');
    });

    test('DELETE /api/todos/:id deletes a todo', async () => {
        const todo = await prisma.todo.create({ data: { text: 'Delete me' } });
        await request(testServer.app).delete(`/api/todos/${todo.id}`).expect(200);
        await request(testServer.app).get(`/api/todos/${todo.id}`).expect(404);
    });
});
