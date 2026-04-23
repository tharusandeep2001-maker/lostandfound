import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, updatePostStatus } from '../services/adminService';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import PostStatusBadge from '../components/post/PostStatusBadge';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data.posts);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (postId, newStatus) => {
    setActionLoading(postId);
    try {
      await updatePostStatus(postId, newStatus);
      toast.success(`Post status updated to ${newStatus}`);
      setPosts(posts.map(p =>
        p._id === postId ? { ...p, status: newStatus } : p
      ));
    } catch {
      toast.error('Status update failed');
    } finally {
      setActionLoading(null);
    }
  };

  const VALID_TRANSITIONS = {
    open: ['matched'],
    matched: ['open', 'resolved'],
    resolved: [],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Manage Posts</h1>
        <span className="ml-auto bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
          {posts.length} posts
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No posts yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Zone</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <Link
                      to={`/posts/${post._id}`}
                      className="font-medium text-slate-900 hover:text-indigo-600 transition"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      post.type === 'lost'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {post.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{post.category}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{post.zone}</td>
                  <td className="px-6 py-4">
                    <PostStatusBadge status={post.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {VALID_TRANSITIONS[post.status]?.map((nextStatus) => (
                        <button
                          key={nextStatus}
                          onClick={() => handleStatusChange(post._id, nextStatus)}
                          disabled={actionLoading === post._id}
                          className="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition disabled:opacity-50"
                        >
                          → {nextStatus}
                        </button>
                      ))}
                      {VALID_TRANSITIONS[post.status]?.length === 0 && (
                        <span className="text-xs text-slate-400">No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}