import { useState } from 'react';
import { Plus, Search, Filter, CheckSquare, Clock, AlertCircle, Flag } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/formatters';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../utils/constants';

// Mock tâches
const MOCK_TASKS = [
  { _id: '1', title: 'Ferraillage fondations Bloc A', project: { name: 'Résidence Al Amal' }, status: 'terminee', priority: 'haute', dueDate: '2024-08-01', assignedTo: { fullName: 'Ahmed Benali' } },
  { _id: '2', title: 'Coulage béton RDC', project: { name: 'Résidence Al Amal' }, status: 'en_cours', priority: 'haute', dueDate: '2024-09-30', assignedTo: { fullName: 'Youssef Chraibi' } },
  { _id: '3', title: 'Installation réseau électrique RDC', project: { name: 'Résidence Al Amal' }, status: 'a_faire', priority: 'normale', dueDate: '2024-10-15', assignedTo: { fullName: 'Khalid Ziani' } },
  { _id: '4', title: 'Structure R+2 Immeuble', project: { name: 'Casablanca Business' }, status: 'en_cours', priority: 'critique', dueDate: '2024-10-01', assignedTo: { fullName: 'Karim Alaoui' } },
  { _id: '5', title: 'Fondations immeuble - Pieux', project: { name: 'Casablanca Business' }, status: 'terminee', priority: 'critique', dueDate: '2024-06-30', assignedTo: { fullName: 'Karim Alaoui' } },
  { _id: '6', title: 'Finitions peinture villa', project: { name: 'Villa Sidi Maarouf' }, status: 'en_cours', priority: 'haute', dueDate: '2024-09-15', assignedTo: { fullName: 'Ayoub Mouhib' } },
  { _id: '7', title: 'Installation piscine', project: { name: 'Villa Sidi Maarouf' }, status: 'bloquee', priority: 'normale', dueDate: '2024-08-31', assignedTo: { fullName: 'Hassan Tazi' } },
  { _id: '8', title: 'Étude technique route', project: { name: 'Route Provinciale RN9' }, status: 'a_faire', priority: 'critique', dueDate: '2024-11-01', assignedTo: { fullName: 'Mohamed Chraibi' } },
  { _id: '9', title: 'Planification phases lotissement', project: { name: 'Lotissement Nour' }, status: 'a_faire', priority: 'normale', dueDate: '2024-12-01', assignedTo: { fullName: 'Fatima El Idrissi' } },
];

type TaskStatus = 'a_faire' | 'en_cours' | 'bloquee' | 'terminee';

type Task = typeof MOCK_TASKS[0];

const COLUMNS: { key: TaskStatus; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { key: 'a_faire', label: 'À faire', icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100' },
  { key: 'en_cours', label: 'En cours', icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  { key: 'bloquee', label: 'Bloquée', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  { key: 'terminee', label: 'Terminée', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-100' },
];

const TaskCard = ({ task }: { task: Task }) => {
  const isOverdue = task.dueDate && new Date() > new Date(task.dueDate) && task.status !== 'terminee';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-border shadow-sm hover:shadow-card-hover transition-all p-4 cursor-pointer group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors leading-snug flex-1">
          {task.title}
        </p>
        <Flag size={13} className={cn('flex-shrink-0 mt-0.5', PRIORITY_COLORS[task.priority]?.includes('warning') ? 'text-yellow-500' : PRIORITY_COLORS[task.priority]?.includes('danger') ? 'text-red-500' : 'text-slate-400')} />
      </div>

      <p className="text-xs text-muted-foreground mb-3 bg-muted rounded px-2 py-1 inline-block">
        {task.project.name}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{task.assignedTo.fullName[0]}</span>
          </div>
          <span className="text-xs text-muted-foreground">{task.assignedTo.fullName.split(' ')[0]}</span>
        </div>
        {task.dueDate && (
          <div className={cn('flex items-center gap-1 text-xs', isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground')}>
            <Clock size={11} />
            {formatDate(task.dueDate)}
            {isOverdue && ' ⚠️'}
          </div>
        )}
      </div>
    </div>
  );
};

const TasksPage = () => {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');

  const filtered = MOCK_TASKS.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.project.name.toLowerCase().includes(search.toLowerCase())
  );

  const getColumnTasks = (status: TaskStatus) =>
    filtered.filter((t) => t.status === status);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tâches</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {MOCK_TASKS.length} tâches au total · {MOCK_TASKS.filter(t => t.status === 'en_cours').length} en cours
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle view */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setView('kanban')}
              className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors', view === 'kanban' ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm' : 'text-muted-foreground')}
            >
              Kanban
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors', view === 'list' ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm' : 'text-muted-foreground')}
            >
              Liste
            </button>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            <Plus size={16} />
            Nouvelle tâche
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher une tâche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Kanban Board */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {COLUMNS.map((col) => {
            const tasks = getColumnTasks(col.key);
            const Icon = col.icon;
            return (
              <div key={col.key} className="flex flex-col gap-3">
                {/* Column header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('p-1.5 rounded-lg', col.bg)}>
                      <Icon size={14} className={col.color} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{col.label}</span>
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full font-medium">
                      {tasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-3 min-h-24">
                  {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                  {tasks.length === 0 && (
                    <div className="border-2 border-dashed border-border rounded-xl h-20 flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Aucune tâche</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="card p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tâche</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Projet</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Priorité</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Assigné à</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Échéance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((task) => {
                const isOverdue = task.dueDate && new Date() > new Date(task.dueDate) && task.status !== 'terminee';
                return (
                  <tr key={task._id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <p className="text-xs text-muted-foreground">{task.project.name}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn('badge text-xs', {
                        'badge-default': task.status === 'a_faire',
                        'badge-info': task.status === 'en_cours',
                        'badge-danger': task.status === 'bloquee',
                        'badge-success': task.status === 'terminee',
                      })}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{PRIORITY_LABELS[task.priority]}</span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <p className="text-sm text-foreground">{task.assignedTo.fullName}</p>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <p className={cn('text-sm', isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground')}>
                        {formatDate(task.dueDate)} {isOverdue && '⚠️'}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
