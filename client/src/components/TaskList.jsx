function TaskList({ tasks = [], onUpdateTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-tasks-container" id="empty-tasks-state">
        <div className="empty-icon-wrapper">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="empty-title">No tasks found</h3>
        <p className="empty-subtitle">Stay organized and productive! Add your first task above.</p>
      </div>
    );
  }

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'badge-priority-high';
      case 'low':
        return 'badge-priority-low';
      case 'medium':
      default:
        return 'badge-priority-medium';
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'work':
        return 'badge-category-work';
      case 'personal':
        return 'badge-category-personal';
      case 'general':
      default:
        return 'badge-category-general';
    }
  };

  return (
    <div className="task-list" id="task-list">
      {tasks.map((task) => {
        const taskId = task._id || task.id;
        const isCompleted = Boolean(task.completed);

        return (
          <div
            key={taskId}
            id={`task-item-${taskId}`}
            className={`task-card ${isCompleted ? 'is-completed' : ''}`}
          >
            <div className="task-main-content">
              <button
                type="button"
                className={`task-checkbox-btn ${isCompleted ? 'checked' : ''}`}
                onClick={() => onUpdateTask(taskId, { completed: !isCompleted })}
                title={isCompleted ? 'Mark as incomplete (Undo)' : 'Mark as complete'}
                aria-label={isCompleted ? 'Undo task' : 'Complete task'}
              >
                {isCompleted ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="check-svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <div className="unchecked-ring" />
                )}
              </button>

              <div className="task-details">
                <span className={`task-text ${isCompleted ? 'completed' : ''}`}>
                  {task.text}
                </span>

                <div className="task-badges">
                  <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority || 'Medium'}
                  </span>
                  <span className={`badge ${getCategoryBadgeClass(task.category)}`}>
                    {task.category || 'General'}
                  </span>
                </div>
              </div>
            </div>

            <div className="task-actions">
              <button
                type="button"
                className={`btn btn-sm ${isCompleted ? 'btn-undo' : 'btn-complete'}`}
                onClick={() => onUpdateTask(taskId, { completed: !isCompleted })}
                id={`toggle-btn-${taskId}`}
              >
                {isCompleted ? 'Undo' : 'Complete'}
              </button>

              <button
                type="button"
                className="btn btn-sm btn-delete"
                onClick={() => onDeleteTask(taskId)}
                title="Delete task"
                id={`delete-btn-${taskId}`}
                aria-label="Delete task"
              >
                <svg className="btn-icon-sm" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TaskList;
