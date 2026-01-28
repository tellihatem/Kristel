'use client';

import { TelegramLoginButton } from '@/components/auth/TelegramLoginButton';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleAuth = async (user: any) => {
    const response = await fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      router.push('/');
      router.refresh();
    } else {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            TRADE<span className="text-blue-500">VIRTUAL</span>
          </h1>
          <p className="text-gray-400">Join the elite trading community</p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <div className="rounded-full bg-blue-500/10 p-4">
            <svg
              className="h-12 w-12 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.91-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Secure login via Telegram</p>
            <TelegramLoginButton 
              botName="TradeVirtualBot" // Replace with your actual bot username
              onAuth={handleAuth} 
            />
          </div>
        </div>

        <div className="text-xs text-gray-500">
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
