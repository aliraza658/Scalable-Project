'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ✅ Correct import for App Router
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // If user is not logged in, redirect to login
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!mounted || !user) {
    return null; // Don't render until mounted and user is available
  }

  const handleLogout = () => {
    logout();
    router.push('/login'); // Optional: redirect after logout
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 text-white flex flex-col justify-center items-center p-6">
      <header className="w-full flex justify-between items-center mb-10">
        <h1 className="text-5xl font-extrabold">PhotoShare</h1>
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        )}
      </header>

      <section className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Welcome to PhotoShare!</h2>
        <div className="flex justify-center space-x-8">
          {/* Check if user is Admin */}
          {user.role === 'admin' && (
            <>
              <Link
                href="/creator"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300"
              >
                Creator View
              </Link>
            </>
          )}
          
          {/* Consumer View is always visible */}
          <Link
            href="/consumer"
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-green-700 transition duration-300"
          >
            Consumer View
          </Link>
        </div>
      </section>
    </main>
  );
}
