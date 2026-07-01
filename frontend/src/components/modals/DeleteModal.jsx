import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { useState } from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const confirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="glass-panel w-full max-w-md rounded-3xl p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-600 dark:text-rose-300">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">Delete task</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    This will permanently remove <span className="font-bold text-slate-800 dark:text-slate-200">"{taskTitle}"</span>.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-slate-600 ring-1 ring-slate-900/5 dark:bg-white/10 dark:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl bg-white/70 px-5 py-3 text-sm font-bold text-slate-700 ring-1 ring-slate-900/5 dark:bg-white/10 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-rose-500/20 transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete Task
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
