import { useState } from 'react';
import { Plus, Search, Building2, MapPin, Calendar, Users, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, PROJECT_TYPE_LABELS } from '../../utils/constants';

const MOCK_PROJECTS = [
  { _id: '1', reference: 'PRJ-2024-001', name: 'Résidence Al Amal', type: 'residence', status: 'en_cours', priority: 'haute', progress: 65, location: { city: 'Casablanca' }, dates: { plannedEndDate: '2025-06-30' }, budget: { total: 8500000, consumed: 5525000 }, _teamCount: 3, description: 'Complexe résidentiel de 48 appartements avec parking souterrain' },
  { _id: '2', reference: 'PRJ-2024-002', name: 'Immeuble Casablanca Business', type: 'immeuble', status: 'en_cours', priority: 'normale', progress: 42, location: { city: 'Casablanca' }, dates: { plannedEndDate: '2026-02-28' }, budget: { total: 12000000, consumed: 5040000 }, _teamCount: 5, description: 'Immeuble de bureaux R+10 en centre-ville' },
  { _id: '3', reference: 'PRJ-2024-003', name: 'Villa Sidi Maarouf', type: 'villa', status: 'en_retard', priority: 'haute', progress: 78, location: { city: 'Casablanca' }, dates: { plannedEndDate: '2024-08-31' }, budget: { total: 3200000, consumed: 2688000 }, _teamCount: 2, description: 'Villa de luxe avec piscine et jardin paysagé' },
  { _id: '4', reference: 'PRJ-2024-004', name: 'Route Provinciale RN9', type: 'route', status: 'preparation', priority: 'critique', progress: 10, location: { city: 'Settat' }, dates: { plannedEndDate: '2025-12-31' }, budget: { total: 6800000, consumed: 680000 }, _teamCount: 4, description: 'Restructuration 45km de route provinciale' },
  { _id: '5', reference: 'PRJ-2024-005', name: 'Aménagement Lotissement Nour', type: 'lotissement', status: 'planification', priority: 'normale', progress: 5, location: { city: 'Marrakech' }, dates: { plannedEndDate: '2026-04-30' }, budget: { total: 4200000, consumed: 210000 }, _teamCount: 1, description: 'Aménagement de lotissement 120 lots avec VRD' },
];

const FILTER_TABS = [
  { key: 'all', label: 'Tous', count: 5 },
  { key: 'en_cours', label: 'En cours', count: 2 },
  { key: 'preparation', label: 'Préparation', count: 1 },
  { key: 'en_retard', label: 'En retard', count: 1 },
  { key: 'planification', label: 'Planification', count: 1 },
];

type Project = typeof MOCK_PROJECTS[0];

const ProjectCard = ({ project }: { project: Project }) => {
  const budgetPercent = Math.round((project.budget.consumed / project.budget.total) * 100);
  return (
    <Link
      to={`/projects/${project._id}`}
      className="card hover:shadow-card-hover transition-all duration-200 block group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono">{project.reference}</span>
            <span className={cn('badge', PROJECT_STATUS_COLORS[project.status])}>
              {PROJECT_STATUS_LABELS[project.status]}
            </span>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors truncate">
            {project.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{PROJECT_TYPE_LABELS[project.type]}</p>
        </div>
        <button className="p-1 rounded hover:bg-muted transition-colors" onClick={(e) => e.preventDefault()}>
          <MoreHorizontal size={16} className="text-muted-foreground" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

      {/* Avancement */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Avancement</span>
          <span className="font-semibold text-foreground">{project.progress}%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              project.progress >= 70 ? 'bg-green-500' : project.progress >= 40 ? 'bg-blue-500' : 'bg-yellow-500'
            )}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Budget */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Budget consommé</span>
          <span className={cn('font-medium', budgetPercent >= 90 ? 'text-red-600' : budgetPercent >= 75 ? 'text-orange-600' : 'text-foreground')}>
            {budgetPercent}%
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">{formatCurrency(project.budget.consumed)}</span>
          <span className="text-muted-foreground">/ {formatCurrency(project.budget.total)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={12} />
          <span>{project.location.city}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={12} />
          <span>{formatDate(project.dates.plannedEndDate)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users size={12} />
          <span>{project._teamCount} éq.</span>
        </div>
      </div>
    </Link>
  );
};

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || p.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projets</h1>
          <p className="text-muted-foreground text-sm mt-1">{MOCK_PROJECTS.length} projets au total</p>
        </div>
        <Link
          to="/projects/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex-shrink-0"
        >
          <Plus size={18} />
          Nouveau projet
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-1 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                activeFilter === tab.key
                  ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-xs',
                activeFilter === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-border text-muted-foreground'
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Building2 size={48} className="text-muted-foreground/30 mb-4" />
          <p className="text-foreground font-medium">Aucun projet trouvé</p>
          <p className="text-muted-foreground text-sm mt-1">Modifiez vos filtres ou créez un nouveau projet</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
