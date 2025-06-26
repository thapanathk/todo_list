const pool = require('../db');

const getAllTodos = async () => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    return result.rows;
  } catch (error) {
    console.error('Error executing getAllTodos query:', error.stack);
    throw error;
  }
};

const getTodosByDate = async (date) => {
  const result = await pool.query(
    'SELECT * FROM todos WHERE start_time::date = $1::date ORDER BY start_time ASC',
    [date]
  );
  return result.rows;
};

const createTodo = async ({ task, start_time, dateline, status_manual = 'Pending' }) => {
  try {
    const result = await pool.query(
      'INSERT INTO todos (task, start_time, dateline, status_manual, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [task, start_time, dateline, status_manual]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error executing createTodo query:', error.stack);
    throw error;
  }
};

const removeTodo = async (id) => {
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new Error('Todo not found');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error executing removeTodo query:', error.stack);
    throw error;
  }
};

const updateTodoStatus = async (id, status_manual) => {
  try {
    const result = await pool.query(
      'UPDATE todos SET status_manual = $1 WHERE id = $2 RETURNING *',
      [status_manual, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error executing updateTodoStatus query:', error.stack);
    throw error;
  }
};

const updateTodoDetails = async (id, task, start_time, dateline, status_manual) => {
  try {
    const result = await pool.query(
      'UPDATE todos SET task = $1, start_time = $2, dateline = $3, status_manual = $4 WHERE id = $5 RETURNING *',
      [task, start_time, dateline, status_manual, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error executing updateTodoDetails query:', error.stack);
    throw error;
  }
};

module.exports = {
  getAllTodos,
  getTodosByDate,
  createTodo,
  removeTodo,
  updateTodoStatus,
  updateTodoDetails,
};
