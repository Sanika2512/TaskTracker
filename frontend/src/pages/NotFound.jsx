import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="glass-panel max-w-md rounded-3xl p-8 text-center">
      <div className="gradient-text text-7xl font-black">404</div>
      <h1 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">Page not found</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        The page you are looking for does not exist in this workspace.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="gradient-primary inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <button onClick={() => window.history.back()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/70 px-5 py-3 text-sm font-bold text-slate-700 ring-1 ring-slate-900/5 dark:bg-white/10 dark:text-slate-200">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    </div>
  </div>
);

export default NotFound;
