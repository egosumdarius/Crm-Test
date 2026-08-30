import React, { useState, useEffect } from 'react';
import { X, DollarSign, Building2, User, Calendar, Briefcase, Trash2 } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { STAGES } from '../../data/stages';
import { Deal, PricingModel, ServiceType, StageId } from '../../types';

export const DealModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    selectedDealId, 
    deals, 
    contacts, 
    addDeal, 
    updateDeal, 
    deleteDeal 
  } = useCrm();

  const isEditing = !!selectedDealId;
  const existingDeal = deals.find(d => d.id === selectedDealId);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [contactId, setContactId] = useState('');
  const [value, setValue] = useState<number>(25000);
  const [currency, setCurrency] = useState('EUR');
  const [pricingModel, setPricingModel] = useState<PricingModel>('project');
  const [serviceType, setServiceType] = useState<ServiceType>('Estrategia Empresarial');
  const [stage, setStage] = useState<StageId>('lead');
  const [probability, setProbability] = useState<number>(20);
  const [expectedCloseDate, setExpectedCloseDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [consultant, setConsultant] = useState('Darío Ramírez');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingDeal) {
      setTitle(existingDeal.title);
      setCompany(existingDeal.company);
      setContactId(existingDeal.contactId);
      setValue(existingDeal.value);
      setCurrency(existingDeal.currency);
      setPricingModel(existingDeal.pricingModel);
      setServiceType(existingDeal.serviceType);
      setStage(existingDeal.stage);
      setProbability(existingDeal.probability);
      setExpectedCloseDate(existingDeal.expectedCloseDate);
      setConsultant(existingDeal.consultant);
      setNotes(existingDeal.notes);
    } else {
      setTitle('');
      setCompany(contacts[0]?.company || '');
      setContactId(contacts[0]?.id || '');
      setValue(30000);
      setCurrency('EUR');
      setPricingModel('project');
      setServiceType('Estrategia Empresarial');
      setStage('lead');
      setProbability(20);
      setConsultant('Darío Ramírez');
      setNotes('');
    }
  }, [existingDeal, contacts, activeModal]);

  if (activeModal !== 'deal') return null;

  const handleContactChange = (cId: string) => {
    setContactId(cId);
    const selected = contacts.find(c => c.id === cId);
    if (selected) {
      setCompany(selected.company);
    }
  };

  const handleStageChange = (newStage: StageId) => {
    setStage(newStage);
    const stageObj = STAGES.find(s => s.id === newStage);
    if (stageObj) {
      setProbability(stageObj.defaultProbability);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contactObj = contacts.find(c => c.id === contactId);

    const dealPayload = {
      title: title.trim() || `Consultoría en ${serviceType} para ${company}`,
      company: company.trim() || 'Empresa Cliente',
      contactId: contactId || (contacts[0]?.id || 'cnt-1'),
      contactName: contactObj?.name || 'Contacto Principal',
      contactEmail: contactObj?.email || 'contacto@empresa.com',
      value: Number(value) || 0,
      currency,
      pricingModel,
      serviceType,
      stage,
      probability: Number(probability),
      expectedCloseDate,
      consultant,
      notes,
      tags: [serviceType, pricingModel === 'retainer' ? 'Retainer' : 'Proyecto']
    };

    if (isEditing && selectedDealId) {
      updateDeal(selectedDealId, dealPayload);
    } else {
      addDeal(dealPayload);
    }
    setActiveModal(null);
  };

  const servicesList: ServiceType[] = [
    'Estrategia Empresarial',
    'Transformación Digital',
    'Eficiencia Operativa',
    'Auditoría & Compliance',
    'Consultoría Financiera',
    'Talento & RRHH',
    'Innovación & Producto'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? 'Editar Oportunidad de Consultoría' : 'Nueva Oportunidad Comercial'}
            </h2>
            <p className="text-xs text-slate-500">Registra el alcance, presupuesto y etapa en el pipeline comercial.</p>
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
          
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Título del Proyecto / Oportunidad *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej. Diagnóstico y Optimización Operativa 2026"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Contact & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contacto Principal *</label>
              <select
                value={contactId}
                onChange={e => handleContactChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Empresa *</label>
              <input
                type="text"
                required
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Nombre de la empresa"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Value, Currency & Pricing Model */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Honorarios / Valor *</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={0}
                  step={500}
                  value={value}
                  onChange={e => setValue(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Moneda</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Modelo de Tarificación</label>
              <select
                value={pricingModel}
                onChange={e => setPricingModel(e.target.value as PricingModel)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="project">Proyecto Cerrado (Fixed)</option>
                <option value="retainer">Retainer Mensual</option>
                <option value="hourly">Por Horas / Time & Materials</option>
              </select>
            </div>
          </div>

          {/* Service Type & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tipo de Consultoría *</label>
              <select
                value={serviceType}
                onChange={e => setServiceType(e.target.value as ServiceType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                {servicesList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Etapa del Pipeline *</label>
              <select
                value={stage}
                onChange={e => handleStageChange(e.target.value as StageId)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-semibold"
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Probability & Expected Close Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Probabilidad de Cierre</label>
                <span className="font-mono text-blue-700 font-bold">{probability}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={probability}
                onChange={e => setProbability(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha Estimada de Cierre</label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={e => setExpectedCloseDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          {/* Consultant & Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Consultor Responsable</label>
            <input
              type="text"
              value={consultant}
              onChange={e => setConsultant(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notas & Requerimientos de Alcance</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Detalles sobre el alcance acordado, expectativas del cliente o hitos clave..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {isEditing && selectedDealId ? (
              <button
                type="button"
                onClick={() => {
                  deleteDeal(selectedDealId);
                  setActiveModal(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors font-semibold text-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Oportunidad'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
