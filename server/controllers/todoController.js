const todoModel = require('../models/todoModel');

const computeStatus = (row) => {
  const now = new Date();
  const start = new Date(row.start_time);
  const end = new Date(row.dateline);
  const manual = row.status_manual;

  if (manual === 'Completed') return 'Completed';
  if (now < start) return 'Pending';
  if (now >= start && now <= end) return 'In Progress';
  return 'Overdue';
};

const getAllTodos = async (req, res) => {
  try {
    const todos = await todoModel.getAllTodos();
    const withStatus = todos.map(todo => ({
      ...todo,
      status: computeStatus(todo)
    }));
    res.json(withStatus);
  } catch (error) {
    console.error('Error retrieving todos:', error.stack);
    res.status(500).json({ message: 'Error retrieving todos' });
  }
};

const getTodosByDate = async (req, res) => {
  const { date } = req.params;
  console.log("🎯 Backend getTodosByDate:", date);
  try {
    const todos = await todoModel.getTodosByDate(date);
    console.log("📥 From DB:", todos);
    const withStatus = todos.map(todo => ({
      ...todo,
      status: computeStatus(todo),
    }));
    res.json(withStatus);
  } catch (error) {
    console.error('Error fetching todos by date:', error.stack);
    res.status(500).json({ message: 'Error fetching by date' });
  }
};

const createTodo = async (req, res) => {
  const { task, start_time, dateline, status_manual } = req.body;
  try {
    const newTodo = await todoModel.createTodo({ task, start_time, dateline, status_manual });
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error.stack);
    res.status(500).json({ message: 'Error creating todo' });
  }
};

const removeTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await todoModel.removeTodo(id);
    res.json(deleted);
  } catch (error) {
    console.error('Error deleting todo:', error.stack);
    res.status(500).json({ message: 'Error deleting todo' });
  }
};

const updateTodoStatus = async (req, res) => {
  const { id } = req.params;
  const { status_manual } = req.body;
  try {
    const updated = await todoModel.updateTodoStatus(id, status_manual);
    res.json(updated);
  } catch (error) {
    console.error('Error updating status:', error.stack);
    res.status(500).json({ message: 'Error updating status' });
  }
};

const updateTodoDetails = async (req, res) => {
  const { id } = req.params;
  const { task, start_time, dateline, status_manual } = req.body;
  try {
    const updated = await todoModel.updateTodoDetails(id, task, start_time, dateline, status_manual);
    res.json(updated);
  } catch (error) {
    console.error('Error updating todo details:', error.stack);
    res.status(500).json({ message: 'Error updating todo details' });
  }
};

const markAsCompleted = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await todoModel.updateTodoStatus(id, 'Completed');
    res.json(updated);
  } catch (error) {
    console.error('Error marking todo as completed:', error.stack);
    res.status(500).json({ message: 'Error completing todo' });
  }
};

module.exports = {
  getAllTodos,
  getTodosByDate,
  createTodo,
  removeTodo,
  updateTodoStatus,
  updateTodoDetails,
  markAsCompleted
};
