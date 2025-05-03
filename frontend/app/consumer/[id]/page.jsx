'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import CommentBox from '../../components/CommentBox';
import Link from 'next/link';

export default function PhotoDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const photoId = params?.id;

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const fetchPhotoAndComments = async () => {
    setLoading(true);
    try {
      const [photoRes, commentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/photos/${photoId}`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/photos/${photoId}/comments`)
      ]);

      const photoData = await photoRes.json();
      const commentsData = await commentsRes.json();

      setPhoto(photoData);
      setComments(commentsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/photos/${photoId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    if (user && photoId) {
      fetchPhotoAndComments();
    }
  }, [photoId, user]);

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
        <h2 className="text-4xl font-extrabold text-gray-800">Photo Details</h2>
      </header>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 h-16 w-16"></div>
        </div>
      ) : (
        <div>
          {photo && (
            <div className="mb-6 text-center">
              <img
                src={photo.url}
                alt={photo.caption || 'Uploaded photo'}
                className="max-w-full max-h-[500px] rounded-lg mx-auto shadow-md"
              />
              {photo.caption && <p className="mt-2 text-gray-700">{photo.caption}</p>}
            </div>
          )}

          {/* ✅ Pass fetchComments to CommentBox */}
          <div className="mb-6">
            <CommentBox photoId={photoId} onCommentAdded={fetchComments} />
          </div>

          <section>
            <h3 className="text-2xl font-semibold mb-4">Comments</h3>
            {comments.length === 0 ? (
              <p>No comments yet. Be the first to leave one!</p>
            ) : (
              <ul>
                {comments.map((comment, index) => (
                  <li key={index} className="mb-4">
                    <p className="font-bold">{comment.rating} Stars</p>
                    <p>{comment.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
