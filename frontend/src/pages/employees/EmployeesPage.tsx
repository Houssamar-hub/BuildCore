import { useState } from 'react';
import { Plus, Search, Users, Phone, Mail, MapPin, Briefcase, Filter } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/formatters';

const PROFESSION_LABELS: Record<string, string> = {
  ingenieur: 'Ingénieur',
  architecte: 'Architecte',
  chef_projet: 'Chef de projet',
  chef_chantier: 'Chef de chantier',
  macon: 'Maçon',
  electricien: 'Électricien',
  plombier: 'Plombier',
  peintre: 'Peintre',
  menuisier: 'Menuisier',
  technicien: 'Technicien',
  chauffeur: 'Chauffeur',
  conducteur_engin: 'Conducteur engin',
  manoeuvre: 'Manœuvre',
  autre: 'Autre',
};

const STATUS_COLORS: Record<string, string> = {
  actif: 'badge-success',
  inactif: 'badge-default',
  conge: 'badge-warning',
  suspendu: 'badge-danger',
};

const STATUS_LABELS: Record<string, string> = {
  actif: 'Actif',
  inactif: 'Inactif',
  conge: 'En congé',
  suspendu: 'Suspendu',
};

const CONTRACT_LABELS: Record<string, string> = {
  cdi: 'CDI',
  cdd: 'CDD',
  interim: 'Intérim',
  freelance: 'Freelance',
  stagiaire: 'Stagiaire',
};

const MOCK_EMPLOYEES = [
  { _id: '1', employeeId: 'EMP-001', firstName: 'Ali', lastName: 'Boutahar', profession: 'macon', contractType: 'cdi', status: 'actif', phone: '+212 661 100 001', email: 'ali.boutahar@imara360.ma', currentProject: 'Résidence Al Amal', salary: { base: 3500 }, hireDate: '2021-03-15' },
  { _id: '2', employeeId: 'EMP-002', firstName: 'Khalid', lastName: 'Ziani', profession: 'electricien', contractType: 'cdi', status: 'actif', phone: '+212 661 100 002', email: 'k.ziani@imara360.ma', currentProject: 'Résidence Al Amal', salary: { base: 4200 }, hireDate: '2020-06-01' },
  { _id: '3', employeeId: 'EMP-003', firstName: 'Mourad', lastName: 'Naciri', profession: 'plombier', contractType: 'cdi', status: 'actif', phone: '+212 661 100 003', email: 'm.naciri@imara360.ma', currentProject: 'Casablanca Business', salary: { base: 4000 }, hireDate: '2021-09-01' },
  { _id: '4', employeeId: 'EMP-004', firstName: 'Jamal', lastName: 'Lahrichi', profession: 'technicien', contractType: 'cdd', status: 'actif', phone: '+212 661 100 004', email: null, currentProject: 'Casablanca Business', salary: { base: 4800 }, hireDate: '2022-01-10' },
  { _id: '5', employeeId: 'EMP-005', firstName: 'Ayoub', lastName: 'Mouhib', profession: 'conducteur_engin', contractType: 'cdi', status: 'actif', phone: '+212 661 100 005', email: 'a.mouhib@imara360.ma', currentProject: 'Route Provinciale RN9', salary: { base: 5500 }, hireDate: '2019-04-20' },
  { _id: '6', employeeId: 'EMP-006', firstName: 'Ibrahim', lastName: 'Chakib', profession: 'chauffeur', contractType: 'cdi', status: 'conge', phone: '+212 661 100 006', email: null, currentProject: 'Route Provinciale RN9', salary: { base: 4200 }, hireDate: '2020-11-01' },
  { _id: '7', employeeId: 'EMP-007', firstName: 'Hamid', lastName: 'Ouali', profession: 'macon', contractType: 'interim', status: 'actif', phone: '+212 661 100 007', email: null, currentProject: 'Villa Sidi Maarouf', salary: { base: 3200 }, hireDate: '2023-02-15' },
  { _id: '8', employeeId: 'EMP-008', firstName: 'Aziz', lastName: 'Bensalah', profession: 'peintre', contractType: 'cdd', status: 'actif', phone: '+212 661 100 008', email: null, currentProject: 'Villa Sidi Maarouf', salary: { base: 3000 }, hireDate: '2023-05-01' },
  { _id: '9', employeeId: 'EMP-009', firstName: 'Driss', lastName: 'Kettani', profession: 'menuisier', contractType: 'cdi', status: 'inactif', phone: '+212 661 100 009', email: null, currentProject: null, salary: { base: 3800 }, hireDate: '2018-08-01' },
  { _id: '10', employeeId: 'EMP-010', firstName: 'Noureddin', lastName: 'Hakimi', profession: 'technicien', contractType: 'cdi', status: 'actif', phone: '+212 661 100 010', email: 'n.hakimi@imara360.ma', currentProject: null, salary: { base: 4500 }, hireDate: '2022-07-15' },
];

type Employee = typeof MOCK_EMPLOYEES[0];

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0]}${lastName[0]}`.toUpperCase();

const PROFESSION_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-cyan-500', 'bg-amber-500', 'bg-rose-500',
  'bg-indigo-500', 'bg-teal-500',
];

const EmployeeCard = ({ employee, index }: { employee: Employee; index: number }) => {
  const color = PROFESSION_COLORS[index % PROFESSION_COLORS.length];

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200 cursor-pointer group">
      <div className="flex items-start gap-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0', color)}>
          {getInitials(employee.firstName, employee.lastName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                {employee.firstName} {employee.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
            </div>
            <span className={cn('badge flex-shrink-0', STATUS_COLORS[employee.status])}>
              {STATUS_LABELS[employee.status]}
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Briefcase size={12} />
              <span>{PROFESSION_LABELS[employee.profession]} · {CONTRACT_LABELS[employee.contractType]}</span>
            </div>
            {employee.phone && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone size={12} />
                <span>{employee.phone}</span>
              </div>
            )}
            {employee.currentProject && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600">
                <MapPin size={12} />
                <span className="truncate">{employee.currentProject}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Embauché le {formatDate(employee.hireDate)}</span>
        <span className="font-medium text-foreground">{employee.salary.base.toLocaleString()} DH/mois</span>
      </div>
    </div>
  );
};

const FILTER_TABS = [
  { key: 'all', label: 'Tous', count: MOCK_EMPLOYEES.length },
  { key: 'actif', label: 'Actifs', count: MOCK_EMPLOYEES.filter(e => e.status === 'actif').length },
  { key: 'conge', label: 'En congé', count: MOCK_EMPLOYEES.filter(e => e.status === 'conge').length },
  { key: 'inactif', label: 'Inactifs', count: MOCK_EMPLOYEES.filter(e => e.status === 'inactif').length },
];

const EmployeesPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = MOCK_EMPLOYEES.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || e.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employés</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {MOCK_EMPLOYEES.filter(e => e.status === 'actif').length} actifs · {MOCK_EMPLOYEES.length} au total
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex-shrink-0">
          <Plus size={16} />
          Nouvel employé
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un employé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                activeFilter === tab.key ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              <span className={cn('px-1.5 py-0.5 rounded-full text-xs', activeFilter === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-border text-muted-foreground')}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((employee, i) => (
            <EmployeeCard key={employee._id} employee={employee} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Users size={48} className="text-muted-foreground/30 mb-4" />
          <p className="text-foreground font-medium">Aucun employé trouvé</p>
          <p className="text-muted-foreground text-sm mt-1">Modifiez vos filtres ou ajoutez un employé</p>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
