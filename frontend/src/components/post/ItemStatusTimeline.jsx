import { useMemo } from 'react';

function formatTimestamp(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today, ${time}`;
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${day}, ${time}`;
}

const STEPS = [
  {
    key: 'reported',
    label: 'Reported',
    hint: 'Scanning for matches',
  },
  {
    key: 'matched',
    label: 'Matched',
    hint: 'Claim under review',
  },
  {
    key: 'claimed',
    label: 'Claimed',
    hint: 'Admin is reviewing',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    hint: null,
  },
];

function getStepIndex(status) {
  if (!status || status === 'open') return 0;
  if (status === 'matched') return 1;
  if (status === 'claimed') return 2;
  if (status === 'resolved') return 3;
  return 0;
}

export default function ItemStatusTimeline({ post }) {
  const activeIndex = useMemo(() => getStepIndex(post?.status), [post?.status]);
  const isResolved = post?.status === 'resolved';

  const timestamps = useMemo(() => [
    post?.createdAt,
    post?.lastMatchedAt || null,
    post?.claimedAt || null,
    post?.resolvedAt || null,
  ], [post]);

  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{
        background: isResolved ? 'rgba(5,150,105,0.06)' : 'var(--color-background-primary, white)',
        border: isResolved ? '1px solid #a7f3d0' : '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: isResolved ? '#059669' : '#6b7280', letterSpacing: '0.07em' }}
      >
        {isResolved ? 'Item returned ✓' : 'Item status'}
      </p>

      {/* Desktop horizontal rail */}
      <div className="hidden sm:flex items-start">
        {STEPS.map((step, i) => {
          const isCompleted = i < activeIndex || isResolved;
          const isActive = i === activeIndex && !isResolved;
          const isFuture = i > activeIndex && !isResolved;
          const ts = timestamps[i];

          return (
            <div key={step.key} className="flex items-start flex-1 min-w-0">
              {/* Node */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 64 }}>
                {/* Circle */}
                <div className="relative flex items-center justify-center w-9 h-9">
                  {isActive && (
                    <div
                      className="absolute w-9 h-9 rounded-full"
                      style={{
                        border: '2px solid #f59e0b',
                        animation: 'timeline-pulse 1.8s ease-out infinite',
                      }}
                    />
                  )}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center z-10 relative"
                    style={{
                      background: isResolved
                        ? '#059669'
                        : isCompleted
                        ? '#4f46e5'
                        : isActive
                        ? '#f59e0b'
                        : 'transparent',
                      border: isFuture ? '1.5px solid #cbd5e1' : 'none',
                    }}
                  >
                    {(isCompleted || isActive || isResolved) && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Label */}
                <span
                  className="text-xs font-medium mt-2 text-center"
                  style={{ color: isFuture ? '#94a3b8' : isResolved ? '#059669' : '#111827' }}
                >
                  {step.label}
                </span>

                {/* Timestamp */}
                <span className="text-xs mt-0.5 text-center" style={{ color: '#94a3b8' }}>
                  {ts ? formatTimestamp(ts) : 'Pending'}
                </span>

                {/* Hint */}
                {isActive && step.hint && (
                  <span
                    className="text-center mt-1 leading-snug"
                    style={{ fontSize: 10, color: '#9ca3af', maxWidth: 80 }}
                  >
                    {step.hint}
                  </span>
                )}
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 mt-4 mx-1"
                  style={{
                    height: 2,
                    background:
                      isResolved
                        ? '#059669'
                        : i < activeIndex
                        ? '#4f46e5'
                        : 'repeating-linear-gradient(90deg,#cbd5e1 0,#cbd5e1 4px,transparent 4px,transparent 8px)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile vertical stack */}
      <div className="flex sm:hidden flex-col gap-0">
        {STEPS.map((step, i) => {
          const isCompleted = i < activeIndex || isResolved;
          const isActive = i === activeIndex && !isResolved;
          const isFuture = i > activeIndex && !isResolved;
          const ts = timestamps[i];

          return (
            <div key={step.key} className="flex items-stretch gap-3">
              {/* Left track */}
              <div className="flex flex-col items-center w-9 flex-shrink-0">
                <div className="relative flex items-center justify-center w-9 h-9">
                  {isActive && (
                    <div
                      className="absolute w-9 h-9 rounded-full"
                      style={{ border: '2px solid #f59e0b', animation: 'timeline-pulse 1.8s ease-out infinite' }}
                    />
                  )}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center z-10 relative"
                    style={{
                      background: isResolved
                        ? '#059669'
                        : isCompleted
                        ? '#4f46e5'
                        : isActive
                        ? '#f59e0b'
                        : 'transparent',
                      border: isFuture ? '1.5px solid #cbd5e1' : 'none',
                    }}
                  >
                    {(isCompleted || isActive || isResolved) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-0.5 flex-1 my-0.5"
                    style={{
                      minHeight: 20,
                      background:
                        isResolved
                          ? '#059669'
                          : i < activeIndex
                          ? '#4f46e5'
                          : '#e2e8f0',
                    }}
                  />
                )}
              </div>

              {/* Right content */}
              <div className="pb-4 pt-1.5 flex flex-col justify-start">
                <span
                  className="text-sm font-medium"
                  style={{ color: isFuture ? '#94a3b8' : isResolved ? '#059669' : '#111827' }}
                >
                  {step.label}
                </span>
                <span className="text-xs" style={{ color: '#9ca3af' }}>
                  {ts ? formatTimestamp(ts) : 'Pending'}
                </span>
                {isActive && step.hint && (
                  <span className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{step.hint}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes timeline-pulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          70% { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
