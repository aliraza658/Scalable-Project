'use client';
import { useParams } from 'next/navigation';

export default function PhotoDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Photo #{id}</h2>
      <img src="/sample.jpg" alt="Mock Photo" className="w-full max-w-lg" />
      <div className="mt-4">
        <textarea className="w-full p-2 border rounded mb-2" placeholder="Leave a comment..."></textarea>
        <input type="number" min="1" max="5" className="w-full p-2 border rounded mb-2" placeholder="Rate 1-5" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit (mock)</button>
      </div>
    </div>
  );
}
