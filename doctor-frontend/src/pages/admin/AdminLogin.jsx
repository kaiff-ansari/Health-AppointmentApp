import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login } = useAuth();
  const { showToast } = useApp();

  // Modes: 'login' | 'forgot' | 'otp'
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Sign In
  async function handleLoginSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      showToast({
        type: 'success',
        title: 'Welcome Back',
        message: `Signed in as ${user.name || 'Administrator'}.`,
      });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  // 2. Request OTP
  async function handleForgotSubmit(e) {
    e.preventDefault();
    if (!email) {
      setError('Please enter your admin email address.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await api.forgotPassword(email);
      setSuccessMsg(res.message || 'A 6-digit verification code has been sent to your email.');
      setMode('otp'); // advance to OTP step!
      showToast({
        type: 'success',
        title: 'OTP Code Sent',
        message: 'Please check your email for the 6-digit verification code.',
      });
    } catch (err) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // 3. Verify OTP and Set New Password
  async function handleOtpSubmit(e) {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      setError('Please enter the OTP code and new password.');
      return;
    }

    if (otp.trim().length !== 6) {
      setError('Verification code must be a 6-digit code.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      showToast({
        type: 'success',
        title: 'Password Updated!',
        message: res.message || 'Password reset successfully! Please log in.',
      });

      // Switch back to login mode with the new password prefilled
      setPassword(newPassword);
      setMode('login');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg('Your password has been updated! You can now sign in.');
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-backdrop" />

      <div className="admin-login-card">
        {/* Brand Header */}
        <div className="admin-login-header">
          <div className="admin-login-icon-badge">
            {mode === 'login' ? <Shield size={28} /> : <KeyRound size={28} />}
          </div>
          <h1 className="admin-login-title">
            {mode === 'login' && 'Admin Console'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'otp' && 'Enter Verification Code'}
          </h1>
          <p className="admin-login-subtitle">
            {mode === 'login' && 'Sign in to manage patient appointments, clinic content & doctor profile'}
            {mode === 'forgot' && 'Enter your admin email address to receive a 6-digit verification code'}
            {mode === 'otp' && `Enter the 6-digit OTP code sent to ${email} and choose a new password`}
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="admin-login-success">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="admin-login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Mode 1: Sign In ─────────────────────────────────────────── */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="admin-login-form">
            <div className="admin-login-group">
              <label htmlFor="admin-email">Admin Email Address</label>
              <div className="admin-login-input-wrap">
                <Mail size={18} className="admin-login-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="e.g. admin@heartcare.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="admin-login-group">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-login-input-wrap">
                <Lock size={18} className="admin-login-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-login-forgot-row">
              <button
                type="button"
                className="admin-login-forgot-btn"
                onClick={() => {
                  setMode('forgot');
                  setError('');
                  setSuccessMsg('');
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="admin-login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="admin-login-spinner-text">Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ── Mode 2: Request OTP ─────────────────────────────────────── */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="admin-login-form">
            <div className="admin-login-group">
              <label htmlFor="forgot-email">Admin Registered Email</label>
              <div className="admin-login-input-wrap">
                <Mail size={18} className="admin-login-input-icon" />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your registered admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="admin-login-spinner-text">Sending OTP...</span>
              ) : (
                <>
                  <span>Send Verification Code (OTP)</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ── Mode 3: Submit OTP & Set New Password ───────────────────── */}
        {mode === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="admin-login-form">
            <div className="admin-login-group">
              <label htmlFor="admin-otp">6-Digit Verification Code (OTP)</label>
              <div className="admin-login-input-wrap">
                <input
                  id="admin-otp"
                  type="text"
                  maxLength={6}
                  className="admin-login-otp-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <div className="admin-login-group">
              <label htmlFor="new-password">New Password</label>
              <div className="admin-login-input-wrap">
                <Lock size={18} className="admin-login-input-icon" />
                <input
                  id="new-password"
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-login-eye-btn"
                  onClick={() => setShowNewPass(!showNewPass)}
                  aria-label={showNewPass ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-login-group">
              <label htmlFor="confirm-password">Confirm New Password</label>
              <div className="admin-login-input-wrap">
                <Lock size={18} className="admin-login-input-icon" />
                <input
                  id="confirm-password"
                  type={showConfirmPass ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-login-eye-btn"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  aria-label={showConfirmPass ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-login-resend-row">
              <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted, #5a7899)' }}>
                Didn't get the code?
              </span>
              <button
                type="button"
                className="admin-login-resend-btn"
                onClick={handleForgotSubmit}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              className="admin-login-submit-btn"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? (
                <span className="admin-login-spinner-text">Verifying &amp; Updating...</span>
              ) : (
                <>
                  <span>Verify OTP &amp; Update Password</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="admin-login-footer">
          {mode !== 'login' ? (
            <button
              type="button"
              className="admin-login-back-link"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMsg('');
              }}
            >
              ← Back to Sign In
            </button>
          ) : (
            <Link to="/" className="admin-login-back-link">
              ← Return to Public Website
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
