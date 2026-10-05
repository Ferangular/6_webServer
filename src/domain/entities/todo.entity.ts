export class TodoEntity {
    constructor(
        public readonly id: number,
        public readonly text: string,
        public readonly completedAt: Date | null,
    ) {}

    get isCompleted(): boolean {
        return this.completedAt !== null;
    }

    static fromObject(object: Record<string, unknown>): TodoEntity {
        const id = Number(object.id);
        const { text, completedAt } = object;

        if (!Number.isInteger(id) || id <= 0) throw new Error('ID is required');
        if (typeof text !== 'string' || text.trim().length === 0) throw new Error('Text is required');

        let parsedCompletedAt: Date | null = null;
        if (completedAt !== null && completedAt !== undefined) {
            parsedCompletedAt = new Date(String(completedAt));
            if (Number.isNaN(parsedCompletedAt.getTime())) throw new Error('CompletedAt is not a valid date');
        }

        return new TodoEntity(id, text, parsedCompletedAt);
    }
}
