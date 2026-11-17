import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { KeyRound, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './AdminLogin.css';

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState(searchParams.get('otp') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      setError('Please enter your admin email.');
      return;
    }

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code (OTP).');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
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

      setSuccess(true);
      showToast({
        type: 'success',
        title: 'Password Updated!',
        message: res.message || 'Your password was reset successfully. Please sign in.',
      });

      // Redirect to admin login after 1.5 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code. Please request a new one.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-backdrop" />

      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-icon-badge">
            <KeyRound size={28} />
          </div>
          <h1 className="admin-login-title">Reset Admin Password</h1>
          <p className="admin-login-subtitle">
            Enter the 6-digit OTP code sent to your email and create your new password
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="admin-login-success">
            <CheckCircle2 size={16} />
            <span>Password updated successfully! Redirecting to login...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="admin-login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-login-group">
              <label htmlFor="reset-email">Admin Email</label>
              <div className="admin-login-input-wrap">
                <Mail size={18} className="admin-login-input-icon" />
                <input
                  id="reset-email"
                  type="email"
                  placeholder="Enter registered admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="admin-login-group">
              <label htmlFor="reset-otp">6-Digit Verification Code (OTP)</label>
              <div className="admin-login-input-wrap">
                <input
                  id="reset-otp"
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
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-login-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
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

            <button
              type="submit"
              className="admin-login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="admin-login-spinner-text">Updating Password...</span>
              ) : (
                <>
                  <span>Verify OTP &amp; Update Password</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="admin-login-footer">
          <Link to="/admin" className="admin-login-back-link">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
