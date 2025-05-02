'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CommentBox from '../../components/CommentBox';
import { use } from 'react';

export default function PhotoDetailPage({ params }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoId, setPhotoId] = useState(null);

  // Unwrap the params object using React.use() to resolve the Promise
  const { id } = use(params); // Use the `use` hook here to resolve `params`

  useEffect(() => {
    if (id) {
      setPhotoId(id);
    }
  }, [id]);

  useEffect(() => {
    if (photoId) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/photos/${photoId}/comments`)
        .then((res) => res.json())
        .then((data) => {
          setComments(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching comments:', err);
          setLoading(false);
        });
    }
  }, [photoId]);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800">Comments for Photo</h2>
      </header>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 h-16 w-16"></div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <CommentBox photoId={photoId} />
          </div>
          <section>
            {comments.length === 0 ? (
              <p>No comments yet. Be the first to leave one!</p>
            ) : (
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id} className="mb-4">
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
