export class UpdateTodoDto {
    private constructor(
        public readonly id: number,
        public readonly text?: string,
        public readonly completedAt?: Date | null,
    ) {}

    get values(): { text?: string; completedAt?: Date | null } {
        const values: { text?: string; completedAt?: Date | null } = {};
        if (this.text !== undefined) values.text = this.text;
        if (this.completedAt !== undefined) values.completedAt = this.completedAt;
        return values;
    }

    static create(props: Record<string, unknown>): [string | undefined, UpdateTodoDto | undefined] {
        const id = Number(props.id);
        const { text, completedAt } = props;

        if (!Number.isInteger(id) || id <= 0) return ['ID must be a positive integer', undefined];
        if (text !== undefined && (typeof text !== 'string' || text.trim().length === 0)) {
            return ['Text must be a non-empty string', undefined];
        }

        let parsedCompletedAt: Date | null | undefined;
        if (completedAt === null || completedAt === 'null') {
            parsedCompletedAt = null;
        } else if (completedAt !== undefined) {
            parsedCompletedAt = new Date(String(completedAt));
            if (Number.isNaN(parsedCompletedAt.getTime())) return ['CompletedAt must be a valid date', undefined];
        }

        return [undefined, new UpdateTodoDto(id, typeof text === 'string' ? text.trim() : undefined, parsedCompletedAt)];
    }
}