import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Tag, Calendar, Edit2, Trash2, ArrowLeft, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../contexts/AuthContext';
import { usePost, useDeletePost } from '../hooks/postHooks';
import PostStatusBadge from '../components/post/PostStatusBadge';
import ItemStatusTimeline from '../components/post/ItemStatusTimeline';
import MatchSuggestionsPanel from '../components/match/MatchSuggestionsPanel';
import ConfirmModal from '../components/ui/ConfirmModal';
import { SkeletonDetail } from '../components/ui/Skeleton';
import { TYPE_COLORS } from '../utils/constants';
import { submitClaim } from '../services/claimService';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: post, isLoading, isError } = usePost(id);
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimDetail, setClaimDetail] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <SkeletonDetail />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">This post no longer exists.</h2>
        <Link to="/posts" className="text-indigo-600 font-medium hover:underline inline-flex items-center mt-2">
          &larr; Back to Browse
        </Link>
      </div>
    );
  }

  const userId = user?.id || user?._id;
  const isOwner = post.authorId === userId;
  const isAdmin = user?.role === 'admin';
  const isStudent = user && !isAdmin;
  const canClaim = isStudent && !isOwner && post.status !== 'resolved';

  const claimButtonText = post.type === 'lost' ? 'I Found This Item' : 'Claim This Item';

  const formattedDate = new Date(post.incidentDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const formattedCreated = new Date(post.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const handleDeleteCallback = async () => {
    try {
      await deletePost(id);
      toast.success('Post removed successfully');
      navigate('/posts');
    } catch {
      toast.error('Failed to remove post');
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (claimDetail.trim().length < 10) {
      toast.error('Please provide more detail (minimum 10 characters)');
      return;
    }
    setClaimLoading(true);
    try {
      await submitClaim(id, claimDetail.trim());
      setClaimSubmitted(true);
      setShowClaimModal(false);
      toast.success('Submitted! Admin will review and contact you.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit claim';
      toast.error(msg);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link
        to="/posts"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </Link>

      {/* Two-column layout on desktop */}
      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 items-start">

        {/* LEFT — Image + body content (3/5) */}
        <div className="lg:col-span-3 w-full space-y-6">

          {/* Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            {post.imageUrls && post.imageUrls.length > 0 ? (
              <img
                src={post.imageUrls[0]}
                alt="Post Cover"
                className="w-full h-64 md:h-80 object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-80 flex items-center justify-center">
                <Camera className="w-16 h-16 text-slate-300" />
              </div>
            )}
          </div>

          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-lg capitalize ${
                  TYPE_COLORS[post.type] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {post.type}
              </span>
              <span data-testid="post-status">
                <PostStatusBadge status={post.status} size="md" />
              </span>
            </div>

            <h1 data-testid="post-title" className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-6 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Tag size={15} className="text-slate-400" /> {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-slate-400" /> {post.zone}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={15} className="text-slate-400" /> {formattedDate}
              </span>
            </div>
          </div>

          {/* Description — owner/admin only */}
          {(isOwner || isAdmin) && (
            <div>
              <h2 className="text-base font-semibold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-[15px]">
                {post.description}
              </p>
            </div>
          )}

          {!isOwner && !isAdmin && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
              🔒 Full description is only visible to the post owner and admin.
              If this is your item, submit a claim with identifying details below.
            </div>
          )}

          {/* Claim button */}
          {canClaim && (
            <div className="pt-2 border-t border-slate-100">
              {claimSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm font-medium">
                  ✅ Your submission has been sent. Admin will review and contact you via email.
                </div>
              ) : (
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm"
                >
                  {claimButtonText}
                </button>
              )}
            </div>
          )}

          {!user && post.status !== 'resolved' && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-slate-600 text-sm">
                <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>{' '}
                to claim this item.
              </p>
            </div>
          )}

          {/* Owner actions */}
          {isOwner && post.status !== 'resolved' && (
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Link
                data-testid="edit-button"
                to={`/posts/${id}/edit`}
                className="inline-flex justify-center items-center px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Details
              </Link>
              <button
                data-testid="delete-button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex justify-center items-center px-4 py-2 border border-red-200 rounded-xl text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Remove Post
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — Timeline + Metadata + Matches (2/5) */}
        <div className="lg:col-span-2 w-full">
          <div className="lg:sticky lg:top-24 space-y-5">

            {/* Status Timeline — primary focus */}
            <ItemStatusTimeline post={post} />

            {/* Metadata card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Date Posted</span>
                <span className="font-semibold text-slate-900">{formattedCreated}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4">
                <span className="text-slate-500 font-medium">Current Status</span>
                <PostStatusBadge status={post.status} size="sm" />
              </div>

              {post.status === 'matched' && (
                <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3 rounded-xl flex items-start gap-2">
                  <span className="text-base leading-none">⚡</span>
                  <span className="font-medium leading-relaxed">A potential match has been found.</span>
                </div>
              )}

              {post.status === 'resolved' && (
                <div className="mt-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3 rounded-xl flex items-start gap-2">
                  <span className="text-base leading-none">✅</span>
                  <span className="font-medium leading-relaxed">This item has been successfully recovered.</span>
                </div>
              )}
            </div>

            {/* Match Panel */}
            {(isOwner || isAdmin) && (
              <div data-testid="match-panel">
                <MatchSuggestionsPanel postId={id} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Remove permanently?"
        message="Are you sure you want to remove this post? This action cannot be undone."
        confirmLabel="Yes, Remove"
        confirmClassName="bg-red-600 hover:bg-red-700 text-white"
        confirmTestId="delete-confirm"
        onConfirm={handleDeleteCallback}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{claimButtonText}</h2>
            <p className="text-slate-500 text-sm mb-6">
              Provide a private identifying detail to verify your claim. This will only be visible to the admin.
            </p>
            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Identifying Detail <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={claimDetail}
                  onChange={(e) => setClaimDetail(e.target.value)}
                  rows={4}
                  required
                  placeholder={
                    post.type === 'lost'
                      ? 'e.g. I found this near the library entrance on Monday morning...'
                      : 'e.g. The watch has my initials R.S. engraved on the back...'
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">{claimDetail.length}/500 characters (min 10)</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={claimLoading || claimDetail.trim().length < 10}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {claimLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
