import { Bell, Menu, Moon, Sun, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/formatters';
import { ROLE_LABELS } from '../../utils/constants';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-border flex items-center px-4 gap-4 flex-shrink-0 z-10">
      {/* Menu toggle */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search bar */}
      <div className="flex-1">
        <button className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors">
          <Search size={16} />
          <span className="hidden sm:block">Recherche globale...</span>
          <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-xs bg-muted border border-border rounded">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          onClick={() => navigate('/notifications')}
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.fullName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span className="text-white text-xs font-semibold">{getInitials(user?.fullName || 'U')}</span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-tight text-foreground">{user?.firstName}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABELS[user?.role || ''] || user?.role}</p>
            </div>
            <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl border border-border shadow-lg z-20 py-1 animate-fade-in">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <button
                  onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <User size={16} className="text-muted-foreground" />
                  Mon profil
                </button>
                <button
                  onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Settings size={16} className="text-muted-foreground" />
                  Paramètres
                </button>
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
