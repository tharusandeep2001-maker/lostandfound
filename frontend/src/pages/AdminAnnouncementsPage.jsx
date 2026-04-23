import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Megaphone, Send, Archive, Info, AlertTriangle, Package, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAnnouncements, createAnnouncement, archiveAnnouncement } from '../services/announcementService';

const TYPE_OPTIONS = [
  { value: 'informational', label: 'Informational', Icon: Info, color: 'text-slate-600' },
  { value: 'urgent', label: 'Urgent', Icon: AlertTriangle, color: 'text-amber-600' },
  { value: 'found_batch', label: 'Found Batch', Icon: Package, color: 'text-indigo-600' },
];

const TYPE_BADGE = {
  informational: 'bg-slate-100 text-slate-700',
  urgent: 'bg-amber-100 text-amber-800',
  found_batch: 'bg-indigo-100 text-indigo-800',
};

export default function AdminAnnouncementsPage() {
  const qc = useQueryClient();
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('informational');

  const { data, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
  });

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      toast.success('Announcement sent to all users');
      setHeadline('');
      setBody('');
      setType('informational');
      qc.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: () => toast.error('Failed to send announcement'),
  });

  const archiveMutation = useMutation({
    mutationFn: archiveAnnouncement,
    onSuccess: () => {
      toast.success('Announcement archived');
      qc.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!headline.trim()) return toast.error('Headline is required');
    if (!body.trim()) return toast.error('Body is required');
    createMutation.mutate({ headline: headline.trim(), body: body.trim(), type });
  };

  const announcements = data?.announcements || [];
  const active = announcements.filter((a) => !a.archived);
  const archived = announcements.filter((a) => a.archived);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Megaphone className="w-7 h-7 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="text-slate-500 text-sm">Broadcast messages to all registered users</p>
        </div>
      </div>

      {/* Create form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-5">New Announcement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Headline <span className="text-red-500">*</span>
              <span className="text-slate-400 font-normal ml-1">({headline.length}/80)</span>
            </label>
            <input
              type="text"
              value={headline}
              maxLength={80}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Large batch of found items at Security Office"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Body <span className="text-red-500">*</span>
              <span className="text-slate-400 font-normal ml-1">({body.length}/300)</span>
            </label>
            <textarea
              value={body}
              maxLength={300}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="Provide details users need to act on this announcement..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <div className="flex gap-3 flex-wrap">
              {TYPE_OPTIONS.map(({ value, label, Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    type === value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {createMutation.isPending ? 'Sending...' : 'Send to All Users'}
            </button>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Users className="w-3.5 h-3.5" />
              This will send an email to all registered users.
            </p>
          </div>
        </form>
      </div>

      {/* Active announcements */}
      {active.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Active ({active.length})
          </h2>
          <div className="space-y-3">
            {active.map((a) => (
              <div
                key={a._id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[a.type]}`}>
                      {a.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{a.headline}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{a.body}</p>
                </div>
                <button
                  onClick={() => archiveMutation.mutate(a._id)}
                  disabled={archiveMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition flex-shrink-0"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Archived */}
      {archived.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Archived ({archived.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {archived.map((a) => (
              <div key={a._id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600">{a.headline}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.body}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8 text-slate-400 text-sm">Loading announcements...</div>
      )}
    </div>
  );
}
