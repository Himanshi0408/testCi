import { useEffect, useState } from 'react';
import { tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    tasksAPI.getAll()
      .then(({ data }) => setTasks(data))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (task) => setTasks([task, ...tasks]);
  const handleUpdated = (updated) => setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
  const handleDeleted = (id) => setTasks(tasks.filter((t) => t._id !== id));

  return (
    <>
      <nav className="navbar">
        <h1>Task Manager</h1>
        <span style={{ color: '#ccc', fontSize: '.9rem' }}>Hi, {user?.name}</span>
        <button onClick={logout}>Logout</button>
      </nav>

      <div className="container dashboard">
        <div className="dashboard-header">
          <h2>My Tasks ({tasks.length})</h2>
        </div>

        <TaskForm onCreated={handleCreated} />

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one above!</p>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
