export function SkeletonBox({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <SkeletonBox className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
        <SkeletonBox className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <SkeletonBox className="w-full h-64 lg:h-80 rounded-2xl" />
        <div className="space-y-4">
          <SkeletonBox className="h-7 w-1/2" />
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-4 w-5/6" />
          <SkeletonBox className="h-4 w-4/6" />
        </div>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <SkeletonBox className="w-full h-36 rounded-xl" />
        <SkeletonBox className="w-full h-28 rounded-xl" />
      </div>
    </div>
  );
}
