import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, BarChart2, TrendingUp, Settings as SettingsIcon, Dumbbell } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/progress', icon: Activity, label: 'My Progress' },
    { to: '/statistics', icon: BarChart2, label: 'My Statistics' },
    { to: '/analysis', icon: TrendingUp, label: 'Progress Analysis' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-[#161b22] border-r border-gray-200 dark:border-[#30363d] flex-shrink-0 flex flex-col transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-[#30363d]">
        <Dumbbell className="w-6 h-6 text-brand-600 dark:text-brand-400 mr-3" />
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">GYMSTAT</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx(
              'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#21262d] dark:hover:text-white'
            )}
          >
            <item.icon className={clsx('w-5 h-5 mr-3')} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
