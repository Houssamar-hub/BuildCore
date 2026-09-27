import {
  Building2, Users, Wrench, TrendingUp, AlertTriangle,
  CheckSquare, PackageOpen, FileText, DollarSign, Clock, ArrowUpRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from '../../utils/constants';
import { cn } from '../../utils/cn';

// Mock data — remplacé par API en Phase 3
const statsData = {
  projects: { total: 12, actifs: 7, termines: 3, enRetard: 2 },
  employees: { total: 48, actifs: 43 },
  equipment: { total: 24, disponible: 18, enMaintenance: 3 },
  suppliers: { total: 15 },
  finance: {
    budgetGlobal: 45000000,
    depenses: 28500000,
    facturesImpayees: 3200000,
    paiementsAttente: 5,
  },
  operations: {
    tachesEnCours: 34,
    tachesEnRetard: 8,
    incidentsOuverts: 3,
    stocksFaibles: 5,
  },
};

const recentProjects = [
  { _id: '1', name: 'Résidence Al Amal', type: 'residence', status: 'en_cours', progress: 65, budget: { total: 8500000, consumed: 5525000 } },
  { _id: '2', name: 'Immeuble Casablanca Business', type: 'immeuble', status: 'en_cours', progress: 42, budget: { total: 12000000, consumed: 5040000 } },
  { _id: '3', name: 'Villa Sidi Maarouf', type: 'villa', status: 'en_retard', progress: 78, budget: { total: 3200000, consumed: 2688000 } },
  { _id: '4', name: 'Route Provinciale RN9', type: 'route', status: 'preparation', progress: 10, budget: { total: 6800000, consumed: 680000 } },
  { _id: '5', name: 'Aménagement Lotissement Nour', type: 'lotissement', status: 'planification', progress: 5, budget: { total: 4200000, consumed: 210000 } },
];

const monthlyExpenses = [
  { month: 'Juil', depenses: 2800000, budget: 4000000 },
  { month: 'Août', depenses: 3200000, budget: 4000000 },
  { month: 'Sept', depenses: 3800000, budget: 4200000 },
];

const pieData = [
  { name: 'En cours', value: 7, color: '#22c55e' },
  { name: 'Préparation', value: 2, color: '#3b82f6' },
  { name: 'En retard', value: 2, color: '#ef4444' },
  { name: 'Terminé', value: 1, color: '#94a3b8' },
];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor }: StatCardProps) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className={cn('p-3 rounded-xl flex-shrink-0', bgColor)}>
        <Icon size={22} className={color} />
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de Bord</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Vue globale de l'entreprise — Septembre 2026
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Système opérationnel
        </span>
      </div>

      {/* Stats Projets */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Projets</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Projets Actifs" value={statsData.projects.actifs} subtitle={`${statsData.projects.total} au total`} icon={Building2} color="text-blue-600" bgColor="bg-blue-100" />
          <StatCard title="Terminés" value={statsData.projects.termines} icon={CheckSquare} color="text-green-600" bgColor="bg-green-100" />
          <StatCard title="En Retard" value={statsData.projects.enRetard} icon={Clock} color="text-red-600" bgColor="bg-red-100" />
          <StatCard title="Employés" value={statsData.employees.total} subtitle={`${statsData.employees.actifs} actifs`} icon={Users} color="text-violet-600" bgColor="bg-violet-100" />
        </div>
      </div>

      {/* Stats Financières */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Finances</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Budget Global" value={formatCurrency(statsData.finance.budgetGlobal)} icon={TrendingUp} color="text-blue-600" bgColor="bg-blue-100" />
          <StatCard
            title="Dépenses"
            value={formatCurrency(statsData.finance.depenses)}
            subtitle={`${Math.round((statsData.finance.depenses / statsData.finance.budgetGlobal) * 100)}% du budget`}
            icon={DollarSign}
            color="text-orange-600"
            bgColor="bg-orange-100"
          />
          <StatCard
            title="Factures Impayées"
            value={formatCurrency(statsData.finance.facturesImpayees)}
            subtitle={`${statsData.finance.paiementsAttente} en attente`}
            icon={FileText}
            color="text-red-600"
            bgColor="bg-red-100"
          />
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique Dépenses */}
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-foreground mb-4">Dépenses vs Budget (DH)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="budget" fill="#dbeafe" radius={[4, 4, 0, 0]} name="Budget" />
              <Bar dataKey="depenses" fill="#2563eb" radius={[4, 4, 0, 0]} name="Dépenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Projets par statut */}
        <div className="card">
          <h3 className="font-semibold text-foreground mb-4">Projets par Statut</h3>
          <div className="flex justify-center">
            <PieChart width={160} height={160}>
              <Pie data={pieData} cx={80} cy={80} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projets récents */}
      <div className="card p-0">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Projets Récents</h3>
          <a href="/projects" className="text-sm text-blue-600 hover:underline font-medium">
            Voir tous
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projet</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avancement</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentProjects.map((project) => (
                <tr key={project._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{project.type.replace('_', ' ')}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('badge', PROJECT_STATUS_COLORS[project.status])}>
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-24">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            project.progress >= 70 ? 'bg-green-500' : project.progress >= 40 ? 'bg-blue-500' : 'bg-yellow-500'
                          )}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{formatCurrency(project.budget.consumed)}</p>
                      <p className="text-xs text-muted-foreground">/ {formatCurrency(project.budget.total)}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertes opérationnelles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-orange-400">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-2xl font-bold text-foreground">{statsData.operations.tachesEnRetard}</p>
              <p className="text-xs text-muted-foreground">Tâches en retard</p>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-l-red-400">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="text-2xl font-bold text-foreground">{statsData.operations.incidentsOuverts}</p>
              <p className="text-xs text-muted-foreground">Incidents ouverts</p>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-l-yellow-400">
          <div className="flex items-center gap-3">
            <PackageOpen size={20} className="text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-2xl font-bold text-foreground">{statsData.operations.stocksFaibles}</p>
              <p className="text-xs text-muted-foreground">Stocks faibles</p>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-l-blue-400">
          <div className="flex items-center gap-3">
            <Wrench size={20} className="text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-2xl font-bold text-foreground">{statsData.equipment.enMaintenance}</p>
              <p className="text-xs text-muted-foreground">En maintenance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
