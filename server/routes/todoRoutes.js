const express = require('express');
const router = express.Router();
const { 
    getAllTodos,
    getTodosByDate,
    createTodo, 
    removeTodo, 
    updateTodoStatus, 
    updateTodoDetails,
    markAsCompleted,
} = require('../controllers/todoController');

router.get('/todos', getAllTodos);
router.get('/todos/date/:date', getTodosByDate);
router.post('/todos', createTodo);
router.delete('/todos/:id', removeTodo);
router.patch('/todos/:id/status', updateTodoStatus);
router.patch('/todos/:id', updateTodoDetails);
router.post('/todos/:id/complete', markAsCompleted);

module.exports = router;