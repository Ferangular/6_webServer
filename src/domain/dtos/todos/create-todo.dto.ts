export class CreateTodoDto {
    private constructor(
        public readonly text: string,
    ) {}

    static create(props: Record<string, unknown>): [string | undefined, CreateTodoDto | undefined] {
        const { text } = props;

        if (typeof text !== 'string' || text.trim().length === 0) {
            return ['Text property is required', undefined];
        }

        return [undefined, new CreateTodoDto(text.trim())];
    }
}