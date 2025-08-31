import React, { useState, useEffect } from 'react';

function AuthView({ onLogin }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [hover, setHover] = useState(false);

  const containerStyle = {
    maxWidth: 460,
    margin: '80px auto',
    padding: 0,
    fontFamily: 'Helvetica, sans-serif',
    color: '#fff',
    borderRadius: 20,
    background: 'linear-gradient(160deg, #0f2027, #203a43 50%, #2c5364)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.6)'
  };

  const shellStyle = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
  };

  const headerStyle = {
    padding: '22px 26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  };

  const toggleStyle = (active) => ({
    padding: '8px 14px',
    borderRadius: 999,
    border: '1px solid',
    borderColor: active ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)',
    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
    cursor: 'pointer',
    color: '#fff',
    fontSize: 13,
  });

  const bodyStyle = {
    position: 'relative',
    minHeight: 260,
    perspective: 1000,
  };

  const cardStyle = (visible) => ({
    position: 'absolute',
    inset: 0,
    padding: 26,
    transform: `translateY(${visible ? 0 : 20}px)`
  });

  const panelStyle = (active) => ({
    transition: 'opacity 300ms ease, transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
    opacity: active ? 1 : 0,
    transform: active ? 'scale(1) rotateX(0deg)' : 'scale(0.98) rotateX(10deg)'
  });

  const inputStyle = {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    width: '100%',
    outline: 'none',
    fontSize: 16,
    background: 'rgba(0,0,0,0.25)',
    color: '#fff'
  };

  const buttonPrimary = {
    padding: '12px 18px',
    borderRadius: 10,
    border: 'none',
    background: hover
      ? 'linear-gradient(135deg, #ff4b2b, #ff416c)'
      : 'linear-gradient(135deg, #ff416c, #ff4b2b)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    transition: 'transform 200ms ease, filter 200ms ease',
    transform: hover ? 'translateY(-1px) scale(1.01)' : 'translateY(0) scale(1)',
    filter: hover ? 'drop-shadow(0 6px 18px rgba(255,65,108,0.45))' : 'none'
  };

  const subtle = { color: 'rgba(255,255,255,0.7)', fontSize: 13 };

  const showMessage = (text, timeout = 1800) => {
    setMessage(text);
    if (timeout) setTimeout(() => setMessage(''), timeout);
  };

  const loadUsers = () => {
    try {
      const raw = localStorage.getItem('todo.users');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };
  const saveUsers = (arr) => localStorage.setItem('todo.users', JSON.stringify(arr));

  const handleSignUp = (e) => {
    e.preventDefault();
    const u = name.trim();
    if (!u || !password) return showMessage('Please fill all fields');
    if (u.length < 3) return showMessage('Username must be at least 3 characters');
    if (password.length < 4) return showMessage('Password must be at least 4 characters');
    const users = loadUsers();
    if (users.find(x => x.name.toLowerCase() === u.toLowerCase())) {
      return showMessage('User already exists');
    }
    const newUsers = [...users, { name: u, password }];
    saveUsers(newUsers);
    showMessage('Account created! Signing you in...', 1200);
    setTimeout(() => onLogin({ name: u }), 600);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const u = name.trim();
    if (!u || !password) return showMessage('Please enter credentials');
    const users = loadUsers();
    const match = users.find(x => x.name.toLowerCase() === u.toLowerCase() && x.password === password);
    if (!match) {
      setPassword('');
      return showMessage('Invalid username or password');
    }
    onLogin({ name: match.name });
  };

  // Reset fields when switching modes for clarity
  const switchMode = (next) => {
    setMode(next);
    setMessage('');
    setPassword('');
    if (next === 'signup') {
      setName('');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={shellStyle}>
        <div style={headerStyle}>
          <div style={{ fontWeight: 'bold', letterSpacing: 1 }}>Welcome</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={toggleStyle(mode === 'signin')} onClick={() => switchMode('signin')}>Sign In</button>
            <button style={toggleStyle(mode === 'signup')} onClick={() => switchMode('signup')}>Sign Up</button>
          </div>
        </div>

        <div style={{ padding: 26 }}>
          {message && (
            <div style={{
              marginBottom: 12,
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              textAlign: 'center',
              fontSize: 13
            }}>{message}</div>
          )}

          {/* Panel (render only active to prevent wrong form submits) */}
          <div style={bodyStyle}>
            {mode === 'signin' ? (
              <div style={{ ...cardStyle(true), ...panelStyle(true) }}>
                <form onSubmit={handleSignIn}>
                  <label>Username</label>
                  <input style={{ ...inputStyle, marginTop: 6 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="jane" />
                  <div style={{ height: 12 }} />
                  <label>Password</label>
                  <input style={{ ...inputStyle, marginTop: 6 }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                  <div style={{ height: 16 }} />
                  <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={buttonPrimary} type="submit">Sign In</button>
                  <div style={{ height: 10 }} />
                  <div style={subtle}>New here? <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => switchMode('signup')}>Create an account</span></div>
                </form>
              </div>
            ) : (
              <div style={{ ...cardStyle(true), ...panelStyle(true) }}>
                <form onSubmit={handleSignUp}>
                  <label>Choose a username</label>
                  <input style={{ ...inputStyle, marginTop: 6 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="jane" />
                  <div style={{ height: 12 }} />
                  <label>Create a password</label>
                  <input style={{ ...inputStyle, marginTop: 6 }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                  <div style={{ height: 16 }} />
                  <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={buttonPrimary} type="submit">Sign Up</button>
                  <div style={{ height: 10 }} />
                  <div style={subtle}>Already have an account? <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => switchMode('signin')}>Sign in</span></div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [backendError, setBackendError] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('todo.user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) setUser(parsed);
      } catch {}
    }
  }, []);

  // Fetch todos from backend (scoped by user)
  useEffect(() => {
    if (!user) return;
    fetch('https://todo-backend-test.azurewebsites.net/', { headers: { 'X-User': user.name } })
      .then(res => {
        if (!res.ok) throw new Error('Backend not reachable');
        return res.json();
      })
      .then(data => setTodos(data))
      .catch(err => {
        console.error('Error fetching todos:', err);
        setBackendError(true);
      });
  }, [user]);

  const onLogin = (u) => {
    setUser(u);
    localStorage.setItem('todo.user', JSON.stringify(u));
  };
  const onLogout = () => {
    localStorage.removeItem('todo.user');
    setUser(null);
  };

  // If not logged in, show login
  if (!user) {
    return <AuthView onLogin={onLogin} />;
  }

  const addTodo = () => {
    if (!title) return;
    const newTodo = { title, completed: false };

    fetch('https://todo-backend-test.azurewebsites.net/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User': user.name },
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
    fetch(`https://todo-backend-test.azurewebsites.net/${id}`, { method: 'DELETE', headers: { 'X-User': user.name } })
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <h1 style={{ letterSpacing: '2px' }}>Todo App</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#ddd', fontSize: 14 }}>Hi, <b>{user.name}</b></span>
            <button onClick={onLogout} style={{ ...buttonStyle, padding: '6px 12px', background: '#444' }}>Logout</button>
          </div>
        </div>
        <p style={{ textAlign: 'center', color: '#ff4b2b', fontWeight: 'bold' }}>Cannot connect to backend. Please start the server.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <h1 style={{ letterSpacing: '2px' }}>Todo App</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#ddd', fontSize: 14 }}>Hi, <b>{user.name}</b></span>
          <button onClick={onLogout} style={{ ...buttonStyle, padding: '6px 12px', background: '#444' }}>Logout</button>
        </div>
      </div>
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
