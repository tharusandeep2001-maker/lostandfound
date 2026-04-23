import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, RefreshCw, SearchX, SlidersHorizontal, X } from 'lucide-react';
import PostCard from '../components/post/PostCard';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';
import { CATEGORIES, ZONES } from '../utils/constants';
import { usePosts } from '../hooks/postHooks';

export default function PostBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentType     = searchParams.get('type') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentZone     = searchParams.get('zone') || '';
  const currentQ        = searchParams.get('q') || '';
  const currentPage     = parseInt(searchParams.get('page') || '1', 10);

  const filters = {
    type:     currentType     || undefined,
    category: currentCategory || undefined,
    zone:     currentZone     || undefined,
    q:        currentQ        || undefined,
    page:     currentPage,
    limit:    12,
  };

  const [inputQ, setInputQ] = useState(currentQ);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchParams(prev => {
        if (inputQ) prev.set('q', inputQ); else prev.delete('q');
        if (inputQ !== currentQ) prev.set('page', '1');
        return prev;
      });
    }, 400);
    return () => clearTimeout(t);
  }, [inputQ, setSearchParams, currentQ]);

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      if (value) prev.set(key, value); else prev.delete(key);
      if (key !== 'page') prev.set('page', '1');
      return prev;
    });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setInputQ('');
  };

  const activeFilterCount = Array.from(searchParams.keys()).filter(k => k !== 'page').length;

  const { data, isLoading, isError, refetch } = usePosts(filters);
  const posts = data?.posts ?? [];
  const pages = data?.pages ?? 1;

  const TYPE_OPTS = [
    { value: '',      label: 'All' },
    { value: 'lost',  label: 'Lost',  active: 'bg-red-500 text-white shadow-sm' },
    { value: 'found', label: 'Found', active: 'bg-emerald-500 text-white shadow-sm' },
  ];

  return (
    <div className="space-y-6">

      {/* Page title row */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lost &amp; Found Board</h1>
          <p className="text-slate-500 text-sm mt-1">Browse all reported items or post your own</p>
        </div>
        <Link
          to="/posts/new"
          className="flex-shrink-0 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm text-sm"
        >
          + Report Item
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm sticky top-16 z-40 space-y-3">
        {/* Row 1: type toggle + search */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Type pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-shrink-0 self-start sm:self-auto">
            {TYPE_OPTS.map(({ value, label, active }) => (
              <button
                key={value}
                data-testid={value ? `filter-type-${value}` : undefined}
                onClick={() => updateFilter('type', value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentType === value
                    ? (active || 'bg-white text-slate-900 shadow-sm')
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              data-testid="search-input"
              type="text"
              aria-label="Search posts"
              placeholder="Search by keyword…"
              value={inputQ}
              onChange={(e) => setInputQ(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50"
            />
            {inputQ && (
              <button
                onClick={() => setInputQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: category + zone + clear */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 text-slate-400 flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>

          <select
            aria-label="Filter by category"
            value={currentCategory}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="flex-1 min-w-[140px] border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-slate-50"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            aria-label="Filter by zone"
            value={currentZone}
            onChange={(e) => updateFilter('zone', e.target.value)}
            className="flex-1 min-w-[140px] border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-slate-50"
          >
            <option value="">All Zones</option>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>

          {activeFilterCount > 0 && (
            <button
              data-testid="clear-filters"
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-medium flex-shrink-0 whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-800 font-medium mb-4">Failed to load posts. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl font-medium hover:bg-red-200 transition"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      )}

      {/* Post grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : !isError && posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <EmptyState
            icon={SearchX}
            title="No items found"
            subtitle="Try adjusting your filters or report a new item"
            action={
              <Link
                to="/posts/new"
                className="inline-flex justify-center bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm"
              >
                Report an Item
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-400">
            {data?.total ?? posts.length} item{(data?.total ?? posts.length) !== 1 ? 's' : ''} found
          </p>
          <div data-testid="post-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        </>
      )}

      {/* Pagination */}
      {pages > 1 && !isLoading && !isError && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={currentPage <= 1}
            onClick={() => updateFilter('page', (currentPage - 1).toString())}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-500 font-medium">
            {currentPage} / {pages}
          </span>
          <button
            disabled={currentPage >= pages}
            onClick={() => updateFilter('page', (currentPage + 1).toString())}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
