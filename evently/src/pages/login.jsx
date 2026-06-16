import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [, setLocation] = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // try {
    //   const response = await fetch('http://localhost:5000/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });
    try {
  // 1. Grab your dynamic Render URL in production, or fallback to localhost during local development
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // 2. Use template literals to append the endpoint cleanly
  const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Save token securely for API calls across your platform dashboard
      localStorage.setItem('token', data.token);
      
      // Redirect straight to your operational Evently dashboard
      setLocation('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inline Scoped CSS Block to keep the file fully standalone */}
      <style>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: system-ui, -apple-system, sans-serif;
          width: 100%;
        }

        .auth-card {
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 400px;
          box-sizing: border-box;
        }

        .auth-card h2 {
          margin: 0 0 0.5rem 0;
          color: #111827;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .auth-subtitle {
          color: #6b7280;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          margin-top: 0;
        }

        .form-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          text-align: left;
        }

        .form-group input {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #ff3366; /* Accent color matching your dashboard layout */
          box-shadow: 0 0 0 3px rgba(255, 51, 102, 0.1);
        }

        .auth-btn {
          width: 100%;
          padding: 0.75rem;
          background: #ff3366;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.2s;
        }

        .auth-btn:hover {
          background: #e02454;
        }

        .auth-btn:disabled {
          background: #f472b6;
          cursor: not-allowed;
        }

        .error-badge {
          background-color: #fee2e2;
          color: #991b1b;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
          margin-bottom: 1.25rem;
          border-left: 4px solid #dc2626;
          text-align: left;
        }

        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: #4b5563;
          margin-bottom: 0;
        }

        .auth-footer a {
          color: #ff3366;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back to Evently</h2>
          <p className="auth-subtitle">Log in to view your dashboard analytics</p>

          {error && <div className="error-badge">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Verifying Account...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;