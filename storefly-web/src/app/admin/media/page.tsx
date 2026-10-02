'use client';

import React, { useEffect, useState, useRef } from 'react';
import { adminApi } from '@/lib/api';
import { MediaItem } from '@/types';
import { 
  Upload, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Image as ImageIcon, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';
import { formatDateTime, getFileUrl } from '@/lib/utils';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = () => {
    setLoading(true);
    adminApi.getMedia()
      .then((res) => {
        if (res.success && res.data) setMedia(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', files[0]);

    try {
      const res = await adminApi.uploadMedia(formData);
      if (res.success) {
        fetchMedia();
      }
    } catch {
      alert('Failed to upload image. Max size 5MB (JPG, PNG, WebP).');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    const fullUrl = getFileUrl(item.file_path);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;
    try {
      await adminApi.deleteMedia(id);
      setMedia(media.filter(m => m.id !== id));
    } catch {
      alert('Failed to delete media file.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white">Media Library</h1>
          <p className="text-xs text-slate-400 mt-1">Upload and manage images for services, hero section, and testimonials</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-xs text-slate-500">Loading media items...</p>
        </div>
      ) : media.length === 0 ? (
        <div className="py-20 text-center bg-slate-950 border border-slate-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 bg-slate-900 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-400">No media uploaded yet. Click &quot;Upload Image&quot; to add media assets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden group flex flex-col justify-between"
            >
              <div className="aspect-square bg-slate-900 relative flex items-center justify-center overflow-hidden">
                {/* Image preview */}
                <img
                  src={getFileUrl(item.file_path)}
                  alt={item.original_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // fallback icon
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="p-3 bg-slate-950 space-y-2 border-t border-slate-800">
                <div className="truncate text-xs font-semibold text-white">
                  {item.original_name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {formatDateTime(item.created_at)}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs flex items-center gap-1 border border-slate-800"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
