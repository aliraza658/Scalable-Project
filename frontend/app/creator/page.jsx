'use client';
import { useState } from 'react';

export default function CreatorPage() {
  const [formData, setFormData] = useState({
    title: '', caption: '', location: '', people: ''
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please choose an image.');
  
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('image', file); // 'image' must match multer field

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/photos`, {
        method: 'POST',
        body: data,
      });
  
      const result = await res.json();
      console.log(result);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex flex-col justify-center items-center p-6">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-xl space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Upload a Photo</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File input */}
          <div className="flex flex-col items-center">
            <label htmlFor="image" className="text-lg font-medium text-gray-700 mb-2">Choose an Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 file:rounded-md hover:file:bg-gray-200"
              required
            />
          </div>

          {/* Form Fields */}
          {['title', 'caption', 'location', 'people'].map((field) => (
            <div key={field} className="space-y-2">
              <label htmlFor={field} className="text-lg font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                id={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          ))}

          {/* Submit Button */}
          <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Upload Photo
          </button>
        </form>
      </div>
    </div>
  );
}
