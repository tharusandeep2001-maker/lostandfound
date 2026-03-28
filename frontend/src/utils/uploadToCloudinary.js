/**
 * uploadToCloudinary.js
 * Direct browser → Cloudinary upload using an unsigned upload preset.
 * The Express backend NEVER receives binary data — only the secure_url strings.
 */

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Uploads a single File object to Cloudinary.
 *
 * @param {File} file
 * @returns {Promise<string>} The secure_url of the uploaded image.
 * @throws {Error} On size/type violation or Cloudinary API error.
 */
export const uploadImage = async (file) => {
  // ── Client-side guards ────────────────────────────────────────────────────
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Image must be under 5MB');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPG, PNG, and WEBP images are allowed');
  }

  // ── Build multipart form ──────────────────────────────────────────────────
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'campus-lost-found/posts');

  // ── Upload ────────────────────────────────────────────────────────────────
  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body:   formData,
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.secure_url;
};

/**
 * Uploads up to 3 files concurrently, reporting progress after each resolves.
 *
 * @param {File[]} filesArray
 * @param {(uploaded: number, total: number) => void} [onProgress]
 * @returns {Promise<string[]>} Array of secure_url strings.
 */
export const uploadImages = async (filesArray, onProgress) => {
  const files = Array.from(filesArray).slice(0, 3);
  const total = files.length;
  let uploaded = 0;

  const promises = files.map(async (file) => {
    const url = await uploadImage(file);
    uploaded += 1;
    if (typeof onProgress === 'function') {
      onProgress(uploaded, total);
    }
    return url;
  });

  return Promise.all(promises);
};
