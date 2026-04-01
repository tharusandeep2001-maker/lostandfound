import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Tag, Calendar, Edit2, Trash2, ArrowLeft, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../contexts/AuthContext';
import { usePost, useDeletePost } from '../hooks/postHooks';
import PostStatusBadge from '../components/post/PostStatusBadge';
import MatchSuggestionsPanel from '../components/match/MatchSuggestionsPanel';
import ConfirmModal from '../components/ui/ConfirmModal';
import { SkeletonDetail } from '../components/ui/Skeleton';
import { TYPE_COLORS } from '../utils/constants';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: post, isLoading, isError } = usePost(id);
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <SkeletonDetail />
      </div>
    );
  }

  // NOT FOUND STATE
  if (isError || !post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">This post no longer exists.</h2>
        <Link to="/posts" className="text-blue-600 font-medium hover:underline inline-flex items-center mt-2">
          &larr; Back to Browse
        </Link>
      </div>
    );
  }

  const isOwner = post.authorId === user?._id;
  const isAdmin = user?.role === 'admin';

  const formattedDate = new Date(post.incidentDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const formattedCreated = new Date(post.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const handleDeleteCallback = async () => {
    try {
      await deletePost(id);
      toast.success('Post removed successfully');
      navigate('/posts');
    } catch (err) {
      toast.error('Failed to remove post');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link to="/posts" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Browse
      </Link>
      
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 w-full order-1">
           {/* Image Gallery */}
           <div className="mb-6">
             {post.imageUrls && post.imageUrls.length > 0 ? (
               <img src={post.imageUrls[0]} alt="Post Cover" className="w-full h-56 md:h-72 object-cover rounded-xl shadow-sm border border-gray-100" />
             ) : (
               <div className="w-full h-56 md:h-72 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                 <Camera className="w-16 h-16 text-gray-300" />
               </div>
             )}
           </div>

           {/* Post Header */}
           <div className="flex items-center gap-3 mb-3">
             <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md capitalize ${TYPE_COLORS[post.type] || 'bg-gray-100 text-gray-800'}`}>
               {post.type}
             </span>
             <span data-testid="post-status">
               <PostStatusBadge status={post.status} size="md" />
             </span>
           </div>
           
           <h1 data-testid="post-title" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
           
           <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-gray-600 border-b border-gray-100 pb-6">
             <div className="flex items-center gap-2"><Tag size={16} className="text-gray-400"/> <span>{post.category}</span></div>
             <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400"/> <span>{post.zone}</span></div>
             <div className="flex items-center gap-2"><Calendar size={16} className="text-gray-400"/> <span>{formattedDate}</span></div>
           </div>

           {/* Description */}
           <div className="pt-6">
             <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
             <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-[15px]">
               {post.description}
             </p>
           </div>

           {/* Owner Actions */}
           {isOwner && post.status !== 'resolved' && (
             <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
               <Link 
                 data-testid="edit-button"
                 to={`/posts/${id}/edit`} 
                 className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition w-full sm:w-auto"
               >
                 <Edit2 className="w-4 h-4 mr-2" /> Edit Details
               </Link>
               <button 
                 data-testid="delete-button"
                 onClick={() => setShowDeleteModal(true)}
                 className="inline-flex justify-center items-center px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition w-full sm:w-auto"
               >
                 <Trash2 className="w-4 h-4 mr-2" /> Remove Post
               </button>
             </div>
           )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1 mt-8 lg:mt-0 w-full order-3 lg:order-2">
          <div className="lg:sticky lg:top-24 space-y-6">
            
            {/* Metadata Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-5 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Date Posted</span>
                <span className="text-sm font-semibold text-gray-900">{formattedCreated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Current Status</span>
                <PostStatusBadge status={post.status} size="sm" />
              </div>

              {post.status === 'matched' && (
                <div className="mt-5 bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <span className="text-lg leading-none">⚡</span>
                  <span className="font-medium leading-relaxed">A potential match has been found. Check the suggestions provided below.</span>
                </div>
              )}
              
              {post.status === 'resolved' && (
                <div className="mt-5 bg-green-50 border border-green-200 text-green-800 text-sm p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <span className="text-lg leading-none">✅</span>
                  <span className="font-medium leading-relaxed">This item has been successfully recovered and the case is resolved.</span>
                </div>
              )}
            </div>
            
            {/* Desktop Match Panel */}
            <div className="hidden lg:block">
              {(isOwner || isAdmin) && (
                 <div data-testid="match-panel">
                   <MatchSuggestionsPanel postId={id} />
                 </div>
              )}
            </div>

          </div>
        </div>
        
        <div className="w-full order-2 lg:hidden">
            {(isOwner || isAdmin) && (
               <div data-testid="match-panel">
                 <MatchSuggestionsPanel postId={id} />
               </div>
            )}
        </div>

      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Remove permanently?"
        message="Are you sure you want to remove this post? It will no longer appear in searches or match results. This action cannot be undone."
        confirmLabel="Yes, Remove"
        confirmClassName="bg-red-600 hover:bg-red-700 text-white"
        confirmTestId="delete-confirm"
        onConfirm={handleDeleteCallback}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />

    </div>
  );
}
