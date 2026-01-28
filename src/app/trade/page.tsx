'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

const ASSETS = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'BNBUSDT', name: 'Binance Coin' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin' },
];

export default function TradePage() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price');
        const data = await response.json();
        const priceMap: Record<string, number> = {};
        data.forEach((item: any) => {
          if (ASSETS.find(a => a.symbol === item.symbol)) {
            priceMap[item.symbol] = parseFloat(item.price);
          }
        });
        setPrices(priceMap);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/trade/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedAsset.symbol,
          type,
          amount: Number(amount),
          price: prices[selectedAsset.symbol],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Successfully ${type === 'BUY' ? 'bought' : 'sold'} ${amount} ${selectedAsset.name}` });
        setAmount('');
        // We might want to trigger a refresh of the user balance here
        window.location.reload(); // Simple way to refresh session data
      } else {
        setMessage({ type: 'error', text: data.error || 'Trade failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Trading Center</h1>
        <p className="text-gray-400">Real-time virtual asset trading</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold">Markets</h2>
          <div className="space-y-2">
            {ASSETS.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                  selectedAsset.symbol === asset.symbol
                    ? "bg-blue-500/10 border-blue-500"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                <div className="flex flex-col items-start">
                  <span className="font-bold">{asset.symbol.replace('USDT', '')}</span>
                  <span className="text-xs text-gray-500">{asset.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {prices[asset.symbol] ? `$${prices[asset.symbol].toLocaleString()}` : 'Loading...'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trading Terminal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedAsset.name}</h2>
                <p className="text-gray-400">{selectedAsset.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-500">
                  {prices[selectedAsset.symbol] ? `$${prices[selectedAsset.symbol].toLocaleString()}` : '---'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 uppercase tracking-wider font-bold">Amount to Trade</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-xl focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    {selectedAsset.symbol.replace('USDT', '')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Estimated Total:</span>
                <span className="text-white font-bold">
                  {prices[selectedAsset.symbol] && amount ? `$${(Number(amount) * prices[selectedAsset.symbol]).toLocaleString()}` : '$0.00'}
                </span>
              </div>

              {message && (
                <div className={cn(
                  "p-4 rounded-xl text-sm font-medium",
                  message.type === 'success' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => handleTrade('BUY')}
                  disabled={loading || !amount}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><TrendingUp className="h-5 w-5" /> <span>BUY</span></>}
                </button>
                <button
                  onClick={() => handleTrade('SELL')}
                  disabled={loading || !amount}
                  className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><TrendingDown className="h-5 w-5" /> <span>SELL</span></>}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl min-h-[200px] flex flex-col items-center justify-center text-gray-500 italic">
            <p>Advanced Charting integration in Phase 6...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
