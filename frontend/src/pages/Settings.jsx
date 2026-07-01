import { Download, Moon, ShieldCheck, Sun, ToggleLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { tasks } = useTasks();

  const exportTasks = () => {
    const csv = [
      ['Title', 'Description', 'Priority', 'Status', 'Category', 'Due Date', 'Created At'],
      ...tasks.map((task) => [
        task.title,
        task.description,
        task.priority,
        task.status,
        task.category,
        new Date(task.dueDate).toLocaleDateString(),
        new Date(task.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `task-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6">
        <p className="text-xs font-black uppercase text-teal-600 dark:text-teal-300">Settings</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Workspace preferences</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Configure appearance and export task data for demos, reviews, and handoffs.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-teal-500/10 p-3 text-teal-600 dark:text-teal-300">
              <ToggleLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black text-slate-950 dark:text-white">Appearance</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark glass themes.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="mt-6 flex w-full items-center justify-between rounded-3xl bg-white/65 p-4 text-left ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 dark:bg-white/10"
          >
            <span>
              <span className="block font-black text-slate-950 dark:text-white">Dark Mode</span>
              <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{isDark ? 'Enabled' : 'Disabled'}</span>
            </span>
            <span className="gradient-primary inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white">
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </span>
          </button>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-300 w-fit">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-black text-slate-950 dark:text-white">Deploy Ready</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            API URLs are environment-based and MongoDB is loaded from the existing backend environment.
          </p>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-black text-slate-950 dark:text-white">Data Export</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Download the current task list as a CSV file.</p>
          </div>
          <button
            type="button"
            onClick={exportTasks}
            className="gradient-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
