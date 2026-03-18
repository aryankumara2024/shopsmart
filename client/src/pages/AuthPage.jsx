import { useState } from 'react';

import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const API_URL = `http://${window.location.hostname}:5001/api`;

export default function AuthPage({ isLogin = true, onNavigate }) {
  const [isLoginForm, setIsLoginForm] = useState(isLogin);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginContext } = useAuth();

  const toggleForm = () => setIsLoginForm(!isLoginForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = isLoginForm ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
    const payload = isLoginForm ? { email, password } : { username: name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.message || 'Authentication failed');
        return;
      }
      
      if (!isLoginForm) {
        alert('Account created! Please log in.');
        toggleForm();
        return;
      }
      
      if (data.token && data.user) {
        loginContext(data.user, data.token);
      } else if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      if (onNavigate) {
        onNavigate('home');
      }
    } catch (err) {
      console.error(err);
      alert('Network error or server is down');
    }
  };

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div className="auth-bg-orb auth-bg-orb--1"></div>
      <div className="auth-bg-orb auth-bg-orb--2"></div>

      <div className="container auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="auth-logo">
              <div className="auth-logo__icon">
                <Icon name="shoppingBag" size={24} />
              </div>
              ShopSmart
            </div>
            <h1 className="auth-title">
              {isLoginForm ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="auth-subtitle">
              {isLoginForm 
                ? 'Enter your credentials to access your account' 
                : 'Join us to get the best shopping experience'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLoginForm && (
              <div className="auth-form__group">
                <label htmlFor="name">Full Name</label>
                <div className="auth-input-wrap">
                  <Icon name="user" size={18} className="auth-input-icon" />
                  <input type="text" id="name" name="username" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>
              </div>
            )}

            <div className="auth-form__group">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrap">
                <Icon name="mail" size={18} className="auth-input-icon" />
                <input type="email" id="email" name="email" placeholder="hello@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="auth-form__group">
              <div className="auth-form__group-header">
                <label htmlFor="password">Password</label>
                {isLoginForm && (
                  <button type="button" className="auth-forgot-link">Forgot password?</button>
                )}
              </div>
              <div className="auth-input-wrap">
                <Icon name="lock" size={18} className="auth-input-icon" />
                <input type="password" id="password" name="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block auth-submit-btn">
              {isLoginForm ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="auth-social">
            <button type="button" className="btn btn-secondary auth-social-btn">
              <Icon name="github" size={20} /> GitHub
            </button>
            <button type="button" className="btn btn-secondary auth-social-btn">
               Google
            </button>
          </div>

          <div className="auth-footer">
            <p>
              {isLoginForm ? "Don't have an account?" : "Already have an account?"}
              <button className="auth-toggle-btn" onClick={toggleForm}>
                {isLoginForm ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

