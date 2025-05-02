'use client'
import { useState } from 'react';

export default function CommentBox({ photoId }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCommentChange = (e) => setComment(e.target.value);
  const handleRatingChange = (e) => setRating(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment || !rating) {
      setError('Both comment and rating are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/photos/${photoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoId,
          comment,
          rating: parseInt(rating), // Make sure rating is an integer
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      const result = await response.json();
      setSuccess('Comment submitted successfully!');
      setComment('');
      setRating('');
    } catch (err) {
      setError('Error submitting comment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Leave a comment..."
        value={comment}
        onChange={handleCommentChange}
      ></textarea>

      <input
        type="number"
        min="1"
        max="5"
        className="w-full p-2 border rounded mb-2"
        placeholder="Rate 1-5"
        value={rating}
        onChange={handleRatingChange}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
}
