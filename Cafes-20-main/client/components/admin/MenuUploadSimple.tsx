import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Loader2, CheckCircle, AlertCircle, Trash2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenuSimple } from '@/hooks/useMenuSimple';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function MenuUploadSimple() {
  const { images, loading, error, refetch } = useMenuSimple();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle file upload
  const handleUpload = async (files: FileList) => {
    console.log('\n========================================');
    console.log('📤 STARTING UPLOAD');
    console.log('========================================');
    console.log('Files selected:', files.length);

    const file = files[0]; // Single file upload

    if (!file) {
      console.log('❌ No file selected');
      return;
    }

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: `${file.name} is too large. Maximum size is 10MB.` });
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: `${file.name} is not a supported format.` });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      console.log('📦 Creating FormData...');
      const formData = new FormData();
      formData.append('image', file);
      console.log('✅ FormData created with key "image"');

      const uploadUrl = `${API_BASE_URL}/menu-simple/upload`;
      console.log('🚀 Sending POST request to:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      console.log('📥 Response status:', response.status);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      console.log('✅ Upload successful!');
      setMessage({
        type: 'success',
        text: `Successfully uploaded ${file.name}!`
      });

      // Refresh images list
      console.log('🔄 Refetching images...');
      await refetch();

      setTimeout(() => setMessage(null), 4000);
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to upload image. Please try again.'
      });
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      console.log('========================================\n');
    }
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    console.log('\n========================================');
    console.log('🗑️ DELETING IMAGE');
    console.log('========================================');
    console.log('Image ID:', id);

    setMessage(null);

    try {
      const deleteUrl = `${API_BASE_URL}/menu-simple/${id}`;
      console.log('DELETE request to:', deleteUrl);

      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Delete failed');
      }

      console.log('✅ Image deleted');
      setMessage({ type: 'success', text: 'Image deleted successfully!' });

      // Refresh images list
      await refetch();

      setTimeout(() => setMessage(null), 4000);
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete image. Please try again.'
      });
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setDeleteConfirm(null);
      console.log('========================================\n');
    }
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border flex items-center gap-3 min-w-[300px] ${message.type === 'success'
                ? 'bg-green-900/90 text-green-100 border-green-700 backdrop-blur-sm'
                : 'bg-red-900/90 text-red-100 border-red-700 backdrop-blur-sm'
              }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Section */}
      <Card className="bg-[#111111] border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Upload className="w-5 h-5 text-red-500" />
            Upload Menu Image
          </CardTitle>
          <CardDescription className="text-gray-400">
            Upload a menu image to display on your website. Supports JPEG, PNG, and WebP formats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive
                ? 'border-red-500 bg-red-500/10'
                : 'border-gray-700 hover:border-gray-600 bg-[#0a0a0a]'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={uploading}
            />

            <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-red-500' : 'text-gray-400'}`} />

            <p className="text-white font-medium mb-2">
              {dragActive ? 'Drop file here' : 'Drag and drop image here'}
            </p>
            <p className="text-gray-400 text-sm mb-4">or</p>

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Select File
                </>
              )}
            </Button>

            <p className="text-gray-500 text-xs mt-4">
              Maximum file size: 10MB • Supported formats: JPEG, PNG, WebP
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Images List */}
      <Card className="bg-[#111111] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Uploaded Menu Images ({images.length})</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your uploaded menu images
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto text-gray-600 mb-4 animate-spin" />
              <p className="text-gray-400">Loading images...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto text-red-600 mb-4" />
              <p className="text-red-400">{error}</p>
              <Button onClick={refetch} variant="outline" className="mt-4">
                Retry
              </Button>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No menu images uploaded yet</p>
              <p className="text-gray-500 text-sm mt-2">Upload your first menu image to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#0a0a0a] rounded-lg border border-gray-800 overflow-hidden group"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-[3/4] bg-gray-900">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', image.url);
                        (e.target as HTMLImageElement).src = '/placeholder-menu.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:text-blue-400"
                        onClick={() => window.open(image.url, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:text-red-400"
                        onClick={() => setDeleteConfirm(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-4">
                    <p className="text-white font-medium text-sm truncate mb-1">{image.name}</p>
                    <p className="text-gray-500 text-xs">{formatFileSize(image.size)}</p>
                    <p className="text-gray-600 text-xs mt-1">{formatDate(image.uploadDate)}</p>
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === image.id && (
                    <div className="p-4 bg-red-900/20 border-t border-red-900/50">
                      <p className="text-red-400 text-sm mb-3">Delete this image?</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(image.id)}
                          className="flex-1"
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 text-gray-400"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
