export const priorities = ['Low', 'Medium', 'High'];
export const statuses = ['Pending', 'In Progress', 'Completed'];
export const categories = ['Work', 'Personal', 'Urgent', 'Health', 'Learning', 'Other'];

export const formatDate = (date) => {
  if (!date) return 'No date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const toInputDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export const getTodayInputDate = () => new Date().toISOString().split('T')[0];

export const getPriorityColor = (priority) => {
  const colors = {
    High: 'bg-rose-500/12 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300',
    Medium: 'bg-amber-500/12 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300',
    Low: 'bg-teal-500/12 text-teal-700 ring-1 ring-teal-500/20 dark:text-teal-300',
  };
  return colors[priority] || colors.Medium;
};

export const getStatusColor = (status) => {
  const colors = {
    Completed: 'bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300',
    'In Progress': 'bg-blue-500/12 text-blue-700 ring-1 ring-blue-500/20 dark:text-blue-300',
    Pending: 'bg-slate-500/12 text-slate-700 ring-1 ring-slate-500/20 dark:text-slate-300',
  };
  return colors[status] || colors.Pending;
};

export const calculateCompletionRate = (tasks) => {
  if (!tasks.length) return 0;
  const completed = tasks.filter((task) => task.status === 'Completed').length;
  return Math.round((completed / tasks.length) * 100);
};

export const isOverdue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

export const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due - today) / 86400000);
};

export const getStatusCounts = (tasks) => statuses.reduce((acc, status) => {
  acc[status] = tasks.filter((task) => task.status === status).length;
  return acc;
}, {});

export const getPriorityCounts = (tasks) => priorities.reduce((acc, priority) => {
  acc[priority] = tasks.filter((task) => task.priority === priority).length;
  return acc;
}, {});

export const getTaskInsights = (tasks) => {
  const completionRate = calculateCompletionRate(tasks);
  const overdue = tasks.filter((task) => isOverdue(task.dueDate) && task.status !== 'Completed').length;
  const highPriority = tasks.filter((task) => task.priority === 'High' && task.status !== 'Completed').length;

  if (!tasks.length) return 'Create your first task to activate the dashboard.';
  if (completionRate === 100) return 'Everything is complete. Excellent execution.';
  if (overdue > 0) return `${overdue} overdue task${overdue > 1 ? 's need' : ' needs'} attention.`;
  if (highPriority > 0) return `${highPriority} high-priority task${highPriority > 1 ? 's are' : ' is'} active.`;
  return `You are ${completionRate}% through the current workload.`;
};
