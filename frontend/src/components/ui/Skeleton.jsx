import React from 'react';

export function SkeletonBox({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <SkeletonBox className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
        <SkeletonBox className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <SkeletonBox className="w-full h-56 lg:h-72 rounded-xl" />
        <div className="space-y-4">
          <SkeletonBox className="h-6 w-1/2" />
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-4 w-5/6" />
        </div>
      </div>
      <div>
        <SkeletonBox className="w-full h-48 rounded-xl" />
      </div>
    </div>
  );
}
