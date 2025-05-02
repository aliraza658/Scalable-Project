'use client';
import { useEffect, useState } from 'react';
import PhotoCard from '../components/PhotoCard';

export default function ConsumerPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/photos`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching photos:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800">Explore Stunning Photos</h2>
        <p className="text-lg text-gray-600">Browse through our collection of beautiful images</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 h-16 w-16"></div>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </section>
      )}
    </div>
  );
}
