import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '@/services/firebase/config';
import { loginWithEmail } from '@/services/firebase/auth';
import { APP_ROUTES } from '@/app/router/constants';
import { Card } from '@/components/common'; 
import { Button } from '@/components/common/Button'; 

export const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        // Handle Account Creation
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
        // Note: You can save the rollNo to your Firestore 'users' collection here if needed
        navigate(APP_ROUTES.dashboard);
      } else {
        // Handle Standard Login
        const result = await loginWithEmail(email, password);
        if (result.ok) {
          navigate(APP_ROUTES.dashboard);
        } else {
          setError(result.error.message);
        }
      }
    } catch (err: any) {
      // Catch Firebase registration errors (like weak password or email already in use)
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 py-16 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h1>
        <p className="mt-2 text-text-secondary">
          {isSignUp ? 'Sign up to start tracking your mess meals' : 'Sign in to your mess account'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {/* Only show Roll Number input if the user is signing up */}
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="rollNo">
                Roll Number
              </label>
              <input
                id="rollNo"
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="b25354"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required={isSignUp}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting 
              ? (isSignUp ? 'Creating Account...' : 'Signing in...') 
              : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="font-semibold text-primary hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </Card>
    </section>
  );
};