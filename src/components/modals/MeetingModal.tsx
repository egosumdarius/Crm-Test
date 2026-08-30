import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, User, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { MeetingType } from '../../types';

export const MeetingModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    prefilledMeetingData, 
    contacts, 
    deals, 
    scheduleMeeting, 
    googleAuth 
  } = useCrm();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<MeetingType>('diagnostico');
  const [contactId, setContactId] = useState('');
  const [dealId, setDealId] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [description, setDescription] = useState('');
  const [syncToGoogle, setSyncToGoogle] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeModal === 'meeting') {
      const initialContact = prefilledMeetingData?.contactId 
        ? contacts.find(c => c.id === prefilledMeetingData.contactId)
        : contacts[0];

      if (initialContact) {
        setContactId(initialContact.id);
        const contactDeals = deals.filter(d => d.contactId === initialContact.id);
        if (contactDeals.length > 0) {
          setDealId(contactDeals[0].id);
        }
      }

      if (prefilledMeetingData?.dealId) {
        setDealId(prefilledMeetingData.dealId);
      }

      if (prefilledMeetingData?.date) {
        setDate(prefilledMeetingData.date);
      }

      if (prefilledMeetingData?.startTime) {
        setStartTime(prefilledMeetingData.startTime);
      }

      setTitle(`Sesión de Diagnóstico y Alcance con ${initialContact?.company || 'Cliente'}`);
      setDescription('Revisión de requerimientos estratégicos y validación de cronograma de consultoría.');
    }
  }, [activeModal, prefilledMeetingData, contacts, deals]);

  if (activeModal !== 'meeting') return null;

  const handleContactChange = (cId: string) => {
    setContactId(cId);
    const selected = contacts.find(c => c.id === cId);
    const contactDeals = deals.filter(d => d.contactId === cId);
    if (contactDeals.length > 0) {
      setDealId(contactDeals[0].id);
    } else {
      setDealId('');
    }

    if (selected) {
      setTitle(`Sesión de ${type === 'discovery' ? 'Descubrimiento' : type === 'presentacion_propuesta' ? 'Presentación de Propuesta' : 'Trabajo'} con ${selected.company}`);
    }
  };

  const handleTypeChange = (newType: MeetingType) => {
    setType(newType);
    const selected = contacts.find(c => c.id === contactId);
    const comp = selected?.company || 'Cliente';
    
    switch (newType) {
      case 'discovery':
        setTitle(`Discovery Call: Evaluación de Necesidades | ${comp}`);
        setDescription('Sesión exploratoria de 25 min para evaluar oportunidad de colaboración.');
        break;
      case 'diagnostico':
        setTitle(`Sesión de Diagnóstico y Alcance | ${comp}`);
        setDescription('Levantamiento de procesos actuales y recopilación de información clave.');
        break;
      case 'presentacion_propuesta':
        setTitle(`Presentación de Propuesta Técnica y Presupuesto | ${comp}`);
        setDescription('Explicación detallada de metodología, hitos, honorarios y condiciones.');
        break;
      case 'revision_alcance':
        setTitle(`Revisión de Alcance y Ajustes de Contrato | ${comp}`);
        setDescription('Alineación final de entregables previa a la firma.');
        break;
      case 'seguimiento_proyecto':
        setTitle(`Sesión de Seguimiento de Hitos de Consultoría | ${comp}`);
        setDescription('Revisión de avance semanal y presentación de entregables.');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const contactObj = contacts.find(c => c.id === contactId);
    const dealObj = deals.find(d => d.id === dealId);

    try {
      await scheduleMeeting({
        title: title.trim() || 'Reunión de Consultoría',
        description: description.trim(),
        date,
        startTime,
        endTime,
        contactId: contactId || (contacts[0]?.id || 'cnt-1'),
        contactName: contactObj?.name || 'Cliente',
        contactEmail: contactObj?.email || '',
        dealId: dealId || undefined,
        dealTitle: dealObj?.title || undefined,
        status: 'programada',
        type,
        syncedWithGoogle: syncToGoogle,
        consultant: googleAuth.userName || 'Darío Ramírez',
        location: 'Google Meet'
      }, syncToGoogle);

      setActiveModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Agendar Reunión de Consultoría</h2>
              <p className="text-xs text-slate-500">Sincronización directa con Google Calendar & Google Meet.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Meeting Type Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Tipo de Reunión de Consultoría</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'discovery', label: 'Discovery Call' },
                { id: 'diagnostico', label: 'Diagnóstico' },
                { id: 'presentacion_propuesta', label: 'Propuesta' },
                { id: 'revision_alcance', label: 'Negociación' },
                { id: 'seguimiento_proyecto', label: 'Seguimiento' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTypeChange(item.id as MeetingType)}
                  className={`p-2 rounded-lg border text-left transition-all font-semibold ${
                    type === item.id 
                      ? 'bg-blue-50 border-blue-300 text-blue-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Título de la Sesión *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Contact & Associated Deal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cliente / Contacto *</label>
              <select
                value={contactId}
                onChange={e => handleContactChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Oportunidad / Proyecto Vinculado</label>
              <select
                value={dealId}
                onChange={e => setDealId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="">(Sin proyecto específico)</option>
                {deals.filter(d => !contactId || d.contactId === contactId).map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.value.toLocaleString()} €)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hora Inicio *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hora Fin *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Google Sync Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Sincronizar con Google Calendar & Meet</span>
                <span className="text-[11px] text-slate-600">Genera automáticamente el enlace de videollamada y añade a asistentes.</span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={syncToGoogle}
              onChange={e => setSyncToGoogle(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Notes / Agenda */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Agenda / Minuta Preliminar</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Puntos a tratar en la sesión de consultoría..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{isSubmitting ? 'Sincronizando...' : 'Confirmar y Sincronizar'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
