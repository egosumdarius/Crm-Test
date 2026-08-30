import React from 'react';
import { 
  Kanban, 
  Users, 
  Calendar, 
  Mail, 
  BarChart3, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  CalendarPlus, 
  Send, 
  Briefcase
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    googleAuth, 
    syncGoogleCalendarNow, 
    openNewDealModal, 
    openScheduleMeetingModal, 
    openComposeEmailModal, 
    openGoogleModal,
    meetings,
    emailLogs
  } = useCrm();

  const todayStr = new Date().toISOString().split('T')[0];
  const meetingsTodayCount = meetings.filter(m => m.date === todayStr && m.status === 'programada').length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-800 tracking-tight">Consult<span className="text-blue-600">Sync</span></span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Pipeline, Contactos, Calendario & Gmail</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setCurrentView('pipeline')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'pipeline'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Pipeline
            </button>

            <button
              onClick={() => setCurrentView('contacts')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'contacts'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Contactos
            </button>

            <button
              onClick={() => setCurrentView('calendar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all relative ${
                currentView === 'calendar'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Calendario
              {meetingsTodayCount > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-200">
                  {meetingsTodayCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('emails')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all relative ${
                currentView === 'emails'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Gmail ({emailLogs.length})
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Métricas
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Google Sync Live Indicator Button */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={openGoogleModal}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors shadow-2xs"
                title="Configuración de sincronización con Google Workspace"
              >
                <div className="relative flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                    Gmail & Calendar Sync
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono leading-none">
                    {googleAuth.lastSyncTime ? `${googleAuth.lastSyncTime}` : 'En tiempo real'}
                  </span>
                </div>
              </button>

              {/* Sync now trigger */}
              <button
                onClick={() => syncGoogleCalendarNow()}
                disabled={googleAuth.isSyncing}
                className={`p-2 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors shadow-2xs ${
                  googleAuth.isSyncing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                title="Sincronizar reuniones con Google Calendar ahora"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${googleAuth.isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>

            {/* Quick Actions Dropdown / Group */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openScheduleMeetingModal()}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                title="Agendar reunión de consultoría"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-blue-600" />
                <span>Reunión</span>
              </button>

              <button
                onClick={() => openComposeEmailModal()}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                title="Enviar correo con plantilla de consultoría"
              >
                <Send className="w-3.5 h-3.5 text-amber-600" />
                <span>Correo</span>
              </button>

              <button
                onClick={() => openNewDealModal()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nueva Oportunidad</span>
                <span className="sm:hidden">Nuevo</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 overflow-x-auto gap-1">
          <button
            onClick={() => setCurrentView('pipeline')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium shrink-0 ${
              currentView === 'pipeline' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Pipeline
          </button>
          <button
            onClick={() => setCurrentView('contacts')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium shrink-0 ${
              currentView === 'contacts' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Contactos
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium shrink-0 ${
              currentView === 'calendar' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Calendario
          </button>
          <button
            onClick={() => setCurrentView('emails')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium shrink-0 ${
              currentView === 'emails' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Gmail
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium shrink-0 ${
              currentView === 'dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Métricas
          </button>
        </div>

      </div>
    </header>
  );
};
