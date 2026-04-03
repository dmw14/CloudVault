export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 border
            bg-white dark:bg-surface-800/40
            border-surface-200 dark:border-surface-700/50"
        >
          {/* Title skeleton */}
          <div className="skeleton h-5 w-3/4 rounded-lg mb-4" />

          {/* Content skeletons */}
          <div className="space-y-2.5 mb-5">
            <div className="skeleton h-3.5 w-full rounded-md" />
            <div className="skeleton h-3.5 w-full rounded-md" />
            <div className="skeleton h-3.5 w-2/3 rounded-md" />
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-surface-100 dark:border-surface-700/50">
            <div className="skeleton h-3 w-24 rounded-md" />
            <div className="flex gap-2">
              <div className="skeleton h-8 w-8 rounded-lg" />
              <div className="skeleton h-8 w-8 rounded-lg" />
              <div className="skeleton h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
