import { useState } from 'react';

function AuthForm({ onLogin, onRegister, error, isLoading }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      onRegister({ name, email, password });
    } else {
      onLogin({ email, password });
    }
  };

  return (
    <div className="auth-card" id="auth-container">
      <div className="auth-header">
        <div className="auth-logo-badge">
          <svg viewBox="0 0 24 24" fill="currentColor" className="auth-logo-icon">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
        </div>
        <h2 className="auth-title">
          {isRegister ? 'Create your TaskBuddy Account' : 'Welcome back to TaskBuddy'}
        </h2>
        <p className="auth-subtitle">
          {isRegister
            ? 'Sign up to start organizing and tracking your tasks today.'
            : 'Enter your credentials to access your personal dashboard.'}
        </p>
      </div>

      {error && (
        <div className="auth-error-alert" id="auth-error-message" role="alert">
          <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} id="auth-form">
        {isRegister && (
          <div className="form-group">
            <label className="form-label" htmlFor="auth-name-input">
              Full Name
            </label>
            <input
              id="auth-name-input"
              type="text"
              className="form-input"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isRegister}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="auth-email-input">
            Email Address
          </label>
          <input
            id="auth-email-input"
            type="email"
            className="form-input"
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="auth-password-input">
            Password
          </label>
          <input
            id="auth-password-input"
            type="password"
            className="form-input"
            placeholder="••••••••"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isRegister && (
            <span className="form-hint">Must be at least 6 characters</span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          id="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner-inline">Processing...</span>
          ) : isRegister ? (
            'Create Account'
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            className="btn-text-link"
            id="auth-toggle-btn"
            onClick={() => {
              setIsRegister(!isRegister);
            }}
          >
            {isRegister ? 'Sign In' : 'Register now'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
