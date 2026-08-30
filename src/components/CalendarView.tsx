import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  User, 
  Building2, 
  RefreshCw, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Link,
  ShieldCheck
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { Meeting } from '../types';

export const CalendarView: React.FC = () => {
  const { 
    meetings, 
    googleAuth, 
    syncGoogleCalendarNow, 
    toggleAutoSync, 
    openScheduleMeetingModal,
    updateMeeting,
    deleteMeeting
  } = useCrm();

  const [calendarTab, setCalendarTab] = useState<'agenda' | 'month'>('agenda');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Sort meetings by date & time
  const sortedMeetings = [...meetings].sort((a, b) => {
    return new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime();
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingMeetings = sortedMeetings.filter(m => m.date >= todayStr && m.status !== 'cancelada');
  const pastMeetings = sortedMeetings.filter(m => m.date < todayStr || m.status === 'completada');

  const getMeetingTypeBadge = (type: Meeting['type']) => {
    switch (type) {
      case 'discovery':
        return { label: 'Discovery Call', class: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'diagnostico':
        return { label: 'Sesión Diagnóstico', class: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'presentacion_propuesta':
        return { label: 'Presentación Propuesta', class: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'revision_alcance':
        return { label: 'Revisión de Alcance', class: 'bg-pink-50 text-pink-700 border-pink-200' };
      case 'seguimiento_proyecto':
      default:
        return { label: 'Seguimiento Proyecto', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Real-time Google Calendar Sync Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Sincronización Automática con Google Calendar</h3>
                <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Tiempo Real
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Las reuniones agendadas en el CRM se sincronizan automáticamente con tu calendario de Google y generan enlaces de Google Meet para tus clientes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Última Sincronización</span>
              <span className="text-xs font-mono font-bold text-blue-700">
                {googleAuth.lastSyncTime || 'Sincronizado ahora'}
              </span>
            </div>

            <button
              onClick={() => syncGoogleCalendarNow()}
              disabled={googleAuth.isSyncing}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer ${
                googleAuth.isSyncing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${googleAuth.isSyncing ? 'animate-spin' : ''}`} />
              <span>{googleAuth.isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Action Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-lg border border-slate-200/80">
          <button
            onClick={() => setCalendarTab('agenda')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              calendarTab === 'agenda'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Agenda de Consultoría ({upcomingMeetings.length})
          </button>
          <button
            onClick={() => setCalendarTab('month')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              calendarTab === 'month'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Vista Mensual
          </button>
        </div>

        <button
          onClick={() => openScheduleMeetingModal()}
          className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Nueva Reunión</span>
        </button>
      </div>

      {/* Agenda View */}
      {calendarTab === 'agenda' && (
        <div className="space-y-6">
          
          {/* Upcoming Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Próximas Sesiones de Consultoría ({upcomingMeetings.length})
              </h3>
            </div>

            {upcomingMeetings.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-xs">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-semibold text-slate-800">No hay reuniones próximas programadas</p>
                <p className="text-xs text-slate-500 mt-1">Haz clic en "Agendar Nueva Reunión" para crear una sesión con Google Meet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMeetings.map((meeting) => {
                  const badge = getMeetingTypeBadge(meeting.type);
                  const isToday = meeting.date === todayStr;

                  return (
                    <div
                      key={meeting.id}
                      className={`bg-white border rounded-xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                        isToday ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Top: Date & Type Badge */}
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.class}`}>
                              {badge.label}
                            </span>
                            {isToday && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                ¡HOY!
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span className="text-[10px] font-semibold">Google Calendar</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                          {meeting.title}
                        </h4>

                        {/* Date & Time */}
                        <div className="flex items-center gap-4 text-xs text-slate-700 mb-3 font-mono bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                            <span>{meeting.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{meeting.startTime} - {meeting.endTime}</span>
                          </div>
                        </div>

                        {/* Client & Company */}
                        <div className="space-y-1 text-xs text-slate-600 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-800">{meeting.contactName}</span>
                            {meeting.contactEmail && (
                              <span className="text-[11px] text-slate-400 font-mono">({meeting.contactEmail})</span>
                            )}
                          </div>
                          {meeting.dealTitle && (
                            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">Proyecto: {meeting.dealTitle}</span>
                            </div>
                          )}
                          {meeting.description && (
                            <p className="text-slate-600 text-[11px] italic mt-1 bg-slate-50 p-2 rounded border border-slate-200">
                              "{meeting.description}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions: Join Meet, Complete, Cancel */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {meeting.meetLink ? (
                          <a
                            href={meeting.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Unirse con Google Meet</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500">Presencial: {meeting.location || 'Oficinas'}</span>
                        )}

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateMeeting(meeting.id, { status: 'completada' })}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Marcar como realizada"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteMeeting(meeting.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Cancelar reunión"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past / Completed Section */}
          {pastMeetings.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Historial de Sesiones Realizadas ({pastMeetings.length})
              </h3>
              <div className="space-y-2">
                {pastMeetings.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block">{meeting.title}</span>
                        <span className="text-slate-500 text-[11px]">{meeting.contactName} · {meeting.date} ({meeting.startTime})</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Completada</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Month View Matrix */}
      {calendarTab === 'month' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Calendario de Consultoría - Agosto / Septiembre 2026</h3>
            <p className="text-xs text-slate-500">Haz clic en cualquier día para ver o crear sesiones de trabajo</p>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="p-2 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                {d}
              </div>
            ))}

            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayMeetings = meetings.filter(m => m.date === dateStr);
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={dayNum}
                  onClick={() => openScheduleMeetingModal({ date: dateStr })}
                  className={`min-h-[75px] p-1.5 rounded-lg border text-left cursor-pointer transition-all hover:border-blue-400 ${
                    isToday 
                      ? 'bg-blue-50/50 border-blue-300 text-blue-900' 
                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <span className={`text-[11px] font-bold block mb-1 ${isToday ? 'text-blue-700' : 'text-slate-500'}`}>
                    {dayNum}
                  </span>

                  <div className="space-y-1">
                    {dayMeetings.slice(0, 2).map(m => (
                      <div 
                        key={m.id} 
                        className="text-[9px] truncate bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-medium border border-blue-200"
                        title={`${m.startTime} ${m.title} (${m.contactName})`}
                      >
                        {m.startTime} {m.title}
                      </div>
                    ))}
                    {dayMeetings.length > 2 && (
                      <span className="text-[9px] text-slate-500 font-bold block">
                        +{dayMeetings.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
