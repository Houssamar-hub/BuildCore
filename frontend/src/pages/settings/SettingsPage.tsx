import { useState } from 'react';
import { User, Bell, Lock, Moon, Sun, Shield, Globe, Palette, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { ROLE_LABELS } from '../../utils/constants';
import { toast } from 'sonner';

type TabKey = 'profil' | 'securite' | 'notifications' | 'apparence' | 'systeme';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'profil', label: 'Mon Profil', icon: User },
  { key: 'securite', label: 'Sécurité', icon: Lock },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'apparence', label: 'Apparence', icon: Palette },
  { key: 'systeme', label: 'Système', icon: Globe },
];

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('profil');
  const [isSaving, setIsSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    projetsRetard: true,
    nouvellesTaches: true,
    stocksFaibles: true,
    incidents: true,
    factures: false,
    rapportsJournaliers: true,
    emailNotifs: false,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Profil mis à jour avec succès');
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Mot de passe modifié avec succès');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsSaving(false);
  };

  return (
    <div className="page-container max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground text-sm mt-1">Gérez votre compte et les préférences de l'application</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-56 flex-shrink-0">
          <nav className="bg-white dark:bg-slate-800 rounded-xl border border-border p-2 space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* ─── PROFIL ─── */}
          {activeTab === 'profil' && (
            <div className="card space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Mon Profil</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Modifiez vos informations personnelles</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl font-bold">
                    {profileForm.firstName?.[0]}{profileForm.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{profileForm.firstName} {profileForm.lastName}</p>
                  <p className="text-sm text-muted-foreground">{ROLE_LABELS[user?.role || ''] || user?.role}</p>
                  <button className="text-xs text-blue-600 hover:underline mt-1">Changer la photo</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Prénom', key: 'firstName' as const, placeholder: 'Prénom' },
                  { label: 'Nom', key: 'lastName' as const, placeholder: 'Nom' },
                  { label: 'Email', key: 'email' as const, placeholder: 'email@imara360.ma', type: 'email' },
                  { label: 'Téléphone', key: 'phone' as const, placeholder: '+212 6XX XXX XXX' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                    <input
                      type={type || 'text'}
                      value={profileForm[key]}
                      onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Sauvegarder
                </button>
              </div>
            </div>
          )}

          {/* ─── SÉCURITÉ ─── */}
          {activeTab === 'securite' && (
            <div className="card space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Sécurité</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Modifiez votre mot de passe</p>
              </div>

              <div className="space-y-4 max-w-sm">
                {[
                  { label: 'Mot de passe actuel', key: 'currentPassword' as const },
                  { label: 'Nouveau mot de passe', key: 'newPassword' as const },
                  { label: 'Confirmer le nouveau mot de passe', key: 'confirmPassword' as const },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                    <input
                      type="password"
                      value={passwordForm[key]}
                      onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                  Changer le mot de passe
                </button>
              </div>
            </div>
          )}

          {/* ─── NOTIFICATIONS ─── */}
          {activeTab === 'notifications' && (
            <div className="card space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Choisissez les alertes que vous souhaitez recevoir</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'projetsRetard' as const, label: 'Projets en retard', desc: 'Recevoir une alerte quand un projet dépasse sa date prévue' },
                  { key: 'nouvellesTaches' as const, label: 'Nouvelles tâches assignées', desc: 'Être notifié quand une tâche vous est assignée' },
                  { key: 'stocksFaibles' as const, label: 'Stocks faibles ou épuisés', desc: 'Alertes automatiques sur les niveaux de stock critiques' },
                  { key: 'incidents' as const, label: 'Incidents et accidents', desc: 'Notification immédiate pour tout incident signalé' },
                  { key: 'factures' as const, label: 'Factures et paiements', desc: 'Rappels pour les factures en attente de paiement' },
                  { key: 'rapportsJournaliers' as const, label: 'Rapports journaliers', desc: 'Recevoir le résumé des rapports de chantier chaque soir' },
                  { key: 'emailNotifs' as const, label: 'Notifications par email', desc: 'Recevoir également les alertes importantes par email' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                        notifications[key] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
                          notifications[key] ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── APPARENCE ─── */}
          {activeTab === 'apparence' && (
            <div className="card space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Apparence</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Personnalisez l'interface de IMARA 360</p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Thème</p>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  <button
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors',
                      theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <Sun size={20} className="text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">Clair</span>
                  </button>
                  <button
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors',
                      theme === 'dark' ? 'border-blue-600 bg-blue-900/20' : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <Moon size={20} className="text-blue-400" />
                    <span className="text-sm font-medium text-foreground">Sombre</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── SYSTÈME ─── */}
          {activeTab === 'systeme' && (
            <div className="card space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Informations système</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Version', value: 'IMARA 360 v1.0.0' },
                  { label: 'Backend', value: 'Node.js + Express + MongoDB' },
                  { label: 'Frontend', value: 'React 18 + TypeScript + Vite' },
                  { label: 'Devise', value: 'MAD (Dirham Marocain)' },
                  { label: 'Langue', value: 'Français' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
