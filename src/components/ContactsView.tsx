import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  Briefcase, 
  Tag, 
  Clock, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { Contact } from '../types';

export const ContactsView: React.FC = () => {
  const { 
    contacts, 
    deals, 
    meetings, 
    emailLogs, 
    openNewContactModal, 
    setSelectedContactId, 
    setActiveModal, 
    openComposeEmailModal, 
    openScheduleMeetingModal,
    deleteContact,
    searchQuery,
    setSearchQuery 
  } = useCrm();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedDrawerContact, setSelectedDrawerContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatusFilter === 'all' || contact.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por contacto, empresa, cargo o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status filter */}
          <div className="shrink-0">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="all">Todos los Estados</option>
              <option value="lead">Leads Cualificados</option>
              <option value="activo">Contactos Activos</option>
              <option value="cliente">Clientes (Proyectos Firmados)</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => openNewContactModal()}
          className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Contacto</span>
        </button>
      </div>

      {/* Contacts Grid / Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => {
          const contactDeals = deals.filter(d => d.contactId === contact.id);
          const totalValue = contactDeals.reduce((sum, d) => sum + d.value, 0);
          const upcomingMeeting = meetings.find(m => m.contactId === contact.id && m.status === 'programada');

          let statusBadgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
          let statusText = 'Lead';
          if (contact.status === 'cliente') {
            statusBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            statusText = 'Cliente VIP';
          } else if (contact.status === 'activo') {
            statusBadgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
            statusText = 'En Negociación';
          }

          return (
            <div
              key={contact.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Avatar, Name & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-sm font-bold text-blue-700 shrink-0">
                      {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <h3 
                        onClick={() => setSelectedDrawerContact(contact)}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug"
                      >
                        {contact.name}
                      </h3>
                      <p className="text-xs text-slate-500">{contact.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadgeClass}`}>
                    {statusText}
                  </span>
                </div>

                {/* Company & Industry */}
                <div className="space-y-1.5 mb-3.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{contact.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{contact.industry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>

                {/* Deals & Value metrics */}
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 mb-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Oportunidades</span>
                    <span className="font-bold text-slate-800">{contactDeals.length} proyectos</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Valor Total</span>
                    <span className="font-bold text-emerald-700 font-mono">{totalValue.toLocaleString()} €</span>
                  </div>
                </div>

                {/* Next Meeting Pill */}
                {upcomingMeeting && (
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 mb-3">
                    <Calendar className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                    <span className="truncate font-medium">
                      Próxima: {upcomingMeeting.date} ({upcomingMeeting.startTime})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openComposeEmailModal({
                      to: contact.email,
                      contactId: contact.id,
                      subject: `Seguimiento de Consultoría | ${contact.company}`
                    })}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                    title="Enviar correo con Gmail"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Gmail</span>
                  </button>

                  <button
                    onClick={() => openScheduleMeetingModal({
                      contactId: contact.id
                    })}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                    title="Agendar reunión con Google Calendar"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reunión</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedContactId(contact.id);
                      setActiveModal('contact');
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Editar contacto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedDrawerContact(contact)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Ver perfil 360°"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Contact Profile Drawer / Modal */}
      {selectedDrawerContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-xs">
                  {selectedDrawerContact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedDrawerContact.name}</h2>
                  <p className="text-xs text-slate-500">{selectedDrawerContact.role} · {selectedDrawerContact.company}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDrawerContact(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Email</span>
                <span className="text-slate-800 font-mono">{selectedDrawerContact.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Teléfono</span>
                <span className="text-slate-800">{selectedDrawerContact.phone || 'No registrado'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Sector / Industria</span>
                <span className="text-slate-800">{selectedDrawerContact.industry}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Notas de Consultoría</span>
                <span className="text-slate-800">{selectedDrawerContact.notes || 'Sin notas especiales'}</span>
              </div>
            </div>

            {/* Quick Actions inside Drawer */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedDrawerContact(null);
                  openComposeEmailModal({
                    to: selectedDrawerContact.email,
                    contactId: selectedDrawerContact.id,
                    subject: `Propuesta y Consultoría | ${selectedDrawerContact.company}`
                  });
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4" />
                <span>Enviar Correo vía Gmail</span>
              </button>
              <button
                onClick={() => {
                  setSelectedDrawerContact(null);
                  openScheduleMeetingModal({
                    contactId: selectedDrawerContact.id
                  });
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar con Google Calendar</span>
              </button>
            </div>

            {/* Associated Deals */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Oportunidades & Proyectos</h4>
              <div className="space-y-2">
                {deals.filter(d => d.contactId === selectedDrawerContact.id).map(deal => (
                  <div key={deal.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 block">{deal.title}</span>
                      <span className="text-slate-500 text-[11px]">{deal.serviceType} · Etapa: {deal.stage.toUpperCase()}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">{deal.value.toLocaleString()} {deal.currency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Meetings */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Historial de Reuniones (Google Calendar)</h4>
              <div className="space-y-2">
                {meetings.filter(m => m.contactId === selectedDrawerContact.id).map(meet => (
                  <div key={meet.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 block">{meet.title}</span>
                      <span className="text-slate-500 text-[11px]">{meet.date} de {meet.startTime} a {meet.endTime}</span>
                    </div>
                    {meet.meetLink && (
                      <a 
                        href={meet.meetLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Meet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Sent Emails */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Correos Enviados (Gmail)</h4>
              <div className="space-y-2">
                {emailLogs.filter(e => e.contactId === selectedDrawerContact.id || e.toEmail === selectedDrawerContact.email).map(email => (
                  <div key={email.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900">{email.subject}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{email.sentAt}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2">{email.body}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
