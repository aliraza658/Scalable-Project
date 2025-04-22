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
      const res = await fetch('http://localhost:4000/api/photos', {
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
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload a Photo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        {['title', 'caption', 'location', 'people'].map(field => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
    </div>
  );
}

