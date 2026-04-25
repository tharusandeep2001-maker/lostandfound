import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, RefreshCw, SearchX, SlidersHorizontal, X, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
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

  return (
    <div className="space-y-7">

      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden px-8 py-10"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 50%, #2563eb 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute top-6 right-24 w-20 h-20 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-2">Campus Lost &amp; Found</p>
            <h1 className="text-3xl font-extrabold text-white leading-tight mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Find what's yours.
            </h1>
            <p className="text-indigo-200 text-sm max-w-sm">
              Browse lost and found reports from across campus, or report a missing item in seconds.
            </p>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <Link
              to="/posts/new"
              className="flex items-center justify-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition shadow-lg text-sm whitespace-nowrap"
            >
              + Report an Item
            </Link>
            <div className="flex items-center justify-center gap-4 text-xs text-indigo-200">
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Live board</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Free service</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 sticky top-16 z-40"
        style={{ border: '1px solid #e8edf4', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(79,70,229,0.04)' }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Type pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-shrink-0">
            {[
              { value: '', label: 'All' },
              { value: 'lost', label: '🔍 Lost', activeClass: 'bg-rose-500 text-white shadow' },
              { value: 'found', label: '✅ Found', activeClass: 'bg-emerald-500 text-white shadow' },
            ].map(({ value, label, activeClass }) => (
              <button
                key={value}
                data-testid={value ? `filter-type-${value}` : 'filter-type-'}
                onClick={() => updateFilter('type', value)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  currentType === value
                    ? (activeClass || 'bg-white text-slate-800 shadow')
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              data-testid="search-input"
              type="text"
              aria-label="Search posts"
              placeholder="Search by keyword…"
              value={inputQ}
              onChange={e => setInputQ(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
            {inputQ && (
              <button onClick={() => setInputQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category */}
          <select
            aria-label="Filter by category"
            value={currentCategory}
            onChange={e => updateFilter('category', e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm text-slate-700 flex-shrink-0"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Zone */}
          <select
            aria-label="Filter by zone"
            value={currentZone}
            onChange={e => updateFilter('zone', e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm text-slate-700 flex-shrink-0"
          >
            <option value="">All Zones</option>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>

          {activeFilterCount > 0 && (
            <button
              data-testid="clear-filters"
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-800 px-2 flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" /> Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* ── Results header ───────────────────────────────────────────────────── */}
      {!isLoading && !isError && posts.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{data?.total ?? posts.length} item{(data?.total ?? posts.length) !== 1 ? 's' : ''} · sorted by newest</span>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────────── */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-800 font-semibold mb-4">Failed to load posts.</p>
          <button onClick={() => refetch()} className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-700 transition text-sm">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : !isError && posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200">
          <EmptyState
            icon={SearchX}
            title="No items found"
            subtitle="Try adjusting your filters or report a new item"
            action={
              <Link to="/posts/new" className="inline-flex justify-center bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm text-sm">
                Report an Item
              </Link>
            }
          />
        </div>
      ) : (
        <div data-testid="post-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────────────────────── */}
      {pages > 1 && !isLoading && !isError && (
        <div className="flex justify-center items-center gap-3 pt-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => updateFilter('page', (currentPage - 1).toString())}
            className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-300 hover:text-indigo-600 transition shadow-sm"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-500 font-medium px-3 py-2 bg-white border border-slate-200 rounded-xl">
            {currentPage} / {pages}
          </span>
          <button
            disabled={currentPage >= pages}
            onClick={() => updateFilter('page', (currentPage + 1).toString())}
            className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-300 hover:text-indigo-600 transition shadow-sm"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
