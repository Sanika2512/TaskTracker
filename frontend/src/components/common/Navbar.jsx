import { Bell, Menu, Moon, Plus, Search, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const Navbar = ({ onAddTask, toggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            title="Toggle navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-slate-700 ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/10 dark:text-slate-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-2xl font-black text-white shadow-lg shadow-blue-500/20">
              T
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-black uppercase tracking-normal text-slate-950 dark:text-white">Task Tracker</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Execution workspace</p>
            </div>
          </div>
        </div>

        <div className="hidden min-w-0 max-w-xl flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Global search hint"
              readOnly
              value="Use the Tasks page for live search"
              className="h-11 w-full rounded-2xl border border-white/70 bg-white/65 pl-11 pr-4 text-sm font-medium text-slate-500 outline-none backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            title="Toggle dark mode"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-slate-700 ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/10 dark:text-slate-200"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            title="Notifications"
            className="relative hidden h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-slate-700 ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/10 dark:text-slate-200 sm:inline-flex"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500" />
          </button>
          <button
            type="button"
            onClick={onAddTask}
            className="gradient-primary inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
