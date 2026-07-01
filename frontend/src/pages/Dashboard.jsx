import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock3, Flame, LayoutDashboard, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import { StatSkeleton, TaskSkeleton } from '../components/common/Skeletons';
import TaskCard from '../components/common/TaskCard';
import AddTaskModal from '../components/modals/AddTaskModal';
import DeleteModal from '../components/modals/DeleteModal';
import EditTaskModal from '../components/modals/EditTaskModal';
import { calculateCompletionRate, getStatusCounts, getTaskInsights, isOverdue } from '../utils/helpers';
import { useTasks } from '../hooks/useTasks';

const Dashboard = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleComplete } = useTasks({ sort: 'newest' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const statusCounts = getStatusCounts(tasks);
  const completionRate = calculateCompletionRate(tasks);
  const overdueCount = tasks.filter((task) => isOverdue(task.dueDate) && task.status !== 'Completed').length;
  const highPriorityCount = tasks.filter((task) => task.priority === 'High').length;
  const recentTasks = tasks.slice(0, 6);

  const focusTasks = useMemo(() => (
    tasks
      .filter((task) => task.status !== 'Completed')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4)
  ), [tasks]);

  const stats = [
    { icon: LayoutDashboard, title: 'Total Tasks', value: tasks.length, detail: 'All tracked work', accent: 'from-teal-500 to-blue-500', trend: 12 },
    { icon: CheckCircle2, title: 'Completed', value: statusCounts.Completed, detail: `${completionRate}% completion rate`, accent: 'from-emerald-500 to-teal-500', trend: 8 },
    { icon: Clock3, title: 'Pending', value: statusCounts.Pending, detail: 'Awaiting action', accent: 'from-amber-500 to-orange-500', trend: -3 },
    { icon: Flame, title: 'High Priority', value: highPriorityCount, detail: 'Needs focus', accent: 'from-rose-500 to-pink-500', trend: 5 },
  ];

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mesh-bg relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl shadow-blue-500/15 sm:p-8"
      >
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.5fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-white/70">Command center</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              Ship work with a dashboard that keeps priorities unmistakable.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78">
              {getTaskInsights(tasks)}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                Quick Add Task
              </button>
              <Link
                to="/tasks"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-black text-white ring-1 ring-white/25 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Search className="h-4 w-4" />
                Search Tasks
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white/12 p-5 ring-1 ring-white/20 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white/70">Completion</p>
                <p className="text-5xl font-black">{completionRate}%</p>
              </div>
              <div className="relative h-24 w-24">
                <svg className="-rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,.2)" strokeWidth="10" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="white"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${completionRate * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-bold text-white/80">
              <span className="rounded-2xl bg-white/10 px-3 py-2">{statusCounts.Pending} pending</span>
              <span className="rounded-2xl bg-white/10 px-3 py-2">{statusCounts['In Progress']} active</span>
              <span className="rounded-2xl bg-white/10 px-3 py-2">{overdueCount} overdue</span>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, index) => <StatSkeleton key={index} />) : stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Recent Tasks</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Latest work across your tracker.</p>
            </div>
            <Link to="/tasks" className="rounded-2xl bg-white/70 px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 dark:bg-white/10 dark:text-slate-200">
              View all
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {loading && Array.from({ length: 4 }).map((_, index) => <TaskSkeleton key={index} />)}
            {!loading && recentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditingTask}
                onDelete={(id) => setDeletingTask(tasks.find((item) => item._id === id))}
                onComplete={toggleComplete}
              />
            ))}
          </div>

          {!loading && !recentTasks.length && (
            <div className="glass-panel rounded-3xl p-10 text-center">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">No tasks yet</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create one task and the dashboard comes alive.</p>
              <button onClick={() => setIsAddModalOpen(true)} className="gradient-primary mt-5 rounded-2xl px-5 py-3 text-sm font-black text-white">
                Create First Task
              </button>
            </div>
          )}
        </div>

        <aside className="glass-panel h-fit rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-600 dark:text-rose-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black text-slate-950 dark:text-white">Focus Queue</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Closest active deadlines.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {focusTasks.map((task) => (
              <button
                key={task._id}
                onClick={() => setEditingTask(task)}
                className="w-full rounded-2xl bg-white/65 p-4 text-left ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 dark:bg-white/10"
              >
                <p className="truncate font-bold text-slate-900 dark:text-white">{task.title}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{task.priority} priority</p>
              </button>
            ))}
            {!focusTasks.length && <p className="rounded-2xl bg-white/60 p-4 text-sm text-slate-500 dark:bg-white/10 dark:text-slate-400">No active deadlines. Smooth sailing.</p>}
          </div>
        </aside>
      </section>

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

export default Dashboard;
