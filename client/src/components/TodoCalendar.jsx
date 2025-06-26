import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TodoCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const formatDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
      .toISOString()
      .split('T')[0];
  };

  const toISOStringLocal = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-');
    const [hour, minute] = timeStr.split(':');
    const localDate = new Date(year, month - 1, day, hour, minute);

    const pad = (n) => n.toString().padStart(2, '0');
    return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`;
  };

  const formatTimeLocal = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/date/${formatDate(selectedDate)}`);
      const data = await res.json();
      console.log("📦 Todos:", data);
      setTodos(data);
    } catch (err) {
      console.error('🚨 Error fetching todos:', err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [selectedDate]);

  const handleAddTodo = async () => {
    if (!task || !startTime || !endTime) {
      alert('กรุณากรอกงานและเวลาก่อนเพิ่ม');
      return;
    }

    const dateStr = formatDate(selectedDate);

    const payload = {
      task,
      start_time: toISOStringLocal(dateStr, startTime),
      dateline: toISOStringLocal(dateStr, endTime),
      status_manual: 'Pending',
    };

    console.log('🛰️ Sending:', payload);

    try {
      const res = await fetch(`http://localhost:5000/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setTask('');
        setStartTime('');
        setEndTime('');
        fetchTodos();
      } else {
        const errMsg = await res.text();
        console.error('🚨 Server Error:', errMsg);
        alert('เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (err) {
      console.error('❌ POST error:', err);
    }
  };

  const markAsCompleted = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}/complete`, { method: 'POST' });
      fetchTodos();
    } catch (err) {
      console.error('❌ Error marking complete:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📅 To-Do Calendar</h2>

      <Calendar onChange={setSelectedDate} value={selectedDate} />

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          รายการวันที่: {selectedDate.toDateString()}
        </h3>

        {todos.length === 0 ? (
          <p className="text-gray-500 italic">ไม่มีงานในวันนี้</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="border rounded px-3 py-2 flex justify-between items-center">
                <div>
                  <strong>{todo.task}</strong><br />
                  ⏰ {formatTimeLocal(todo.start_time)} - {formatTimeLocal(todo.dateline)} |
                  <span className="ml-2 font-semibold text-blue-600">{todo.status_manual}</span>
                </div>
                {todo.status_manual !== 'Completed' && (
                  <button
                    onClick={() => markAsCompleted(todo.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Completed
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <h4 className="font-semibold mb-2">➕ เพิ่ม To-Do</h4>
        <div className="flex flex-col md:flex-row gap-2 mb-2">
          <input
            type="text"
            placeholder="ชื่องาน เช่น WFH"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="border px-3 py-1 rounded w-full"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            เพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCalendar;
