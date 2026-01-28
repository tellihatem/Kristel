import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { getServerSession } from '@/lib/session';

export async function Navbar() {
  const user = await getServerSession();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <Link href="/" className="flex ms-2 md:me-24">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white tracking-tight">
                TRADE<span className="text-blue-500">VIRTUAL</span>
              </span>
            </Link>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <Wallet className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-300">
                  ${user.virtualBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span className="text-xs font-bold text-blue-400">LVL {user.level}</span>
                <div className="ml-2 w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-500" 
                    style={{ width: `${(user.xp % 1000) / 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
