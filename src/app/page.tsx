import { TrendingUp, Users, Award, Clock } from 'lucide-react';
import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { XpExchange } from '@/components/gamification/XpExchange';

export default async function Home() {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  const recentTrades = await prisma.trade.findMany({
    where: { userId: user.id },
    orderBy: { timestamp: 'desc' },
    take: 5,
  });

  const stats = [
    { label: 'Total Balance', value: `$${Number(user.virtualBalance).toLocaleString()}`, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total XP', value: user.xp.toLocaleString(), icon: Award, color: 'text-blue-500' },
    { label: 'Level', value: user.level.toString(), icon: Users, color: 'text-purple-500' },
    { label: 'Active Trades', value: '0', icon: Clock, color: 'text-orange-500' }, // Placeholder for active trades logic
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user.username || 'Trader'}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl min-h-[300px]">
            <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
            <div className="flex items-center justify-center h-full text-gray-500 italic">
              Chart integration coming soon...
            </div>
          </div>
          
          <XpExchange currentXp={user.xp} />
        </div>
        
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentTrades.length > 0 ? (
              recentTrades.map((trade: any) => (
                <div key={trade.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="font-medium">{trade.type} {trade.symbol}</p>
                    <p className="text-xs text-gray-500">{new Date(trade.timestamp).toLocaleString()}</p>
                  </div>
                  <p className={trade.type === 'BUY' ? 'text-red-500' : 'text-green-500'}>
                    {trade.type === 'BUY' ? '-' : '+'}${Number(trade.amount * trade.price).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-4">No recent trades</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
