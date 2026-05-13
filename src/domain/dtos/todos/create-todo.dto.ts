export class CreateTodoDto {

    private constructor(
        public readonly text: string,
    ) {}

    static create( object: Record<string, unknown> ): [string | null, CreateTodoDto | null] {

        const allowedFields = ['text'];

        const extraFields = Object.keys(object).filter(
            key => !allowedFields.includes(key)
        );

        if ( extraFields.length > 0 ) {
            return [`Invalid properties: ${ extraFields.join(', ') }`, null];
        }

        const { text } = object;

        if ( text === undefined || text === null ) {
            return ['Text property is required', null];
        }

        if ( typeof text !== 'string' ) {
            return ['Text must be a string', null];
        }

        const cleanText = text.trim();

        if ( cleanText.length === 0 ) {
            return ['Text cannot be empty', null];
        }

        return [null, new CreateTodoDto( cleanText )];
    }
}