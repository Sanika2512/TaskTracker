import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Clock3, LayoutDashboard, ListTodo, Settings, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tasks', icon: ListTodo, label: 'All Tasks' },
  { path: '/tasks?status=Completed', icon: CheckCircle2, label: 'Completed' },
  { path: '/tasks?status=Pending', icon: Clock3, label: 'Pending' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = ({ isOpen, isMobile, onClose }) => {
  const content = (
    <aside className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5 lg:hidden">
        <span className="text-sm font-black uppercase text-slate-500 dark:text-slate-400">Navigation</span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-slate-600 ring-1 ring-slate-900/5 dark:bg-white/10 dark:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) => `
              flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all
              ${isActive
                ? 'bg-slate-950 text-white shadow-xl shadow-slate-950/15 dark:bg-white dark:text-slate-950'
                : 'text-slate-600 hover:bg-white/70 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'}
            `}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <div className="mesh-bg rounded-2xl p-4 text-white shadow-xl shadow-blue-500/15">
          <p className="text-sm font-black">Focus score</p>
          <p className="mt-1 text-xs text-white/80">Keep high-priority work visible and close loops faster.</p>
          <div className="mt-4 h-2 rounded-full bg-white/20">
            <div className="h-2 w-3/4 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {(isOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -300 } : undefined}
            transition={{ type: 'spring', damping: 26, stiffness: 250 }}
            className="fixed left-0 top-[65px] z-50 h-[calc(100vh-65px)] w-72 border-r border-white/50 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55 lg:sticky lg:z-20"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
