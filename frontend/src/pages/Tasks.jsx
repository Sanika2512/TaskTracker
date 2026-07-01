import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TaskCard from '../components/common/TaskCard';
import { TaskSkeleton } from '../components/common/Skeletons';
import AddTaskModal from '../components/modals/AddTaskModal';
import DeleteModal from '../components/modals/DeleteModal';
import EditTaskModal from '../components/modals/EditTaskModal';
import { categories, priorities, statuses } from '../utils/helpers';
import { useTasks } from '../hooks/useTasks';

const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tasks, meta, loading, filters, setFilters, clearFilters, createTask, updateTask, deleteTask, toggleComplete } = useTasks({
    status: searchParams.get('status') || '',
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const status = searchParams.get('status') || '';
    setFilters((prev) => ({ ...prev, status }));
  }, [searchParams, setFilters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'status') {
      setSearchParams(value ? { status: value } : {});
    }
  };

  const hasFilters = filters.search || filters.status || filters.priority || filters.category || filters.due || filters.sort !== 'newest';

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-teal-600 dark:text-teal-300">Task operations</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Plan, filter, and execute</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Search across titles, descriptions, and categories. Filter by priority, status, and due date without refreshing the page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="gradient-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Search tasks, categories, or notes..."
              className="h-12 w-full rounded-2xl border border-slate-200/80 bg-white/70 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white/70 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-900/5 dark:bg-white/10 dark:text-slate-200"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  setSearchParams({});
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-slate-600 ring-1 ring-slate-900/5 dark:bg-white/10 dark:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-3 border-t border-slate-900/5 pt-4 dark:border-white/10 sm:grid-cols-2 xl:grid-cols-5">
                <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm font-bold dark:border-white/10 dark:bg-white/10 dark:text-white">
                  <option value="">All Status</option>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <select value={filters.priority} onChange={(event) => updateFilter('priority', event.target.value)} className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm font-bold dark:border-white/10 dark:bg-white/10 dark:text-white">
                  <option value="">All Priority</option>
                  {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                </select>
                <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)} className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm font-bold dark:border-white/10 dark:bg-white/10 dark:text-white">
                  <option value="">All Categories</option>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
                <select value={filters.due} onChange={(event) => updateFilter('due', event.target.value)} className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm font-bold dark:border-white/10 dark:bg-white/10 dark:text-white">
                  <option value="">Any Due Date</option>
                  <option value="today">Due Today</option>
                  <option value="week">Due This Week</option>
                  <option value="overdue">Overdue</option>
                </select>
                <select value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)} className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm font-bold dark:border-white/10 dark:bg-white/10 dark:text-white">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
          Showing {tasks.length} of {meta.total} tasks
        </p>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-900/5 dark:bg-white/10 dark:text-slate-300">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Live updates
        </span>
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        {loading && Array.from({ length: 6 }).map((_, index) => <TaskSkeleton key={index} />)}
        {!loading && tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={setEditingTask}
            onDelete={(id) => setDeletingTask(tasks.find((item) => item._id === id))}
            onComplete={toggleComplete}
          />
        ))}
      </section>

      {!loading && !tasks.length && (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <h3 className="text-2xl font-black text-slate-950 dark:text-white">No tasks found</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Adjust filters or create a new task to start tracking work.</p>
          <button onClick={() => setIsAddModalOpen(true)} className="gradient-primary mt-5 rounded-2xl px-5 py-3 text-sm font-black text-white">
            Create Task
          </button>
        </div>
      )}

      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={createTask} />
      <EditTaskModal isOpen={Boolean(editingTask)} onClose={() => setEditingTask(null)} onSubmit={updateTask} task={editingTask} />
      <DeleteModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={async () => {
          await deleteTask(deletingTask._id);
          setDeletingTask(null);
        }}
        taskTitle={deletingTask?.title}
      />
    </div>
  );
};

export default Tasks;
