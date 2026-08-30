import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const Toast: React.FC = () => {
  const { notifications, dismissNotification } = useCrm();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {notifications.map((n) => {
          let Icon = Info;
          let borderColor = 'border-blue-500/30';
          let bgColor = 'bg-slate-900/95';
          let iconColor = 'text-blue-400';

          if (n.type === 'success') {
            Icon = CheckCircle2;
            borderColor = 'border-emerald-500/40';
            iconColor = 'text-emerald-400';
          } else if (n.type === 'warning') {
            Icon = AlertTriangle;
            borderColor = 'border-amber-500/40';
            iconColor = 'text-amber-400';
          } else if (n.type === 'error') {
            Icon = AlertCircle;
            borderColor = 'border-rose-500/40';
            iconColor = 'text-rose-400';
          }

          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderColor} ${bgColor} shadow-2xl backdrop-blur-md text-slate-100`}
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
              <div className="flex-1 text-sm font-medium leading-snug">
                <p className="text-slate-200">{n.message}</p>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">{n.timestamp}</span>
              </div>
              <button
                onClick={() => dismissNotification(n.id)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
