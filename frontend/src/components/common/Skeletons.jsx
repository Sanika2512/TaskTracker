export const StatSkeleton = () => (
  <div className="glass-panel rounded-2xl p-5">
    <div className="skeleton h-10 w-10 rounded-xl" />
    <div className="skeleton mt-5 h-4 w-24 rounded-full" />
    <div className="skeleton mt-3 h-8 w-16 rounded-full" />
  </div>
);

export const TaskSkeleton = () => (
  <div className="glass-panel rounded-2xl p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="skeleton h-5 w-3/4 rounded-full" />
        <div className="skeleton mt-3 h-4 w-full rounded-full" />
        <div className="skeleton mt-2 h-4 w-2/3 rounded-full" />
      </div>
      <div className="skeleton h-9 w-20 rounded-xl" />
    </div>
    <div className="mt-5 flex gap-2">
      <div className="skeleton h-7 w-20 rounded-full" />
      <div className="skeleton h-7 w-24 rounded-full" />
      <div className="skeleton h-7 w-28 rounded-full" />
    </div>
  </div>
);
