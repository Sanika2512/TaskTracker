import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Flag, Layers3, Loader2, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { categories, getTodayInputDate, priorities, statuses, toInputDate } from '../../utils/helpers';

const fieldClass = (hasError) => `
  w-full rounded-2xl border bg-white/70 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition
  placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10
  dark:bg-white/10 dark:text-white dark:placeholder:text-slate-500
  ${hasError ? 'border-rose-400' : 'border-slate-200/80 dark:border-white/10'}
`;

const TaskModal = ({ isOpen, mode = 'create', task, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Pending',
      dueDate: '',
      category: 'Other',
    },
  });

  const titleLength = watch('title')?.length || 0;
  const descriptionLength = watch('description')?.length || 0;

  useEffect(() => {
    if (!isOpen) return;

    reset(task ? {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: toInputDate(task.dueDate),
      category: task.category,
    } : {
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Pending',
      dueDate: getTodayInputDate(),
      category: 'Other',
    });
  }, [isOpen, reset, task]);

  const submit = async (data) => {
    if (mode === 'edit') {
      await onSubmit(task._id, data);
    } else {
      await onSubmit(data);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="glass-panel max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-900/5 p-6 dark:border-white/10">
              <div>
                <p className="text-xs font-black uppercase text-teal-600 dark:text-teal-300">
                  {mode === 'edit' ? 'Edit workflow' : 'Quick add'}
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                  {mode === 'edit' ? 'Refine task details' : 'Create a new task'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-slate-600 ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 dark:bg-white/10 dark:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(submit)} className="space-y-5 p-6">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Title</label>
                <input
                  {...register('title', {
                    required: 'Title is required',
                    minLength: { value: 3, message: 'Use at least 3 characters' },
                    maxLength: { value: 100, message: 'Keep the title under 100 characters' },
                  })}
                  className={fieldClass(errors.title)}
                  placeholder="Launch onboarding checklist"
                />
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-rose-500">{errors.title?.message}</span>
                  <span className="text-slate-400">{titleLength}/100</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Description</label>
                <textarea
                  {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 10, message: 'Use at least 10 characters' },
                    maxLength: { value: 600, message: 'Keep the description under 600 characters' },
                  })}
                  rows="4"
                  className={`${fieldClass(errors.description)} resize-none`}
                  placeholder="Add context, expected outcome, blockers, or handoff notes."
                />
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-rose-500">{errors.description?.message}</span>
                  <span className="text-slate-400">{descriptionLength}/600</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <Flag className="h-4 w-4" /> Priority
                  </span>
                  <select {...register('priority', { required: true })} className={fieldClass(errors.priority)}>
                    {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <Layers3 className="h-4 w-4" /> Status
                  </span>
                  <select {...register('status', { required: true })} className={fieldClass(errors.status)}>
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <CalendarDays className="h-4 w-4" /> Due Date
                  </span>
                  <input
                    type="date"
                    min={getTodayInputDate()}
                    {...register('dueDate', { required: 'Due date is required' })}
                    className={fieldClass(errors.dueDate)}
                  />
                  <span className="mt-1 block text-xs text-rose-500">{errors.dueDate?.message}</span>
                </label>

                <label className="block">
                  <span className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <Layers3 className="h-4 w-4" /> Category
                  </span>
                  <select {...register('category', { required: true })} className={fieldClass(errors.category)}>
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl bg-white/70 px-5 py-3 text-sm font-bold text-slate-700 ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 dark:bg-white/10 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gradient-primary inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === 'edit' ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
