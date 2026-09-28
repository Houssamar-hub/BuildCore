import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Building2, MapPin, Calendar, DollarSign, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { PROJECT_TYPE_LABELS } from '../../utils/constants';
import { toast } from 'sonner';

const createProjectSchema = z.object({
  reference: z.string().min(3, 'Référence min 3 caractères').toUpperCase(),
  name: z.string().min(3, 'Nom min 3 caractères').max(200),
  type: z.string().min(1, 'Type requis'),
  description: z.string().max(2000).optional(),
  'location.city': z.string().min(1, 'Ville requise'),
  'location.address': z.string().optional(),
  'dates.startDate': z.string().min(1, 'Date de début requise'),
  'dates.plannedEndDate': z.string().min(1, 'Date de fin prévue requise'),
  'budget.total': z.coerce.number().min(0, 'Budget doit être positif'),
  priority: z.enum(['basse', 'normale', 'haute', 'critique']),
  status: z.enum(['prospection', 'preparation', 'planification', 'en_cours']),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

const PRIORITY_OPTIONS = [
  { value: 'basse', label: '🟢 Basse', color: 'text-green-600' },
  { value: 'normale', label: '🔵 Normale', color: 'text-blue-600' },
  { value: 'haute', label: '🟠 Haute', color: 'text-orange-600' },
  { value: 'critique', label: '🔴 Critique', color: 'text-red-600' },
];

const STATUS_OPTIONS = [
  { value: 'prospection', label: 'Prospection' },
  { value: 'preparation', label: 'Préparation' },
  { value: 'planification', label: 'Planification' },
  { value: 'en_cours', label: 'En cours' },
];

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      priority: 'normale',
      status: 'preparation',
    },
  });

  const onSubmit = async (data: CreateProjectForm) => {
    setIsLoading(true);
    try {
      // TODO Phase 3 : appel API réel
      // await api.post('/projects', data);
      console.log('Données projet :', data);
      toast.success('Projet créé avec succès !');
      navigate('/projects');
    } catch {
      toast.error('Erreur lors de la création du projet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouveau Projet</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Remplissez les informations du projet</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations générales */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 size={18} className="text-blue-600" />
            </div>
            <h2 className="font-semibold text-foreground">Informations générales</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Référence */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Référence <span className="text-red-500">*</span>
              </label>
              <input
                {...register('reference')}
                placeholder="PRJ-2024-006"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.reference && <p className="mt-1 text-xs text-red-500">{errors.reference.message}</p>}
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Nom du projet <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                placeholder="Résidence Les Jardins..."
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner...</option>
                {Object.entries(PROJECT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Priorité</label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Statut initial */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Statut initial</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Description du projet..."
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Localisation */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin size={18} className="text-green-600" />
            </div>
            <h2 className="font-semibold text-foreground">Localisation</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Ville <span className="text-red-500">*</span>
              </label>
              <input
                {...register('location.city')}
                placeholder="Casablanca"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors['location.city'] && <p className="mt-1 text-xs text-red-500">{errors['location.city'].message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Adresse</label>
              <input
                {...register('location.address')}
                placeholder="Boulevard Zerktouni, Lot 15..."
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Planning */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar size={18} className="text-purple-600" />
            </div>
            <h2 className="font-semibold text-foreground">Planning</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Date de début <span className="text-red-500">*</span>
              </label>
              <input
                {...register('dates.startDate')}
                type="date"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors['dates.startDate'] && <p className="mt-1 text-xs text-red-500">{errors['dates.startDate'].message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Date de fin prévue <span className="text-red-500">*</span>
              </label>
              <input
                {...register('dates.plannedEndDate')}
                type="date"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors['dates.plannedEndDate'] && <p className="mt-1 text-xs text-red-500">{errors['dates.plannedEndDate'].message}</p>}
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign size={18} className="text-orange-600" />
            </div>
            <h2 className="font-semibold text-foreground">Budget</h2>
          </div>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Budget total (DH) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('budget.total')}
                type="number"
                min="0"
                step="1000"
                placeholder="5 000 000"
                className="w-full pl-3 pr-12 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">DH</span>
            </div>
            {errors['budget.total'] && <p className="mt-1 text-xs text-red-500">{errors['budget.total'].message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Création...</>
            ) : (
              <><Save size={16} /> Créer le projet</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPage;
