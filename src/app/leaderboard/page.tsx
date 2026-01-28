'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, User as UserIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardUser {
  id: string;
  username: string | null;
  xp: number;
  level: number;
  virtualBalance: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        if (response.ok) {
          setUsers(data.leaderboard);
          setCurrentUserRank(data.currentUserRank);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-gray-400">Global rankings by XP and performance</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Trader</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Level</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">XP</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user, index) => {
                const rank = index + 1;
                const isTopThree = rank <= 3;
                
                return (
                  <tr 
                    key={user.id} 
                    className={cn(
                      "hover:bg-white/5 transition-colors",
                      rank === currentUserRank && "bg-blue-500/10"
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {rank === 1 && <Trophy className="h-5 w-5 text-yellow-500 mr-2" />}
                        {rank === 2 && <Medal className="h-5 w-5 text-gray-300 mr-2" />}
                        {rank === 3 && <Medal className="h-5 w-5 text-amber-600 mr-2" />}
                        <span className={cn(
                          "font-bold",
                          isTopThree ? "text-lg" : "text-gray-400"
                        )}>
                          #{rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                          <UserIcon className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="font-medium text-white">
                          {user.username || `Trader_${user.id.slice(0, 4)}`}
                          {rank === currentUserRank && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">You</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-blue-400 font-bold">LVL {user.level}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-gray-300 font-medium">{user.xp.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-green-500 font-bold">
                      ${Number(user.virtualBalance).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="py-12 text-center text-gray-500 italic">
              No traders found yet. Be the first!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
