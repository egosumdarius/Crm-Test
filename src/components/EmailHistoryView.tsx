import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Search, 
  FileText, 
  User, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { EMAIL_TEMPLATES } from '../data/emailTemplates';
import { EmailLog } from '../types';

export const EmailHistoryView: React.FC = () => {
  const { 
    emailLogs, 
    googleAuth, 
    openComposeEmailModal, 
    contacts 
  } = useCrm();

  const [search, setSearch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);

  const filteredLogs = emailLogs.filter(e => 
    e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.toEmail.toLowerCase().includes(search.toLowerCase()) ||
    e.contactName.toLowerCase().includes(search.toLowerCase()) ||
    e.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Gmail Integration Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Conexión con Gmail API</h3>
                <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Envío Directo Activo
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Envía propuestas de consultoría, minutas y acuerdos directamente a tus clientes utilizando plantillas ejecutivas con tu cuenta de correo.
              </p>
            </div>
          </div>

          <button
            onClick={() => openComposeEmailModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Redactar Correo Gmail</span>
          </button>

        </div>
      </div>

      {/* Consulting Templates Quick Launcher */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Plantillas Rápidas de Consultoría
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EMAIL_TEMPLATES.slice(0, 3).map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => openComposeEmailModal({
                subject: tmpl.subject.replace('{empresa}', 'Cliente').replace('{servicio}', 'Consultoría'),
                body: tmpl.body
              })}
              className="p-3.5 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all group shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {tmpl.name}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {tmpl.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {tmpl.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en correos enviados, destinatarios o contenido..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <span className="text-xs text-slate-500 font-mono">
            {filteredLogs.length} correos registrados
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 shadow-xs">
            <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No hay correos que coincidan con la búsqueda</p>
            <p className="text-xs text-slate-500 mt-1">Haz clic en "Redactar Correo Gmail" para enviar una propuesta a tus clientes.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedEmail(log)}
                className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 p-4 rounded-xl shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {log.subject}
                      </span>
                      {log.templateUsed && (
                        <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {log.templateUsed}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-medium text-slate-800">Para: {log.contactName}</span>
                      <span className="font-mono text-[11px] text-slate-500">({log.toEmail})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-500 font-mono block">{log.sentAt}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Enviado con Gmail
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Body Viewer Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Correo Enviado vía Gmail
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{selectedEmail.subject}</h3>
                <p className="text-xs text-slate-500">Destinatario: {selectedEmail.contactName} ({selectedEmail.toEmail})</p>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {selectedEmail.body}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
              <span>Fecha: {selectedEmail.sentAt}</span>
              <span>ID: {selectedEmail.id}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
