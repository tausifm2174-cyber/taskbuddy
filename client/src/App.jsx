import { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ProgressTracker from './components/ProgressTracker';
import AuthForm from './components/AuthForm';
import { api, authStorage } from './services/api';
import './style.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(() => authStorage.getUser());
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Fetch tasks when user is logged in
  const fetchTasks = useCallback(async () => {
    if (!authStorage.getToken()) return;
    setIsTasksLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      if (err.status === 401) {
        handleLogout();
        showNotification('Session expired. Please log in again.', 'error');
      } else {
        showNotification(err.message || 'Error loading tasks', 'error');
      }
    } finally {
      setIsTasksLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && authStorage.getToken()) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user, fetchTasks]);

  // Auth Handlers
  const handleLogin = async (credentials) => {
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const data = await api.login(credentials);
      authStorage.setToken(data.token);
      authStorage.setUser(data.user);
      setUser(data.user);
      showNotification(`Welcome back, ${data.user.name || 'friend'}!`, 'success');
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setIsAuthLoading(true);
    setAuthError('');
    try {
      const data = await api.register(userData);
      authStorage.setToken(data.token);
      authStorage.setUser(data.user);
      setUser(data.user);
      showNotification('Account created successfully! Welcome to TaskBuddy.', 'success');
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authStorage.clear();
    setUser(null);
    setTasks([]);
    setAuthError('');
    showNotification('Logged out successfully.', 'info');
  };

  // Task Actions
  const addTask = async (taskData) => {
    try {
      const newTask = await api.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      showNotification('Task added successfully!', 'success');
    } catch (err) {
      console.error('Add task error:', err);
      showNotification(err.message || 'Failed to add task.', 'error');
    }
  };

  const updateTask = async (taskId, updates) => {
    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => ((t._id || t.id) === taskId ? { ...t, ...updates } : t))
    );

    try {
      const updated = await api.updateTask(taskId, updates);
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === taskId ? updated : t))
      );
    } catch (err) {
      console.error('Update task error:', err);
      setTasks(previousTasks); // Rollback on error
      showNotification(err.message || 'Failed to update task.', 'error');
    }
  };

  const deleteTask = async (taskId) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => (t._id || t.id) !== taskId));

    try {
      await api.deleteTask(taskId);
      showNotification('Task deleted.', 'info');
    } catch (err) {
      console.error('Delete task error:', err);
      setTasks(previousTasks); // Rollback on error
      showNotification(err.message || 'Failed to delete task.', 'error');
    }
  };

  const clearTask = async () => {
    if (tasks.length === 0) return;
    const confirmClear = window.confirm('Are you sure you want to clear all tasks?');
    if (!confirmClear) return;

    const previousTasks = [...tasks];
    setTasks([]);

    try {
      await api.clearTasks();
      showNotification('All tasks cleared.', 'info');
    } catch (err) {
      console.error('Clear tasks error:', err);
      setTasks(previousTasks); // Rollback on error
      showNotification(err.message || 'Failed to clear tasks.', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {notification && (
        <aside
          className={`toast-alert toast-${notification.type}`}
          id="toast-notification"
          role="status"
          aria-live="polite"
        >
          <span>{notification.message}</span>
        </aside>
      )}

      {/* Header & Navbar */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-section">
            <div className="brand-logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>
            <div>
              <h1 className="brand-title">TaskBuddy</h1>
              <span className="brand-tagline">Stay focused, organized & productive</span>
            </div>
          </div>

          {user && (
            <div className="user-nav" id="user-nav">
              <div className="user-profile">
                <div className="user-avatar" title={user.name || user.email}>
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name || 'User'}</span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline btn-logout"
                id="logout-btn"
                onClick={handleLogout}
              >
                <svg className="btn-icon-sm" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {!user ? (
          <AuthForm
            onLogin={handleLogin}
            onRegister={handleRegister}
            error={authError}
            isLoading={isAuthLoading}
          />
        ) : (
          <div className="dashboard-layout">
            <section className="dashboard-section" aria-label="Progress Overview">
              <ProgressTracker tasks={tasks} />
            </section>

            <section className="dashboard-section" aria-label="Add New Task">
              <TaskForm onAddTask={addTask} />
            </section>

            <section className="dashboard-section" aria-label="Your Tasks">
              <div className="section-header-bar">
                <div className="section-title-wrap">
                  <h2 className="section-title">Your Tasks</h2>
                  <span className="tasks-counter-badge">{tasks.length}</span>
                </div>

                {/* Clear All Tasks button visible only when at least one task exists */}
                {tasks.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-danger-outline btn-clear-all"
                    id="clear-all-tasks-btn"
                    onClick={clearTask}
                  >
                    <svg className="btn-icon-sm" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Clear All Tasks
                  </button>
                )}
              </div>

              {isTasksLoading ? (
                <div className="loading-state" id="tasks-loading">
                  <div className="loader-ring" />
                  <p>Loading your tasks...</p>
                </div>
              ) : (
                <TaskList
                  tasks={tasks}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>TaskBuddy &copy; 2026 &bull; Crafted with React, Express & MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
