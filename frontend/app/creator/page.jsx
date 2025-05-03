'use client';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function CreatorPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '', caption: '', location: '', people: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/'); // Redirect to main page if the user is not an admin
    }
  }, [user, router]);

  if (!user) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please choose an image.');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('image', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/photos`, {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      console.log(result);
      if (res.ok) {
        router.push('/consumer'); // Redirect to Consumer page
      } else {
        alert('Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-black flex flex-col justify-center items-center p-6">

      <header className="w-full flex justify-between items-center mb-10">
        <Link href="/" className="text-5xl font-extrabold text-white hover:text-gray-300">
          PhotoShare
        </Link>
        {user && (
          <div className="flex space-x-8">
            {/* Check if the user is an Admin */}
            {user.role === 'admin' && (
              <Link
                href="/creator"
                className="bg-blue-600 text-black px-6 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300"
              >
                Creator View
              </Link>
            )}

            {/* Consumer View is always visible */}
            <Link
              href="/consumer"
              className="bg-green-600 text-black px-6 py-3 rounded-lg text-xl font-semibold hover:bg-green-700 transition duration-300"
            >
              Consumer View
            </Link>
          </div>
        )}
      </header>

      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-xl space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Upload a Photo</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-black rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Upload Photo
          </button>
        </form>
      </div>
    </div>
  );
}
