'use client';
import { useState } from 'react';

export default function PhotoUploadForm() {
  const [formData, setFormData] = useState({
    title: '', caption: '', location: '', people: ''
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Photo uploaded (mock)!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="file" accept="image/*" className="block w-full" required />
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
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
    </form>
  );
}
