import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, Trash2 } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const ContactModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    selectedContactId, 
    contacts, 
    addContact, 
    updateContact, 
    deleteContact 
  } = useCrm();

  const isEditing = !!selectedContactId;
  const existingContact = contacts.find(c => c.id === selectedContactId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState<'lead' | 'activo' | 'inactivo' | 'cliente'>('lead');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingContact) {
      setName(existingContact.name);
      setEmail(existingContact.email);
      setPhone(existingContact.phone);
      setCompany(existingContact.company);
      setRole(existingContact.role);
      setIndustry(existingContact.industry);
      setStatus(existingContact.status);
      setNotes(existingContact.notes);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setRole('');
      setIndustry('Tecnología & Servicios');
      setStatus('lead');
      setNotes('');
    }
  }, [existingContact, activeModal]);

  if (activeModal !== 'contact') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      role: role.trim(),
      industry: industry.trim() || 'General',
      status,
      notes: notes.trim(),
      tags: [role, status === 'cliente' ? 'Cliente VIP' : 'Lead']
    };

    if (isEditing && selectedContactId) {
      updateContact(selectedContactId, payload);
    } else {
      addContact(payload);
    }
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? 'Editar Contacto' : 'Nuevo Contacto de Consultoría'}
            </h2>
            <p className="text-xs text-slate-500">Registra tomadores de decisión y directivos de clientes.</p>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej. Carolina Morales"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico (Gmail/Empresa) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="cmorales@empresa.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Teléfono / WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Empresa *</label>
              <input
                type="text"
                required
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Nexus Logistics S.L."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cargo / Posición *</label>
              <input
                type="text"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Directora de Operaciones (COO)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sector / Industria</label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="Logística, Finanzas, Salud..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estado de Relación</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="lead">Lead Cualificado</option>
                <option value="activo">Contacto Activo / En Negociación</option>
                <option value="cliente">Cliente (Contrato Firmado)</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notas de Perfil</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Intereses, estilo de comunicación, objetivos prioritarios..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {isEditing && selectedContactId ? (
              <button
                type="button"
                onClick={() => {
                  deleteContact(selectedContactId);
                  setActiveModal(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            ) : <div />}

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
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Contacto'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
