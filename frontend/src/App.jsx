import { useState, useEffect } from 'react'
import ImageUploader from './components/post/ImageUploader'
import './App.css'

function App() {
  const [uploadedUrls, setUploadedUrls] = useState([])

  useEffect(() => {
    console.log('--- Cloudinary Environment Check ---');
    console.log('Cloud Name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    console.log('Upload Preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="text-2xl font-bold mb-6">Cloudinary Upload Test</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Image Uploader Component</h2>
        <ImageUploader 
          existingUrls={[]} 
          onChange={(urls) => {
            console.log('Uploaded URLs:', urls);
            setUploadedUrls(urls);
          }} 
        />
      </div>

      {uploadedUrls.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Uploaded Cloudinary URLs:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {uploadedUrls.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
