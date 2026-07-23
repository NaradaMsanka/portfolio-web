import { ImagePlus, LoaderCircle, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadAdminImage } from '../services/adminApi';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageUploader({ label, folder, entityId, value, onChange }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const uploading = progress > 0 && progress < 100;

  async function selectFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
      setError('Use a JPG, PNG or WebP image no larger than 5 MB.');
      return;
    }
    setError('');
    setProgress(1);
    try {
      const uploaded = await uploadAdminImage({ file, folder, entityId, onProgress: setProgress });
      onChange(uploaded);
      setProgress(0);
    } catch (uploadError) {
      setError(uploadError.message);
      setProgress(0);
    }
  }

  return (
    <div className="admin-uploader">
      <span>{label}</span>
      {value?.url ? <div className="admin-image-preview"><img src={value.url} alt="Uploaded preview" /><button type="button" onClick={() => onChange({ url: '', path: '' })} title="Remove image"><X size={17} /></button></div> : <button className="admin-upload-zone" type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>{uploading ? <LoaderCircle className="spin" size={23} /> : <ImagePlus size={23} />}<span>{uploading ? `Uploading ${progress}%` : 'Choose image'}</span><small>JPG, PNG or WebP · maximum 5 MB</small></button>}
      {value?.url && <button className="admin-text-button" type="button" onClick={() => inputRef.current?.click()}>Replace image</button>}
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" hidden onChange={selectFile} />
      {error && <small className="admin-field-error">{error}</small>}
    </div>
  );
}
