import { useState, useRef } from 'react';
import { uploadImages } from '../../utils/uploadToCloudinary';

const MAX_FILES   = 3;
const ACCEPT_ATTR = '.jpg,.jpeg,.png,.webp';

/**
 * StatusIcon — small inline indicator rendered inside each preview tile.
 */
const StatusIcon = ({ status }) => {
  if (status === 'uploading') {
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/80 shadow">
        <svg className="animate-spin h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </span>
    );
  }
  if (status === 'done') {
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white shadow text-xs font-bold">
        ✓
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white shadow text-xs font-bold">
        ✗
      </span>
    );
  }
  return null;
};

/**
 * ImageUploader
 *
 * Props:
 *   existingUrls {string[]}          — pre-filled when editing a post
 *   onChange     {(urls: string[]) => void} — called with cloud URLs after upload
 */
export default function ImageUploader({ existingUrls = [], onChange }) {
  // Previews for locally-selected files
  const [previews, setPreviews] = useState([]);
  // Existing URLs (from props, allow removal)
  const [retained, setRetained]   = useState(existingUrls);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState({ done: 0, total: 0 });
  const [globalError, setGlobalError] = useState('');
  const inputRef = useRef(null);

  // ── File selection ──────────────────────────────────────────────────────────
  const handleFiles = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    // Clear previous global error
    setGlobalError('');

    // Guard: total previews + retained + newly selected must not exceed 3
    const totalAfter = retained.length + previews.filter(p => p.status === 'done').length + selected.length;
    if (totalAfter > MAX_FILES) {
      setGlobalError(`You can upload at most ${MAX_FILES} images in total.`);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    // Build local preview entries
    const newPreviews = selected.map((file) => ({
      file,
      localUrl: URL.createObjectURL(file),
      status:   'pending',
      cloudUrl: null,
      error:    null,
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);

    // Mark as uploading
    const startIdx = previews.length; // index offset into previews
    setPreviews((prev) =>
      prev.map((p, i) =>
        i >= startIdx ? { ...p, status: 'uploading' } : p
      )
    );

    setUploading(true);
    setProgress({ done: 0, total: selected.length });

    try {
      const urls = await uploadImages(selected, (done, total) => {
        setProgress({ done, total });
        // Mark each file done as progress arrives
        setPreviews((prev) => {
          const copy = [...prev];
          for (let i = startIdx; i < startIdx + done; i++) {
            if (copy[i]) copy[i] = { ...copy[i], status: 'done' };
          }
          return copy;
        });
      });

      // Attach cloud URLs to their preview slots
      setPreviews((prev) => {
        const copy = [...prev];
        urls.forEach((url, relIdx) => {
          const absIdx = startIdx + relIdx;
          if (copy[absIdx]) {
            copy[absIdx] = { ...copy[absIdx], status: 'done', cloudUrl: url };
          }
        });
        return copy;
      });

      // Notify parent with full combined URL list
      const allDone = [
        ...retained,
        ...previews
          .filter((p, i) => i < startIdx && p.status === 'done' && p.cloudUrl)
          .map((p) => p.cloudUrl),
        ...urls,
      ];
      onChange(allDone);
    } catch (err) {
      // Mark failed items with error status
      setPreviews((prev) =>
        prev.map((p, i) =>
          i >= startIdx && p.status === 'uploading'
            ? { ...p, status: 'error', error: err.message }
            : p
        )
      );
      setGlobalError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  // ── Remove a preview (before or after upload) ─────────────────────────────
  const removePreview = (idx) => {
    setPreviews((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].localUrl);
      copy.splice(idx, 1);
      return copy;
    });
    // Re-notify parent
    const surviving = previews
      .filter((p, i) => i !== idx && p.status === 'done' && p.cloudUrl)
      .map((p) => p.cloudUrl);
    onChange([...retained, ...surviving]);
  };

  // ── Remove an existing (retained) URL ────────────────────────────────────
  const removeRetained = (idx) => {
    const updated = retained.filter((_, i) => i !== idx);
    setRetained(updated);
    const successUrls = previews
      .filter((p) => p.status === 'done' && p.cloudUrl)
      .map((p) => p.cloudUrl);
    onChange([...updated, ...successUrls]);
  };

  const uploadingCount = previews.filter((p) => p.status === 'uploading').length;

  return (
    <div className="space-y-3">
      {/* ── Drop zone / trigger ─────────────────────────────────────────────── */}
      <label
        htmlFor="image-upload-input"
        className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors
          ${uploading
            ? 'border-amber-400 bg-amber-50 cursor-not-allowed'
            : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'}`}
      >
        <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 16.5V19a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 19v-2.5M16 10l-4-4m0 0L8 10m4-4v12" />
        </svg>
        <p className="text-sm text-gray-600">
          {uploading
            ? `Uploading ${progress.done}/${progress.total}…`
            : 'Click to select images'}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Max {MAX_FILES} images · 5 MB each · JPG / PNG / WEBP
        </p>
        <input
          id="image-upload-input"
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          disabled={uploading}
          className="sr-only"
          onChange={handleFiles}
        />
      </label>

      {/* ── Global error ──────────────────────────────────────────────────── */}
      {globalError && (
        <p className="text-sm text-red-600 font-medium">{globalError}</p>
      )}

      {/* ── Progress text ─────────────────────────────────────────────────── */}
      {uploading && uploadingCount > 0 && (
        <p className="text-sm text-amber-600 font-medium">
          Uploading {progress.done}/{progress.total} image{progress.total !== 1 ? 's' : ''}…
        </p>
      )}

      {/* ── Preview grid ─────────────────────────────────────────────────── */}
      {(retained.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-3 gap-3">
          {/* Existing / retained images */}
          {retained.map((url, idx) => (
            <div key={`retained-${idx}`} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-square">
              <img
                src={url}
                alt={`existing-${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeRetained(idx)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                ×
              </button>
              {/* Existing badge */}
              <span className="absolute bottom-1 left-1 text-[10px] bg-black/40 text-white px-1 rounded">
                saved
              </span>
            </div>
          ))}

          {/* New preview tiles */}
          {previews.map((preview, idx) => (
            <div
              key={`preview-${idx}`}
              className={`relative group rounded-lg overflow-hidden border aspect-square
                ${preview.status === 'error'
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 bg-gray-100'}`}
            >
              <img
                src={preview.localUrl}
                alt={`preview-${idx}`}
                className={`w-full h-full object-cover transition-opacity
                  ${preview.status === 'uploading' ? 'opacity-60' : 'opacity-100'}`}
              />

              {/* Status indicator (top-left) */}
              <span className="absolute top-1 left-1">
                <StatusIcon status={preview.status} />
              </span>

              {/* Remove button (top-right) — hidden while uploading */}
              {preview.status !== 'uploading' && (
                <button
                  type="button"
                  onClick={() => removePreview(idx)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  ×
                </button>
              )}

              {/* Per-file error tooltip */}
              {preview.status === 'error' && preview.error && (
                <p className="absolute bottom-0 left-0 right-0 bg-red-600/80 text-white text-[10px] px-1 py-0.5 truncate">
                  {preview.error}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
