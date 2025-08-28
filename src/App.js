import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [backendError, setBackendError] = useState(false);

  // Fetch todos from backend
  useEffect(() => {
    fetch('https://test-backend-demo.azurewebsites.net/api/todos')
      .then(res => {
        if (!res.ok) throw new Error('Backend not reachable');
        return res.json();
      })
      .then(data => setTodos(data))
      .catch(err => {
        console.error('Error fetching todos:', err);
        setBackendError(true);
      });
  }, []);

  const addTodo = () => {
    if (!title) return;
    const newTodo = { title, completed: false };

    fetch('https://test-backend-demo.azurewebsites.net/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    })
    .then(res => {
      if (!res.ok) throw new Error('Backend not reachable');
      return res.json();
    })
    .then(savedTodo => {
      setTodos([...todos, savedTodo]);
      setTitle('');
    })
    .catch(err => {
      console.error('Error adding todo:', err);
      setBackendError(true);
    });
  };

  const deleteTodo = (id) => {
    fetch(`https://test-backend-demo.azurewebsites.net/api/todos/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Backend not reachable');
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(err => {
        console.error('Error deleting todo:', err);
        setBackendError(true);
      });
  };

  // Styling
  const containerStyle = {
    maxWidth: 500,
    margin: '50px auto',
    padding: 30,
    fontFamily: 'Helvetica, sans-serif',
    color: '#fff',
    borderRadius: 15,
    background: 'linear-gradient(135deg, #141e30, #243b55)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
  };

  const inputStyle = {
    padding: '10px 15px',
    marginRight: 10,
    borderRadius: 8,
    border: 'none',
    width: '70%',
    outline: 'none',
    fontSize: 16
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(45deg, #ff416c, #ff4b2b)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease'
  };

  const todoItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px 0',
    padding: '10px',
    borderRadius: 10,
    background: 'linear-gradient(90deg, #2c3e50, #4ca1af)',
    transition: 'transform 0.3s, background 0.3s',
    cursor: 'pointer'
  };

  const deleteButtonStyle = {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    padding: '5px 12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s'
  };

  if (backendError) {
    return (
      <div style={containerStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: 25, letterSpacing: '2px' }}>Todo App</h1>
        <p style={{ textAlign: 'center', color: '#ff4b2b', fontWeight: 'bold' }}>Cannot connect to backend. Please start the server.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: 25, letterSpacing: '2px' }}>Todo App</h1>
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <input style={inputStyle} type='text' value={title} onChange={e => setTitle(e.target.value)} placeholder='Add Todo' />
        <button style={buttonStyle} onClick={addTodo} onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>Add</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={todoItemStyle} onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
            <span>{todo.title}</span>
            <button style={deleteButtonStyle} onClick={() => deleteTodo(todo.id)} onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
