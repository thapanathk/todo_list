import React from 'react';
import TodoCalendar from './components/TodoCalendar';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1 className='text-white'>React To-Do App</h1>
      <TodoCalendar />
    </div>
  );
};

export default App;
