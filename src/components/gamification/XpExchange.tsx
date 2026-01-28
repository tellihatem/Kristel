'use client';

import { useState } from 'react';
import { Coins, ArrowRightLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function XpExchange({ currentXp }: { currentXp: number }) {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ xp: number; balance: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const EXCHANGE_RATE = 0.10;
  const estimatedBalance = amount ? (Number(amount) * EXCHANGE_RATE).toFixed(2) : '0.00';

  const handleExchange = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid XP amount');
      return;
    }

    if (Number(amount) > currentXp) {
      setError('Insufficient XP');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/xp-exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xpAmount: Number(amount) }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess({ xp: Number(amount), balance: Number(estimatedBalance) });
        setAmount('');
        // Refresh page to update stats in navbar/dashboard
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError(data.error || 'Exchange failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
          <Coins className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold">XP Exchange</h3>
      </div>
      
      <p className="text-sm text-gray-400">
        Convert your hard-earned XP into virtual balance. 
        <span className="block mt-1 font-bold text-blue-400">Rate: 10 XP = $1.00</span>
      </p>

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>XP to convert</span>
            <span>Available: {currentXp.toLocaleString()} XP</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter XP amount"
              className="w-full bg-black border border-white/10 rounded-xl p-4 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              onClick={() => setAmount(currentXp.toString())}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-500 hover:text-blue-400"
            >
              MAX
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center py-2">
          <ArrowRightLeft className="h-5 w-5 text-gray-600" />
        </div>

        <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
          <span className="text-gray-400">You will receive:</span>
          <span className="text-xl font-bold text-green-500">${estimatedBalance}</span>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            {error}
          </p>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-sm text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
            <CheckCircle2 className="h-4 w-4" />
            <span>Successfully exchanged {success.xp} XP for ${success.balance}!</span>
          </div>
        )}

        <button
          onClick={handleExchange}
          disabled={loading || !amount || Number(amount) > currentXp}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Exchange XP</span>}
        </button>
      </div>
    </div>
  );
}
