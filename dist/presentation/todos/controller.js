const todos = [
    { id: 1, text: 'Buy milk', completedAt: new Date() },
    { id: 2, text: 'Buy bread', completedAt: null },
    { id: 3, text: 'Buy butter', completedAt: new Date() },
];
export class TodosController {
    //* DI
    constructor() { }
    getTodos = (req, res) => {
        return res.json(todos);
    };
    getTodoById = (req, res) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({
                error: 'ID argument is not a number'
            });
            return;
        }
        const todo = todos.find(todo => todo.id === id);
        if (!todo) {
            res.status(404).json({
                error: `TODO with id ${id} not found`
            });
            return;
        }
        res.json(todo);
    };
    createTodo = (req, res) => {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({
                error: 'Text property is required'
            });
            return;
        }
        const newTodo = {
            id: todos.length + 1,
            text,
            completedAt: null
        };
        todos.push(newTodo);
        res.json(newTodo);
    };
    updateTodo = (req, res) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({
                error: 'ID argument is not a number'
            });
            return;
        }
        const todo = todos.find(todo => todo.id === id);
        if (!todo) {
            res.status(404).json({
                error: `Todo with id ${id} not found`
            });
            return;
        }
        const { text, completedAt } = req.body;
        todo.text = text || todo.text;
        if (completedAt === 'null') {
            todo.completedAt = null;
        }
        else {
            todo.completedAt = new Date(completedAt || todo.completedAt);
        }
        res.json(todo);
    };
    deleteTodo = (req, res) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({
                error: 'ID argument is not a number'
            });
            return;
        }
        const todo = todos.find(todo => todo.id === id);
        if (!todo) {
            res.status(404).json({
                error: `Todo with id ${id} not found`
            });
            return;
        }
        todos.splice(todos.indexOf(todo), 1);
        res.json(todo);
    };
}
//# sourceMappingURL=controller.js.map