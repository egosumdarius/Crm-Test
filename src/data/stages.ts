import { Stage } from '../types';

export const STAGES: Stage[] = [
  {
    id: 'lead',
    name: 'Lead / Diagnóstico',
    color: '#3B82F6', // Blue
    bgLight: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    borderLight: 'border-blue-500/40',
    defaultProbability: 20,
    description: 'Primer contacto o solicitud de evaluación inicial de consultoría.'
  },
  {
    id: 'diagnostico',
    name: 'Sesión de Alcance',
    color: '#8B5CF6', // Purple
    bgLight: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderLight: 'border-purple-500/40',
    defaultProbability: 40,
    description: 'Reunión de levantamiento de requerimientos y definición de alcance.'
  },
  {
    id: 'propuesta',
    name: 'Propuesta Enviada',
    color: '#F59E0B', // Amber
    bgLight: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderLight: 'border-amber-500/40',
    defaultProbability: 60,
    description: 'Propuesta técnica y económica entregada al comité o directivo.'
  },
  {
    id: 'negociacion',
    name: 'Negociación / Cierre',
    color: '#EC4899', // Pink
    bgLight: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    borderLight: 'border-pink-500/40',
    defaultProbability: 80,
    description: 'Ajustes finales de presupuesto, plazos y firma de contrato/NDA.'
  },
  {
    id: 'ganado',
    name: 'Cerrado Ganado',
    color: '#10B981', // Green
    bgLight: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderLight: 'border-emerald-500/40',
    defaultProbability: 100,
    description: 'Contrato firmado e inicio del proyecto de consultoría.'
  },
  {
    id: 'perdido',
    name: 'Cerrado Perdido',
    color: '#64748B', // Slate
    bgLight: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    borderLight: 'border-slate-500/40',
    defaultProbability: 0,
    description: 'Oportunidad descartada o pospuesta para el próximo trimestre.'
  }
];
