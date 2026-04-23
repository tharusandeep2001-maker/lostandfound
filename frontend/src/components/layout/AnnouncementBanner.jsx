import { useState, useEffect } from 'react';
import { X, Info, AlertTriangle, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../../services/announcementService';

const TYPE_CONFIG = {
  informational: {
    bg: 'bg-slate-700',
    text: 'text-white',
    Icon: Info,
    label: 'Info',
  },
  urgent: {
    bg: 'bg-amber-500',
    text: 'text-white',
    Icon: AlertTriangle,
    label: 'Urgent',
  },
  found_batch: {
    bg: 'bg-indigo-600',
    text: 'text-white',
    Icon: Package,
    label: 'Found Items',
  },
};

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAnnouncements()
      .then((data) => {
        if (cancelled) return;
        const active = (data?.announcements || [])
          .filter((a) => !a.archived)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        if (!active) return;

        const dismissKey = `announcement_dismissed_${active._id}`;
        const dismissedAt = localStorage.getItem(dismissKey);
        if (dismissedAt) {
          const elapsed = Date.now() - parseInt(dismissedAt, 10);
          if (elapsed < 24 * 60 * 60 * 1000) return; // 24h
        }
        setAnnouncement(active);
      })
      .catch(() => {}); // silently fail — banner is non-critical
    return () => { cancelled = true; };
  }, []);

  const handleDismiss = () => {
    if (announcement) {
      localStorage.setItem(`announcement_dismissed_${announcement._id}`, Date.now().toString());
    }
    setDismissed(true);
  };

  if (!announcement || dismissed) return null;

  const config = TYPE_CONFIG[announcement.type] || TYPE_CONFIG.informational;
  const { Icon } = config;

  return (
    <div className={`${config.bg} ${config.text} relative`} role="alert">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Icon className="w-4 h-4 flex-shrink-0 opacity-90" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm mr-2">{announcement.headline}</span>
          <span className="text-sm opacity-90 hidden sm:inline">{announcement.body}</span>
        </div>
        {announcement.type === 'found_batch' && (
          <Link
            to="/posts?type=found"
            className="flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition flex-shrink-0"
          >
            View Found Items <ArrowRight className="w-3 h-3" />
          </Link>
        )}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 opacity-80 hover:opacity-100 transition p-1 rounded"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
