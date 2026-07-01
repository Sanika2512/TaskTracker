import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Clock3, Flame, PieChart, TrendingUp } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { StatSkeleton } from '../components/common/Skeletons';
import { calculateCompletionRate, getPriorityCounts, getStatusCounts } from '../utils/helpers';
import { useTasks } from '../hooks/useTasks';

const Analytics = () => {
  const { tasks, loading } = useTasks();
  const statusCounts = getStatusCounts(tasks);
  const priorityCounts = getPriorityCounts(tasks);
  const completionRate = calculateCompletionRate(tasks);
  const maxPriority = Math.max(...Object.values(priorityCounts), 1);

  const cards = [
    { icon: BarChart3, title: 'Tracked Tasks', value: tasks.length, detail: 'Total items in MongoDB', accent: 'from-teal-500 to-blue-500' },
    { icon: CheckCircle2, title: 'Completion Rate', value: `${completionRate}%`, detail: 'Completed vs total', accent: 'from-emerald-500 to-teal-500' },
    { icon: Clock3, title: 'In Progress', value: statusCounts['In Progress'], detail: 'Currently active', accent: 'from-blue-500 to-indigo-500' },
    { icon: Flame, title: 'High Priority', value: priorityCounts.High, detail: 'Requires attention', accent: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6">
        <p className="text-xs font-black uppercase text-teal-600 dark:text-teal-300">Analytics</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Task intelligence</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          A concise view of throughput, status distribution, and priority load for your current workspace.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, index) => <StatSkeleton key={index} />) : cards.map((card) => <StatCard key={card.title} {...card} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-300">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black text-slate-950 dark:text-white">Status Distribution</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">How work is moving.</p>
            </div>
          </div>
          <div className="mt-6 space-y-5">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status}>
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span>{status}</span>
                  <span className="text-slate-500 dark:text-slate-400">{count}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200/70 dark:bg-white/10">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-700"
                    style={{ width: tasks.length ? `${(count / tasks.length) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-600 dark:text-rose-300">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black text-slate-950 dark:text-white">Priority Load</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Balance across urgency levels.</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {Object.entries(priorityCounts).map(([priority, count]) => (
              <div key={priority} className="rounded-2xl bg-white/65 p-4 ring-1 ring-slate-900/5 dark:bg-white/10">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>{priority}</span>
                  <span>{count} tasks</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200/70 dark:bg-white/10">
                  <div
                    className={`h-2 rounded-full ${priority === 'High' ? 'bg-rose-500' : priority === 'Medium' ? 'bg-amber-500' : 'bg-teal-500'}`}
                    style={{ width: `${(count / maxPriority) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Analytics;
