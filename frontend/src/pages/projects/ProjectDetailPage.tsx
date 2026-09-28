import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Edit, Building2, MapPin, Calendar, DollarSign, Users,
  TrendingUp, CheckSquare, AlertTriangle, Clock, MoreHorizontal, Wrench,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  PROJECT_TYPE_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
} from '../../utils/constants';

// Mock data — remplacé par API en Phase 3
const MOCK_PROJECT = {
  _id: '1',
  reference: 'PRJ-2024-001',
  name: 'Résidence Al Amal',
  type: 'residence',
  description: 'Complexe résidentiel de 48 appartements avec parking souterrain, piscine et espaces verts. Projet situé dans le quartier Hay Hassani à Casablanca.',
  status: 'en_cours',
  priority: 'haute',
  progress: 65,
  location: { address: 'Lot 15, Quartier Hay Hassani', city: 'Casablanca', region: 'Grand Casablanca' },
  dates: { startDate: '2024-01-15', plannedEndDate: '2025-06-30' },
  budget: { total: 8500000, consumed: 5525000 },
  manager: { fullName: 'Mohammed El Mansouri', role: 'directeur' },
  projectManager: { fullName: 'Ahmed Benali', role: 'chef_projet' },
  _teamCount: 3,
  tags: ['résidentiel', 'Casablanca', 'prioritaire'],
  phases: [
    { _id: 'p1', name: 'Fondations & Gros œuvre', status: 'terminee', progress: 100, order: 1 },
    { _id: 'p2', name: 'Structure R+1 à R+5', status: 'terminee', progress: 100, order: 2 },
    { _id: 'p3', name: 'Second œuvre & Réseaux', status: 'en_cours', progress: 60, order: 3 },
    { _id: 'p4', name: 'Finitions & Peinture', status: 'non_commencee', progress: 0, order: 4 },
    { _id: 'p5', name: 'Aménagements extérieurs', status: 'non_commencee', progress: 0, order: 5 },
  ],
  recentTasks: [
    { _id: 't1', title: 'Coulage béton RDC Bloc B', status: 'en_cours', priority: 'haute', assignedTo: { fullName: 'Youssef Chraibi' } },
    { _id: 't2', title: 'Installation électrique R+1', status: 'a_faire', priority: 'normale', assignedTo: { fullName: 'Khalid Ziani' } },
    { _id: 't3', title: 'Plomberie sanitaires RDC', status: 'en_cours', priority: 'normale', assignedTo: { fullName: 'Mourad Naciri' } },
  ],
  incidents: [
    { _id: 'i1', title: 'Fissures mur maçonnerie Bloc B', status: 'en_cours', priority: 'critique', date: '2024-09-01' },
  ],
};

const PHASE_STATUS_COLORS: Record<string, string> = {
  non_commencee: 'bg-slate-100 text-slate-600',
  en_cours: 'bg-blue-100 text-blue-700',
  en_pause: 'bg-yellow-100 text-yellow-700',
  terminee: 'bg-green-100 text-green-700',
  annulee: 'bg-red-100 text-red-700',
};

const PHASE_STATUS_LABELS: Record<string, string> = {
  non_commencee: 'Non commencée',
  en_cours: 'En cours',
  en_pause: 'En pause',
  terminee: 'Terminée',
  annulee: 'Annulée',
};

const TASK_STATUS_COLORS: Record<string, string> = {
  a_faire: 'bg-slate-100 text-slate-600',
  en_cours: 'bg-blue-100 text-blue-700',
  bloquee: 'bg-red-100 text-red-700',
  terminee: 'bg-green-100 text-green-700',
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = MOCK_PROJECT;
  const budgetPercent = Math.round((project.budget.consumed / project.budget.total) * 100);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 rounded-lg hover:bg-muted transition-colors mt-0.5"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <span className="text-sm text-muted-foreground font-mono">{project.reference}</span>
              <span className={cn('badge', PROJECT_STATUS_COLORS[project.status])}>
                {PROJECT_STATUS_LABELS[project.status]}
              </span>
              <span className={cn('badge', PRIORITY_COLORS[project.priority])}>
                {PRIORITY_LABELS[project.priority]}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{PROJECT_TYPE_LABELS[project.type]}</p>
          </div>
        </div>
        <Link
          to={`/projects/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex-shrink-0"
        >
          <Edit size={16} />
          Modifier
        </Link>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-1">Avancement</p>
          <p className="text-2xl font-bold text-foreground">{project.progress}%</p>
          <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <div
              className={cn('h-full rounded-full', project.progress >= 70 ? 'bg-green-500' : 'bg-blue-500')}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-1">Budget consommé</p>
          <p className="text-2xl font-bold text-foreground">{budgetPercent}%</p>
          <p className="text-xs text-muted-foreground mt-1">{formatCurrency(project.budget.consumed)} / {formatCurrency(project.budget.total)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-1">Phases</p>
          <p className="text-2xl font-bold text-foreground">{project.phases.filter(p => p.status === 'terminee').length}/{project.phases.length}</p>
          <p className="text-xs text-muted-foreground mt-1">phases terminées</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-1">Fin prévue</p>
          <p className="text-lg font-bold text-foreground">{formatDate(project.dates.plannedEndDate)}</p>
          <p className="text-xs text-muted-foreground mt-1">Début: {formatDate(project.dates.startDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phases */}
          <div className="card p-0">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Phases du projet</h3>
              <button className="text-sm text-blue-600 hover:underline">+ Ajouter phase</button>
            </div>
            <div className="divide-y divide-border">
              {project.phases.map((phase) => (
                <div key={phase._id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-slate-600">{phase.order}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">{phase.name}</p>
                      <span className={cn('badge text-xs', PHASE_STATUS_COLORS[phase.status])}>
                        {PHASE_STATUS_LABELS[phase.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden max-w-32">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{phase.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tâches récentes */}
          <div className="card p-0">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Tâches récentes</h3>
              <Link to="/tasks" className="text-sm text-blue-600 hover:underline">Voir toutes</Link>
            </div>
            <div className="divide-y divide-border">
              {project.recentTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckSquare size={16} className="text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.assignedTo.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn('badge text-xs', TASK_STATUS_COLORS[task.status])}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Infos projet */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-foreground">Informations</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Localisation</p>
                  <p className="text-sm font-medium text-foreground">{project.location.city}</p>
                  {project.location.address && (
                    <p className="text-xs text-muted-foreground">{project.location.address}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Directeur</p>
                  <p className="text-sm font-medium text-foreground">{project.manager.fullName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Chef de projet</p>
                  <p className="text-sm font-medium text-foreground">{project.projectManager.fullName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Budget total</p>
                  <p className="text-sm font-medium text-foreground">{formatCurrency(project.budget.total)}</p>
                </div>
              </div>
            </div>
            {project.description && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground leading-relaxed">{project.description}</p>
              </div>
            )}
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Incidents actifs */}
          {project.incidents.length > 0 && (
            <div className="card border-l-4 border-l-red-400 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-red-500" />
                <h3 className="font-semibold text-foreground text-sm">Incidents actifs</h3>
              </div>
              {project.incidents.map((incident) => (
                <div key={incident._id} className="text-sm">
                  <p className="font-medium text-foreground">{incident.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(incident.date)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
