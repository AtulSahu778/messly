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
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/MessIcon.png" 
              alt="Messly" 
              className="w-20 h-20 rounded-[22px] shadow-lg"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold text-white tracking-tight">Messly</h1>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-[#111513] rounded-3xl p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-[22px] font-semibold text-white">
              {isSignUp ? 'Create Account' : 'Sign in to continue'}
            </h2>
            <p className="text-[15px] text-[rgba(235,235,245,0.6)] leading-relaxed">
              {isSignUp 
                ? 'Create your Messly account to keep your mess and meal records safe and in sync.'
                : 'Use your Messly account to keep your mess and meal records safe and in sync.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-white uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full min-h-[52px] px-4 py-3 text-[17px] bg-[#1A1F1D] border border-[rgba(255,255,255,0.12)] rounded-2xl text-white placeholder:text-[rgba(235,235,245,0.6)] focus:outline-none focus:ring-2 focus:ring-[#30D158] focus:border-transparent transition-all disabled:opacity-50"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-white uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Required"
                className="w-full min-h-[52px] px-4 py-3 text-[17px] bg-[#1A1F1D] border border-[rgba(255,255,255,0.12)] rounded-2xl text-white placeholder:text-[rgba(235,235,245,0.6)] focus:outline-none focus:ring-2 focus:ring-[#30D158] focus:border-transparent transition-all disabled:opacity-50"
                disabled={isLoading}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[52px] px-5 py-3.5 text-[17px] font-semibold rounded-2xl bg-[#30D158] text-black hover:bg-[#5CFD98] active:scale-95 active:opacity-70 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-[15px] text-[rgba(235,235,245,0.6)] hover:text-[#5CFD98] transition-colors active:scale-95 transition-all duration-150 pt-2"
              disabled={isLoading}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create Account"}
            </button>
          </form>
        </div>

        {/* Guest Mode / Local Only */}
        <div className="space-y-3">
          <button
            onClick={onSkip}
            className="w-full min-h-[52px] px-5 py-3.5 text-[17px] font-semibold rounded-2xl bg-[#1A1F1D] text-white border border-[rgba(255,255,255,0.12)] hover:bg-[#111513] active:scale-95 active:opacity-70 transition-all duration-150"
            disabled={isLoading}
          >
            Continue Without Account
          </button>
          <p className="text-center text-[13px] text-[rgba(235,235,245,0.6)] leading-relaxed px-4">
            Your data will be saved on this device only.
          </p>
        </div>

        {/* Security / Sync Info */}
        <div className="text-center px-4">
          <p className="text-[11px] text-[rgba(235,235,245,0.6)] leading-relaxed">
            When you sign in with Messly, your mess data is securely backed up and available on all your devices.
          </p>
        </div>
      </div>
    </div>
  );
};
