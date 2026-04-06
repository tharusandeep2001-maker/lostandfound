import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllClaims, reviewClaim } from '../services/claimService';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);
  const [adminNote, setAdminNote] = useState({});

  useEffect(() => {
    fetchClaims();
  }, [filter]);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const data = await getAllClaims(filter);
      setClaims(data.claims);
    } catch {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (claimId, status) => {
    const note = adminNote[claimId] || '';
    if (!confirm(`Are you sure you want to ${status} this claim?`)) return;
    setActionLoading(claimId);
    try {
      await reviewClaim(claimId, status, note);
      toast.success(`Claim ${status} successfully`);
      setClaims(claims.filter(c => c._id !== claimId));
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Manage Claims</h1>
        <span className="ml-auto bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
          {claims.length} claims
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === s
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 text-gray-500">
          No {filter} claims.
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              
              {/* Claim Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[claim.status]}`}>
                  {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(claim.createdAt).toLocaleDateString('en-GB')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Post Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Post Details</h3>
                  <Link
                    to={`/posts/${claim.postId?._id}`}
                    className="font-semibold text-gray-900 hover:text-indigo-600 transition block mb-2"
                  >
                    {claim.postId?.title}
                  </Link>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Type:</span> {claim.postId?.type}</p>
                    <p><span className="font-medium">Category:</span> {claim.postId?.category}</p>
                    <p><span className="font-medium">Zone:</span> {claim.postId?.zone}</p>
                    <p><span className="font-medium">Status:</span> {claim.postId?.status}</p>
                  </div>
                </div>

                {/* Claimant Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Claimant Details</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Name:</span> {claim.claimantId?.name}</p>
                    <p><span className="font-medium">Email:</span> {claim.claimantId?.email}</p>
                    <p><span className="font-medium">Faculty:</span> {claim.claimantId?.faculty}</p>
                  </div>
                </div>
              </div>

              {/* Identifying Detail */}
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                <h3 className="text-xs font-medium text-indigo-700 uppercase mb-2">
                  Private Identifying Detail
                </h3>
                <p className="text-sm text-gray-800">{claim.identifyingDetail}</p>
              </div>

              {/* Admin Actions — only for pending */}
              {claim.status === 'pending' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note to claimant (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Please come to the admin office with your student ID..."
                      value={adminNote[claim._id] || ''}
                      onChange={(e) => setAdminNote({ ...adminNote, [claim._id]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(claim._id, 'approved')}
                      disabled={actionLoading === claim._id}
                      className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReview(claim._id, 'rejected')}
                      disabled={actionLoading === claim._id}
                      className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Show admin note if already reviewed */}
              {claim.status !== 'pending' && claim.adminNote && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  <span className="font-medium">Admin note: </span>{claim.adminNote}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}