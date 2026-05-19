import { useState } from 'react';
import { tasksAPI } from '../services/api';

const BADGE = { pending: 'badge-pending', 'in-progress': 'badge-in-progress', done: 'badge-done' };

export default function TaskCard({ task, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: task.title, description: task.description, status: task.status });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const { data } = await tasksAPI.update(task._id, form);
      onUpdated(data);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setLoading(true);
    try {
      await tasksAPI.delete(task._id);
      onDeleted(task._id);
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <div className="task-card">
        <div className="form-group">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        </div>
        <div className="form-group">
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} />
        </div>
        <div className="form-group">
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="task-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button className="btn btn-sm" style={{ background: '#ddd' }} onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      {task.description && <p>{task.description}</p>}
      <div className="task-card-footer">
        <span className={`badge ${BADGE[task.status]}`}>{task.status}</span>
        <div className="task-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={loading}>Delete</button>
        </div>
      </div>
    </div>
  );
}
