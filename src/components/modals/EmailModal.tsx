import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, User, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { EMAIL_TEMPLATES } from '../../data/emailTemplates';

export const EmailModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    prefilledEmailData, 
    contacts, 
    deals, 
    sendEmailAction, 
    googleAuth 
  } = useCrm();

  const [selectedContactId, setSelectedContactId] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('propuesta-tecnica');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (activeModal === 'email') {
      const initialContact = prefilledEmailData?.contactId 
        ? contacts.find(c => c.id === prefilledEmailData.contactId)
        : (prefilledEmailData?.to ? contacts.find(c => c.email === prefilledEmailData.to) : contacts[0]);

      if (initialContact) {
        setSelectedContactId(initialContact.id);
        setToEmail(prefilledEmailData?.to || initialContact.email);
      } else {
        setToEmail(prefilledEmailData?.to || 'cliente@empresa.com');
      }

      if (prefilledEmailData?.subject) {
        setSubject(prefilledEmailData.subject);
      }

      if (prefilledEmailData?.body) {
        setBody(prefilledEmailData.body);
      } else {
        // Load default template with dynamic replacement
        applyTemplate('propuesta-tecnica', initialContact);
      }
    }
  }, [activeModal, prefilledEmailData, contacts]);

  if (activeModal !== 'email') return null;

  const applyTemplate = (templateId: string, contactOverride?: any) => {
    const tmpl = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;

    setSelectedTemplateId(templateId);
    const contact = contactOverride || contacts.find(c => c.id === selectedContactId) || contacts[0];
    const contactDeals = contact ? deals.filter(d => d.contactId === contact.id) : [];
    const mainDeal = contactDeals[0];

    const nombre = contact?.name ? contact.name.split(' ')[0] : 'Estimado/a cliente';
    const empresa = contact?.company || 'su empresa';
    const consultor = googleAuth.userName || 'Darío Ramírez';
    const servicio = mainDeal?.serviceType || 'Consultoría Estratégica';
    const enlaceCalendario = 'https://calendar.google.com/appointments/schedules/consultoria-dario';

    let replacedSubject = tmpl.subject
      .replace(/\{nombre\}/g, nombre)
      .replace(/\{empresa\}/g, empresa)
      .replace(/\{servicio\}/g, servicio)
      .replace(/\{consultor\}/g, consultor);

    let replacedBody = tmpl.body
      .replace(/\{nombre\}/g, nombre)
      .replace(/\{empresa\}/g, empresa)
      .replace(/\{servicio\}/g, servicio)
      .replace(/\{consultor\}/g, consultor)
      .replace(/\{enlace_calendario\}/g, enlaceCalendario);

    setSubject(replacedSubject);
    setBody(replacedBody);
  };

  const handleContactChange = (cId: string) => {
    setSelectedContactId(cId);
    const contact = contacts.find(c => c.id === cId);
    if (contact) {
      setToEmail(contact.email);
      applyTemplate(selectedTemplateId, contact);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !subject.trim() || !body.trim()) return;

    setIsSending(true);
    const tmplObj = EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId);

    try {
      await sendEmailAction({
        to: toEmail.trim(),
        subject: subject.trim(),
        body: body.trim(),
        contactId: selectedContactId || undefined,
        templateUsed: tmplObj?.name || 'Redacción personalizada'
      });
      setActiveModal(null);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Redactar Correo con Gmail API</h2>
              <p className="text-xs text-slate-500">
                Envío directo a clientes desde tu cuenta ({googleAuth.userEmail || 'dario.ramirez@gmail.com'}).
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Quick Selector */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Plantillas Rápidas de Consultoría</span>
            </label>
            <span className="text-[10px] text-slate-500">Auto-rellena variables del cliente</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {EMAIL_TEMPLATES.slice(0, 3).map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTemplate(t.id)}
                className={`p-2 rounded-lg border text-left text-xs transition-all ${
                  selectedTemplateId === t.id
                    ? 'bg-blue-100 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span className="block truncate">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="space-y-3.5 text-xs">
          
          {/* Contact and To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destinatario (Contacto CRM)</label>
              <select
                value={selectedContactId}
                onChange={e => handleContactChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.company} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={toEmail}
                onChange={e => setToEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Asunto *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Cuerpo del Mensaje (Gmail) *</label>
            <textarea
              rows={9}
              required
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-sans leading-relaxed"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Conexión Gmail activa</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Enviando vía Gmail...' : 'Enviar Correo'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
