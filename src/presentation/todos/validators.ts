import { body, param } from 'express-validator';

import { validateFields } from '../middlewares/validate-fields.js';

export class TodoValidators {

    static getTodoById = [
        param('id')
            .isInt()
            .withMessage('ID must be a valid number'),

        validateFields,
    ];

    static createTodo = [
        body('text')
            .exists()
            .withMessage('Text property is required')
            .bail()
            .isString()
            .withMessage('Text must be a string')
            .bail()
            .notEmpty()
            .withMessage('Text cannot be empty'),

        validateFields,
    ];

    static updateTodo = [
        param('id')
            .isInt()
            .withMessage('ID must be a valid number'),

        body('text')
            .optional()
            .isString()
            .withMessage('Text must be a string'),

        validateFields,
    ];

    static deleteTodo = [
        param('id')
            .isInt()
            .withMessage('ID must be a valid number'),

        validateFields,
    ];
}