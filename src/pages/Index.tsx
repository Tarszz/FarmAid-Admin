
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // Redirect to login or dashboard based on authentication status
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-admin-primary mb-4">
          AgriWatch <span className="text-admin-secondary">Admin</span>
        </h1>
        <p className="text-xl text-admin-textSecondary">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
