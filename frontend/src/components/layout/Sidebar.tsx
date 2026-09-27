import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, CheckSquare, Users, UsersRound,
  Package, Wrench, ShoppingCart, Wallet, FileText, Bell, Settings,
  FileBarChart, ChevronLeft, X, ChevronDown, ChevronRight, ClipboardList,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  {
    label: 'Projets',
    icon: Building2,
    children: [
      { label: 'Tous les projets', href: '/projects' },
      { label: 'En cours', href: '/projects?status=en_cours' },
      { label: 'Terminés', href: '/projects?status=termine' },
      { label: 'En retard', href: '/projects?status=en_retard' },
    ],
  },
  {
    label: 'Opérations',
    icon: ClipboardList,
    children: [
      { label: 'Tâches', href: '/tasks' },
      { label: 'Planning', href: '/planning' },
      { label: 'Rapports', href: '/reports' },
      { label: 'Incidents', href: '/incidents' },
    ],
  },
  {
    label: 'Ressources',
    icon: Users,
    children: [
      { label: 'Employés', href: '/employees' },
      { label: 'Équipes', href: '/teams' },
      { label: 'Matériaux', href: '/materials' },
      { label: 'Équipements', href: '/equipment' },
    ],
  },
  {
    label: 'Achats & Stock',
    icon: ShoppingCart,
    children: [
      { label: 'Stock', href: '/stock' },
      { label: 'Achats', href: '/purchases' },
      { label: 'Fournisseurs', href: '/suppliers' },
    ],
  },
  {
    label: 'Finance',
    icon: Wallet,
    children: [
      { label: 'Budgets', href: '/budgets' },
      { label: 'Dépenses', href: '/expenses' },
      { label: 'Factures', href: '/invoices' },
      { label: 'Paiements', href: '/payments' },
    ],
  },
  {
    label: 'Partenaires',
    icon: UsersRound,
    children: [
      { label: 'Clients', href: '/clients' },
      { label: 'Sous-traitants', href: '/subcontractors' },
    ],
  },
  { label: 'Documents', icon: FileText, href: '/documents' },
  { label: 'Rapports', icon: FileBarChart, href: '/analytics' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  { label: 'Utilisateurs', icon: Users, href: '/users' },
  { label: 'Paramètres', icon: Settings, href: '/settings' },
];

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Projets', 'Opérations']);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const isActiveParent = (item: NavItem) => {
    if (!item.children) return false;
    return item.children.some(
      (child) => location.pathname === child.href || location.pathname.startsWith(child.href.split('?')[0] + '/')
    );
  };

  return (
    <aside
      className={cn(
        'fixed lg:static inset-y-0 left-0 z-30 flex flex-col bg-slate-900 text-white transition-all duration-300 flex-shrink-0',
        isCollapsed ? 'w-16' : 'w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-slate-700/50 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-base leading-tight">IMARA 360</h1>
              <p className="text-slate-400 text-xs truncate">Gestion Entreprise</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center w-full">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
          </div>
        )}
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white ml-2 flex-shrink-0">
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(item.label);
          const isActive = item.href
            ? location.pathname === item.href
            : isActiveParent(item);

          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => !isCollapsed && toggleExpanded(item.label)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </>
                  )}
                </button>
                {!isCollapsed && isExpanded && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-700/50 pl-3">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={({ isActive: active }) =>
                          cn(
                            'block px-3 py-2 rounded-md text-xs font-medium transition-colors',
                            active
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.href!}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive: active }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-slate-700/50 flex-shrink-0">
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={isCollapsed ? 'Agrandir' : 'Réduire'}
        >
          <ChevronLeft
            size={18}
            className={cn('transition-transform duration-300', isCollapsed && 'rotate-180')}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
