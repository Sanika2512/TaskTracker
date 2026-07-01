import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, detail, accent = 'from-teal-500 to-blue-500', trend }) => {
  const TrendIcon = trend && trend < 0 ? ArrowDownRight : ArrowUpRight;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="glass-panel group rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 shadow-lg shadow-slate-900/10`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {trend !== undefined && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-900/5 dark:bg-white/10 dark:text-slate-300">
            <TrendIcon className="h-3.5 w-3.5" />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 text-3xl font-black tracking-normal text-slate-950 dark:text-white">{value}</p>
      {detail && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{detail}</p>}
    </motion.div>
  );
};

export default StatCard;
