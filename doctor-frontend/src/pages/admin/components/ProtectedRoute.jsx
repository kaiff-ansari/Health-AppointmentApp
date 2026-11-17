import { useAuth } from '../../../context/AuthContext';
import AdminLogin from '../AdminLogin';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070d18',
          color: '#94a3b8',
          gap: 16,
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            border: '3px solid rgba(14, 165, 160, 0.2)',
            borderTopColor: '#0ea5a0',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
          Verifying admin session...
        </span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return children;
}
