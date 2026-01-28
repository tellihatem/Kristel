import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { User, TrendingUp, BarChart3, Clock, Award, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function ProfilePage() {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  const allTrades = await prisma.trade.findMany({
    where: { userId: user.id },
    orderBy: { timestamp: 'desc' },
  });

  const totalTrades = allTrades.length;
    const buyTrades = allTrades.filter((t: any) => t.type === 'BUY');
    const sellTrades = allTrades.filter((t: any) => t.type === 'SELL');
    
    // Calculate simple PnL (in a real app this would be more complex)
    const totalVolume = allTrades.reduce((acc: number, t: any) => acc + (Number(t.amount) * Number(t.price)), 0);

  const stats = [
    { label: 'Total Trades', value: totalTrades, icon: BarChart3, color: 'text-blue-500' },
    { label: 'Buy Orders', value: buyTrades.length, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Sell Orders', value: sellTrades.length, icon: TrendingUp, color: 'text-red-500' },
    { label: 'Trading Volume', value: `$${totalVolume.toLocaleString()}`, icon: Wallet, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-center space-x-4">
        <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
          {user.username ? user.username[0].toUpperCase() : 'T'}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.username || 'Anonymous Trader'}</h1>
          <p className="text-gray-400">Level {user.level} • {user.xp} XP</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Activity Timeline
            </h2>
            <div className="space-y-6">
              {allTrades.length > 0 ? (
                allTrades.map((trade: any, index: number) => (
                  <div key={trade.id} className="relative pl-8 pb-6 last:pb-0">
                    {index !== allTrades.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-white/5"></div>
                    )}
                    <div className={cn(
                      "absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-black flex items-center justify-center",
                      trade.type === 'BUY' ? "bg-green-500" : "bg-red-500"
                    )}></div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold">
                          {trade.type === 'BUY' ? 'Purchased' : 'Sold'} {trade.amount} {trade.symbol}
                        </p>
                        <p className="text-sm text-gray-500">
                          at ${Number(trade.price).toLocaleString()} per unit
                        </p>
                      </div>
                      <div className="mt-1 sm:mt-0 text-right">
                        <p className="text-sm font-medium text-gray-400">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(trade.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 italic">
                  No activity found. Start trading to see your timeline!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Performance
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Balance</span>
                <span className="font-bold text-green-500">${Number(user.virtualBalance).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">XP Progress</span>
                <span className="font-bold text-blue-500">{user.xp} XP</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500" 
                  style={{ width: `${(user.xp % 1000) / 10}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center">Next level in {1000 - (user.xp % 1000)} XP</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-2">Share Performance</h3>
            <p className="text-sm text-blue-100 mb-4 opacity-80">Let others know how your portfolio is doing.</p>
            <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Export Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
