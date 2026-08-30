import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Mail, 
  MoreHorizontal, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  ArrowRight,
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { STAGES } from '../data/stages';
import { Deal, StageId, ServiceType } from '../types';

export const PipelineView: React.FC = () => {
  const { 
    deals, 
    moveDealStage, 
    openNewDealModal, 
    setSelectedDealId, 
    setActiveModal, 
    openScheduleMeetingModal, 
    openComposeEmailModal, 
    searchQuery, 
    setSearchQuery,
    serviceFilter,
    setServiceFilter,
    contacts
  } = useCrm();

  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = serviceFilter === 'all' || deal.serviceType === serviceFilter;

    return matchesSearch && matchesService;
  });

  // Calculate Pipeline Metrics
  const totalPipelineValue = filteredDeals
    .filter(d => d.stage !== 'perdido')
    .reduce((sum, d) => sum + d.value, 0);

  const weightedPipelineValue = filteredDeals
    .filter(d => d.stage !== 'perdido' && d.stage !== 'ganado')
    .reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);

  const wonDealsValue = filteredDeals
    .filter(d => d.stage === 'ganado')
    .reduce((sum, d) => sum + d.value, 0);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: StageId) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId) {
      moveDealStage(dealId, targetStage);
    }
    setDraggedDealId(null);
  };

  const serviceOptions: ServiceType[] = [
    'Estrategia Empresarial',
    'Transformación Digital',
    'Eficiencia Operativa',
    'Auditoría & Compliance',
    'Consultoría Financiera',
    'Talento & RRHH',
    'Innovación & Producto'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Pipeline KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pipeline Total</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {totalPipelineValue.toLocaleString()} €
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {filteredDeals.filter(d => d.stage !== 'perdido').length} oportunidades activas
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor Ponderado</span>
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">
            {Math.round(weightedPipelineValue).toLocaleString()} €
          </p>
          <p className="text-xs text-slate-500 mt-1">Proyección ajustada a probabilidad</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cerrado Ganado</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">
            {wonDealsValue.toLocaleString()} €
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {filteredDeals.filter(d => d.stage === 'ganado').length} contratos firmados
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket Promedio</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {filteredDeals.length > 0 
              ? Math.round(totalPipelineValue / Math.max(1, filteredDeals.length)).toLocaleString() + ' €'
              : '0 €'}
          </p>
          <p className="text-xs text-slate-500 mt-1">Por proyecto de consultoría</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, proyecto, servicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Service filter */}
          <div className="shrink-0">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="all">Todos los Servicios</option>
              {serviceOptions.map(svc => (
                <option key={svc} value={svc}>{svc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Create Deal Button */}
        <button
          onClick={() => openNewDealModal()}
          className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Oportunidad</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
        {STAGES.map((stage) => {
          const stageDeals = filteredDeals.filter(d => d.stage === stage.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="bg-slate-200/50 border border-slate-200/80 rounded-xl flex flex-col min-h-[520px] transition-colors"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-200 bg-slate-100/60 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="text-xs font-bold text-slate-800 tracking-tight">{stage.name}</h3>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {stageDeals.length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-slate-500 font-mono font-medium">
                    {stageTotal.toLocaleString()} €
                  </span>
                  <button
                    onClick={() => {
                      setSelectedDealId(null);
                      setActiveModal('deal');
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
                    title={`Añadir oportunidad en ${stage.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Column Cards Container */}
              <div className="p-2 flex-1 space-y-2.5 overflow-y-auto max-h-[620px]">
                {stageDeals.length === 0 ? (
                  <div className="h-32 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-3 text-center text-slate-400">
                    <p className="text-[11px]">Arrastra oportunidades aquí</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    return (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 p-3 rounded-lg shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative"
                      >
                        {/* Service Type Tag & Value */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 truncate max-w-[130px]">
                            {deal.serviceType}
                          </span>
                          <span className="text-xs font-bold text-slate-900 shrink-0 font-mono">
                            {deal.value.toLocaleString()} {deal.currency === 'EUR' ? '€' : '$'}
                          </span>
                        </div>

                        {/* Deal Title */}
                        <h4 
                          onClick={() => {
                            setSelectedDealId(deal.id);
                            setActiveModal('deal');
                          }}
                          className="text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer mb-1 leading-snug"
                        >
                          {deal.title}
                        </h4>

                        {/* Company & Contact */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate font-medium">{deal.company}</span>
                        </div>

                        {/* Probability Progress Bar */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                            <span>Probabilidad</span>
                            <span className="font-semibold text-slate-700">{deal.probability}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-300"
                              style={{ 
                                width: `${deal.probability}%`,
                                backgroundColor: stage.color
                              }}
                            />
                          </div>
                        </div>

                        {/* Footer Info: Expected close date & Consultant */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1" title="Fecha estimada de cierre">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{deal.expectedCloseDate}</span>
                          </div>
                          <span className="text-slate-600 font-medium truncate max-w-[90px]">
                            {deal.consultant.split(' ')[0]}
                          </span>
                        </div>

                        {/* Quick Action Overlay on Card (Meeting, Gmail Email, Stage Move) */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            {/* Schedule Meeting via Google */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openScheduleMeetingModal({
                                  contactId: deal.contactId,
                                  dealId: deal.id
                                });
                              }}
                              className="p-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                              title="Agendar reunión con Google Calendar"
                            >
                              <Calendar className="w-3 h-3" />
                            </button>

                            {/* Send Email via Gmail */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openComposeEmailModal({
                                  to: deal.contactEmail,
                                  contactId: deal.contactId,
                                  subject: `Propuesta de Consultoría: ${deal.serviceType} | ${deal.company}`
                                });
                              }}
                              className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                              title="Enviar correo con Gmail"
                            >
                              <Mail className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Quick Stage Progression buttons */}
                          <div className="flex items-center gap-1">
                            {stage.id !== 'ganado' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const stageIdx = STAGES.findIndex(s => s.id === stage.id);
                                  if (stageIdx < STAGES.length - 2) {
                                    moveDealStage(deal.id, STAGES[stageIdx + 1].id);
                                  } else {
                                    moveDealStage(deal.id, 'ganado');
                                  }
                                }}
                                className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors"
                                title="Avanzar a siguiente etapa"
                              >
                                <span>Avanzar</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}

                            {stage.id === 'negociacion' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveDealStage(deal.id, 'ganado');
                                }}
                                className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                                title="Marcar como Cerrado Ganado"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
