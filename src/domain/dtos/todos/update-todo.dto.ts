export class UpdateTodoDto {

    private constructor(
        public readonly id: number,
        public readonly text: string | null,
        public readonly completedAt: Date | null,
    ) {}

    get values(): Record<string, string | Date | null> {

        const returnObj: Record<string, string | Date | null> = {};

        if ( this.text !== null ) {
            returnObj.text = this.text;
        }

        if ( this.completedAt !== null ) {
            returnObj.completedAt = this.completedAt;
        }

        return returnObj;
    }

    static create( props: Record<string, unknown> ): [string | null, UpdateTodoDto | null] {

        const allowedFields = ['id', 'text', 'completedAt'];

        const extraFields = Object.keys(props).filter(
            key => !allowedFields.includes(key)
        );

        if ( extraFields.length > 0 ) {
            return [`Invalid properties: ${ extraFields.join(', ') }`, null];
        }

        const { id, text, completedAt } = props;

        if ( id === undefined || id === null || isNaN( Number(id) ) ) {
            return ['id must be a valid number', null];
        }

        let cleanText: string | null = null;

        if ( text !== undefined && text !== null ) {

            if ( typeof text !== 'string' ) {
                return ['Text must be a string', null];
            }

            cleanText = text.trim();

            if ( cleanText.length === 0 ) {
                return ['Text cannot be empty', null];
            }
        }

        let newCompletedAt: Date | null = null;

        if ( completedAt !== undefined && completedAt !== null ) {

            if ( typeof completedAt !== 'string' && !( completedAt instanceof Date ) ) {
                return ['CompletedAt must be a valid date', null];
            }

            newCompletedAt = new Date( completedAt );

            if ( isNaN( newCompletedAt.getTime() ) ) {
                return ['CompletedAt must be a valid date', null];
            }
        }

        return [
            null,
            new UpdateTodoDto(
                Number(id),
                cleanText,
                newCompletedAt
            )
        ];
    }
}