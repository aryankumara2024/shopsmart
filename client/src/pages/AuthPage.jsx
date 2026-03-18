import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../components/Icon';
import './AuthPage.css';

export default function AuthPage({ isLogin = true, onNavigate }) {
  const [isLoginForm, setIsLoginForm] = useState(isLogin);

  const toggleForm = () => setIsLoginForm(!isLoginForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication process
    console.log(isLoginForm ? 'Logging in...' : 'Registering...');
    // Simply route to home for now as demonstration
    if (onNavigate) {
      onNavigate('home');
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
                  <input type="text" id="name" placeholder="John Doe" required />
                </div>
              </div>
            )}

            <div className="auth-form__group">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrap">
                <Icon name="mail" size={18} className="auth-input-icon" />
                <input type="email" id="email" placeholder="hello@example.com" required />
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
                <input type="password" id="password" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block auth-submit-btn">
              {isLoginForm ? 'Sign In' : 'Sign Up'}
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
                {isLoginForm ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

AuthPage.propTypes = {
  isLogin: PropTypes.bool,
  onNavigate: PropTypes.func
};
