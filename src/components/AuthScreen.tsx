import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface AuthScreenProps {
  onSignIn: (email: string, password: string) => Promise<{ error: any }>;
  onSignUp: (email: string, password: string) => Promise<{ error: any }>;
  onSkip: () => void;
}

export const AuthScreen = ({ onSignIn, onSignUp, onSkip }: AuthScreenProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = isSignUp 
        ? await onSignUp(email, password)
        : await onSignIn(email, password);

      console.log('Auth result:', result);

      if (result?.error) {
        console.error('Auth error:', result.error);
        toast.error(result.error.message || 'Authentication failed');
      } else {
        toast.success(isSignUp ? 'Account created successfully!' : 'Signed in successfully!');
      }
    } catch (error) {
      console.error('Auth exception:', error);
      toast.error(`Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070A09] p-4">
      <div className="w-full max-w-md space-y-8">
        {/* App Icon & Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img 
              src="/MessIcon.png" 
              alt="Messly" 
              className="w-16 h-16 rounded-[18px] shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Messly</h1>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-[#111513] rounded-3xl p-5 space-y-5">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold text-white">
              {isSignUp ? 'Create Account' : 'Sign in to continue'}
            </h2>
            <p className="text-sm text-[rgba(235,235,245,0.6)] leading-relaxed">
              {isSignUp 
                ? 'Keep your mess records safe and in sync.'
                : 'Access your mess records across devices.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full min-h-[48px] px-4 py-2.5 text-base bg-[#1A1F1D] border border-[rgba(255,255,255,0.12)] rounded-xl text-white placeholder:text-[rgba(235,235,245,0.6)] focus:outline-none focus:ring-2 focus:ring-[#30D158] focus:border-transparent transition-all disabled:opacity-50"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Required"
                className="w-full min-h-[48px] px-4 py-2.5 text-base bg-[#1A1F1D] border border-[rgba(255,255,255,0.12)] rounded-xl text-white placeholder:text-[rgba(235,235,245,0.6)] focus:outline-none focus:ring-2 focus:ring-[#30D158] focus:border-transparent transition-all disabled:opacity-50"
                disabled={isLoading}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] px-4 py-2.5 text-base font-semibold rounded-xl bg-[#30D158] text-black hover:bg-[#5CFD98] active:scale-95 active:opacity-70 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Creating...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-sm text-[rgba(235,235,245,0.6)] hover:text-[#5CFD98] transition-colors active:scale-95 transition-all duration-150 pt-1"
              disabled={isLoading}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create Account"}
            </button>
          </form>
        </div>

        {/* Guest Mode / Local Only */}
        <div className="space-y-2">
          <button
            onClick={onSkip}
            className="w-full min-h-[48px] px-4 py-2.5 text-base font-semibold rounded-xl bg-[#1A1F1D] text-white border border-[rgba(255,255,255,0.12)] hover:bg-[#111513] active:scale-95 active:opacity-70 transition-all duration-150"
            disabled={isLoading}
          >
            Continue Without Account
          </button>
          <p className="text-center text-xs text-[rgba(235,235,245,0.6)] leading-relaxed px-4">
            Your data will be saved on this device only.
          </p>
        </div>

        {/* Security / Sync Info */}
        <div className="text-center px-4">
          <p className="text-[10px] text-[rgba(235,235,245,0.6)] leading-relaxed">
            Sign in to securely back up your data across all devices.
          </p>
        </div>
      </div>
    </div>
  );
};
