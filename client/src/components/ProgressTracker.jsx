function ProgressTracker({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-tracker-card" id="progress-tracker">
      <div className="progress-header">
        <div className="progress-info">
          <span className="progress-badge">Progress</span>
          <span className="progress-count-text" id="progress-count-text">
            {completed} out of {total} tasks completed
          </span>
        </div>
        <span className="progress-percentage-label">{percentage}%</span>
      </div>

      <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
          id="progress-bar-fill"
        />
      </div>
    </div>
  );
}

export default ProgressTracker;
