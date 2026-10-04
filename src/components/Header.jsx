import { useGym } from '../context/GymContext';
import { User } from 'lucide-react';

const Header = () => {
  const { profile } = useGym();

  return (
    <header className="h-16 bg-white dark:bg-[#161b22] border-b border-gray-200 dark:border-[#30363d] flex items-center justify-between px-6 transition-colors">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">
        Fitness Statistical Analysis
      </h2>
      <div className="flex-1 sm:hidden"></div>
      <div className="flex items-center space-x-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{profile?.name || 'User'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{profile?.goal || 'Fitness Goal'}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
};

export default Header;
