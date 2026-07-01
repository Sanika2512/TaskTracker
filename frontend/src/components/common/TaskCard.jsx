import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Circle,
  Edit3,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
  Sparkles,
  Tag,
  Trash2,
  UserRound,
  Zap,
} from 'lucide-react';
import {
  formatDate,
  getDaysUntilDue,
  getPriorityColor,
  getStatusColor,
  isOverdue,
} from '../../utils/helpers';

const categoryIcons = {
  Work: BriefcaseBusiness,
  Personal: UserRound,
  Urgent: Zap,
  Health: HeartPulse,
  Learning: GraduationCap,
  Other: Tag,
};

const TaskCard = ({ task, onEdit, onDelete, onComplete }) => {
  const CategoryIcon = categoryIcons[task.category] || Sparkles;
  const overdue = isOverdue(task.dueDate) && task.status !== 'Completed';
  const daysUntilDue = getDaysUntilDue(task.dueDate);

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 360, damping: 26 }}
      className="glass-panel group relative overflow-hidden rounded-2xl p-5"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-rose-500 opacity-80" />

      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => onComplete(task._id, task.completed)}
          title={task.completed ? 'Reopen task' : 'Mark complete'}
          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${
            task.completed
              ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'border-slate-200 bg-white/70 text-slate-400 hover:border-teal-400 hover:text-teal-600 dark:border-white/10 dark:bg-white/10'
          }`}
        >
          {task.completed ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className={`truncate text-lg font-bold text-slate-950 dark:text-white ${task.completed ? 'line-through opacity-55' : ''}`}>
                {task.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {task.description}
              </p>
            </div>
            <MoreHorizontal className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-900/5 dark:bg-white/10 dark:text-slate-300">
              <CategoryIcon className="h-3.5 w-3.5" />
              {task.category}
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-900/5 pt-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span className={`inline-flex items-center gap-2 ${overdue ? 'font-semibold text-rose-600 dark:text-rose-300' : ''}`}>
              <CalendarDays className="h-4 w-4" />
              {formatDate(task.dueDate)}
              {!overdue && task.status !== 'Completed' && daysUntilDue <= 3 && daysUntilDue >= 0 && (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                  {daysUntilDue === 0 ? 'Today' : `${daysUntilDue}d left`}
                </span>
              )}
              {overdue && <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-bold">Overdue</span>}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(task)}
                title="Edit task"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-slate-600 ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:text-blue-600 dark:bg-white/10 dark:text-slate-300"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task._id)}
                title="Delete task"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-slate-600 ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:text-rose-600 dark:bg-white/10 dark:text-slate-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default TaskCard;
