import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyClaims, withdrawClaim } from '../services/claimService';
import PostStatusBadge from '../components/post/PostStatusBadge';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const data = await getMyClaims();
      setClaims(data.claims);
    } catch {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (claimId) => {
    if (!confirm('Are you sure you want to withdraw this claim?')) return;
    setWithdrawing(claimId);
    try {
      await withdrawClaim(claimId);
      toast.success('Claim withdrawn');
      setClaims(claims.filter(c => c._id !== claimId));
    } catch {
      toast.error('Failed to withdraw claim');
    } finally {
      setWithdrawing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Claims</h1>

      {claims.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 mb-4">You haven't submitted any claims yet.</p>
          <Link to="/posts" className="text-indigo-600 font-medium hover:underline">
            Browse posts to find your item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Post info */}
                  <Link
                    to={`/posts/${claim.postId?._id}`}
                    className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition"
                  >
                    {claim.postId?.title || 'Post unavailable'}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span>{claim.postId?.category}</span>
                    <span>·</span>
                    <span>{claim.postId?.zone}</span>
                    <span>·</span>
                    <PostStatusBadge status={claim.postId?.status} size="sm" />
                  </div>

                  {/* Claim status */}
                  <div className="mt-3 flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[claim.status]}`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                    <span className="text-xs text-slate-400">
                      Submitted {new Date(claim.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>

                  {/* Admin note if rejected */}
                  {claim.status === 'rejected' && claim.adminNote && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                      <span className="font-medium">Admin note: </span>{claim.adminNote}
                    </div>
                  )}

                  {/* Success message if approved */}
                  {claim.status === 'approved' && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
                      ✅ Your claim was approved! Please visit the campus lost & found office with your student ID.
                    </div>
                  )}
                </div>

                {/* Withdraw button — only for pending claims */}
                {claim.status === 'pending' && (
                  <button
                    onClick={() => handleWithdraw(claim._id)}
                    disabled={withdrawing === claim._id}
                    className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50 shrink-0"
                  >
                    {withdrawing === claim._id ? 'Withdrawing...' : 'Withdraw'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}