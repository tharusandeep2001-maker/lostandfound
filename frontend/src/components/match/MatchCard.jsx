import { Link } from 'react-router-dom';
import { MapPin, Tag, Camera, Calendar, CheckCircle2, XCircle } from 'lucide-react';

// ─── Scoring constants (mirrors matchService.js exactly) ──────────────────────
const MAX = { category: 40, zone: 35, date: 25 };

// ─── Human-readable reasons derived purely from the score value ───────────────
function categoryReason(score, snapshot) {
  if (!snapshot?.category)    return 'Category not provided';
  if (score === MAX.category) return 'Same category';
  return 'Different category';
}

function zoneReason(score, snapshot) {
  if (!snapshot?.zone)    return 'Zone not provided';
  if (score === MAX.zone) return 'Same zone';
  if (score === 18)       return 'Adjacent zone';
  return 'Different zone';
}

function dateReason(score, snapshot) {
  if (!snapshot?.incidentDate) return 'Date not provided';
  if (score === MAX.date) return 'Same day';
  if (score === 15)       return 'Within 3 days';
  if (score === 8)        return 'Within a week';
  return 'More than a week apart';
}

// ─── Circular progress ring ───────────────────────────────────────────────────
function ScoreRing({ score }) {
  const radius      = 30;
  const stroke      = 5;
  const normalised  = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalised;
  const offset      = circumference - (score / 100) * circumference;

  const ringColor  = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';
  const bgColor    = score >= 80 ? '#f0fdf4' : score >= 60 ? '#fffbeb' : '#fef2f2';
  const textColor  = score >= 80 ? '#15803d' : score >= 60 ? '#b45309' : '#b91c1c';

  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full"
      style={{ width: 72, height: 72, background: bgColor }}
    >
      <svg width={72} height={72} viewBox="0 0 72 72">
        <circle cx={36} cy={36} r={normalised} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          cx={36} cy={36} r={normalised}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x={36} y={33} textAnchor="middle" fontSize={13} fontWeight={800} fill={textColor} fontFamily="inherit">
          {score}%
        </text>
        <text x={36} y={46} textAnchor="middle" fontSize={8} fontWeight={600} fill={textColor} opacity={0.75} fontFamily="inherit">
          MATCH
        </text>
      </svg>
    </div>
  );
}

// ─── Single breakdown row ─────────────────────────────────────────────────────
function BreakdownRow({ icon: Icon, label, earned, max, reason }) {
  const hit = earned > 0;
  const pct = Math.round((earned / max) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        {hit
          ? <CheckCircle2 size={16} className="text-emerald-500" />
          : <XCircle      size={16} className="text-red-400"     />
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Icon size={12} className="text-gray-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-xs text-gray-500 leading-tight mt-0.5">{reason}</p>
      </div>

      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          hit
            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
            : 'bg-red-50 text-red-500 ring-1 ring-red-100'
        }`}>
          {hit ? '+' : ''}{earned} / {max}
        </span>
        <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${hit ? 'bg-emerald-400' : 'bg-red-300'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Matched-field tags ───────────────────────────────────────────────────────
function MatchTags({ breakdown }) {
  const tags = [];
  if (breakdown.categoryScore > 0)
    tags.push({ label: 'Same Category', color: 'bg-blue-50 text-blue-700 ring-blue-200' });
  if (breakdown.zoneScore > 0)
    tags.push({
      label: breakdown.zoneScore === 35 ? 'Same Zone' : 'Adjacent Zone',
      color: 'bg-violet-50 text-violet-700 ring-violet-200',
    });
  if (breakdown.dateScore > 0)
    tags.push({ label: 'Date Match', color: 'bg-amber-50 text-amber-700 ring-amber-200' });
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
      {tags.map(({ label, color }) => (
        <span key={label} className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ring-1 ${color}`}>
          ✓ {label}
        </span>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MatchCard({ postId, matchedPostId, score, breakdown, matchedPostSnapshot }) {
  const snap = matchedPostSnapshot ?? {};

  const formattedDate = snap.incidentDate
    ? new Date(snap.incidentDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : 'Date unknown';

  const totalEarned =
    (breakdown.categoryScore ?? 0) +
    (breakdown.zoneScore     ?? 0) +
    (breakdown.dateScore     ?? 0);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200">

      {/* ── Top strip: thumbnail + title + score ring ─────────────────────── */}
      <div className="flex gap-4 p-4 pb-3">
        <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          {snap.imageUrls?.length > 0
            ? <img src={snap.imageUrls[0]} alt="thumbnail" className="w-full h-full object-cover" />
            : <Camera className="text-gray-300 w-6 h-6" />
          }
        </div>

        <div className="flex-1 min-w-0 self-center">
          <h4 className="font-semibold text-gray-900 text-sm leading-snug truncate">
            {snap.title ?? 'Untitled post'}
          </h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-400">
            {snap.category && (
              <span className="flex items-center gap-1"><Tag size={11} />{snap.category}</span>
            )}
            {snap.zone && (
              <span className="flex items-center gap-1"><MapPin size={11} />{snap.zone}</span>
            )}
            <span className="flex items-center gap-1"><Calendar size={11} />{formattedDate}</span>
          </div>
        </div>

        <ScoreRing score={score} />
      </div>

      {/* ── Section divider ──────────────────────────────────────────────── */}
      <div className="mx-4 border-t border-dashed border-gray-100" />

      {/* ── Breakdown header ──────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Score Breakdown
        </span>
        <span className="text-xs text-gray-400">
          <span className="font-bold text-gray-700">{totalEarned}</span>
          <span className="text-gray-300"> / 100 pts</span>
        </span>
      </div>

      {/* ── Three breakdown rows ──────────────────────────────────────────── */}
      <div className="px-4 pb-3 flex flex-col gap-2.5">
        <BreakdownRow
          icon={Tag}
          label="Category"
          earned={breakdown.categoryScore ?? 0}
          max={MAX.category}
          reason={categoryReason(breakdown.categoryScore ?? 0, snap)}
        />
        <BreakdownRow
          icon={MapPin}
          label="Zone"
          earned={breakdown.zoneScore ?? 0}
          max={MAX.zone}
          reason={zoneReason(breakdown.zoneScore ?? 0, snap)}
        />
        <BreakdownRow
          icon={Calendar}
          label="Date proximity"
          earned={breakdown.dateScore ?? 0}
          max={MAX.date}
          reason={dateReason(breakdown.dateScore ?? 0, snap)}
        />

        <MatchTags breakdown={breakdown} />
      </div>

      {/* ── CTA footer ───────────────────────────────────────────────────── */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <Link
          to={`/posts/${matchedPostId}`}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          View post →
        </Link>
        <button
          onClick={() =>
            import('react-hot-toast').then(({ default: toast }) =>
              toast(
                'Claims Module is currently under active development. Keep an eye out for our upcoming Week 11 integration update!',
                { icon: '🚧' }
              )
            )
          }
          className="text-xs font-semibold bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          Submit Claim →
        </button>
      </div>
    </div>
  );
}
