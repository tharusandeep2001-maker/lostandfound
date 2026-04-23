import React from 'react';

export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {Icon && <Icon className="w-8 h-8 text-slate-400" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">{subtitle}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
