import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Inbox } from 'lucide-react';
import { useMyPosts } from '../hooks/postHooks';
import PostCard from '../components/post/PostCard';
import PageHeader from '../components/layout/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function MyPostsPage() {
  const [activeTab, setActiveTab] = useState('Active');
  const { data, isLoading } = useMyPosts();
  const posts = data?.posts || [];

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'Active') return !post.isDeleted && ['open', 'matched'].includes(post.status);
    if (activeTab === 'Resolved') return !post.isDeleted && post.status === 'resolved';
    if (activeTab === 'Removed') return post.isDeleted === true;
    return false;
  });

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Page Header */}
      <PageHeader 
        title="My Posts"
        subtitle="Manage items you have reported lost or found"
        action={
          <Link 
            to="/posts/new" 
            className="inline-flex items-center justify-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 mr-1" /> Report New Item
          </Link>
        }
      />

      {/* Tabs Row */}
      <div className="border-b border-slate-200 mb-8 overflow-x-auto pb-1">
        <nav className="flex space-x-8 sm:space-x-10 min-w-max px-1" aria-label="Tabs">
          {['Active', 'Resolved', 'Removed'].map((tab) => (
            <button
              key={tab}
              data-testid={`tab-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all shadow-sm ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200 shadow-none'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Post State Rendering */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[...Array(3)].map((_, i) => (
             <SkeletonCard key={i} />
           ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
          {activeTab === 'Active' ? (
            <EmptyState 
              icon={Inbox} 
              title="No posts yet" 
              subtitle="You have not reported any items" 
              action={
                <Link to="/posts/new" className="inline-flex justify-center bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm">
                  Report your first item
                </Link>
              } 
            />
          ) : activeTab === 'Resolved' ? (
            <EmptyState icon={Inbox} title="No resolved posts" subtitle="You don't have any resolved entries yet." />
          ) : (
            <EmptyState icon={Inbox} title="No removed posts" subtitle="You haven't permanently deleted any items." />
          )}
        </div>
      ) : (
        <div data-testid="post-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
