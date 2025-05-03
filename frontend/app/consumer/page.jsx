'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import PhotoCard from '../components/PhotoCard';
import Link from 'next/link';

export default function ConsumerPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
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
