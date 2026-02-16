import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const API_URL = 'http://localhost:5000/api/menu-simple';

export function MenuUploadTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [images, setImages] = useState<any[]>([]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('\n========================================');
    console.log('📁 FILE SELECTED');
    console.log('========================================');

    const file = e.target.files?.[0];

    if (file) {
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified)
      });
      setSelectedFile(file);
      setMessage(`Selected: ${file.name}`);
    } else {
      console.log('❌ No file selected');
      setSelectedFile(null);
      setMessage('');
    }

    console.log('========================================\n');
  };

  // Handle upload
  const handleUpload = async () => {
    console.log('\n========================================');
    console.log('🚀 STARTING UPLOAD');
    console.log('========================================');

    if (!selectedFile) {
      console.log('❌ No file selected');
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('Uploading...');

    try {
      // Create FormData
      console.log('📦 Creating FormData...');
      const formData = new FormData();
      formData.append('image', selectedFile);
      console.log('✅ FormData created with key "image"');

      // Log FormData contents
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(`  ${pair[0]}:`, pair[1]);
      }

      // Send request
      const uploadUrl = `${API_URL}/upload`;
      console.log('📤 Sending POST request to:', uploadUrl);
      console.log('Request details:', {
        method: 'POST',
        url: uploadUrl,
        body: 'FormData with image'
      });

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
        // DO NOT set Content-Type header - browser sets it automatically with boundary
      });

      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const data = await response.json();
      console.log('📦 Response data:', JSON.stringify(data, null, 2));

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      console.log('✅ Upload successful!');
      setMessage(`✅ Upload successful: ${data.data.filename}`);
      setSelectedFile(null);

      // Refresh images list
      fetchImages();
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setUploading(false);
      console.log('========================================\n');
    }
  };

  // Fetch images
  const fetchImages = async () => {
    console.log('\n========================================');
    console.log('📥 FETCHING IMAGES');
    console.log('========================================');

    try {
      const fetchUrl = API_URL;
      console.log('GET request to:', fetchUrl);

      const response = await fetch(fetchUrl);
      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));

      if (data.success) {
        console.log(`✅ Fetched ${data.count} images`);
        setImages(data.data);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
    }

    console.log('========================================\n');
  };

  // Delete image
  const handleDelete = async (id: string) => {
    console.log('\n========================================');
    console.log('🗑️ DELETING IMAGE');
    console.log('========================================');
    console.log('Image ID:', id);

    try {
      const deleteUrl = `${API_URL}/${id}`;
      console.log('DELETE request to:', deleteUrl);

      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });

      const data = await response.json();
      console.log('Response:', data);

      if (data.success) {
        console.log('✅ Image deleted');
        fetchImages();
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
    }

    console.log('========================================\n');
  };

  return (
    <div className="p-8 space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Menu Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700"
            />
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>

          {/* Fetch Button */}
          <Button
            onClick={fetchImages}
            variant="outline"
            className="w-full"
          >
            Refresh Images
          </Button>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded ${message.includes('✅') ? 'bg-green-900/50 text-green-300' :
                message.includes('❌') ? 'bg-red-900/50 text-red-300' :
                  'bg-blue-900/50 text-blue-300'
              }`}>
              {message}
            </div>
          )}

          {/* Images List */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold">
              Uploaded Images ({images.length})
            </h3>
            {images.length === 0 ? (
              <p className="text-gray-400">No images uploaded yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="bg-gray-800 rounded p-3">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-40 object-cover rounded mb-2"
                      onError={(e) => {
                        console.error('Image load error:', image.url);
                        (e.target as HTMLImageElement).src = '/placeholder.png';
                      }}
                    />
                    <p className="text-white text-sm truncate">{image.name}</p>
                    <p className="text-gray-400 text-xs">{image.filename}</p>
                    <Button
                      onClick={() => handleDelete(image.id)}
                      variant="destructive"
                      size="sm"
                      className="w-full mt-2"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <div className="text-gray-400">
              <span className="text-white">API URL:</span> {API_URL}
            </div>
            <div className="text-gray-400">
              <span className="text-white">Upload URL:</span> {API_URL}/upload
            </div>
            <div className="text-gray-400">
              <span className="text-white">Selected File:</span> {selectedFile?.name || 'None'}
            </div>
            <div className="text-gray-400">
              <span className="text-white">File Size:</span> {selectedFile?.size || 0} bytes
            </div>
            <div className="text-gray-400">
              <span className="text-white">File Type:</span> {selectedFile?.type || 'N/A'}
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-800 rounded">
            <p className="text-yellow-400 text-xs">
              ⚠️ Check browser console (F12) for detailed logs
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
