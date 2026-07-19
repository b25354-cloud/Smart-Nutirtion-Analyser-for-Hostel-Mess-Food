import { useNavigate } from 'react-router-dom';
import { signOutUser } from '@/services/firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/common';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/app/router/constants';

export const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await signOutUser();
    
    if (result.ok) {
      // Successfully logged out, redirect to the landing page
      navigate(ROUTES.home);
    } else {
      console.error("Logout failed:", result.error);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-8 px-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="mt-1 text-text-secondary">Manage your account settings and preferences.</p>
      </div>

      <Card className="space-y-6 p-6">
        <div>
          <h3 className="text-sm font-medium text-text-secondary">Account Email</h3>
          <p className="text-lg font-semibold text-text-primary mt-1">
            {user?.email || 'Loading...'}
          </p>
        </div>

        {/* You can display the Roll Number here later if you fetch it from your database */}

        <div className="pt-6 border-t border-border">
          <Button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md transition"
          >
            Log Out
          </Button>
        </div>
      </Card>
    </section>
  );
};