import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowRight, Clock, CheckCircle2, XCircle, AlertCircle, Inbox } from 'lucide-react';
import { getMyClaims, withdrawClaim } from '../services/claimService';
import PostStatusBadge from '../components/post/PostStatusBadge';
import toast from 'react-hot-toast';

const CLAIM_CONFIG = {
  pending:  { icon: Clock,         color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200', label: 'Under Review' },
  approved: { icon: CheckCircle2,  color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200',label: 'Approved' },
  rejected: { icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',   label: 'Rejected' },
};

function ClaimCard({ claim, onWithdraw, withdrawing }) {
  const cfg = CLAIM_CONFIG[claim.status] || CLAIM_CONFIG.pending;
  const { icon: Icon } = cfg;

  return (
    <div className="bg-white rounded-2xl overflow-hidden transition-all"
      style={{ border: '1px solid #e8edf4', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 2px 12px rgba(79,70,229,0.04)' }}
    >
      {/* Coloured top strip */}
      <div className={`h-1 w-full ${
        claim.status === 'approved' ? 'bg-emerald-400' :
        claim.status === 'rejected' ? 'bg-red-400' : 'bg-amber-400'
      }`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Post title link */}
            <Link
              to={`/posts/${claim.postId?._id}`}
              className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {claim.postId?.title || 'Post unavailable'}
            </Link>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span>{claim.postId?.category}</span>
              <span className="w-0.5 h-3 bg-slate-200 rounded-full" />
              <span>{claim.postId?.zone}</span>
              <span className="w-0.5 h-3 bg-slate-200 rounded-full" />
              <PostStatusBadge status={claim.postId?.status} size="sm" />
            </div>
          </div>

          {/* Claim status badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold flex-shrink-0 ${cfg.bg} ${cfg.border} ${cfg.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {cfg.label}
          </div>
        </div>

        {/* Submitted date */}
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Submitted {new Date(claim.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>

        {/* Admin note (rejected) */}
        {claim.status === 'rejected' && claim.adminNote && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div><span className="font-semibold">Admin note: </span>{claim.adminNote}</div>
          </div>
        )}

        {/* Success (approved) */}
        {claim.status === 'approved' && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            Your claim was approved! Please visit the campus lost &amp; found office with your student ID.
          </div>
        )}

        {/* Actions row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <Link
            to={`/posts/${claim.postId?._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            View post <ArrowRight className="w-3 h-3" />
          </Link>

          {claim.status === 'pending' && (
            <button
              onClick={() => onWithdraw(claim._id)}
              disabled={withdrawing === claim._id}
              className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
            >
              {withdrawing === claim._id ? 'Withdrawing…' : 'Withdraw'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => { fetchClaims(); }, []);

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
    if (!confirm('Withdraw this claim?')) return;
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

  const pending  = claims.filter(c => c.status === 'pending');
  const resolved = claims.filter(c => c.status !== 'pending');

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 pt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100">
            <div className="h-1 w-full skeleton rounded-none" />
            <div className="p-5 space-y-3">
              <div className="skeleton h-5 w-2/3 rounded-lg" />
              <div className="skeleton h-3 w-1/3 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <ClipboardList className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >My Claims</h1>
          <p className="text-slate-400 text-sm mt-0.5">{claims.length} total claim{claims.length !== 1 ? 's' : ''} submitted</p>
        </div>
      </div>

      {claims.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-20 flex flex-col items-center text-center px-6">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No claims yet</h3>
          <p className="text-slate-400 text-sm mb-6">Browse the board and claim an item that belongs to you.</p>
          <Link to="/posts" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition text-sm shadow-md shadow-indigo-200">
            Browse Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                Active ({pending.length})
              </p>
              {pending.map(c => (
                <ClaimCard key={c._id} claim={c} onWithdraw={handleWithdraw} withdrawing={withdrawing} />
              ))}
            </div>
          )}

          {resolved.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                Past ({resolved.length})
              </p>
              {resolved.map(c => (
                <ClaimCard key={c._id} claim={c} onWithdraw={handleWithdraw} withdrawing={withdrawing} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
