import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';

export default function PostStatusBadge({ status, size = 'md' }) {
  const label = STATUS_LABELS[status];
  const colorClass = STATUS_COLORS[status] || 'bg-slate-100 text-slate-600';
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  
  let dotColor = 'bg-gray-400';
  if (status === 'open') dotColor = 'bg-green-500';
  else if (status === 'matched') dotColor = 'bg-amber-500';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${colorClass} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {label}
    </span>
  );
}
