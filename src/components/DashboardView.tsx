import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Calendar, 
  Mail, 
  Briefcase, 
  Users, 
  ArrowUpRight,
  Clock,
  Award
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { STAGES } from '../data/stages';

export const DashboardView: React.FC = () => {
  const { deals, contacts, meetings, emailLogs, activities, setCurrentView } = useCrm();

  const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
  const wonDeals = deals.filter(d => d.stage === 'ganado');
  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const activeDeals = deals.filter(d => d.stage !== 'ganado' && d.stage !== 'perdido');
  const weightedPipeline = activeDeals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);

  const winRate = deals.length > 0
    ? Math.round((wonDeals.length / Math.max(1, deals.length)) * 100)
    : 0;

  // Breakdown by Service Type
  const servicesMap: Record<string, { count: number; value: number }> = {};
  deals.forEach(deal => {
    if (!servicesMap[deal.serviceType]) {
      servicesMap[deal.serviceType] = { count: 0, value: 0 };
    }
    servicesMap[deal.serviceType].count += 1;
    servicesMap[deal.serviceType].value += deal.value;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Rendimiento de Consultoría & Pipeline</h2>
          <p className="text-xs text-slate-400">Métricas clave de conversión comercial, reuniones y acuerdos cerrados.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Periodo actual:</span>
          <span className="text-xs font-bold text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            Q3 / Q4 2026
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Ganado (Contratos)</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{wonRevenue.toLocaleString()} €</p>
          <span className="text-[11px] text-slate-400 mt-1 block">{wonDeals.length} proyectos firmados</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pipeline Activo</span>
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {activeDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()} €
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">{activeDeals.length} oportunidades en curso</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tasa de Conversión</span>
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-indigo-300 mt-2">{winRate}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Récord de efectividad comercial</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Actividad Google Workspace</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{meetings.length + emailLogs.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">{meetings.length} reuniones · {emailLogs.length} correos</span>
        </div>

      </div>

      {/* Funnel & Services Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Conversion Funnel by Stage */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
            <span>Embudo Comercial de Consultoría</span>
            <span className="text-xs font-normal text-slate-400">Por Etapa</span>
          </h3>

          <div className="space-y-3">
            {STAGES.map(stage => {
              const count = deals.filter(d => d.stage === stage.id).length;
              const value = deals.filter(d => d.stage === stage.id).reduce((sum, d) => sum + d.value, 0);
              const percentage = totalPipeline > 0 ? (value / totalPipeline) * 100 : 0;

              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                      {stage.name}
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400">{count} deals</span>
                      <span className="font-bold text-slate-200">{value.toLocaleString()} €</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(percentage, count > 0 ? 5 : 0)}%`,
                        backgroundColor: stage.color 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Distribución por Tipo de Servicio</h3>
          
          <div className="space-y-3">
            {Object.entries(servicesMap).map(([serviceName, data]) => {
              const percent = totalPipeline > 0 ? (data.value / totalPipeline) * 100 : 0;
              return (
                <div key={serviceName} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200">{serviceName}</span>
                    <span className="font-mono font-bold text-white">{data.value.toLocaleString()} €</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{data.count} proyectos activos</span>
                    <span>{Math.round(percent)}% del pipeline</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Activity Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">Registro de Actividad en Tiempo Real</h3>
        <div className="divide-y divide-slate-800">
          {activities.slice(0, 6).map(act => (
            <div key={act.id} className="py-3 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <p className="text-slate-300">{act.description}</p>
              </div>
              <span className="text-[11px] text-slate-500 font-mono shrink-0">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
