import { useState } from 'react';

function TaskForm({ onAddTask }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onAddTask({
      text: trimmed,
      priority,
      category,
    });

    // Resets after submit
    setText('');
    setPriority('Medium');
    setCategory('General');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} id="task-form">
      <div className="form-group task-input-group">
        <label htmlFor="task-text-input" className="form-label">
          Task Description
        </label>
        <input
          id="task-text-input"
          type="text"
          className="form-input"
          placeholder="What needs to be done today?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group select-group">
          <label htmlFor="task-priority-select" className="form-label">
            Priority
          </label>
          <select
            id="task-priority-select"
            className="form-select priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>

        <div className="form-group select-group">
          <label htmlFor="task-category-select" className="form-label">
            Category
          </label>
          <select
            id="task-category-select"
            className="form-select category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General">📌 General</option>
            <option value="Work">💼 Work</option>
            <option value="Personal">🏠 Personal</option>
          </select>
        </div>

        <button type="submit" id="add-task-btn" className="btn btn-primary add-btn">
          <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
