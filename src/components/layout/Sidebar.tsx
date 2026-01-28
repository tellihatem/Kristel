import Link from 'next/link';
import { LayoutDashboard, TrendingUp, Trophy, User, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Trade', href: '/trade', icon: TrendingUp },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black pt-16 transition-transform sm:translate-x-0">
      <div className="h-full overflow-y-auto px-3 py-4">
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center rounded-lg p-2 text-white hover:bg-white/5 group"
              >
                <item.icon className="h-5 w-5 text-gray-400 transition duration-75 group-hover:text-white" />
                <span className="ms-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4 border-t border-white/10">
           <Link
                href="/settings"
                className="flex items-center rounded-lg p-2 text-white hover:bg-white/5 group"
              >
                <Settings className="h-5 w-5 text-gray-400 transition duration-75 group-hover:text-white" />
                <span className="ms-3">Settings</span>
              </Link>
        </div>
      </div>
    </aside>
  );
}
