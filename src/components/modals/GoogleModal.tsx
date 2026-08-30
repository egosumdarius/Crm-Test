import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Calendar, 
  Mail, 
  RefreshCw, 
  CheckCircle2, 
  LogOut, 
  Key, 
  Sparkles, 
  Zap,
  Globe
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const GoogleModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    googleAuth, 
    connectGoogleWithGIS, 
    connectWithCustomToken, 
    disconnectGoogle, 
    syncGoogleCalendarNow, 
    toggleAutoSync 
  } = useCrm();

  const [showCustomToken, setShowCustomToken] = useState(false);
  const [customToken, setCustomToken] = useState('');

  if (activeModal !== 'google') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Google Workspace & Sincronización</h2>
              <p className="text-xs text-slate-500">Google Calendar, Google Meet y Gmail API.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Info Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-sm font-bold text-blue-700">
                {googleAuth.userName ? googleAuth.userName.substring(0, 2).toUpperCase() : 'DR'}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{googleAuth.userName || 'Darío Ramírez'}</h3>
                <p className="text-[11px] text-slate-500 font-mono">{googleAuth.userEmail || 'dario.ramirez@gmail.com'}</p>
              </div>
            </div>

            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Conectado
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
            <span className="text-slate-500 text-[11px]">Última sincronización:</span>
            <span className="font-mono text-blue-700 font-semibold">{googleAuth.lastSyncTime || 'Activa en tiempo real'}</span>
          </div>
        </div>

        {/* Permissions / Scopes Authorized */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Servicios Vinculados
          </label>

          <div className="space-y-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">Google Calendar & Google Meet</span>
                  <span className="text-[10px] text-slate-500">Lectura, creación de eventos y enlaces de videollamada</span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">Gmail API</span>
                  <span className="text-[10px] text-slate-500">Envío directo de propuestas y minutas de consultoría</span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
          </div>
        </div>

        {/* Real-time sync settings */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Sincronización Automática en Segundo Plano</span>
            <span className="text-[11px] text-slate-500">Actualiza reuniones y disponibilidad cada 60 segundos.</span>
          </div>

          <button
            onClick={() => toggleAutoSync(!googleAuth.autoSyncEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              googleAuth.autoSyncEnabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span 
              className={`w-5 h-5 rounded-full bg-white block transition-transform shadow-md ${
                googleAuth.autoSyncEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sync now button */}
        <button
          onClick={() => syncGoogleCalendarNow()}
          disabled={googleAuth.isSyncing}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${googleAuth.isSyncing ? 'animate-spin' : ''}`} />
          <span>{googleAuth.isSyncing ? 'Sincronizando Google Calendar...' : 'Sincronizar Todo Ahora'}</span>
        </button>

        {/* Advanced Token Configuration */}
        <div className="pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setShowCustomToken(!showCustomToken)}
            className="text-slate-500 hover:text-slate-700 text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <Key className="w-3 h-3" />
            <span>Configuración avanzada de OAuth Token</span>
          </button>

          {showCustomToken && (
            <div className="mt-2 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <input
                type="password"
                placeholder="Google OAuth Access Token..."
                value={customToken}
                onChange={e => setCustomToken(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 font-mono"
              />
              <button
                onClick={() => {
                  if (customToken.trim()) {
                    connectWithCustomToken(customToken.trim());
                  }
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-semibold cursor-pointer"
              >
                Aplicar Token
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
